// Route untuk menampilkan halaman

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Maba = require('../models/Maba');
const Tugas = require('../models/Tugas');

// route untuk menampilkan root route landing page
router.get('/', (req, res) => {
    res.render('index', {loggedIn: req.isAuthenticated()});
});

// route untuk menampilkan halaman login (kalo ada)
router.get('/login', (req, res) => {
    res.render('login', {message: req.flash('message')});
});

// route untuk menampilkan halaman register (kalo ada)
router.get('/register', (req, res) => {
    res.render('register', {message: req.flash('message')});
});

router.get('/dashboard', (req, res) => {
    res.render('dashboard', {message: req.flash('message')});
});

router.get('/home', (req, res) => {
    res.render('home', {message: req.flash('message')});
});

router.get('/registerPanit', (req, res) => {
    res.render('registerPanit');
});

router.get('/tugas', (req, res) => {
    res.render('tugas', {message: req.flash('message')});
});

router.get('/materi', (req, res) => {
    res.render('materi', {message: req.flash('message')});
});

router.get('/materi/civitas', (req, res) => {
    res.render('materi/materi_1', {message: req.flash('message')});
});

router.get('/user', (req, res) => {
    res.render('user', {message: req.flash('message')});
});

router.get('/edituser', (req, res) => {
    res.render('edituser', {message: req.flash('message')});
});

// route untuk menampilkan halaman dashboard untuk maba
router.get('/dashMaba', (req, res) => {
    if (req.isAuthenticated()){
        if (req.user.role === 'maba'){
            Tugas.find({}, (err, tugas) => {
                if (err){
                    console.log(err);
                }
                else {
                    if (tugas){
                        Maba.findOne({user: req.user.id}, (err, maba) => {
                            res.render('home', {tugas: tugas, maba: maba});
                        });
                    }
                    else {
                        req.flash('message', 'Tidak ada tugas!');
                    }
                }
            });
        }
        else {
            res.redirect('/');
        }
    }
    else {
        res.redirect('/login');
    }
});

router.get('/tes', (req, res) => {
    if (req.isAuthenticated()){
        Maba.findOne({user: req.user.id}, (err, maba) => {
            res.send(maba.file[1].status);
        });
    }
});

// route untuk menampilkan halaman dashboard untuk panitia
router.get('/dashPanit', (req, res) => {
    if (req.isAuthenticated()){
        const role = req.user.role
        if (role.split('_')[0] === 'asesor'){
            Maba.find({'kelompok': role.split('_')[1]}, (err, maba) => {
                Tugas.find({}, (err, tugas) => {
                    if (err){
                        console.log(err);
                    }
                    else {
                        if (maba){
                            res.render('panitia', {tugas: tugas, maba: maba, role: role, kelompok: role.split('_')[1], uname: req.user.username}); //ganti file yang akan dirender dengan nama file yang sesuai
                        }
                        else {
                            req.flash('message', 'Tidak ada user!');
                        }
                    }
                });
            });
        }
        else if (role === 'pengembangan'){
            Maba.find({}, (err, maba) => {
                Tugas.find({}, (err, tugas) => {
                    if (err){
                        console.log(err);
                    }
                    else {
                        if (maba){
                            res.render('panitia', {tugas: tugas, maba: maba, role: role, uname: req.user.username});
                        }
                        else {
                            req.flash('message', 'Tidak ada user!');
                        }
                    }
                });
            });
        }
    }
    else {
        res.redirect('/login');
    }
});

// route untuk menampilkan tugas maba
router.get('/dashPanit/:filename', (req, res) => {
    if (req.isAuthenticated()){
        if (req.user.role === 'pengembangan' || req.user.role.split('_')[0] === 'asesor'){
            res.sendFile(__dirname + '/uploads/' + req.params['filename']);
        }
        else {
            res.redirect('/');
        }
    }
    else {
        res.redirect('/login');
    }
});

// route untuk ganti profil maba
router.get('/profileMaba', (req, res) => {
    // if (req.isAuthenticated()){
    //     if (req.user.role === 'maba'){
    //         Maba.findOne({'user': req.user.id}, (err, maba) => {
    //             if (err){
    //                 console.log(err);
    //             }
    //             else {
    //                 if (maba){
    //                     res.render('profilMaba', {maba: maba});
    //                 }
    //             }
    //         });
    //     }
    // }
    res.render('profilMaba');
});

module.exports = router;
