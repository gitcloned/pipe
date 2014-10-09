var util = require('util'),
nodeStream = require('stream'),
moment = require('moment'),
colors = require('colors/safe'),
EventEmitter = require('events').EventEmitter;

var defer = require("./utils/deferload"),
    From = new require("./from").From,
    To = new require("./to").To;

/* Pipeline
*/
var Pipeline = function () {
	
	this.end = null;
	this.count = 0;

	this.retVal = {};
	this.meta = {};
	this.error = null;

	this.timeline = {};

	EventEmitter.call(this);

	// create an instance of component factory
	this.factory = require("./streams/factory").create();

    // store the streams
	this._streams = [];

    // open a queue withy parallelism of number of cpu/cores
	this.queue = require("queue-async")(require("os").cpus().length);

    // from end of pipeline
	this.from = new From(this);

    // to end of pipeline
	this.to = new To(this);
}

/* Inherits event emitter
*
*/
util.inherits(Pipeline, EventEmitter);

/* extend all streams modules as proto to pipeline
*   
*/
require("./utils/extend").withModifiers(Pipeline.prototype);

/* add a step to pipeline
*	step: json defining step
*/
Pipeline.prototype.add = function(step) {

	if (!(step instanceof Object))
		return this.emit("error", "Cannot pipe, step should be a valid json object");

	this.queue.defer(defer.add, this.factory, step, this.retVal);

	return this;
}

/* pipes a stream into pipeline
*	stream: stream object
*/
Pipeline.prototype.pipe = function(stream, options, name) {
	
	if (null == stream)
	    return this.emit("error", "Cannot pipe a null stream")

	this.queue.defer(defer.pipe, stream, options, name);

	return this;
}

/* starts the pipeline to stream
*
*	emit events:
*		open: emitted when pipeline is successfully opened
*				returns the count of streams and start time
*		error: emitted on any error
*				returns the error if any
*		end: emitted when pipeline ends successfully
*				returns the result if any
*		close: emitted when pipeline closes, even if error has occurred
*				returns the error if any
*				returns the result if any
*				returns the meta info
*/
Pipeline.prototype.stream = function () {

    var that = this;
    this.timeline.start = moment();

    // load all stream
    this.queue.awaitAll(function (err, streams) {

        console.log(colors.bgCyan("Starting pipeline"))

        if (err != null)
            return that.emit("error", "Error while opening streams: " + err);

        that.count = streams.length;
        that.emit("open", that.count, that.timeline.start.format());

        // pipe all streams
        for (var i = 0; i < streams.length; i++) {

            var count = i, stream = streams[i];

            // on any error in stream, destroy stream
            stream.on("error", function (err) {
                that.emit("error", "Error occurred in stream at idx : " + count + " : " + err);
            });

            // pipe end to stream
            if (that.end != null) {
                console.log(" | piping stream " + colors.green(that.end.name) + colors.grey(" >> ") + colors.green(stream.name));
                that.end.pipe(stream);
            }

            // assign the end to the newly piped stream
            that.end = stream;
            that._streams.push(stream);

            stream = null;
        }
        streams = null;

        // register for error event
        if (that.end == null)
            return that.emit("error", "Cannot stream, pipeline is empty");
        
        // register to end event
        that.end.on("close", function () {

            that.timeline.end = moment();
            that.meta.time = that.timeline.end.diff(that.timeline.start);

            console.log(colors.bgCyan("Pipeline finished, time taken: %s"), that.meta.time);

            that.emit("close", that.error, that.retVal, that.meta);

            // no error occurred
            if (that.error == null) {
                that.emit("end", that.retVal, that.meta);
            }
        });
    });

    this.on("error", function (err) {

        console.log(colors.bgRed("Error: ") + err);

        // got err, in pipeline
        this.error = err;

        // destroy all streams
        for (var i = 0; i < that._streams.length; i++) {
            if (that._streams[i].destroy)
                that._streams[i].destroy();
            else if (that._streams[i].close)
                that._streams[i].close();
        }

        that.timeline.end = moment();
        that.meta.time = that.timeline.end.diff(that.timeline.start);
    });

	return this;
}

exports.Pipeline = Pipeline;