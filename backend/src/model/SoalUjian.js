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
    required: true,
  },
  grade: {
    type: String,
   
    required: true,
  },
  examType: {
    type: String,
  
    required: true,
  },
  academicYear: {
    type: String,
    required: true,
  },
});


const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
