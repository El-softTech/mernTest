import React, { useState } from "react";
import { useEffect } from "react";
function Penilaian() {
  const [kelas, setKelas] = useState("");
  const [jenis, setJenis] = useState("");
  const [mapel, setMapel] = useState("");
  const [tahun, setTahun] = useState("");
  const [dataNilai, setDataNilai] = useState([]);

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

  useEffect(() => {
    if (kelas && jenis && mapel) {
      const fetchDataNilai = async () => {
        try {
          const res = await fetch(
            `${
              import.meta.env.VITE_API_SERVER
            }/api/penilaian/filter?grade=${kelas}&subject=${mapel}&examType=${jenis}`
          );
          const data = await res.json();
          setDataNilai(data);
        
        } catch (err) {
          console.error("Gagal mengambil data nilai:", err);
        }
      };

      fetchDataNilai();
    } else {
      setDataNilai([]); // kosongkan data jika filter belum lengkap
    }
  }, [kelas, jenis, mapel]);

  // Bisa tambahkan fetch ke backend jika filter diubah

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Penilaian</h2>

      {/* Filter */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Kelas</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
          >
            <option value="">Pilih Kelas</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Jenis</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={jenis}
            onChange={(e) => setJenis(e.target.value)}
          >
            <option value="">Pilih Jenis</option>
            <option value="UTS">UTS</option>
            <option value="UAS">UAS</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mapel</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={mapel}
            onChange={(e) => setMapel(e.target.value)}
          >
            <option value="">Pilih Mata Pelajaran</option>
            {mapelList?.map((mapel) => (
              <option key={mapel._id} value={mapel.nama}>
                {mapel.nama}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabel Nilai */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 border-b">Nama</th>
              <th className="text-left px-4 py-2 border-b">Nilai</th>
            </tr>
          </thead>
          <tbody>
            {dataNilai.length > 0 ? (
              dataNilai.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{item.nama}</td>
                  <td className="px-4 py-2 border-b">{item.totalBenar}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center py-4 text-gray-500">
                  Tidak ada data nilai.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Penilaian;
