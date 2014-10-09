
var Pipeline = new require("../../index").Pipeline
	, pipeline = new Pipeline()
	, path = require('path');

pipeline
	// read from file
	.add({
		name: "reader.csv",
		params:{
		    target: path.join(__filename, '../../tmp/names.tmp.in.csv'),
            objectMode: false
		}
	})
	// write to another file
	.add({
		name: "writer.file",
		params:{
			target: path.join(__filename, '../tmp/names.tmp.out.csv')
		}
	})
    // on open
	.on("open", function (size, startTime) {
	    //console.log('\npipeline opened, size: %s, startTime:', size, startTime);
	})
	// on close
	.on("close", function (err, res, meta) {
		console.log('\npipeline closed, err: %s \nret:', err);
		require('eyes').inspect(res);
		require('eyes').inspect(meta);
	})
	// on any error
	.on("error", function (err) {
		console.log('\nerror occurred in pipeline\nresult:');
		require('eyes').inspect(err);
	})
    // on end
	.on("end", function (res, meta) {
	    console.log('\npipeline ended successfully \nret:');
	    require('eyes').inspect(res);
	    require('eyes').inspect(meta);
	})
	// starts to stream
	.stream();