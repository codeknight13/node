const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);


module.exports = class Cart {
  static addProduct (id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      let cart = {products: [], totalPrice: 0};
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct =  {...existingProduct};
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = {
          id: id,
          qty: 1
        }
        cart.products = [...cart.products, updatedProduct];
      }
      let price = parseFloat(cart.totalPrice) + parseFloat(productPrice);
      Math.round((price+Number.EPSILON)*1000)/1000;
      cart.totalPrice = price;
      fs.writeFile(p, JSON.stringify(cart), err => console.log(err));
      console.log('Write Complete');
    })
  }

  static deleteProduct(id, productPrice, cb) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return cb();
      }
      const cart = JSON.parse(fileContent);
      const updatedCart = {...cart};
      const product = updatedCart.products.find(prod => prod.id === id);
      if (!product) {
        return cb();
      }
      console.log(updatedCart.totalPrice, productPrice, product.qty);
      console.log(typeof(updatedCart.totalPrice), typeof(productPrice), typeof(product.qty));
      updatedCart.totalPrice = +updatedCart.totalPrice - parseFloat(productPrice)*parseInt(product.qty);
      updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
      fs.writeFile(p, JSON.stringify(updatedCart), err => {
        console.log(err);
        cb();
      });
    });
  }

  static getProduct(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb(null);
      } else {
        const cart = JSON.parse(fileContent);
        cb(cart);
      }
    })
  }
}