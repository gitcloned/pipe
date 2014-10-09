/* To
*  : specifies the to streams of pipeline
*   pipeline, pipeline to bind 'to' to
*/
var To = function (pipeline) {
    this.pipeline = pipeline;
}

/* extend all readers to from
*   
*/
require("./utils/extend").withWriters(To.prototype);

exports.To = To;