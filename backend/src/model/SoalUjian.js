const mongoose = require('mongoose');


const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  choices: {
    A: { type: String, required: true },
    B: { type: String, required: true },
    C: { type: String, required: true },
    D: { type: String, required: true },
    E: { type: String, required: true },
  },
  correctAnswer: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'E'],  // Menyimpan pilihan yang benar
    required: true,
  },
  subject: {
    type: String,
    enum: [
      'bahasa_inggris',
      'ppkn',
      'informatika',
      'bahasa_indonesia',
      'ips',
      'matematika',
      'kemuhammadiyahan',
      'fiqih',
      'aqidah_akhlak',
      'tarikh_islam',
      'bahasa_arab',
      'alquran_hadits',
      'sbk',
      'ipa',
      'pjok',
    ],
    required: true,
  },
  grade: {
    type: String,
    enum: ['7', '8', '9'], // Kelas 7, 8, 9
    required: true,
  },
  examType: {
    type: String,
    enum: ['UTS', 'UAS'], // Jenis ujian UTS atau UAS
    required: true,
  },
  academicYear: {
    type: String,
    required: true,
  },
});


const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
