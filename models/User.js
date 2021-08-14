const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    file: {
        data: Buffer, 
        contentType: String, 
        date: String, 
        time: String
    },
    role: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = new mongoose.model('User', userSchema);

