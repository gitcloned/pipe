
/* defers the adding/piping of streams
*/
var defer = {

    add: function (factory, step, session, callback) {

        var name = step.name
	        , desc = step.description
	        , options = step.options
	        , sparams = step.params;

        // creates the component
        factory.get(name)
            .open(sparams, function (err, stream) {

                stream.name = name;
                stream.description = desc;
                stream.options = options ? options : {};

                callback(err, stream);
            }, session);
    },

    pipe: function (stream, options, name, callback) {

        if (typeof options == "function") {
            callback = options;
            options = name = undefined;
        }
        else if (typeof name == "function") {
            callback = name;
            name = undefined;
        }

        stream.name = name;
        stream.options = options ? options : {};

        callback(null, stream);
    }
}

module.exports = defer;