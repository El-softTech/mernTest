import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";


// Shuffle helper
const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

const SoalUjian = () => {
  const { id } = useParams(); // format: "bahasa_indonesia-UAS-7"
  const { state } = useLocation(); // dari navigate()
  const navigate = useNavigate();

  const [soalList, setSoalList] = useState([]);
  const [jawabanUser, setJawabanUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(120 * 60); // 120 menit
  const [showExitModal, setShowExitModal] = useState(false);

  // Fullscreen logic
  useEffect(() => {
    const enterFullscreen = () => {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setShowExitModal(true);
      }
    };

    enterFullscreen();
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true); // Auto submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Fetch soal
  useEffect(() => {
    const fetchSoal = async () => {
      try {
        const [subject, examType, grade] = id.split("-");
        const res = await fetch(
          `${
            import.meta.env.VITE_API_SERVER
          }/api/questions?subject=${subject}&examType=${examType}&grade=${grade}`,
          {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        const data = await res.json();

        // Hanya shuffle soal
        const shuffledSoal = shuffleArray(data);
        setSoalList(shuffledSoal);
        setLoading(false);
      } catch (err) {
        setError("Gagal memuat soal.");
        setLoading(false);
      }
    };

    fetchSoal();
  }, [id]);

  const handleChange = (soalId, pilihan) => {
    setJawabanUser((prev) => ({
      ...prev,
      [soalId]: pilihan,
    }));
  };

  const handleSubmit = async (auto = false) => {
    let totalBenar = 0;
    soalList.forEach((soal) => {
      if (jawabanUser[soal._id] === soal.correctAnswer) {
        totalBenar++;
      }
    });

    const payload = {
      nama: state.nama,
      id: state.id,
      subject: soalList[0]?.subject || "",
      examType: soalList[0]?.examType || "",
      grade: soalList[0]?.grade || "",
      totalBenar,
      jawaban: jawabanUser,
    };

    try {
      await fetch(`${import.meta.env.VITE_API_SERVER}/api/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(payload),
      });

      alert(
        auto
          ? `Waktu habis! Skor kamu: ${totalBenar} / ${soalList.length}`
          : `Skor kamu: ${totalBenar} / ${soalList.length}`
      );
      navigate("/ujian");
    } catch (err) {
      alert("Gagal menyimpan jawaban.");
    }
  };

  if (loading)
    return <p className="text-center mt-20 text-lg">⏳ Memuat soal...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      {/* Exit modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Keluar dari fullscreen?
            </h2>
            <p className="mb-6 text-gray-600">
              kamu yakin ingin keluar dari mode fullscreen? Jika iya, jawaban kamu akan hilang!!
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowExitModal(false);
                  document.documentElement.requestFullscreen?.(); // masuk lagi ke fullscreen
                }}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowExitModal(false);
                  handleSubmit(false); // simpan lalu keluar
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Ya, keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-white rounded-md p-4 shadow sticky top-0 z-10">
        <h2 className="text-xl font-bold text-gray-800">
          Ujian {id.replaceAll("-", " ").toUpperCase()}
        </h2>
        <div className="text-lg font-mono bg-yellow-100 text-yellow-800 px-4 py-1 rounded">
          ⏰ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Soal */}
      <div className="grid gap-6">
        {soalList.map((soal, index) => (
          <div
            key={soal._id}
            className="bg-white p-6 rounded-lg shadow-md border"
          >
            <p className="font-semibold text-gray-700 mb-4">
              {index + 1}. {soal.questionText}
            </p>

            <div className="flex flex-col gap-2">
              {Object.entries(soal.choices).map(([key, value]) => {
                const isSelected = jawabanUser[soal._id] === key;
                return (
                  <div
                    key={key}
                    onClick={() => handleChange(soal._id, key)}
                    className={`cursor-pointer border rounded-lg p-3 transition
                      ${
                        isSelected
                          ? "bg-green-500 border-green-300 text-white"
                          : "bg-white hover:bg-gray-100"
                      }`}
                  >
                    <span className="font-semibold mr-2">{key}.</span>
                    <span>{value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 flex justify-center">
        <button
          onClick={() => handleSubmit(false)}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Jawaban
        </button>
      </div>
    </div>
  );
};

export default SoalUjian;
