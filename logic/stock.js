const db = require('../startup/db');
const shopify = require('../startup/shopify');
const models = require('../logic/models');

module.exports = {
    init: async function () {
        await db.init();
        await shopify.init();
    },
    clearShopifyCollection: async function () {
        await db.createShopifyIndex();
        await db.clearShopifyCollection();
    },
    fetchShopify: async function (since_id) {
        let products = [];

        await shopify.list(since_id)
            .then(async product => {
                product.forEach(productItem => {
                    productItem.variants.map(variant => {
                        let shopify_product = models.getShopifyDbModel(variant, productItem);

                        if (shopify_product.sku === '')
                            shopify_product.status = 'ERR_NOSKU';

                        products.push(shopify_product);
                    });
                });

                if (products.length > 0) {
                    await this.insertShopifyRecords(products);
                    const lastId = products[products.length - 1].site_productid;
                    console.log(`Fetch next records from ID: ${lastId}`);
                    await this.fetchShopify(lastId);
                }
                else {
                    console.log('Finished collecting data from Shopify');
                }
            })
            .catch(err => console.error(err));
    },
    insertShopifyRecords: async function (data) {
        await db.shopifyCollection.insertMany(data);
    },
    finalise: async function () {
        console.log("Waiting for DB to complete.")
        setTimeout(() => { db.client.close(); console.log("Done"); }, 60000);
    }
};