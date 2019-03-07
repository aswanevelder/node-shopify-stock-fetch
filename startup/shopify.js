const Shopify = require('shopify-api-node');
const environment = require('./environment');
let shopify;

module.exports = {
    init: async function () {
        shopify = new Shopify({
            shopName: environment.SHOPIFY_SHOPNAME,
            apiKey: environment.SHOPIFY_APIKEY,
            password: environment.SHOPIFY_PASSWORD
        });
        console.log(`SHOPIFY_SHOPNAME: ${environment.SHOPIFY_SHOPNAME}`);
        console.log(`SHOPIFY_APIKEY: ${environment.SHOPIFY_APIKEY}`);
        console.log(`SHOPIFY_PASSWORD: ${environment.SHOPIFY_PASSWORD}`);
    },
    locationId: null,
    getLocationId: async function () {
        if (!this.locationId) {
            const stockLocations = await shopify.location.list();
            if (stockLocations.length !== 1)
                console.error('The implementation only cater for 1 location at the moment');
            else {
                this.locationId = stockLocations[0].id;
            }
        }
        return this.locationId;
    },
    updateStock: async function (sku, inventoryId, stockQty) {
        const inventoryItem = await shopify.inventoryLevel.set({
            "location_id": await this.getLocationId(),
            "inventory_item_id": inventoryId,
            "available": stockQty
        });
        console.log(`Updated Stock for ${sku} to ${stockQty}`);
    },
    updatePrice: async function (id, price, comparePrice) {
        const result = await shopify.productVariant.update(id, {
            price: price,
            compare_at_price: comparePrice
        });
    },
    list: function (since_id) {
        return shopify.product.list({ limit: 250, since_id: since_id });
    }
}