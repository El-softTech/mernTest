const mongoose = require("mongoose");

const SiswaSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true, 
    },
    nama: {
      type: String,
      required: true,
    },
    kelas: {
      type: String,
      required: true,
    },
  },
  { collection: "Siswa" } 
);

const Siswa = mongoose.model("Siswa", SiswaSchema);
module.exports = Siswa;