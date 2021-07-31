const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const File = require('../models/File');

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
                res.redirect('/');
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

router.get('logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});

router.post('/taskUpload', upload.single('file'), (req, res, next) => {
    const obj = {
        desc: req.body.desc,
        file: {
            contentType: 'file/pdf',
        }
    }

    File.create(obj, (err, file) => {
        if (err){
            console.log('error');
        }
        else {
            res.redirect('/taskUpload');
        }
    });
});

module.exports = router;