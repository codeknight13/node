const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: false
}));

// Database connection
const db = require('./util/database');

// Used to find absolute path in any OS
const path = require('path');

// Setting the templating engine
app.set('view engine', 'ejs');

// Not required to set if named views
app.set('views', 'views');

// For using files in public folder
app.use(express.static(path.join(__dirname, 'public')));

// Requiring routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Requiring Controller for error
const errorController = require('./controllers/error');

// Requiring users
const User = require('./models/user');

// Injecting user into our request for temporary use
const userId = "5ece3554d10ca2114390fc7e";
app.use((req, res, next) => {
  User.findById(userId)
    .then(user => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch(err => {
      console.log(err);
    });
});


// Using imported Routes
// app.use('/something', someroutes) this prepends /something before every route in someroutes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

db.mongoConnect(() => {
  app.listen(4000, () => {
    console.log('Server Started');
  });
});


/**
 * Below is a user document
  {
    "_id":{"$oid":"5ece3554d10ca2114390fc7e"},
    "name":"Vikram Kirti",
    "email":"kirtivikram13@gmail.com"
  }
 */