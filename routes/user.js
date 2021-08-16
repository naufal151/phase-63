// Route untuk semua user post seperti post/upload tugas, login, register, logout, dll

const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const Tugas = require('..models/Tugas');
const Maba = require('../models/Maba');

// route untuk login
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

// route untuk register
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

// route untuk logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// buat skema penyimpanan file tugas maba dengan multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'routes/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, req.user.username + '@' + new Date().getDate() + '-' + (new Date().getMonth()+1) + '-' + new Date().getFullYear() + '@' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});

// route untuk upload tugas maba
router.post('/mabaUpload', upload.single('file'), (req, res, next) => {
    const role = req.user.role;

    if (role === 'maba'){
        Maba.findOne({'user': req.user.id}, (err, user) => {
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
    }
    else {
        res.redirect('/');
    }
});

// route untuk upload tugas dari panit asesor/pengembangan
router.post('/panitUpload', (req, res) => {
    const judul = req.body.judul;
    const deskripsi = req.body.deskripsi;
    const deadline = req.body.deadline;

    const role = req.user.role;

    if (role === 'pengembangan' || role.split('_')[0] === 'asesor'){
        Tugas.findOne({'user': req.user.id}, (err, tugas) => {
            if (err){
                console.log(err);
            }
            else {
                if (tugas){
                    tugas.judul = judul;
                    tugas.deskripsi = deskripsi;
                    tugas.deadline = deadline;
    
                    tugas.save(() => {
                        res.redirect('/');
                    });
                }
                else {
                    req.flash('message', 'Tidak dapat mengupload tugas!');
                    res.redirect('/');
                }
            }
        });
    }
    else {
        res.redirect('/');
    }
});

// route untuk memberikan status tugas untuk maba
router.post('/statusTugas/:mabaId', (req, res) => {
    const status = req.body.status;

    if (req.user.role === 'pengembangan' || req.user.role.split('_')[0] === 'asesor'){
        Maba.findOne({user: req.params['mabaId']}, (err, maba) => {
            if (err){
                console.log(err);
            }
            else {
                if (maba){
                    maba.file.status = status;
                    maba.save(() => {
                        res.redirect('/dashPanit');
                    });
                }
            }
        });
    }
    else {
        res.redirect('/');
    }
});

// route untuk profil maba
router.post('/profil', (req, res) => {
    const nama = req.body.nama;
    const npm = req.body.npm;

    if (req.user.role === 'maba'){
        Maba.findOne({'user': req.user.id}, (err, maba) => {
            maba.nama = nama;
            maba.npm = npm;

            maba.save(() => {
                res.redirect('/dashMaba');
            });
        });
    }
    else {
        res.redirect('/');
    }
});

module.exports = router;
