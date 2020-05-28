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

  static findById(id) {
    const db = mongo.getDB();
    return db.collection('products')
      .find({
        _id: new mongodb.ObjectId(id)
      })
      .next()
      .then(product => {
        // console.log('your product', product);
        if (product)
        return product;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static updateOneById(id, updatedProduct) {
    const db = mongo.getDB();
    return db.collection('products')
      .updateOne({_id: new mongodb.ObjectId(id)}, {$set: updatedProduct})
      .catch(err => {
        console.log(err);
      });
  }

  static deleteOneById(id) {
    const db = mongo.getDB();
    return db.collection('products')
      .deleteOne({_id: mongodb.ObjectId(id)});
  }
}

module.exports = Product;