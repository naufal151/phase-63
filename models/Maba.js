// Model untuk maba mengupload tugas dan profil maba

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('./User');
const Tugas = require('./Tugas');

const MyObjectId = mongoose.Schema.Types.ObjectId;

const mabaSchema = new mongoose.Schema({
    user: { 
        type: MyObjectId, 
        ref: 'User'
    },
    nama: String,
    npm: Number,
    kelompok: String,
    email: String,
    ig: String,
    alamat: String,
    tgl: Date,
    file: [{
        tugas: {
            type: MyObjectId, 
            ref: 'Tugas'
        },
        data: Buffer,
        contentType: String,
        date: String,
        time: String,
        status: String
    }]
});

mabaSchema.plugin(passportLocalMongoose);

module.exports = new mongoose.model('Maba', mabaSchema);