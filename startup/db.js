const MongoClient = require('mongodb').MongoClient;
const environment = require('./environment');

module.exports = {
    client: null,
    db: null,
    shopifyCollection: null,
    storeCollection: null,
    init: async function() {
        console.log(`SHOPIFY_DBURL: ${environment.SHOPIFY_DBURL}`);
        console.log(`SHOPIFY_DBNAME: ${environment.SHOPIFY_DBNAME}`);
        console.log(`SHOPIFY_COLLECTIONNAME: ${environment.SHOPIFY_COLLECTIONNAME}`);
        console.log(`STORE_COLLECTIONNAME: ${environment.STORE_COLLECTIONNAME}`);

        if (!this.client) {
            this.client = await MongoClient.connect(environment.SHOPIFY_DBURL);
            this.db = this.client.db(environment.SHOPIFY_DBNAME);
            this.shopifyCollection = this.db.collection(environment.SHOPIFY_COLLECTIONNAME);
            this.storeCollection = this.db.collection(environment.STORE_COLLECTIONNAME);
        }
        return this.shopifyCollection;
    },
    createShopifyIndex: async function () {
        await this.shopifyCollection.createIndex({ sku: 1 });
        console.log(`shopifyCollection ${environment.SHOPIFY_COLLECTIONNAME} added index sku.`);
    },
    clearShopifyCollection: async function () {
        await this.shopifyCollection.deleteMany({});
        console.log(`shopifyCollection ${environment.SHOPIFY_COLLECTIONNAME} was cleared.`);
    },
    insertStoreStock: async function(collection) {
        await this.storeCollection.deleteMany({});
        await this.storeCollection.insertMany(collection, 
            async function (err, result) {
                if (err)
                    console.error(err.message);
                else {
                    console.log("Inserted records: " + result.result.n);
                    const collectionCount = await this.storeCollection.countDocuments(); 
                    console.log(`Counted ${collectionCount} records in total.`);
                }
            }
        );
    }
}
