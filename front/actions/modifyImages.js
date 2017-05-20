/**
 * Created by piotr on 17.05.17.
 */

"use strict";

var AWS = require("aws-sdk");
var _ = require("lodash");

AWS.config.loadFromPath('config/aws-config.json');
var sqs = new AWS.SQS();

var task =  function(request, callback){

    if(!request.body.keys) callback("ERROR: Any images selected");
    if(request.body.keys.length > 10) callback("ERROR: more than 10 items selected");

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
            callback(err);
        }
        else {
            console.log(data);
            if(!data.Failed) {
                callback(null, "all msg upload");
            } else {
                callback(null, "sorry " + data.Failed.length + " msg failed")
            }
        }
    });
};

exports.action = task;
