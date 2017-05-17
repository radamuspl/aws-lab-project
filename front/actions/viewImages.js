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
        MaxKeys: 10,
        Prefix: 'uploadedImages/'
    };

    s3.listObjects(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            callback(err);
        }
        else {
            console.log(data);
            var keys = _.map(data.Contents, 'Key');
            console.log(keys);
            callback(null, keys);
        }

    });

};

exports.action = task;
