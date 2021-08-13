const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', (req, res) => {
    res.render('index', {loggedIn: req.isAuthenticated()});
});

router.get('/login', (req, res) => {
    res.render('login', {message: req.flash('message')});
});

router.get('/register', (req, res) => {
    res.render('register', {message: req.flash('message')});
});

router.get('/taskUpload', (req, res) => {
    if (req.isAuthenticated()){
        res.render('upload')
    }
    else {
        res.redirect('/login');
    }
});

router.get('/zoom', (req, res) => {
    if (req.isAuthenticated()){
        res.render('zoom');
    }
    else {
        res.redirect('/login');
    }
});

router.get('/files', (req, res) => {
    if (req.isAuthenticated()){
        User.find({'file': {$ne: null}}, (err, user) => {
            if (err){
                console.log(err);
            }
            else {
                if (user){
                    res.render('files', {users: user});
                }
                else {
                    res.send('user not found');
                }
            }
        });
    }
    else {
        res.redirect('/login');
    }
});

router.get('/files/:filename', (req, res) => {
	if (req.isAuthenticated()){
		res.sendFile(__dirname + '/uploads/' + req.params['filename']);
	}
	else {
		res.redirect('/login');
	}
});

module.exports = router;
