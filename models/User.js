// Model untuk user secara umum

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        sparse: true 
    },
    password: String,
    role: String,
    npm: String,
    angkatan: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = new mongoose.model('User', userSchema);

