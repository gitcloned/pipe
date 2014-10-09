var es = require('event-stream');

/*
* collates the data
*/
module.exports.open = function (params, callback) {
    var chunk = params.chunk;
    chunk = chunk > 0 ? chunk : -1;

    var as = params.as ? params.as : "array";
    var seperator = param.seperator ? params.seperator : ",";

    var cnt = 0, buffer = [];

    var join = function (data) {
        buffer.push(data);
        cnt++;
    }
    var flush = function () {
        var ret = buffer;
        buffer = [];
        cnt = 0;
        return ret;
    }

    if (params.as == "string") {
        flush = function () {
            var ret = buffer.join(seperator);
            buffer = [];
            cnt = 0;
            return ret;
        }
    }

    var stream = es.through(function write(data) {
        if (chunk == -1 || cnt < chunk) join(data);
        else if (cnt == chunk)
            this.emit("data", flush());
    }, function end() {
        this.emit("data", flush());
        this.emit("end");
    });

    callback(null, stream);
};