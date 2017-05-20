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


function receive() {
    var params = {
        QueueUrl: 'https://sqs.us-west-2.amazonaws.com/894955361035/AWS-project',
        MaxNumberOfMessages: 1
    };

    sqs.receiveMessage(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
        }
        else {
            console.log(data);
            var msgBody = JSON.parse(data.Messages[0].Body);

            // validate msg body
            if(!msgBody.hasOwnProperty("option") || !msgBody.hasOwnProperty("key")) {
                console.log("ERROR: invalid msg body")
            }

            // validate options
            if(msgBody.option !== "grayScale") {
                console.log("ERROR: invalid option");
            }

            // construct link
            var imageLink = encodeURI("https://s3-us-west-2.amazonaws.com/aws-lab-project1/" + msgBody.key);
            console.log(imageLink);

            //TODO validate is key exist in bucket

            //convert image
            convert(imageLink);

            //TODO save converted image to bucket

            // delete local copy of converted file
            // del.sync([convertedFileName]);
            //
            // console.log("file deleted");

        }
    });
}

function convert(imageLink) {

    jimp.read(imageLink, function (err, image) {
        if (err) {
            throw err;
            // TODO return callback with error
        }

        // TODO save with good extenstion

        var convertedFileName =  moment() + ".jpg";

        image.greyscale()
            .write(convertedFileName);

        console.log("file converted");

    })
}

//convert("https://s3-us-west-2.amazonaws.com/aws-lab-project1/uploadedImages/bird-sample1.jpeg");
receive();

