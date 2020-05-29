const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: false
}));

const db = require('./util/database'); // Database connection

const path = require('path'); // Used to find absolute path in any OS

app.set('view engine', 'ejs'); // Setting the templating engine

app.set('views', 'views'); // Not required to set if named views

app.use(express.static(path.join(__dirname, 'public'))); // For using files in public folder

const adminRoutes = require('./routes/admin'); // Requiring routes and controllers
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

const User = require('./models/user'); // Requiring users

const userId = "5ece3554d10ca2114390fc7e"; // Injecting user into our request for temporary use
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

app.use('/admin', adminRoutes); // app.use('/something', someroutes) this prepends /something before every route in someroutes
app.use(shopRoutes);
app.use(errorController.get404);

db.mongoConnect(() => {
  app.listen(4000, () => {
    console.log('Server Started');
  });
});