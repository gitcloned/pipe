
var Pipeline = new require("../../index").Pipeline
	, pipeline = new Pipeline()
	, path = require('path');

pipeline
	.from
	.csv({
	    target: path.join(__filename, '../../tmp/names.tmp.in.csv'),
        objectMode: true,
        headers: true
    })
    .map(function(data, callback){
    	data.Id = parseInt(data.Id);
    	callback(null, data);
    })
    //.stringify()
    .to
    .mongo({
    	database: "world",
	    collection: "person"
	})
	.on("close", function(err, res, meta){
		require("eyes").inspect(meta);
	})
	.stream();