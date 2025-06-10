import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SiswaEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [siswa, setSiswa] = useState(null);

  useEffect(() => {
    const fetchSiswa = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_SERVER}/api/Siswa/${id}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setSiswa(data);
      } catch (err) {
        console.error("❌ Gagal fetch data siswa:", err.message);
      }
    };

    fetchSiswa();
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_SERVER}/api/Siswa/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          nama: siswa.nama,
          kelas: siswa.kelas
        })
      });

      if (!response.ok) throw new Error('Gagal update data siswa');

      toast.success('✅ Data berhasil disimpan');
      setTimeout(() => navigate('/siswa'), 1500);
    } catch (error) {
      console.error("❌ Gagal simpan perubahan:", error.message);
      toast.error('❌ Gagal menyimpan data');
    }
  };

  if (!siswa) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-center mb-6 text-indigo-700">Edit Siswa</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Nama</label>
          <input
            type="text"
            value={siswa.nama}
            onChange={(e) => setSiswa({ ...siswa, nama: e.target.value.toUpperCase() })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div>
  <label className="block text-gray-700 font-medium mb-1">Kelas</label>
  <select
    value={siswa.kelas}
    onChange={(e) => setSiswa({ ...siswa, kelas: e.target.value })}
    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
  >
    <option value="">-- Pilih Kelas --</option>
    <option value="7">7</option>
    <option value="8">8</option>
    <option value="9">9</option>
  </select>
</div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200"
        >
          Simpan Perubahan
        </button>
      </form>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </div>
  );
}

export default SiswaEdit;
