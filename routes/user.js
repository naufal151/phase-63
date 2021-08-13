const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

router.post('/login', (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, (err) => {
        if (err) {
            console.log(err);
            req.flash('message', 'Username atau Password salah! Coba ulangi lagi.');
            res.redirect('/login');
        }
        else {
            passport.authenticate('local', { failureRedirect: '/login', failureFlash: req.flash('message', 'Username atau Password salah! Coba ulangi lagi.')})(req, res, () => {
                res.redirect('/');
            });
        }
    });
});

router.post('/register', (req, res) => {
    const username = req.body.username;

    User.findOne({'username': username}, (err, user) => {
        if (err){
            console.log(err);
        }
        else {
            if (user){
                req.flash('message', 'Username sudah digunakan, coba username lain!');
                res.redirect('/register');
            }
            else {
                User.register({ username: req.body.username }, req.body.password, (err, user) => {
                    if (err) {
                        res.redirect('/register');
                    }
                    else {
                        passport.authenticate('local', { failureRedirect: '/register' })(req, res, () => {
                            res.redirect('/');
                        });
                    }
                });
            }
        }
    });
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'routes/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, req.user.username + '@' + new Date().getDate() + '-' + (new Date().getMonth()+1) + '-' + new Date().getFullYear() + '@' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});

router.post('/taskUpload', upload.single('file'), (req, res, next) => {
    User.findById(req.user.id, (err, user) => {
        const data = fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename));
        const contentType = 'application/pdf';

        if (err){
            console.log(err);
        }
        else {
            if (user){
                user.file.data = data;
                user.file.contentType = contentType;
                user.file.date = new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear();
                user.file.time = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
                user.save(() => {
                    res.redirect('/taskUpload');
                });
            }
            else {
                res.send('user tidak ditemukan');
            }
        }
    });
});

module.exports = router;
