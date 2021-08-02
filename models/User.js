const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = new mongoose.model('User', userSchema);

