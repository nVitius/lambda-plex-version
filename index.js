console.log('Loading function');

//var app = require('lib/app.js');
//exports.check = app.check;
exports.handler = function (event, context) {
    var http = require('http');
    var AWS = require("aws-sdk");

    AWS.config.update({region: 'us-west-2'});

    var dynamo = new AWS.DynamoDB({apiVersion: '2012-08-10'});

    var params = {
        TableName: "plex_versions",
        IndexName: "plex_pass-insert_timestamp-index",
        KeyConditionExpression: "plex_pass = :pass",
        ExpressionAttributeValues: {
            ":pass": {"S": event.pass}
        },
        ProjectionExpression: "version, insert_timestamp",
        ScanIndexForward: false,
        Limit: 1
    };
    dynamo.query(params, versionTtl);
};

function versionTtl(err, response) {
    console.log(response.Items[0].insert_timestamp.N);
    if (err) {
        return;
    }

    var now = (new Date()).getTime() / 1000 | 0;

    if ((now - response.Items[0].insert_timestamp.N) <= 900) {
    }
}