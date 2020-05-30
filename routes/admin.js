const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

const authorizedPersonnelOnly = require('../security/authorizedPersonnelOnly');

// /admin/add-product => GET
router.get('/add-product', authorizedPersonnelOnly, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', authorizedPersonnelOnly, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', authorizedPersonnelOnly, adminController.postAddProduct);

// /admin/edit-product => GET
router.get('/edit-product/:productId', authorizedPersonnelOnly, adminController.getEditProduct);

// /admin/edit-product => POST
router.post('/edit-product', authorizedPersonnelOnly, adminController.postEditProduct);

// /admin/delete-product => POST
router.post('/delete-product', authorizedPersonnelOnly, adminController.deleteProduct);

module.exports = router;