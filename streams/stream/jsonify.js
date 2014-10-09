var es = require('event-stream');

/*
* parses the data to json
*/
module.exports.open = function (params, callback) {
    callback(null, es.parse());
};