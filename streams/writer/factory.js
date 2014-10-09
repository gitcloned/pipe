
module.exports.get = function (type) {
    /*
    * Should return a Readable stream
    */
    return require("./" + type + "/writer");
}