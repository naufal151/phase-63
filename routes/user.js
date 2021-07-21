const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

router.post('/login', (req, res) => {
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
                res.redirect('/#page-portfolio');
            });
        }
    });
});

router.post('/register', (req, res) => {
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

module.exports = router;