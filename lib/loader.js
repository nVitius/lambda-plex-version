function Loader(aws, options) {
    this.aws = aws;
    this.dynamo = new aws.DynamoDB({apiVersion: '2012-08-10'});
    this.pass = options.pass;
    this.credentials = options.credentials;
    this.callback = options.callback;
}

Loader.prototype.checkCacheTtl = function (err, result) {
    var now = (new Date()).getTime() / 1000 | 0;

    if (err) {
        this.callback(err);
    }

    //note: comparison flipped for debugging. Should be >=
    if ((now - result.Items[0].insert_timestamp.N) <= 1800) {
        this.fromPlex()
    } else {
        this.fromCache(result);
    }
};

Loader.prototype.fetchVersion = function () {
    var request = this.query();
    var self = this;

    request.send(function (err, result) {
        self.checkCacheTtl(err, result);
    });
};

Loader.prototype.query = function () {
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

Loader.prototype.fromCache = function (cacheResult) {
    this.callback(null, cacheResult.Items[0].version.S);
};

Loader.prototype.fromPlex = function () {
    // TODO: fetch plex version from plex.tv
    var version = '123';
    this.callback(null, version);
    this.updateCache(version);
};

Loader.prototype.updateCache = function (version) {
    // TODO: invalidate previous record. set new one.
};
module.exports = Loader;
