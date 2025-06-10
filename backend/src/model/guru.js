const mongoose = require("mongoose");

const GuruSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true, // Menandakan bahwa ID harus unik
    },
    nama: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  { collection: "Guru" } // Paksa nama collection jadi "siswa"
);

const Guru = mongoose.model("Guru", GuruSchema);
module.exports = Guru;