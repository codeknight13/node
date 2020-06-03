const mongodb = require('mongodb')

const mongo = require('../util/database');

class Product {
  constructor(title, price, description, imageUrl, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this.userId = userId;
  }

  save() {
    const db = mongo.getDB();
    return db.collection('products')
      .insertOne(this)
      .then(result => {
        // console.log(result);
      })
      .catch(err => {
        console.log(err);
      })
  }

  static fetchAll() {
    const db = mongo.getDB();
    return db.collection('products')
      .find()
      .toArray()
      .then(products => {
        // console.log(products);
        return products;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static fetchAllFromUserId(id) {
    const db = mongo.getDB();
    return db.collection('products')
      .find({
        userId: new mongodb.ObjectId(id)
      })
      .toArray()
      .then(products => {
        // console.log(products);
        return products;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static findById(id) {
    const db = mongo.getDB();
    return db.collection('products')
      .findOne({
        _id: new mongodb.ObjectId(id)
      })
      .then(product => {
        return product;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static updateOneById(productId, updatedProduct, userId) {
    const db = mongo.getDB();
    return db.collection('products')
      .updateOne({
        _id: new mongodb.ObjectId(productId),
        userId: new mongodb.ObjectId(userId)
      }, {
        $set: updatedProduct
      })
      .catch(err => {
        console.log(err);
      });
  }

  static deleteOneById(id, userId) {
    const db = mongo.getDB();
    return db.collection('products')
      .deleteOne({
        _id: mongodb.ObjectId(id),
        userId: mongodb.ObjectId(userId)
      });
  }
}

module.exports = Product;