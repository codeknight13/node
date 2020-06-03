const mongodb = require('mongodb');

const connectionURL = 'mongodb+srv://codeknight13:V*k$1ml212665@cluster0-jb1si.mongodb.net/test?retryWrites=true&w=majority';
const shopConnectionURL = 'mongodb+srv://codeknight13:V*k$1ml212665@cluster0-jb1si.mongodb.net/shop';


const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (cb) => {
  // console.log('mongoConnect reached');
  MongoClient.connect(connectionURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(client => {
      // console.log('connection established successfully');
      _db = client.db('shop');
      cb();
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    })
}

const getDB = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found';
};

const getConnectionString = () => {
  return shopConnectionURL;
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
exports.getConnectionString = getConnectionString;