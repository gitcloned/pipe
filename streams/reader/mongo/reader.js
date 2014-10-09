
var client = require('mongodb').MongoClient;

module.exports.open = function (params, callback) {

    var mongoparams = require("extend")({}, params);

    var target = mongoparams.target;
    if (!target) {
        target = "mongodb://" + (mongoparams.host ? mongoparams.host : "localhost");
        target += ":" + (mongoparams.port ? mongoparams.port : 27017);
        target += "/" + mongoparams.database;
    }

    client.connect(target, function (err, db) {
        if (err != null) return callback(err);

        var collection = db.collection(mongoparams.collection);
        if (mongoparams.pipeline) {
            callback(null, collection.aggregate(mongoparams.pipeline));
        } else {
            
            var stream = collection.find(mongoparams.selector
                , mongoparams.fields
                , mongoparams.options)
                .sort(mongoparams.sort ? mongoparams.sort : {})
                .limit(mongoparams.limit ? mongoparams.limit : null)
                .stream();

            callback(null, stream);
            /*
            collection.find(mongoparams.selector
                , mongoparams.fields
                , mongoparams.options)
                .sort(mongoparams.sort ? mongoparams.sort : {})
                .limit(mongoparams.limit ? mongoparams.limit : null).toArray(function (err, res) {
                    console.log("err: %s", err)
                    console.log(res.length)
                });

            require("eyes").inspect(mongoparams)*/
        }
    });
}