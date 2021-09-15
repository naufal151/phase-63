// Route untuk menampilkan halaman

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Maba = require('../models/Maba');
const Tugas = require('../models/Tugas');

// route untuk menampilkan root route landing page
router.get('/', (req, res) => {
    if (req.isAuthenticated()){
        res.redirect('/home');
    }else{
        res.render('index', {loggedIn: req.isAuthenticated()});
    }
});

// route untuk menampilkan halaman login (kalo ada)
router.get('/login', (req, res) => {
    res.render('login', {message: req.flash('message')});
});

// route untuk menampilkan halaman register (kalo ada)
router.get('/register', (req, res) => {
    res.render('register', {message: req.flash('message')});
});

router.get('/nightmodebackground', (req, res) => {
    res.render('background', {message: req.flash('message')});
});

router.get('/registerPanit', (req, res) => {
    res.render('tokenCheck');
});

router.get('/tugas', (req, res) => {
    if (req.isAuthenticated()){
        Tugas.find({}, (err, tugas) => {
            if (err){
                console.log(err);
            }
            else {
                if (tugas){
                    Maba.findOne({user: req.user.id}, (err, maba) => {
                        res.render('tugas', {tugas: tugas, maba: maba, user: req.user});
                    });
                }
                else {
                    req.flash('message', 'Tidak ada tugas!');
                }
            }
        });
    }
    else {
        res.redirect('/login');
    }
});

router.get('/tugas-detail/:id', (req, res) => {
    if (req.isAuthenticated()){
        Tugas.findById(req.params.id, (err, tugas) => {
            if (err){
                console.log(err);
            }
            else {
                if (tugas){
                    Maba.find({'file': {$ne: null}}, (err, peserta) => {
                        res.render('tugas-detail', {tugas: tugas, maba: peserta, user: req.user});
                    });
                }
                else {
                    req.flash('message', 'Tidak ada tugas!');
                }
            }
        });
    }
    else {
        res.redirect('/login');
    }
});

router.get('/materi', (req, res) => {
    if (req.isAuthenticated()){
        Tugas.find({}, (err, tugas) => {
            if (err){
                console.log(err);
            }
            else {
                if (tugas){
                    Maba.findOne({user: req.user.id}, (err, maba) => {
                        res.render('materi', {tugas: tugas, maba: maba, user: req.user});
                    });
                }
                else {
                    req.flash('message', 'Tidak ada tugas!');
                }
            }
        });
    }
    else {
        res.redirect('/login');
    }
});

router.get('/civitas', (req, res) => {
    if (req.isAuthenticated()){
        Tugas.find({}, (err, tugas) => {
            if (err){
                console.log(err);
            }
            else {
                if (tugas){
                    Maba.findOne({user: req.user.id}, (err, maba) => {
                        res.render('materi/materi_1', {tugas: tugas, maba: maba, user: req.user});
                    });
                }
                else {
                    req.flash('message', 'Tidak ada tugas!');
                }
            }
        });
    }
    else {
        res.redirect('/login');
    }
});

router.get('/badan-kelengkapan', (req, res) => {
    if (req.isAuthenticated()){
        Tugas.find({}, (err, tugas) => {
            if (err){
                console.log(err);
            }
            else {
                if (tugas){
                    Maba.findOne({user: req.user.id}, (err, maba) => {
                        res.render('materi/materi_2', {tugas: tugas, maba: maba, user: req.user});
                    });
                }
                else {
                    req.flash('message', 'Tidak ada tugas!');
                }
            }
        });
    }
    else {
        res.redirect('/login');
    }
});

router.get('/pengenalan-hifi', (req, res) => {
    if (req.isAuthenticated()){
        Tugas.find({}, (err, tugas) => {
            if (err){
                console.log(err);
            }
            else {
                if (tugas){
                    Maba.findOne({user: req.user.id}, (err, maba) => {
                        res.render('materi/materi_3', {tugas: tugas, maba: maba, user: req.user});
                    });
                }
                else {
                    req.flash('message', 'Tidak ada tugas!');
                }
            }
        });
    }
    else {
        res.redirect('/login');
    }
});

router.get('/user/:id', (req, res) => {
    if (req.isAuthenticated()){
        Maba.findById(req.params.id, (err, mabas) => {
            if (err){
                console.log(err);
            }
            else {
                res.render('user', {maba: mabas, user: req.user});
            }
        });
    }
    else {
        res.redirect('/login');
    }
});

router.get('/edituser/:id', (req, res) => {
    if (req.isAuthenticated()){
        Maba.findById(req.params.id, (err, mabas) => {
            if (err){
                console.log(err);
            }
            else {
                res.render('edituser', {maba: mabas, user: req.user});
            }
        });
    }
    else {
        res.redirect('/login');
    }
});

// route untuk menampilkan halaman dashboard untuk maba
router.get('/home', (req, res) => {
    if (req.isAuthenticated()){
        Tugas.find({}, (err, tugas) => {
            if (err){
                console.log(err);
            }
            else {
                if (tugas){
                    Maba.findOne({user: req.user.id}, (err, maba) => {
                        res.render('home', {tugas: tugas, maba: maba, user: req.user});
                    });
                }
                else {
                    req.flash('message', 'Tidak ada tugas!');
                }
            }
        });
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
        if (role.split('_')[0] !== 'maba'){
            Maba.find({'kelompok': role}, (err, maba) => {
                Tugas.find({}, (err, tugas) => {
                    if (err){
                        console.log(err);
                    }
                    else {
                        if (maba){
                            res.render('panitia', {tugas: tugas, maba: maba, role: role, kelompok: role.split('_')[1], uname: req.user.username, user: req.user}); //ganti file yang akan dirender dengan nama file yang sesuai
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
                            res.render('panitia', {tugas: tugas, maba: maba, role: role, uname: req.user.username, user: req.user});
                        }
                        else {
                            req.flash('message', 'Tidak ada user!');
                        }
                    }
                });
            });
        }else {
            res.redirect('/home');
        }
    }
    else {
        res.redirect('/login');
    }
});

// route untuk menampilkan tugas maba
router.get('/dashPanit/:filename', (req, res) => {
    if (req.isAuthenticated()){
        if (req.user.role === 'pengembangan' || req.user.role.split('_')[0] === 'asesor' || req.user.role !== 'maba'){
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
