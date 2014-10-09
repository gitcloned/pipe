
var fs = require('fs');

module.exports.open = function (params, callback) {
    callback(fs.createReadStream(params.target));
}