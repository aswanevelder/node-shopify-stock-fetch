const AWS = require('aws-sdk');
const environment = require('./environment');

module.exports = {
    sqs: null,
    init: async function () {
        console.log(`SHOPIFY_SQSURL: ${environment.SHOPIFY_SQSURL}`);
        this.sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
    },
    insertQueueMany: async function (lines) {
        lines.forEach(async function (line) {
            await insertQueueOne(line);
        });
    },
    insertQueueOne: async function (line) {
        if (line !== '') {
            const data = line.split(",");
            var params = {
                MessageAttributes: {
                    "id": {
                        DataType: "String",
                        StringValue: data[0]
                    }
                },
                MessageBody: line,
                QueueUrl: S3TOSERVICE_SQSURL
            };
    
            await this.sqs.sendMessage(params, function (err, data) {
                if (err) {
                    console.log("Error", err);
                } else {
                    console.log("Success", data.MessageId);
                }
            });
        };
    }
};

