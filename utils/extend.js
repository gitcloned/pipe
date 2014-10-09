
/* extends 
*   from (all readers)
*   to (all writers)
*   stream methods (all stream modifiers)
*       => to pipeline prototype
*/

var fs = require('fs')
    , path = require('path');

var addToProto = function(proto, component, mod, subpipes) {

    proto[mod] = function (params, options) {

        var pipe = subpipes ? this.pipeline : this;

        pipe.add({
            name: component + "." + mod,
            params: params,
            options: options
        });

        return pipe;
    }
}

module.exports.withModifiers = function (proto) {

    var files = fs.readdirSync(path.join(__filename.substring(0, __filename.lastIndexOf("/")), "../streams/stream"))
    for (var i = 0; i < files.length; i++) {
        addToProto(proto, "stream", files[i].split(".")[0]);
    }
}

module.exports.withReaders = function (proto) {

    var files = fs.readdirSync(path.join(__filename.substring(0, __filename.lastIndexOf("/")), "../streams/reader"))
    for (var i = 0; i < files.length; i++) {
        addToProto(proto, "reader", files[i], true);
    }
}

module.exports.withWriters = function (proto) {

    var files = fs.readdirSync(path.join(__filename.substring(0, __filename.lastIndexOf("/")), "../streams/writer"))
    for (var i = 0; i < files.length; i++) {
        addToProto(proto, "writer", files[i], true);
    }
}