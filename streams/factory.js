

var Factory = function () {

    this.factories = {
        "reader": 1,
        "writer": 1
    };

    this.singletons = {};
}
Factory.prototype.get = function () {

    var split = arguments[0].split("."), args = [];
    for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i]);
    }

    var type = split[0], name = split[1], component = undefined;

    // get the component
    if (this.factories[type])
        component = require("./" + type + "/factory").get(name);
    else
        component = require("./" + type + "/" + name);

    // if component is singleton
    if (component.singleton) {
        if (!this.singletons[arguments[0]])
            this.singletons[arguments[0]] = component;
        else
            component = this.singletons[arguments[0]];
    }

    return component;
}

module.exports.create = function () {
    return new Factory();
};