const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    desc: String,
    file: {data: Buffer, contentType: String}
});

module.exports = new mongoose.model('File', fileSchema);