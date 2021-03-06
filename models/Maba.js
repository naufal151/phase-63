// Model untuk maba mengupload tugas dan profil maba

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('./User');
const Tugas = require('./Tugas');

const MyObjectId = mongoose.Schema.Types.ObjectId;

const mabaSchema = new mongoose.Schema({
    user: { 
        type: MyObjectId, 
        ref: 'User',
        unique: false
    },
    nama: String,
    npm: Number,
    kelompok: String,
    desc: String,
    ttl: String,
    ig: String,
    wa: String,
    alamat: String,
    file: [{
        tugas: MyObjectId,
        data: Buffer,
        contentType: String,
        date: String,
        time: String,
        status: String,
        judul: String
    }]
});

mabaSchema.plugin(passportLocalMongoose);

module.exports = new mongoose.model('Maba', mabaSchema);