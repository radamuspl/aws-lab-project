/**
 * Created by piotr on 17.05.17.
 */

"use strict";

var AWS = require("aws-sdk");
var _ = require("lodash");

var notificationHelper = require("../notificationHelper");

AWS.config.loadFromPath('config/aws-config.json');
var sqs = new AWS.SQS();

var task =  function(request, callback){

    if(!request.body.keys) return notificationHelper.showError("Any images selected", callback);

    if(typeof request.body.keys === 'string' ) {
        request.body.keys = [request.body.keys];
    }

    if(request.body.keys.length > 10)  return notificationHelper.showError("More than 10 images selected", callback);

    var entries = _.map( request.body.keys, function (key, index) {
        return {
            Id: index.toString(),
            MessageBody: JSON.stringify(
                {
                    option: request.body.option,
                    key: key
                }
            )
        }
    });

    var params = {
        QueueUrl: 'https://sqs.us-west-2.amazonaws.com/894955361035/AWS-project',
        Entries: entries
    };

    sqs.sendMessageBatch(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            return notificationHelper.showError(err, callback);
        }
        else {
            console.log(data);
            if(data.Failed.length === 0) {
                return notificationHelper.showSuccess("All images send to convert", callback);
            } else {
                return notificationHelper.showError("Sorry " + data.Failed.length + " msg failed", callback);
            }
        }
    });
};

exports.action = task;
