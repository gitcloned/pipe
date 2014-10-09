
var Pipeline = new require("../../index").Pipeline
	, pipeline = new Pipeline()
	, path = require('path');

pipeline
	// read from file
	.add({
	    name: "reader.mssql",
	    params: {
	        user: "user",
	        password: "user",
	        server: "localhost",
	        database: "AdventureWorks",
	        port: 1433,
	        query: "Select 1 as Id, 'John' as Name;"
	    }
	})
    // stringify
	.add({
	    name: "stream.stringify"
	})
	// write to another file
	.add({
		name: "writer.file",
		params:{
			target: path.join(__filename, '../tmp/names.tmp.out.csv')
		}
	})
	// on close
	.on("close", function (err, retVal) {
	    console.log('\npipeline closed, err: %s \nret:', err);
	    require('eyes').inspect(retVal);
	})
	// starts to stream
	.stream();