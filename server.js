// import libraries and require it for use
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
require('dotenv').config();

// set ejs as view engine, set public as assets source, 
// use body-parser to parse data from body html to server and flash for warning
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(flash());

// database connection for user session
const MongoStore = require('connect-mongo');
app.use(session({
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

// initialize passport to login and register schema and session
app.use(passport.initialize());
app.use(passport.session());

// connecting to database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("useCreateIndex", true);

// connect to user model
const User = require('./models/User');

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// import routes
const routes = require('./routes/pages');
const userRoute = require('./routes/user');
app.use('/', routes);
app.use('/', userRoute);

// listen to port
const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Server started on ${port}`);
});