// import libraries and require it for use
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
require('dotenv').config();

// set ejs as view engine, set public as assets source, 
// use body-parser to parse data from body html to server and flash for warning
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
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

// create database model
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String,
});

// connect model to database
userSchema.plugin(passportLocalMongoose);

// collection for database
const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// get home route
app.get('/', (req, res) => {
    res.render('index');
});

// get login route
app.get('/register', (req, res) => {
    res.render('register', {message: req.flash('error')});
});

// get register route
app.get('/login', (req, res) => {
    res.render('login', {message: req.flash('error')});
});

// post register route
app.post('/register', (req, res) => {
    User.register({ username: req.body.username }, req.body.password, (err, user) => {
        if (err) {
            res.redirect('/register');
        }
        else {
            passport.authenticate('local', { failureFlash: true, failureRedirect: '/register' })(req, res, () => {
                res.redirect('/');
            });
        }
    });
});

// post login route
app.post('/login', (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, (err) => {
        if (err) {
            console.log(err);
            res.redirect('/login');
        }
        else {
            passport.authenticate('local', { failureRedirect: '/login', failureFlash: true })(req, res, () => {
                res.redirect('/');
            });
        }
    });
});

// listen to port
const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Server started on ${port}`);
});