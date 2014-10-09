
var csv = require("fast-csv"),
    fs = require('fs');

module.exports.open = function (params, callback) {
    csvparams = require('extend')({
        delimiter: ',',
        objectMode: false,
        from: 'Path'
    }, params);

    var stream = csv['from' + csvparams.from](csvparams.target, csvparams)

    callback(null, stream);
}