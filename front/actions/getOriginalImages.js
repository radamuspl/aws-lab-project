/**
 * Created by piotr on 17.05.17.
 */
var getImages = require("../s3getImages").getImages;

var task =  function(request, callback){
    return getImages("uploadedImages/", "images.ejs", callback);
};

exports.action = task;
