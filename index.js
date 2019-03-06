const MongoClient = require('mongodb').MongoClient;
const stock = require('./logic/stock');

exports.handler = async function (event, context, callback) {
    await stock.init();
    await stock.clearShopifyCollection();
    await stock.fetchShopify();
}
