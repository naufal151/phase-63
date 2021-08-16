// Model untuk Tugas yang diberikan oleh pengembangan dan/atau panitia (asesor)

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const MyObjectId = mongoose.Types.ObjectId;

const tugasSchema = new mongoose.Schema({
    user: {
        type: MyObjectId,
        ref: 'User'
    },
    judul: String,
    deskripsi: String,
    deadline: String
});

tugasSchema.plugin(passportLocalMongoose);

module.exports = new mongoose.model('Tugas', tugasSchema);