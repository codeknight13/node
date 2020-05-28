const mongodb = require('mongodb');

const connectionURL = 'mongodb+srv://codeknight13:V*k$1ml212665@cluster0-jb1si.mongodb.net/test?retryWrites=true&w=majority';

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
      console.log(err);
      throw err;
    });
}

const getDB = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found';
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;