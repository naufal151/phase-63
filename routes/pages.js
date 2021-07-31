const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {loggedIn: req.isAuthenticated()});
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/taskUpload', (req, res) => {
    if (req.isAuthenticated()){
        res.render('upload');
    }
    else {
        res.redirect('/login');
    }
});

module.exports = router;