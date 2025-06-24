import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Lottie from "lottie-react";
import jamAnim from "../assets/jam.json";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function FormQuestionWithAI() {
  const navigate = useNavigate();
  // State form manual dan juga untuk generate AI
  const [form, setForm] = useState({
    questionText: "",
    choices: { A: "", B: "", C: "", D: "", E: "" },
    correctAnswer: "",
    subject: "", // Mata pelajaran
    grade: "", // Kelas
    examType: "",
    academicYear: "",
  });

  // State untuk generate AI input tambahan
  const [aiInput, setAiInput] = useState({
    mapel: "",
    materi: "",
    grade: "",
  });

  const [loading, setLoading] = useState(false);

  const [mapelList, setMapelList] = useState([]);

  useEffect(() => {
    
    const fetchMapel = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_SERVER}/api/mapel`);
        const data = await res.json();
        
        setMapelList(data); 
      } catch (err) {
        console.error("Gagal mengambil data mapel:", err);
      }
    };

    fetchMapel();
  }, []);

  // Handle perubahan input form manual
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["A", "B", "C", "D", "E"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        choices: { ...prev.choices, [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle perubahan input AI generate
  const handleAiChange = (e) => {
    const { name, value } = e.target;
    setAiInput((prev) => ({ ...prev, [name]: value }));
  };

  const generateQuestion = async () => {
    if (!aiInput.mapel || !aiInput.materi || !aiInput.grade) {
      toast.error("Isi Mapel, Materi, dan Kelas untuk generate soal.");
      return;
    }

    setLoading(true);

    const prompt = `
Buatkan 1 soal pilihan ganda mata pelajaran ${aiInput.mapel} tentang ${aiInput.materi} untuk kelas ${aiInput.grade}.
- Tingkat kesulitan sesuai kelas.
- Gunakan 5 opsi jawaban (A-E).
- Sertakan kunci jawaban.

**Balas hanya dengan JSON tanpa penjelasan, tanpa tambahan teks apapun.**
Contoh format:
{
  "soal": "Pertanyaan di sini...",
  "pilihan": {
    "A": "Opsi A",
    "B": "Opsi B",
    "C": "Opsi C",
    "D": "Opsi D",
    "E": "Opsi E"
  },
  "jawaban": "A"
}
`;

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://your-website.com",
            "X-Title": "ujian-app",
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-r1-0528:free",
            messages: [{ role: "user", content: prompt }],
          }),
        }
      );

      if (!response.ok) {
        // Kalau status bukan 2xx, tampilkan error
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      const rawText = data.choices?.[0]?.message?.content;
      if (!rawText)
        throw new Error("Response AI kosong atau tidak sesuai format");

      const jsonStart = rawText.indexOf("{");
      const jsonEnd = rawText.lastIndexOf("}") + 1;

      if (jsonStart === -1 || jsonEnd === -1)
        throw new Error("Tidak dapat menemukan JSON dalam response AI");

      const jsonString = rawText.substring(jsonStart, jsonEnd);
      const parsed = JSON.parse(jsonString);

      setForm({
        questionText: parsed.soal,
        choices: parsed.pilihan,
        correctAnswer: parsed.jawaban,
        subject: aiInput.mapel,
        grade: aiInput.grade,
        examType: "",
        academicYear: "",
      });

      toast.success("Soal berhasil digenerate dan masuk ke form.");
    } catch (err) {
      console.error("Error generate soal:", err);
      toast.error(`Gagal generate soal coba ulangi lagi`);
    }

    setLoading(false);
  };

  // Submit form manual ke server
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.correctAnswer) {
      toast.error("Kunci jawaban belum dipilih.");
      return;
    }
    if (!form.questionText) {
      toast.error("Soal belum diisi.");
      return;
    }
    if (!form.subject || !form.grade) {
      toast.error("Mapel dan Kelas harus diisi.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER}/api/questions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) throw new Error("Gagal menyimpan soal");

      const data = await response.json();
      toast.success(data.message);

      // Reset form manual dan AI input
      setForm({
        questionText: "",
        choices: { A: "", B: "", C: "", D: "", E: "" },
        correctAnswer: "",
        subject: "",
        grade: "",
        examType: "",
        academicYear: "",
      });

      setAiInput({ mapel: "", materi: "", grade: "" });
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat menyimpan soal.");
    }

    console.log("Data yang dikirim ke backend:", form);
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
        Form Tambah Soal & Generate AI
      </h2>

      {/* Bagian Generate AI */}
      <div className="mb-8 p-4 bg-white rounded-md shadow">
        <h3 className="text-xl font-semibold mb-4 text-center">
          Generate Soal dengan AI
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            name="mapel"
            placeholder="Mata Pelajaran"
            value={aiInput.mapel}
            onChange={handleAiChange}
            className="p-3 border rounded-md focus:ring focus:ring-indigo-300"
          />
          <input
            type="text"
            name="materi"
            placeholder="Materi"
            value={aiInput.materi}
            onChange={handleAiChange}
            className="p-3 border rounded-md focus:ring focus:ring-indigo-300"
          />
          <input
            type="text"
            name="grade"
            placeholder="Kelas"
            value={aiInput.grade}
            onChange={handleAiChange}
            className="p-3 border rounded-md focus:ring focus:ring-indigo-300"
          />
        </div>

        <button
          onClick={generateQuestion}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white py-3 rounded-md font-semibold shadow-md"
        >
          {loading ? (
            <div className="flex justify-center items-center min-h-[50px]">
              <div className="flex items-center space-x-2">
                <p className="text-3xl text-amber-50">Generate soal</p>
                <Lottie
                  animationData={jamAnim}
                  loop={true}
                  style={{ width: 50, height: 100 }}
                />
              </div>
            </div>
          ) : (
            "Generate Soal AI"
          )}
        </button>
      </div>

      {/* Form Manual */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-6 bg-white rounded-md shadow"
      >
        <h3 className="text-xl font-semibold mb-4 text-center">
          Form Input Soal Manual
        </h3>

        <div>
          <label className="font-semibold text-gray-700 block mb-1">
            Tulis Soal:
          </label>
          <textarea
            name="questionText"
            placeholder="Tulis soal di sini..."
            value={form.questionText}
            onChange={handleChange}
            className="w-full p-3 border border-purple-300 rounded-md shadow-sm focus:ring focus:ring-purple-300"
            required
          />
        </div>

        <div>
          <label className="font-semibold text-gray-700 block mb-2">
            Pilihan Jawaban:
          </label>
          {["A", "B", "C", "D", "E"].map((option) => (
            <label
              key={option}
              className="flex items-center space-x-3 mb-2 bg-white px-3 py-2 rounded-md shadow hover:bg-purple-50"
            >
              <input
                type="radio"
                name="correctAnswer"
                value={option}
                checked={form.correctAnswer === option}
                onChange={handleChange}
                className="text-purple-600 focus:ring-purple-400"
                required
              />
              <input
                type="text"
                name={option}
                placeholder={`Pilihan ${option}`}
                value={form.choices[option]}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-purple-300"
                required
              />
            </label>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="p-3 border rounded-md bg-white shadow-sm focus:ring focus:ring-indigo-200"
            required
          >
            <option value="">Pilih Mata Pelajaran</option>
            {mapelList?.map((mapel) => (
              <option key={mapel._id} value={mapel.nama}>
                {mapel.nama}
              </option>
            ))}
          </select>

          <select
            name="grade"
            value={form.grade}
            onChange={handleChange}
            className="p-3 border rounded-md bg-white shadow-sm focus:ring focus:ring-indigo-200"
            required
          >
            <option value="">Pilih Kelas</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="examType"
            value={form.examType}
            onChange={handleChange}
            className="p-3 border rounded-md bg-white shadow-sm focus:ring focus:ring-indigo-200"
          >
            <option value="">Pilih Jenis Ujian (opsional)</option>
            <option value="UTS">UTS</option>
            <option value="UAS">UAS</option>
          </select>

          <input
            type="text"
            name="academicYear"
            placeholder="Tahun Ajaran misal: 2023"
            value={form.academicYear}
            onChange={handleChange}
            className="p-3 border rounded-md shadow-sm focus:ring focus:ring-indigo-200"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-md shadow-md transition"
        >
          Simpan Soal
        </button>
        <button
          onClick={() => navigate("/liat-soal")}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md shadow-md transition"
        >
          Lihat Semua Soal
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
}
