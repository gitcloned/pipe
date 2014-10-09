var es = require('event-stream');

/*
* splits the data by matcher
*/
module.exports.open = function (params, callback) {

    callback(null, es.split(params.matcher));
};