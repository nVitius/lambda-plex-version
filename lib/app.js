function init(region) {
    if (!region) {
        region = 'aws-west-2';
    }

    var aws = require('aws-sdk');
    aws.config.update({region: region});

    var Loader = require('./loader');
    var loader = new Loader(
        aws,
        {
            pass: true,
            credentials: {
                user: "test",
                pass: "test"
            }
        }
    );
}
