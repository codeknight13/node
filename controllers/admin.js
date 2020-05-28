const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    product: {
      title: "Add title",
      description: "Add description",
      price: "Add price",
      imageUrl: "Add url"
    }
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => {
      console.log(err);
    })
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const userId = req.user._id;
  const product = new Product(
    title,
    price,
    description,
    imageUrl,
    userId
  );
  product.save()
    .then(() => {
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
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
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const updatedProduct = {
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    description: req.body.description
  }
  Product.updateOneById(id, updatedProduct)
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
}

exports.deleteProduct = (req, res, next) => {
  const deleteId = req.body.productId;
  Product.deleteOneById(deleteId)
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    })
}