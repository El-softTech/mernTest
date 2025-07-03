const express = require("express");
const router = express.Router();
const Siswa = require("../model/siswa");
const Guru = require("../model/guru");
const Token = require("../model/token");
const Question = require("../model/SoalUjian");
const crypto = require("crypto");
const Mapel = require("../model/mapel");
const Penilaian = require("../model/nilai");

router.get("/Siswa", async (req, res) => {
  try {
    const siswa = await Siswa.find();
    res.json(siswa);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/Siswa/:id", async (req, res) => {
  try {
    const siswa = await Siswa.findOne({ id: req.params.id });
    if (!siswa)
      return res.status(404).json({ message: "Siswa tidak ditemukan" });
    res.json(siswa);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/Siswa", async (req, res) => {
  const siswa = new Siswa({
    id: req.body.id,
    nama: req.body.nama,
    kelas: req.body.kelas,
  });

  try {
    const newSiswa = await siswa.save();
    res.status(201).json("succes");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/Siswa/:id", async (req, res) => {
  try {
    const siswa = await Siswa.findOneAndDelete({ id: req.params.id });
    if (!siswa)
      return res.status(404).json({ message: "Siswa tidak ditemukan" });
    res.json({ message: "Siswa berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/Siswa/:id", async (req, res) => {
  try {
    const siswa = await Siswa.findOne({ id: req.params.id });
    if (!siswa)
      return res.status(404).json({ message: "Siswa tidak ditemukan" });
    if (req.body.nama != null) siswa.nama = req.body.nama;
    if (req.body.kelas != null) siswa.kelas = req.body.kelas;
    const updatedSiswa = await siswa.save();
    res.json(updatedSiswa);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// === Guru ===
router.get("/Guru", async (req, res) => {
  try {
    const guru = await Guru.find();
    res.json(guru);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/Guru/:id", async (req, res) => {
  try {
    const guru = await Guru.findOne({ id: req.params.id });
    if (!guru) return res.status(404).json({ message: "Guru tidak ditemukan" });
    res.json(guru);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/Guru", async (req, res) => {
  const guru = new Guru({
    id: req.body.id,
    nama: req.body.nama,
    role: req.body.role,
  });
  try {
    const newGuru = await guru.save();
    res.status(201).json(newGuru);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/Guru/:id", async (req, res) => {
  try {
    const guru = await Guru.findOne({ id: req.params.id });
    if (!guru) return res.status(404).json({ message: "Guru tidak ditemukan" });
    if (req.body.nama != null) guru.nama = req.body.nama;
    if (req.body.role != null) guru.role = req.body.role;
    const updatedGuru = await guru.save();
    res.json(updatedGuru);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/Guru/:id", async (req, res) => {
  try {
    const guru = await Guru.findOneAndDelete({ id: req.params.id });
    if (!guru) return res.status(404).json({ message: "Guru tidak ditemukan" });
    res.json({ message: "Guru berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// === Token ===
router.get("/Token", async (req, res) => {
  try {
    const token = await Token.find();
    res.json(token);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function generateUniqueToken(length = 6) {
  let token;
  let exists = true;
  while (exists) {
    token = crypto.randomBytes(length).toString("hex").slice(0, length);
    exists = await Token.exists({ token });
  }
  return token;
}

router.post("/Token", async (req, res) => {
  const { type } = req.body;
  if (!type || !["public", "private"].includes(type)) {
    return res.status(400).json({ error: "Tipe token tidak valid" });
  }

  try {
    const tokenValue = await generateUniqueToken(6);
    const newToken = new Token({ token: tokenValue, type });
    await newToken.save();
    res.status(201).json({ message: "Token berhasil dibuat", token: newToken });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Gagal membuat token", details: err.message });
  }
});

router.get("/Siswaa/count", async (req, res) => {
  try {
    const jumlahSiswa = await Siswa.countDocuments();
    res.json({ totala: jumlahSiswa });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/Guruu/count", async (req, res) => {
  try {
    const jumlahGuru = await Guru.countDocuments();
    res.json({ total: jumlahGuru });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/validate-token", async (req, res) => {
  const { token: tokenInput, siswaId } = req.body;

  try {
    const foundToken = await Token.findOne({ token: tokenInput });
    if (!foundToken) {
      return res.status(404).json({ message: "Token tidak valid" });
    }

    const siswa = await Siswa.findOne({ id: siswaId });

    if (!siswa) {
      return res.status(404).json({ message: "ID tidak valid" });
    }

    // Jika token private, hapus setelah dipakai
    if (foundToken.type === "private") {
      await Token.deleteOne({ token: tokenInput });
    }

    res.status(200).json({
      valid: true,
      message: "Token dan Siswa valid",
      type: foundToken.type,
      siswa: {
        nama: siswa.nama,
        id: siswa._id,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan", error: error.message });
  }
});

// === Mapel / Subjects ===
router.get("/mapel", async (req, res) => {
  try {
    const mapel = await Mapel.find();
    res.json(mapel);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil mata pelajaran", error });
  }
});

router.post("/mapel", async (req, res) => {
  const { nama } = req.body;
  console.log("Menerima data:", req.body);

  if (!nama) {
    return res.json({ message: "Nama mata pelajaran harus diisi" });
  }
  try {
    const newMapel = new Mapel({ nama });
    await newMapel.save();
    res.json({ data: newMapel });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal menambahkan mata pelajaran", error });
  }
});

router.put("/mapel/:id", async (req, res) => {
  try {
    const updatedMapel = await Mapel.findByIdAndUpdate(
      req.params.id,
      { nama: req.body.nama },
      { new: true } // ini penting agar dapat data terbaru
    );

    if (!updatedMapel) {
      return res
        .status(404)
        .json({ message: "Mata pelajaran tidak ditemukan" });
    }

    res.json({
      message: "Mata pelajaran berhasil diperbarui",
      data: updatedMapel,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal memperbarui mata pelajaran", error });
  }
});

router.delete("/mapel/:id", async (req, res) => {
  try {
    const deleted = await Mapel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Mapel tidak ditemukan" });
    }
    res.json({ message: "Mapel berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus mapel", error });
  }
});

// === Soal / Questions ===
router.get("/questions", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil soal", error });
  }
});

router.post("/questions", async (req, res) => {
  try {
    const newQuestion = new Question(req.body);
    await newQuestion.save();
    res.status(201).json({ message: "Soal berhasil disimpan!" });
  } catch (error) {
    res.status(400).json({ message: "Gagal menyimpan soal", error });
  }
});

router.put("/questions/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question)
      return res.status(404).json({ message: "Soal tidak ditemukan" });

    Object.assign(question, req.body);
    const updated = await question.save();
    res.json({ message: "Soal berhasil diperbarui", data: updated });
  } catch (error) {
    res.status(400).json({ message: "Gagal memperbarui soal", error });
  }
});

router.delete("/questions/:id", async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question)
      return res.status(404).json({ message: "Soal tidak ditemukan" });
    res.json({ message: "Soal berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus soal", error });
  }
});

router.get("/questions/filter", async (req, res) => {
  const { kelas, jenis, mapel } = req.query;

  if (!kelas || !jenis || !mapel) {
    return res
      .status(400)
      .json({ message: "kelas, jenis, dan mapel harus disertakan" });
  }

  try {
    const questions = await Question.find({
      grade: kelas,
      examType: jenis,
      subject: mapel,
    });

    if (questions.length === 0) {
      return res
        .status(404)
        .json({ message: "Tidak ada soal ditemukan dengan kriteria tersebut" });
    }

    res.json(questions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat mengambil soal", error });
  }
});

// Hapus semua siswa berdasarkan kelas tertentu
router.delete("/Siswa/kelas/:kelas", async (req, res) => {
  const kelas = parseInt(req.params.kelas);
  if (isNaN(kelas))
    return res.status(400).json({ message: "Kelas harus berupa angka." });

  try {
    const result = await Siswa.deleteMany({ kelas });
    res.json({
      message: `${result.deletedCount} siswa kelas ${kelas} berhasil dihapus.`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal menghapus siswa.", error: error.message });
  }
});

// Naikkan kelas semua siswa dari kelas tertentu
router.put("/Siswa/kelas/:kelas", async (req, res) => {
  const kelasLama = parseInt(req.params.kelas);
  const { kelasBaru } = req.body;

  if (isNaN(kelasLama) || isNaN(kelasBaru)) {
    return res.status(400).json({ message: "Kelas harus berupa angka." });
  }

  try {
    const updated = await Siswa.updateMany(
      { kelas: kelasLama },
      { kelas: kelasBaru }
    );
    res.json({
      message: `${updated.modifiedCount} siswa berhasil dinaikkan ke kelas ${kelasBaru}`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal menaikkan kelas.", error: error.message });
  }
});

router.post("/Penilaian", async (req, res) => {
  try {
    const payload = req.body;

    const hasil = new Penilaian(payload);
    await hasil.save();

    res
      .status(201)
      .json({ message: "Data penilaian berhasil disimpan.", data: hasil });
  } catch (err) {
    console.error("Error menyimpan data:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat menyimpan data." });
  }
});

router.get("/Penilaian/filter", async (req, res) => {
  // console.log("Masuk ke route /penilaian/filter");
  const { grade, subject, examType } = req.query;

  const query = {};
  if (grade) query.grade = grade;
  if (subject) query.subject = subject;
  if (examType) query.examType = examType;

  try {
    const hasil = await Penilaian.find(query);

    res.json(hasil);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.post("/login", async (req, res) => {
  const { password, name } = req.body;

  try {
    const guru = await Guru.findOne({ id: password });

    if (guru) {
      return res
        .status(200)
        .json({ success: true, role: guru.role, nama: guru.nama }); // role = "admin" / "guru"
    }

    const siswa = await Siswa.findOne({ id: password });
    if (siswa) {
      return res
        .status(200)
        .json({ success: true, role: "siswa", nama: siswa.nama }); // role = "siswa"
    }

    return res
      .status(401)
      .json({ success: false, error: "ID tidak ditemukan" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

// Endpoint untuk mengambil soal
router.get("/api/exam", async (req, res) => {
  const { subject, examType, grade } = req.query;

  try {
    const questions = await Question.find({
      subject,
      examType,
      grade,
    }).select("questionText options answerKey -_id");

    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Endpoint untuk menyimpan hasil ujian
router.post("/api/exam-results", async (req, res) => {
  const { nama, id, subject, examType, grade, score, answers } = req.body;

  try {
    const examResult = new ExamResult({
      nama,
      id,
      subject,
      examType,
      grade,
      score,
      answers,
      date: new Date(),
    });

    await examResult.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save exam results" });
  }
});

module.exports = router;
