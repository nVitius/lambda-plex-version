function Loader(aws, options) {
    this.aws = aws;
    this.dynamo = new aws.DynamoDB({apiVersion: '2012-08-10'});
    this.pass = options.pass;
    this.credentials = options.credentials;
}

Loader.prototype.ttl = function ttl(err, result) {
    var now = (new Date()).getTime() / 1000 | 0;

    if (err) {
        return;
    }

    if ((now - result.Items[0].insert_timestamp.N) <= 1800) {
        return this.fetchLive();
    } else {
        return this.fetchCache();
    }
};

Loader.prototype.fetchCache = function fetchCache() {
    var query = {
        TableName: "plex_versions",
        IndexName: "plex_pass-insert_timestamp-index",
        KeyConditionExpression: "plex_pass = :pass",
        ExpressionAttributeValues: {
            ":pass": {"S": pass}
        },
        ProjectionExpression: "version, insert_timestamp",
        ScanIndexForward: false,
        Limit: 1
    };

    this.dynamo.query(query, this.ttl);
};

Loader.prototype.fetchLive = function fetchLive() {
    // TODO: fetch plex version from plex.tv
};

Loader.prototype.updateCache = function updateCache(version) {
    // TODO: invalidate previous record. set new one.
};
module.exports = Loader;
