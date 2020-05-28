const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct)

router.get('/cart', shopController.getCartProducts);

router.post('/cart', shopController.postCartProduct)

router.post('/cart-delete-item', shopController.postCartDeleteProduct);

router.post('/order-cart', shopController.postOrders);

router.get('/orders', shopController.getOrders);

module.exports = router;