/**
 * Created by piotr on 17.05.17.
 */

var AWS = require("aws-sdk");
var _ = require("lodash");

AWS.config.loadFromPath('./config.json');

var task =  function(request, callback){

    if(!request.body.keys) {
        callback("Any images selected")
    }

    // TODO add SQS

    callback(null, request.body);

};

exports.action = task;
