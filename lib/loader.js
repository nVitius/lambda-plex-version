function Loader(aws, options) {
    var dynamo = new aws.DynamoDB({apiVersion: '2012-08-10'}),
        pass = options.pass,
        credentials = options.credentials,
        callback = options.callback;

    function checkCacheTtl(err, result) {
        var now = (new Date()).getTime() / 1000 | 0;

        if (err) {
            callback(err, err.message);
            return;
        }

        //note: comparison flipped for debugging. Should be >=
        if ((now - result.Items[0].insert_timestamp.N) <= 1800) {
            fromPlex()
        } else {
            fromCache(result);
        }
    }

    function fromCache(cacheResult) {
        callback(null, cacheResult.Items[0].version.S);
    }

    function fromPlex() {
        // TODO: fetch plex version from plex.tv
        var version = '123';
        callback(null, version);
        updateCache(version);
    }

    function updateCache(version) {
        // TODO: invalidate previous record. set new one.
    }

    this.fetchVersion = function () {

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

        dynamo.query(query, checkCacheTtl);
    }
}

module.exports = Loader;