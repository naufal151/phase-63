// Route untuk semua user post seperti post/upload tugas, login, register, logout, dll

const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const Tugas = require('../models/Tugas');
const Maba = require('../models/Maba');

// route untuk login
router.post('/login', (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, (err) => {
        if (err) {
            res.redirect('/login');
            console.log(err);
            req.flash('message', 'Username atau Password salah! Coba ulangi lagi.');
        }
        else {
            passport.authenticate('local', { failureRedirect: '/login', failureFlash: req.flash('message', 'Username atau Password salah! Coba ulangi lagi.')})(req, res, () => {
                if (req.user.role === 'maba'){
                    res.redirect('/home');
                }
                else {
                    res.redirect('/dashPanit');
                }
            });
        }
    });
});

// route untuk register maba
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
                            user.role = 'maba';
                            user.save(() => {
                                res.render('profile');
                            });
                        });
                    }
                });
            }
        }
    });
});

router.post('/registerPanit', (req, res) => {
    if (req.body.token === process.env.TOKEN){
        res.render('registerPanit');
    }
    else {
        req.flash('message', 'Token yang anda masukan salah.');
        res.redirect('/tokenCheck');
    }
});

router.post('/registerPanit/reg', (req, res) => {
    User.findOne({'username': req.body.username}, (err, user) => {
        if (err){
            console.log(err);
        }
        else {
            if (user){
                req.flash('message', 'Username sudah digunakan! Coba username lain.');
                res.redirect('/registerPanit');
            }
            else {
                User.register({username: req.body.username}, req.body.password, (err, user) => {
                    if (err){
                        res.redirect('/registerPanit');
                    }
                    else {
                        passport.authenticate('local', {failureRedirect: '/registerPanit'})(req, res, () => {
                            user.role = req.body.role;
                            user.save(() => {
                                res.redirect('/dashPanit');
                            });
                        });
                    }
                });
            }
        }
    });
});

// route untuk profile nama, kelompok, npm
router.post('/profile', (req, res) => {
    const userProfile = new Maba({
        user: req.user.id,
        nama: req.body.nama,
        npm: req.body.npm,
        kelompok: req.body.kelompok,
        ttl: req.body.ttl,
        wa: req.body.wa,
        ig: req.body.ig,
        alamat: req.body.alamat,
        desc: req.body.desc
    });

    userProfile.save(() => {
        res.redirect('/home');
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
        Maba.findOne({user: req.user.id}, (err, maba) => {
            if (err){
                console.log(err);
            }
            else {
                if (maba){
                    cb(null, maba.npm + '@' + new Date().getFullYear() + '-' + (new Date().getMonth()+1) + '-' + new Date().getDate() + path.extname(file.originalname));
                }
            }
        });
    }
});

const upload = multer({storage: storage});

// route untuk upload tugas maba
router.post('/mabaUpload/:id', upload.single('file'), (req, res, next) => {
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
                    const file = {
                        tugas: req.params.id,
                        data: data,
                        contentType: contentType,
                        date: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
                        time: new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),
                        status: 'diperiksa'
                    }

                    user.file.push(file);
                    user.save(() => {
                        res.redirect('/home');
                    });
                }
                else {
                    req.flash('message', 'Gagal upload tugas!');
                    res.redirect('/home');
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
    const jenis = req.body.jenis;

    const tugas = new Tugas({
        judul: judul,
        deskripsi: deskripsi,
        deadline: deadline,
        jenis: jenis
    });

    tugas.save((err) => {
        if (err){
            res.send('MongoDriver Error! Please contact our staff.');
        }
        else {
            res.redirect('/dashPanit');
        }
        
    });
});

// route untuk delete upload tugas dari panitia
// cara pake --> <form method="POST" action="/removeTugas/<%= tugasMaba.id %>?_method=DELETE"></form>
router.post('/removeTugas/:tugasId', (req, res) => {
    Tugas.findByIdAndRemove(req.params.tugasId, (err, tugas) => {
        if (err){
            console.log(err);
        }
        else {
            if (tugas){
                res.redirect('/dashPanit');
            }
        }
    });
});

// route untuk memberikan status tugas untuk maba
router.post('/statusTugas/:mabaId/:fileIndex', (req, res) => {
    const status = req.body.status;

    if (req.user.role === 'pengembangan' || req.user.role.split('_')[0] === 'asesor'){
        Maba.findOne({user: req.params['mabaId']}, (err, maba) => {
            if (err){
                console.log(err);
            }
            else {
                if (maba){
                    maba.file[req.params['fileIndex']].status = status;
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

// route untuk ganti profil maba
router.post('/profileChange', (req, res) => {
    const ttl = req.body.ttl;
    const alamat = req.body.alamat;
    const desc = req.body.desc;
    const ig = req.body.ig;
    const wa = req.body.wa;

    Maba.findOne({'user': req.user.id}, (err, maba) => {
        if (err){
            res.send(err);
        }
        else {
            if (maba){
                maba.ttl = ttl;
                maba.alamat = alamat;
                maba.desc = desc;
                maba.ig = ig;
                maba.wa = wa;

                maba.save(() => {
                    res.redirect('/home');
                });
            }
        }
    });
});

module.exports = router;
