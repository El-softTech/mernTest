const mongoose = require("mongoose");

const penilaianSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
    default: "Anonim"
  },
  id: {
    type: String,
    required: true,
    default: "tanpa-id"
  },
  subject: {
    type: String,
    required: true
  },
  examType: {
    type: String,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  totalBenar: {
    type: Number,
    required: true
  },
  jawaban: {
    type: Map, // Kunci berupa string (id soal), nilai berupa jawaban A/B/C/D
    of: String,
    required: true
  }
});

module.exports = mongoose.model("Penilaian", penilaianSchema);
