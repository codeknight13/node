const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

const makeid = (length = 7) => {
  let result = '';
  let characters = 'AB0CD1EF2GH3IJ4KL5MN6OP7QR8ST9UVWXYZabcdefghijklmnopqrstuvwxyz';
  characters += (3*characters);
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.id = makeid();
  }

  save () {
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static fetchAll (cb) {
    getProductsFromFile(cb);
  }

  static findById (id, cb) {
    getProductsFromFile(products => {
      const product = products.find(product => product.id === id);
      cb(product);
    })
  }

  static update (toBeUpdatedProduct, cb) {
    console.log("entering in the body of update model");
    getProductsFromFile(products => {
      const updateIndex = products.findIndex(product => product.id === toBeUpdatedProduct.id);
      products[updateIndex] = toBeUpdatedProduct;
      fs.writeFile(p, JSON.stringify(products), err => {
        if (err) {
          return console.log(err);
        }
        console.log("done writing");
        cb();
      });
    });
    console.log("leaving the body of edit controller");
  }

  static deleteById (deleteId, cb) {
    getProductsFromFile(products => {
      const product = products.find(pdt => pdt.id === deleteId);
      const updatedProducts = products.filter(product => product.id !== deleteId);
      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        if (err) {
          return console.log(err);
        }
        Cart.deleteProduct(product.id, product.price, () => {
          cb();
        });
      });
    });
  }
};