/**
 * Created by piotr on 17.05.17.
 */
var AWS = require("aws-sdk");
var _ = require("lodash");

AWS.config.loadFromPath('./config.json');
var s3 = new AWS.S3();

var task =  function(request, callback){

    var params = {
        Bucket: 'aws-lab-project1',
        // EncodingType: url,
        Marker: 'uploadedImages/',
        MaxKeys: 20,
        Prefix: 'uploadedImages/'
    };

    s3.listObjects(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            callback(err);
        }
        else {
            var keys = _.map(data.Contents, 'Key');
            var links = _.map(keys, function (value) {
                return "https://s3-us-west-2.amazonaws.com/aws-lab-project1/" + value;
            });
            console.log(links);
            callback(null, {template: "images.ejs", params:{links: links}});
            // callback(null, links);
        }
    });

};

exports.action = task;
