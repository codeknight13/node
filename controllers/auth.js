const User = require('../models/user');
const mongo = require('../util/database');
const bcrypt = require('bcryptjs');
const bcryptHashRounds = 12;


exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  })
}

exports.postLogin = (req, res, next) => {
  mongo.getDB()
    .collection('users')
    .findOne({
      name: req.body.name
    })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid UserName');
        return res.redirect('/login');
      }
      const enteredPassword = req.body.password;
      const cryptedUserPassword = user.password;
      bcrypt.compare(enteredPassword, cryptedUserPassword)
        .then(matchSuccessful => {
          if (matchSuccessful) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save(err => { // to make sure that we redirect only when write is completed on mongodb
              if (err) console.log(err);
              res.redirect('/');
            });
          } else {
            req.flash('error', 'Invalid Password');
            res.redirect('/login');
          }
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
}

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err)
      console.log('logout err ', err);
    res.redirect('/');
  });
}

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/auth/signup',
    pageTitle: 'SignUp',
    isAuthenticated: false
  })
}

exports.postSignup = (req, res, next) => {
  const db = mongo.getDB();
  db.collection('users')
    .findOne({
      name: req.body.name
    })
    .then(user => {
      const password = req.body.password;
      const confirmPassword = req.body.confirmPassword;
      if (user || password !== confirmPassword) {
        req.flash('error', 'UserName Exist, Try Logging In');
        return res.redirect('/signup');
      }
      return bcrypt.hash(password, bcryptHashRounds)
        .then(hashedPassword => {
          const userDetails = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            cart: {
              items: []
            }
          }
          user = new User(userDetails);
          return user.save();
        })
        .then(result => {
          res.redirect('/login');
        })
        .catch(err => console.log(err));
    })
}