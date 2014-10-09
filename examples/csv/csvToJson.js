
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
    .stringify()
    .to
    .file({
	    target: path.join(__filename, '../tmp/names.tmp.out.2.csv'),
	})
	.on("close", function(err, res, meta){
		require("eyes").inspect(meta);
	})
	.stream();