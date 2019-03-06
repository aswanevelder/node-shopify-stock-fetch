module.exports = {
    getShopifyDbModel: function(variant, productItem) {
        return {
            sku: variant.sku,
            site_productid: variant.product_id,
            site_variantid: variant.id,
            site_inventoryid: variant.inventory_item_id,
            product_title: productItem.title,
            variant_title: variant.title,
            site_price: variant.price,
            site_compareprice: variant.compare_at_price,
            site_stock: variant.inventory_quantity,
            store_price: 0,
            store_promo: 0,
            store_stock: 0,
            status: 'SHOPIFY'
        };
    },
    getStoreDbModel: function(data) {
        return {
            "sku": data[0],
            "descr": data[1],
            "qty": data[2],
            "price": data[3],
            "promo": data[4]
        };
    }
}