console.log('Loading function');

exports.handler = function check(event, context) {
    var app = require('./lib/app');

    var config = {
        callback: context.done,
        pass: event.pass,
        credentials: {
            user: "test",
            pass: "test"
        }
    };

    app(config)
};
