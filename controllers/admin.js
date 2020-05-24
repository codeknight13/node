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

exports.getEditProduct = (req, res, next) => {
  const editMode = (req.query.edit === "true");
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId, product => {
    console.log(product);
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  })
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const toBeUpdatedProduct = {
    id: req.body.productId,
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    description: req.body.description
  }
  console.log("entering in the body of edit controller");
  Product.update(toBeUpdatedProduct, () => {
    res.redirect('/admin/products');
    console.log('redirecting to /admin/products');
  });
  console.log("leaving in the body of edit controller");
}

exports.deleteProduct = (req, res, next) => {
  const deleteId = req.body.productId;
  Product.deleteById(deleteId, () => {
    res.redirect('/admin/products');
  });
}