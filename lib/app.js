module.exports = function run(config, region) {
    if (!region) {
        region = 'us-west-2';
    }

    var aws = require('aws-sdk');
    aws.config.update({region: region});

    var Loader = require('./loader');
    var loader = new Loader(aws, config);

    loader.fetchVersion();
};
