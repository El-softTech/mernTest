import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

const SoalUjian = () => {
  const { id } = useParams(); // format: "bahasa_indonesia-UAS-7"
  const { state } = useLocation();
  const navigate = useNavigate();

  const [soalList, setSoalList] = useState([]);
  const [jawabanUser, setJawabanUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const DURASI = 120 * 60; // 120 menit dalam detik

  // Fullscreen & keluar auto navigate
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
        navigate("/ujian");
      }
    };

    enterFullscreen();
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [navigate]);

  // Waktu: ambil dari localStorage atau set baru
  useEffect(() => {
    const key = `startTime-${id}`;
    const now = Date.now();
    let startTime = localStorage.getItem(key);

    if (!startTime) {
      localStorage.setItem(key, now.toString());
      startTime = now;
    }

    const tick = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = DURASI - elapsed;
      setTimeLeft(remaining);
      if (remaining <= 0) {
        handleSubmit(true);
      }
    };

    tick(); // immediately
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [id]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Fetch soal + jawaban
  useEffect(() => {
    const fetchSoal = async () => {
      try {
        const [subject, examType, grade] = id.split("-");
        const res = await fetch(
          `${import.meta.env.VITE_API_SERVER}/api/questions?subject=${subject}&examType=${examType}&grade=${grade}`,
          {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        const data = await res.json();

        const shuffled = shuffleArray(data);
        setSoalList(shuffled);

        const saved = localStorage.getItem(`jawaban-${id}`);
        if (saved) setJawabanUser(JSON.parse(saved));

        setLoading(false);
      } catch (err) {
        setError("Gagal memuat soal.");
        setLoading(false);
      }
    };

    fetchSoal();
  }, [id]);

  const handleChange = (soalId, pilihan) => {
    setJawabanUser((prev) => {
      const updated = { ...prev, [soalId]: pilihan };
      localStorage.setItem(`jawaban-${id}`, JSON.stringify(updated));
      return updated;
    });
  };

  const handleSubmit = async (auto = false) => {
    let totalBenar = 0;
    soalList.forEach((soal) => {
      if (jawabanUser[soal._id] === soal.correctAnswer) totalBenar++;
    });

    const payload = {
      nama: state?.nama || "Anonim",
      id: state?.id || "tanpa-id",
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

      localStorage.removeItem(`jawaban-${id}`);
      localStorage.removeItem(`startTime-${id}`);

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
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-white rounded-md p-4 shadow sticky top-0 z-10">
        <h2 className="text-xl font-bold text-gray-800">
          Ujian {id.replaceAll("-", " ").toUpperCase()}
        </h2>
        <div className="text-lg font-mono bg-yellow-100 text-yellow-800 px-4 py-1 rounded">
          ⏰ {formatTime(Math.max(timeLeft, 0))}
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
                    className={`cursor-pointer border rounded-lg p-3 transition ${
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
