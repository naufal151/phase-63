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

router.get('/home', (req, res) => {
    res.render('home', {message: req.flash('message')});
});


router.get('/taskUpload', (req, res) => {
    if (req.isAuthenticated()){
        if (req.user.role === 'maba'){
            Tugas.find({}, (err, tugas) => {
                if (err){
                    console.log(err);
                }
                else {
                    if (tugas){
                        res.render('upload', {tugas: tugas, message: req.flash('message')}); //ganti file yang akan dirender dengan nama file yang sesuai
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

// route untuk menampilkan halaman dashboard untuk panitia
router.get('/dashPanit', (req, res) => {
    const role = req.user.role
    if (req.isAuthenticated()){
        if (role.split('_')[0] === 'asesor'){
            Maba.find({'kelompok': role.split('_')[1]}, (err, maba) => {
                if (err){
                    console.log(err);
                }
                else {
                    if (maba){
                        res.render('files', {maba: maba, message: req.flash('message')}); //ganti file yang akan dirender dengan nama file yang sesuai
                    }
                    else {
                        req.flash('message', 'Tidak ada user!');
                    }
                }
            });
        }
        else if (role === 'pengembangan'){
            Maba.find({}, (err, maba) => {
                if (err){
                    console.log(err);
                }
                else {
                    if (maba){
                        res.render('files', {maba: maba, message: req.flash('message')});
                    }
                    else {
                        req.flash('message', 'Tidak ada user!');
                    }
                }
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

module.exports = router;
