// Model untuk Tugas yang diberikan oleh pengembangan dan/atau panitia (asesor)

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('./User');

const MyObjectId = mongoose.Schema.Types.ObjectId;

const tugasSchema = new mongoose.Schema({
    user: {
        type: MyObjectId,
        ref: 'User'
    },
    judul: String,
    deskripsi: String,
    deadline: Date,
    jenis: String
});

tugasSchema.plugin(passportLocalMongoose);

module.exports = new mongoose.model('Tugas', tugasSchema);