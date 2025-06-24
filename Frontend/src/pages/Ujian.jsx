import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Socket_io from "../Components/Socket_io";
import { FaClock, FaBook, FaChalkboardTeacher, FaPlay } from "react-icons/fa";

const Ujian = () => {
  const [ujians, setUjians] = useState([]);
  const [kelas, setKelas] = useState("");
  const [jenisUjian, setJenisUjian] = useState("");
  const [mapel, setMapel] = useState("");
  const [filteredUjians, setFilteredUjians] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUjian, setSelectedUjian] = useState(null);
  const [nama, setNama] = useState("");
  const [id, setId] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_SERVER}/api/questions`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      const questions = await res.json();

      const capitalize = (s) =>
        s.charAt(0).toUpperCase() + s.slice(1).replace("_", " ");
      const uniqueUjians = [];
      const seen = new Set();

      for (const q of questions) {
        const key = `${q.subject}-${q.examType}-${q.grade}`;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueUjians.push({
            id: key,
            nama: `Ujian ${capitalize(q.subject)}`,
            durasi: 120,
            kelas: q.grade,
            jenis: q.examType,
            mapel: q.subject,
          });
        }
      }

      setUjians(uniqueUjians);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = ujians.filter((ujian) => {
      return (
        (kelas ? ujian.kelas === kelas : true) &&
        (jenisUjian ? ujian.jenis === jenisUjian : true) &&
        (mapel ? ujian.mapel === mapel : true)
      );
    });
    setFilteredUjians(filtered);
  }, [kelas, jenisUjian, mapel, ujians]);

  const handleOpenModal = (ujian) => {
    const storedUser = JSON.parse(sessionStorage.getItem("user")) || {};
    setSelectedUjian(ujian);
    setShowModal(true);
    setNama(storedUser.nama || "");
    setId("");
    setToken("");
    setError("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUjian(null);
    setError("");
  };

  const handleStart = async () => {
    if (!nama || !id || !token) {
      setError("Semua field harus diisi.");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_SERVER}/api/validate-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            siswaId: id, // atau 'id' kalau backend-nya pakai itu
            token,
          }),
        }
      );

      const result = await res.json();
      console.log(result);
      if (result.valid) {
        navigate(`/ujian/${selectedUjian.id}`, {
          state: {
            ujianId: selectedUjian.id,
            nama: result.siswa?.nama || nama,
            id,
            token,
          },
        });
      } else {
        setError("ID atau Token tidak valid.");
      }
    } catch (err) {
      setError("Gagal memverifikasi token.");
    }
  };

  const capitalize = (s) =>
    s.charAt(0).toUpperCase() + s.slice(1).replace("_", " ");

  return (
    <>
      <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-md shadow-md max-w-6xl mx-auto mt-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <FaBook className="text-blue-600" /> Pilih Ujian
        </h2>

        <div className="mb-4">
          <select
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
            className="border px-4 py-2 mr-4"
          >
            <option value="">Pilih Kelas</option>
            <option value="7">Kelas 7</option>
            <option value="8">Kelas 8</option>
            <option value="9">Kelas 9</option>
          </select>

          <select
            value={jenisUjian}
            onChange={(e) => setJenisUjian(e.target.value)}
            className="border px-4 py-2 mr-4"
          >
            <option value="">Pilih Jenis Ujian</option>
            <option value="UTS">UTS</option>
            <option value="UAS">UAS</option>
          </select>

          <select
            value={mapel}
            onChange={(e) => setMapel(e.target.value)}
            className="border px-4 py-2"
          >
            <option value="">Pilih Mata Pelajaran</option>
            <option value="bahasa_inggris">Bahasa Inggris</option>
            <option value="ppkn">PPKn</option>
            <option value="informatika">Informatika</option>
            <option value="bahasa_indonesia">Bahasa Indonesia</option>
            <option value="ips">IPS</option>
            <option value="matematika">Matematika</option>
            <option value="kemuhammadiyahan">Kemuhammadiyahan</option>
            <option value="fiqih">Fiqih</option>
            <option value="aqidah_akhlak">Aqidah Akhlak</option>
            <option value="tarikh_islam">Tarikh Islam</option>
            <option value="bahasa_arab">Bahasa Arab</option>
            <option value="alquran_hadits">Al-Qur'an Hadits</option>
            <option value="sbk">SBK</option>
            <option value="ipa">IPA</option>
            <option value="pjok">PJOK</option>
          </select>
        </div>

        {filteredUjians.length === 0 ? (
          <p className="text-gray-500 text-center">
            Tidak ada ujian yang tersedia dengan kriteria ini.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUjians.map((ujian) => (
              <div
                key={ujian.id}
                className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-200"
              >
                <h3 className="  text-xl text-teal-500 mb-2 flex items-center gap-2 font-serif">
                  <FaBook /> {ujian.nama}
                </h3>
                <p className="flex items-center text-gray-700">
                  <FaChalkboardTeacher className="mr-2" /> Kelas: {ujian.kelas}
                </p>
                <p className="flex items-center text-gray-700">
                  <FaBook className="mr-2" /> Mapel: {capitalize(ujian.mapel)}
                </p>
                <p className="flex items-center text-gray-700">
                  <FaClock className="mr-2" /> Durasi: {ujian.durasi} menit
                </p>
                <p className="text-sm text-gray-600 italic mt-1">
                  {capitalize(ujian.jenis)}
                </p>
                <button
                  onClick={() => handleOpenModal(ujian)}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700 transition"
                >
                  <FaPlay /> Mulai Ujian
                </button>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                📝 Konfirmasi Ujian
              </h2>
              <input
                type="text"
                placeholder="Nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full mb-2 border p-2 rounded"
              />
              <input
                type="text"
                placeholder="ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full mb-2 border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full mb-2 border p-2 rounded"
              />
              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStart}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Start
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Socket_io />
    </>
  );
};

export default Ujian;
