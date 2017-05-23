/**
 * Created by piotr on 21.05.17.
 */

var getImages = require("../s3getImages").getImages;

var task =  function(request, callback){
    return getImages("convertedImages/", "convertedImages.ejs", callback);
};

exports.action = task;
