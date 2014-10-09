
var Pipeline = new require("../../index").Pipeline
	, pipeline = new Pipeline()
	, path = require('path');

pipeline
    // read from mongo
    .from.mongo({
        host: "ws-hjain",
        database: "ivp-ds-client-supernova2",
        collection: "/pnl",
        selector: {
            dt: new Date("01/01/2014")
        },
        fields: {
            _id: 0,
            pf: 1,
            st: 1,
            dt: 1
        }
    })
    // stringify
    .stringify()
    // write to file
    .to.file({
        target: path.join(__filename, '../tmp/names.tmp.out.csv')
    })
	// on close
	.on("close", function (err, retVal) {
	    console.log('\npipeline closed, err: %s \nret:', err);
	    require('eyes').inspect(retVal);
	})
	// starts to stream
	.stream();