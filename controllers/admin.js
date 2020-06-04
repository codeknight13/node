const Product = require('../models/product');
const validator = require('express-validator');
const deleteFile = require('../util/deleteFile');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    product: {
      title: "Add title",
      description: "Add description",
      price: "Add price",
      imageUrl: "Add url"
    },
    errorMessage: req.flash('error'),
    validationErrors: [],
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAllFromUserId(req.user._id)
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    })
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const userId = req.user._id;
  const errors = validator.validationResult(req);
  // console.log('uploaded image meta data', image);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
      },
      errorMessage: 'Attached image not of png, jpg, or jpeg format',
      validationErrors: [],
    });
  }

  const imageUrl = image.path;

  const product = new Product(
    title,
    price,
    description,
    imageUrl,
    userId
  );
  product.save()
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    })
};


exports.getEditProduct = (req, res, next) => {
  const editMode = (req.query.edit === "true");
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: req.flash('error'),
        validationErrors: [],
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    })
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const updatedProduct = {
    title: req.body.title,
    price: req.body.price,
    description: req.body.description
  }
  const errors = validator.validationResult(req);
  const image = req.file;

  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/add-product',
      editing: true,
      hasError: true,
      product: {
        ...updatedProduct,
        _id: productId
      },
      errorMessage: 'Attached image not of png, jpg, or jpeg format',
      validationErrors: [],
    });
  }

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/add-product',
      editing: true,
      hasError: true,
      product: {
        ...updatedProduct,
        _id: productId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  if (image) {
    updatedProduct.imageUrl = image.path;
  }
  Product.findById(productId)
    .then(product => {
      deleteFile(product.imageUrl);
      Product.updateOneById(productId, updatedProduct, req.user._id)
        .then(() => {
          res.redirect('/admin/products');
        })
        .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        })
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    })
}

exports.deleteProduct = (req, res, next) => {
  const deleteId = req.body.productId;
  Product.deleteOneById(deleteId, req.user._id)
    .then(() => {
      deleteFile(req.body.imageUrl);
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    })
}