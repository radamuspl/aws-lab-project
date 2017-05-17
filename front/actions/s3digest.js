var AWS = require("aws-sdk");

AWS.config.loadFromPath('./config.json');


var task =  function(request, callback){

	callback(null, "zapisano plik w kubełku " + request.query.bucket +
	" pod kluczem " + request.query.key);

}

exports.action = task
