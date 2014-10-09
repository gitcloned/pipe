
var client = require('mongodb').MongoClient,
stream = require('stream'),
util = require('util');

module.exports.open = function (params, callback) {

    var mongoparams = require("extend")({}, params);

    var target = mongoparams.target;
    if (!target) {
        target = "mongodb://" + (mongoparams.host ? mongoparams.host : "localhost");
        target += ":" + (mongoparams.port ? mongoparams.port : 27017);
        target += "/" + mongoparams.database;
    }

    console.log(target)
    client.connect(target, function (err, db) {
        if (err != null) return callback(err);

        require("eyes").inspect(mongoparams)
        var collection = db.collection(mongoparams.collection);

        //callback(null, writeToCollection(db, collection, mongoparams));
        callback(null, new MongoWriteStream(db, collection, mongoparams));
    });
}

var Writable = stream.Writable ||
  require('readable-stream').Writable;

function MongoWriteStream(db, collection, params, options) {
    this.db = db;
    this.collection = collection;
    this.params = params;
  Writable.call(this, options);
}
util.inherits(MongoWriteStream, Writable);

MongoWriteStream.prototype._write = function (doc, enc, cb) {
 // store chunk, then call cb when done

    var that = this;

    var options = this.params.options ? this.params.options : {};

    console.log("doc")
    require("eyes").inspect(doc)
    if (params.update){ // http://mongodb.github.io/node-mongodb-native/markdown-docs/insert.html#update
        this.collection.update(doc.criteria, doc.update, options, function(err, doc){
            if (err != null) that.emit("error", err);
            cb();
        });
    }
    else if (params.save){ // http://mongodb.github.io/node-mongodb-native/markdown-docs/insert.html#save
        this.collection.save(doc, options, function(err, doc){
            if (err != null) that.emit("error", err);
            cb();
        });
    }
    else { // http://mongodb.github.io/node-mongodb-native/markdown-docs/insert.html#insert
        this.collection.insert(doc, options, function(err, doc){
            if (err != null) that.emit("error", err);
            cb();
        });
    }
};

var writeToCollection = function(db, collection, params){
    var options = params.options ? params.options : {};
    var a = new Stream ()
        , isDone = false
    a.write = function (doc) {
        console.log("doc")
        require("eyes").inspect(doc)
        if (params.update){ // http://mongodb.github.io/node-mongodb-native/markdown-docs/insert.html#update
            collection.update(doc.criteria, doc.update, options, function(err, doc){
                if (err != null) a.emit("error", err);
            });
        }
        else if (params.save){ // http://mongodb.github.io/node-mongodb-native/markdown-docs/insert.html#save
            collection.save(doc, options, function(err, doc){
                if (err != null) a.emit("error", err);
            });
        }
        else { // http://mongodb.github.io/node-mongodb-native/markdown-docs/insert.html#insert
            collection.insert(doc, options, function(err, doc){
                if (err != null) a.emit("error", err);
            });
        }
    }
    a.end = function () {
        db.close(function(err){
            isDone = true
            if (err != null) a.emit("error", err);
            a.emit("close");
        });
    }
    a.writable = true
    a.readable = false
    a.destroy = function () {
        a.writable = a.readable = false
        if(isDone) return;
        db.close(function(err){
            isDone = true
            if (err != null) a.emit("error", err);
            a.emit("close");
        });
    }
    return a
}