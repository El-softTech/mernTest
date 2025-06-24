import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useeffect} from "react";

const ViewSoal = () => {
  const [filters, setFilters] = useState({
    grade: "",
    examType: "",
    subject: "",
    academicYear: "",
  });

  const [allQuestions, setAllQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchQuestions = async () => {
    const { grade, examType, subject, academicYear } = filters;

    if (!grade || !examType || !subject || !academicYear) {
      toast.warning("Lengkapi semua filter terlebih dahulu.");
      return;
    }

    setLoading(true);

    const url = `${
      import.meta.env.VITE_API_SERVER
    }/api/questions/filter?kelas=${grade}&jenis=${examType}&mapel=${subject}&tahun=${academicYear}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!response.ok) throw new Error("Gagal mengambil soal");
      const data = await response.json();
      setAllQuestions(data);
    } catch (error) {
      console.error(error);
      toast.error("Tidak ada soal tersedia.");
      setAllQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFilteredQuestions(allQuestions);
  }, [allQuestions]);

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setShowModal(true);
  };

  const handleDeleteClick = (_id) => {
    setQuestionToDelete(_id);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER}/api/questions/${questionToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      if (!response.ok) throw new Error("Gagal menghapus");
      toast.success("Soal berhasil dihapus.");
      setAllQuestions((prev) => prev.filter((q) => q._id !== questionToDelete));
      setDeleteModal(false);
      setQuestionToDelete(null);
    } catch (error) {
      toast.error("Gagal hapus soal.");
    }
  };

  const submitEdit = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER}/api/questions/${
          editingQuestion._id
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(editingQuestion),
        }
      );
      if (!response.ok) throw new Error("Gagal menyimpan perubahan");
      toast.success("Soal berhasil diperbarui.");
      setShowModal(false);
      fetchQuestions();
    } catch (error) {
      toast.error("Gagal update soal.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Lihat Soal</h1>

      {/* Filter */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <input
          type="text"
          name="academicYear"
          placeholder="Tahun Ajaran"
          value={filters.academicYear}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <select
          name="grade"
          value={filters.grade}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="">Kelas</option>
          <option value="7">Kelas 7</option>
          <option value="8">Kelas 8</option>
          <option value="9">Kelas 9</option>
        </select>

        <select
          name="examType"
          value={filters.examType}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="">Jenis Ujian</option>
          <option value="UTS">UTS</option>
          <option value="UAS">UAS</option>
        </select>

        <select
          name="subject"
          value={filters.subject}
          onChange={handleChange}
          className="p-2 border rounded"
        >
         <option value="">Pilih Mata Pelajaran</option>
            {mapelList?.map((mapel) => (
              <option key={mapel._id} value={mapel.nama}>
                {mapel.nama}
              </option>
            ))}
        </select>
      </div>

      {/* Tombol Submit */}
      <button
        onClick={fetchQuestions}
        disabled={
          !filters.grade ||
          !filters.examType ||
          !filters.subject ||
          !filters.academicYear
        }
        className={`w-full md:w-auto px-4 py-2 rounded text-white font-semibold mb-6 ${
          !filters.grade ||
          !filters.examType ||
          !filters.subject ||
          !filters.academicYear
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        Tampilkan Soal
      </button>

      {/* Loading */}
      {loading && (
        <p className="text-center text-blue-600">Mengambil soal...</p>
      )}

      {/* Daftar Soal */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 && !loading ? (
          <p className="text-gray-500">
            Tidak ada soal yang cocok dengan filter.
          </p>
        ) : (
          filteredQuestions.map((q) => (
            <div key={q._id} className="border p-4 rounded shadow-sm bg-white">
              <p className="font-semibold">Soal: {q.questionText}</p>
              <ul className="pl-5 list-disc">
                {["A", "B", "C", "D", "E"].map((opt) =>
                  q.choices[opt] ? (
                    <li key={opt}>
                      <span
                        className={
                          q.correctAnswer === opt
                            ? "font-bold text-green-600"
                            : ""
                        }
                      >
                        {opt}. {q.choices[opt]}
                      </span>
                    </li>
                  ) : null
                )}
              </ul>
              <p className="text-sm text-gray-500 mt-2">
                Mapel: {q.subject} | Kelas: {q.grade} | Ujian: {q.examType} |
                Tahun: {q.academicYear}
              </p>
              <div className="flex gap-3 mt-3">
                <button onClick={() => handleEdit(q)} className="text-blue-600">
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(q._id)}
                  className="text-red-600"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Edit */}
      {showModal && editingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Soal</h2>
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={editingQuestion.questionText}
              onChange={(e) =>
                setEditingQuestion({
                  ...editingQuestion,
                  questionText: e.target.value,
                })
              }
            />
            {["A", "B", "C", "D", "E"].map((opt) => (
              <input
                key={opt}
                type="text"
                className="border p-2 w-full mb-2"
                placeholder={`Pilihan ${opt}`}
                value={editingQuestion.choices[opt] || ""}
                onChange={(e) =>
                  setEditingQuestion({
                    ...editingQuestion,
                    choices: {
                      ...editingQuestion.choices,
                      [opt]: e.target.value,
                    },
                  })
                }
              />
            ))}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pilih Jawaban yang Benar:
            </label>
            <select
              className="border p-2 w-full mb-4"
              value={editingQuestion.correctAnswer}
              onChange={(e) =>
                setEditingQuestion({
                  ...editingQuestion,
                  correctAnswer: e.target.value,
                })
              }
            >
              <option value="">Jawaban Benar</option>
              {["A", "B", "C", "D", "E"].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Batal
              </button>
              <button
                onClick={submitEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h2>
            <p>Apakah kamu yakin ingin menghapus soal ini?</p>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => {
                  setDeleteModal(false);
                  setQuestionToDelete(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" />
    </div>
  );
};

export default ViewSoal;
