var es = require('event-stream');

/*
* transforms the data to data dictionary
*/
module.exports.open = function (params, callback, result) {
    require("../../../mapping/mapper").for(params.keeper).of(params.type).to(params, function (mapper) {
        var stream = es.map(function (data, callback) {
            mapper.transform(data, function (err, map) {
                /*
                    map: object
                      {
                        mapped: out,
                        len: ddColLen,
                        keys: keys,
                        types: ttypes,
                        columns: colMap,
                        pnl_collection: pnl_collection,
                        skeys: skeys
                    }
                */
                result = map;
                delete result.mapped;
                callback(err, map.mapped);
            });
        });
    });
};

module.exports.singleton = true;
