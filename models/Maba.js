// Model untuk maba mengupload tugas dan profil maba

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const MyObjectId = mongoose.Types.ObjectId;

const mabaSchema = new mongoose.Schema({
    user: { 
        type: MyObjectId, 
        ref: 'User' 
    },
    nama: String,
    npm: Number,
    kelompok: String,
    file: {
        data: Buffer,
        contentType: String,
        date: String,
        time: String,
        status: String
    }
});

mabaSchema.plugin(passportLocalMongoose);

module.exports = new mongoose.model('Maba', mabaSchema);