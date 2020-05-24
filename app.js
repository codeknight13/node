const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// Used to find absolute path in any OS
const path = require('path');


app.set('view engine', 'ejs');

// Not required to set if named views
app.set('views', 'views');

// For using files in public folder
app.use(express.static(path.join(__dirname, 'public')));

// Requiring routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Requiring Controller
const errorController = require('./controllers/error');

// app.use('/something', someroutes) this prepends /something before every route in someroutes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

app.listen(3000);