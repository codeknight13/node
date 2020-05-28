const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      return res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    })
}

exports.getCartProducts = (req, res, next) => {
  return req.user.getCartProducts()
    .then(cartItems => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartItems
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postCartProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      // console.log(result);
      res.redirect('/');
    })
}

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.user.deleteById(productId)
    .then(result => {
      // console.log(result);
      res.redirect('/cart');
    })
}

exports.postOrders = (req, res, next) => {
  req.user.addOrder()
    .then(() => {
      res.redirect('/');
    })
    .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders()
    .then((orders) => {
      res.render('shop/orders.ejs', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
}