/**
 * Created by piotr on 19.05.17.
 */

"use strict";

var jimp = require("jimp");
var sleep = require('sleep');
var AWS = require("aws-sdk");
var _ = require("lodash");
var moment = require("moment");
var del = require("delete");
var async = require("async");

AWS.config.loadFromPath('aws-config.json');
var sqs = new AWS.SQS();

function run() {
    async.waterfall([
            function (cb) {
                return receive(cb);
            },
            function (msgBody, cb) {
                return validateMsgBody(msgBody, cb);
            },
            function (msgBody, cb) {
                return validateIsImageExistingInBucket(msgBody, cb);
            },
            function (msgBody, cb) {
                return convertImage(msgBody, cb);
            },
            function (convertedFileName, cb) {
                return saveConvertedImageInBucket(convertedFileName, cb);
            },
            function (convertedFileName, cb) {
                return deleteLocalConvertedFile(convertedFileName, cb);
            }
        ], function (err, result) {
            if(err) {
                console.log("ERROR: " + err);
            } else {
                console.log(result);
                // Debug: Wait 30s to next polling msg
                // sleep.msleep(10000);
                // run();
            }
        }
    );
}

function receive(cb) {
    var params = {
        QueueUrl: 'https://sqs.us-west-2.amazonaws.com/894955361035/AWS-project',
        MaxNumberOfMessages: 1
    };
    sqs.receiveMessage(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            cb(err);
        }
        else {
            console.log(data);
            var msgBody = JSON.parse(data.Messages[0].Body);
            cb(null, msgBody);
        }
    });
}

function validateMsgBody(msgBody, cb) {
    if(!msgBody.hasOwnProperty("option") || !msgBody.hasOwnProperty("key")) {
        return cb("invalid msg body");
    }

    // TODO move this array
    var viableOptions = ["grayScale", "invert"];

    if(!_.includes(viableOptions, msgBody.option)) {
        return cb("invalid option");
    }
    return cb(null, msgBody);
}

function validateIsImageExistingInBucket(msgBody, cb) {
    // TODO implement
    return cb(null, msgBody)
}

function convertImage(msgBody, cb) {
    var imageLink = constructLink(msgBody.key);

    jimp.read(imageLink, function (err, image) {
        if (err) {
            return cb(err);
        }

        // TODO save with good extension
        var convertedFileName =  moment() + ".jpg";

        switch (msgBody.option) {
            case "grayScale":
                image.greyscale();
                break;
            case "invert":
                image.invert();
                break;
            default:
                console.log("Case " + msgBody.operation + " doesn't exist");
        }
        image.write(convertedFileName);

        console.log("File converted");
        return cb(null, convertedFileName);
    })
}

function saveConvertedImageInBucket(convertedFileName, cb) {
    // TODO implement
    cb(null, convertedFileName);
}

function deleteLocalConvertedFile(convertedFileName, cb) {
    del([convertedFileName], function(err, deleted) {
        if (err) {
            return cb(err);
        }
        return cb(null, "File deleted: " + deleted);
    });
}

// utils function
function constructLink(key) {
    return  encodeURI("https://s3-us-west-2.amazonaws.com/aws-lab-project1/" + key);
}

run();


