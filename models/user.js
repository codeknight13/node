const mongodb = require('mongodb');

const mongo = require('../util/database');

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = mongo.getDB();
    return db
      .collection('users')
      .insertOne(this);
  }

  static findById(userId) {
    const db = mongo.getDB();
    return db
      .collection('users')
      .find({
        _id: new mongodb.ObjectId(userId)
      })
      .next();
  }

  addToCart(product) {
    const db = mongo.getDB();
    if (!this.cart) {
      const cart = {
        items: [{
          productId: product._id,
          quantity: 1
        }]
      }
      return db
        .collection('users')
        .updateOne({
          _id: new mongodb.ObjectId(this._id)
        }, {
          $set: {
            cart: cart
          }
        });
    }
    const updatedCart = {
      ...this.cart
    };
    const cartProductIndex = updatedCart.items.findIndex(cp => cp.productId.equals(product._id));
    if (cartProductIndex === -1) {
      updatedCart.items.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: 1
      })
    } else {
      updatedCart.items[cartProductIndex].quantity++;
    }
    return db
      .collection('users')
      .updateOne({
        _id: new mongodb.ObjectId(this._id)
      }, {
        $set: {
          cart: updatedCart
        }
      });
  }

  getCartProducts() {
    const db = mongo.getDB();
    const productIds = this.cart.items.map(item => new mongodb.ObjectId(item.productId));
    return db
      .collection('products')
      .find({
        _id: {
          $in: productIds
        }
      })
      .toArray()
      .then(cartItems => {
        // Mapping and returning cart products
        return cartItems.map(item => {
          return {
            ...item,
            quantity: this.cart.items.find(i => {
              return i.productId.equals(item._id);
            }).quantity
          }
        });
      });
  }

  deleteById(productId) {
    const updatedCartItems = this.cart.items.filter(item => !item.productId.equals(productId));
    const db = mongo.getDB();
    return db
      .collection('users')
      .updateOne({
        _id: new mongodb.ObjectId(this._id)
      }, {
        $set: {
          cart: {
            items: updatedCartItems
          }
        }
      });
  }

  addOrder() {
    const db = mongo.getDB();
    return this.getCartProducts()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: new mongodb.ObjectId(this._id),
            name: this.name
          }
        }
        return db
          .collection('orders')
          .insertOne(order);
      })
      .then(() => {
        return db
          .collection('users')
          .updateOne({
            _id: this._id
          }, {
            $set: {
              cart: {
                items: []
              }
            }
          })
      })
  }

  getOrders() {
    const db = mongo.getDB();
    return db
      .collection('orders')
      .find({
        'user._id': new mongodb.ObjectId(this._id)
      })
      .toArray()
      .then(orders => {
        console.log(orders);
        return orders;
      })
  }
}

module.exports = User;