
var sql = require('mssql'),
    Stream = require("stream").Stream,
    es = require('event-stream');

module.exports.open = function (params, callback) {

    var sqlparams = require("extend")({
        stream: true
    }, params);

    var sqlType = function (t) {

        if (t && sql[t.toString])
            return sql[t.toString];

        switch (t) {

            case "int":
            case "integer":
            case "Integer":
                return sql.Int;

            case "varchar":
            case "string":
            case "str":
                return sql.VarChar;

            case "datetime":
                return sql.DateTime;

            case "date":
                return sql.Date;

            case "float":
                return sql.Float;
        }

        return t;
    }

    var buildProcQuery = function (request, params) {
        var inputs = params.in || params.ins || params.input_parameters || params.input_parameter;
        var outputs = params.out || params.outs || params.output_parameters || params.output_parameter;

        inputs = inputs ? (inputs instanceof Array ? inputs : [inputs]) : [];
        outputs = outputs ? (outputs instanceof Array ? outputs : [inputs]) : [];

        for (var i = 0; i < inputs.length; i++) {
            request.input('input_parameter', sqlType(inputs[i].type), inputs[i].value);
        }

        for (var i = 0; i < outputs.length; i++) {
            request.input('output_parameter', sqlType(outputs[i].type));
        }

        return request;
    }

    sql.connect(sqlparams, function (err) {
        if (err != null) return callback(err);

        var request = new sql.Request();

        if (sqlparams.execute)
            buildProcQuery(request, sqlparams).execute(sqlparams.execute);
        else
            request.query(sqlparams.query);

        callback(null, readRecords(request));
    })
};

var readRecords = function (request) {
    var stream = new Stream()
    , i = 0
    , paused = false
    , ended = false

    stream.readable = true
    stream.writable = false

    request.on('recordset', function (columns) {
        // Emitted once for each recordset in a query
    });

    request.on('row', function (row) {
        stream.emit('data', row)
    });

    request.on('error', function (err) {
        stream.emit('error', err)
    });

    request.on('done', function (returnValue) {
        stream.emit("end");
    });
    
    stream.resume = function () {
        if (ended) return
        paused = false
    }
    process.nextTick(stream.resume)
    stream.pause = function () {
        paused = true
    }
    stream.destroy = function () {
        ended = true
        stream.emit('close')
        request.destroy();
    }
    return stream
}