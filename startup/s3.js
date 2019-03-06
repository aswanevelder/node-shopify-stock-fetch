const AWS = require('aws-sdk');
const util = require('util');

module.exports = {
    s3: null,
    init: async function () {
        this.s3 = new AWS.S3();
    },
    getObjectFromTrigger: async function(event, next) {
        console.log("Reading options from event:\n", util.inspect(event, { depth: 5 }));
        const srcBucket = event.Records[0].s3.bucket.name;
        var srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
        console.log("S3 Object key found: " + srcKey);
        await this.s3.getObject({ Bucket: srcBucket, Key: srcKey }, next);
    }
};