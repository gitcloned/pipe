
var fs = require('fs');

module.exports.open = function (params, callback) {
    callback(null
        , fs.createWriteStream(params.target));
}