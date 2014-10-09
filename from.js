/* From
*  : specifies the from streams of pipeline
*   pipeline, pipeline to bind from to
*/
var From = function (pipeline) {
    this.pipeline = pipeline;
}

/* extend all readers to from
*   
*/
require("./utils/extend").withReaders(From.prototype);

exports.From = From;