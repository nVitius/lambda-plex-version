function Loader(aws, options) {
    this.aws = aws;
    this.dynamo = new aws.DynamoDB({apiVersion: '2012-08-10'});
    this.pass = options.pass;
    this.credentials = options.credentials;
    this.callback = options.callback;
}

Loader.prototype.ttl = function ttl(err, result) {
    var now = (new Date()).getTime() / 1000 | 0;

    if (err) {
        this.callback(err);
    }

    //note: comparison flipped for debugging. Should be >=
    if ((now - result.Items[0].insert_timestamp.N) <= 1800) {
        return this.fetchLive();
    } else {
        this.callback(null, result.Items[0].version.S);
    }
};

Loader.prototype.fetchVersion = function fetchVersion() {
    var request = this.fetchCache();
    var self = this;

    request.send(function (err, result) {
        self.ttl(err, result);
    });
};

Loader.prototype.fetchCache = function fetchCache() {
    var query = {
        TableName: "plex_versions",
        IndexName: "plex_pass-insert_timestamp-index",
        KeyConditionExpression: "plex_pass = :pass",
        ExpressionAttributeValues: {
            ":pass": {"S": this.pass}
        },
        ProjectionExpression: "version, insert_timestamp",
        ScanIndexForward: false,
        Limit: 1
    };

    return this.dynamo.query(query);
};

Loader.prototype.fetchLive = function fetchLive() {
    // TODO: fetch plex version from plex.tv
    this.updateCache('123');
};

Loader.prototype.updateCache = function updateCache(version) {
    // TODO: invalidate previous record. set new one.
};
module.exports = Loader;
