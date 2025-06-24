const mongoose = require('mongoose');
const mapelSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: true,
        
    }
})

const Mapel = mongoose.model('Mapel', mapelSchema);
module.exports = Mapel;