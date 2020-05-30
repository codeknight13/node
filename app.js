const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path'); // Used to find absolute path in any OS
const adminRoutes = require('./routes/admin'); // Requiring routes and controllers
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');
const User = require('./models/user'); // Requiring users
const session = require('express-session');
const csrf = require('csurf'); // Securing Cross-Site-Request-Forgery
const csrfProtection = csrf();
const flash = require('connect-flash');
const db = require('./util/database'); // Database connection

const dbURL = db.getConnectionString();

app.set('view engine', 'ejs'); // Setting the templating engine

app.set('views', 'views'); // Not required to set if named views

app.use(express.static(path.join(__dirname, 'public'))); // For using files in public folder

app.use(bodyParser.urlencoded({
  extended: false
}));

// Session
const sessionHash = "785H3G61681eh95p3gAV3jFbVCP43Go6K7Owr11I1aUNf6zb3Y0N9s0sTpt61AY7ijIg7zX1kbNN10h14q0lLM88lth5z5244XuZ35RWi30i7v04wb41G3c71f10i8131C2PKG48TIMiC8M120c803hLPa45DV3v91JL973c7Au4yK3942CU0a1XO49V0g18KQ97q513J6A9o9ZeU88c6I4RMzx8ISTyk39I9ew1tB674NC81jmU1i45o5v631cP";
const MongoDBStore = require('connect-mongodb-session')(session); // MongoDB Store for sessions
const store = new MongoDBStore({
  uri: dbURL,
  collection: 'sessions'
});

app.use(session({
  secret: sessionHash,
  resave: false,
  saveUninitialized: false,
  store: store
}));

app.use(csrfProtection); // Should be placed after session initialisation
app.use(flash()); // Should be placed after session initialisation

app.use((req, res, next) => { // Injecting user into our request for further access
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = new User({
        name: user.name,
        email: user.email,
        password: user.password,
        cart: user.cart,
        id: user._id
      });
      next();
    })
    .catch(err => {
      console.log(err);
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  res.locals.errorMessage = req.flash('error');
  next();
})

app.use('/admin', adminRoutes); // app.use('/something', someroutes) this prepends /something before every route in someroutes
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

db.mongoConnect(() => {
  app.listen(3000, () => {
    console.log('Server Started');
  });
});

// if you ever come acrross situation where you have closed your server improperly and wants to reboot it use: - 
// => lsof -i tcp:portYouUsed
// kill -9 PID