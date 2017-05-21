/**
 * Created by piotr on 17.05.17.
 */
var AWS = require("aws-sdk");
var _ = require("lodash");

AWS.config.loadFromPath('config/aws-config.json');
var s3 = new AWS.S3();

var task =  function(request, callback){

    //TODO get bucket from config

    var params = {
        Bucket: 'aws-lab-project1',
        Marker: 'uploadedImages/',
        MaxKeys: 50,
        Prefix: 'uploadedImages/'
    };

    s3.listObjects(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            callback(err);
        }
        else {
            var imagesKeys = _.map(data.Contents, 'Key');
            var images = _.map(imagesKeys, function (key) {
                return {
                    key: key,
                    link: "https://s3-us-west-2.amazonaws.com/aws-lab-project1/" + key
                }
            });
            callback(null, {template: "images.ejs", params:{images: images}});
        }
    });

};

exports.action = task;
