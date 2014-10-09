var es = require('event-stream');

/*
* maps the data to function
*/
module.exports.open = function (func, callback) {

    callback(null, es.map(func));
};