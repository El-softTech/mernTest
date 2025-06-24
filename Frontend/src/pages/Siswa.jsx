import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Siswa() {
  const [siswaData, setSiswaData] = useState([]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmMassDelete, setConfirmMassDelete] = useState(false);
  const [kelasToUpdate, setKelasToUpdate] = useState('');
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_SERVER;

  useEffect(() => {
    fetchSiswa();
  }, []);

  const fetchSiswa = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_SERVER}/api/Siswa`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setSiswaData(data);
    } catch (error) {
      console.error("Gagal mengambil data siswa:", error);
      toast.error('❌ Gagal mengambil data siswa. Periksa koneksi atau server.');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_SERVER}/api/Siswa/${deleteId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Gagal menghapus data');
      setSiswaData(siswaData.filter(siswa => siswa.id !== deleteId));
      toast.success('✅ Data siswa berhasil dihapus');
    } catch (error) {
      console.error('Error:', error);
      toast.error('❌ Gagal menghapus data siswa');
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const handleEdit = (id) => {
    toast.info('✏️ Mengalihkan ke halaman edit...');
    navigate(`/siswa/edit/${id}`);
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleMassDelete = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_SERVER}/api/Siswa/kelas/${selectedClass}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error("Gagal menghapus data berdasarkan kelas");

      toast.success(`✅ Semua siswa kelas ${selectedClass} berhasil dihapus`);
      fetchSiswa();
    } catch (error) {
      console.error(error);
      toast.error("❌ Gagal menghapus siswa berdasarkan kelas");
    } finally {
      setConfirmMassDelete(false);
    }
  };

  const handlePromoteKelas = async () => {
    try {
      const kelasLama = kelasToUpdate;
      const kelasBaru = parseInt(kelasLama) + 1;

      const res = await fetch(`${import.meta.env.VITE_API_SERVER}/api/Siswa/kelas/${kelasLama}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kelasBaru })
      });

      if (!res.ok) throw new Error("Gagal menaikkan kelas");

      toast.success(`📚 Semua siswa kelas ${kelasLama} dinaikkan ke kelas ${kelasBaru}`);
      fetchSiswa();
    } catch (err) {
      console.error(err);
      toast.error("❌ Gagal menaikkan kelas");
    } finally {
      setKelasToUpdate('');
    }
  };

  const filteredSiswa = selectedClass === 'all'
    ? siswaData
    : siswaData.filter(siswa => siswa.kelas === selectedClass);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredSiswa.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredSiswa.length / itemsPerPage);

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Data Siswa</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/siswa/tambah')}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            + Tambah Siswa
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Filter Kelas:</label>
          <select
            value={selectedClass}
            onChange={handleClassChange}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="all">Semua</option>
            <option value="7">Kelas 7</option>
            <option value="8">Kelas 8</option>
            <option value="9">Kelas 9</option>
          </select>
        </div>

        {selectedClass !== 'all' && (
          <>
            <button
              onClick={() => setConfirmMassDelete(true)}
              className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
            >
              🗑 Hapus Semua Kelas {selectedClass}
            </button>
          </>
        )}

        <div className="flex items-center space-x-2">
          <select
            value={kelasToUpdate}
            onChange={(e) => setKelasToUpdate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="">Pilih kelas untuk dinaikkan</option>
            <option value="7">Naikkan Kelas 7 ke 8</option>
            <option value="8">Naikkan Kelas 8 ke 9</option>
          </select>
          <button
            onClick={handlePromoteKelas}
            disabled={!kelasToUpdate}
            className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            🚀 Naikkan
          </button>
        </div>
      </div>

      {/* TABEL */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b">ID</th>
              <th className="px-4 py-2 border-b">Nama</th>
              <th className="px-4 py-2 border-b">Kelas</th>
              <th className="px-4 py-2 border-b">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((siswa) => (
              <tr key={siswa.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{siswa.id}</td>
                <td className="px-4 py-2 border-b">{siswa.nama}</td>
                <td className="px-4 py-2 border-b">Kelas {siswa.kelas}</td>
                <td className="px-4 py-2 border-b flex space-x-2">
                  <button onClick={() => handleEdit(siswa.id)} className="bg-blue-500 text-white px-2 py-1 rounded text-sm">✏️</button>
                  <button onClick={() => { setDeleteId(siswa.id); setShowDeleteModal(true); }} className="bg-red-500 text-white px-2 py-1 rounded text-sm">🗑️</button>
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  Tidak ada data siswa untuk kelas ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={() => handlePageChange(Math.max(page - 1, 1))} disabled={page === 1} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">← Prev</button>
          <span className="text-sm">Halaman {page} dari {totalPages}</span>
          <button onClick={() => handlePageChange(Math.min(page + 1, totalPages))} disabled={page === totalPages} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">Next →</button>
        </div>
      )}

      {/* MODAL HAPUS INDIVIDU */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Konfirmasi Hapus</h3>
            <p className="text-sm text-gray-600 mb-4">Yakin ingin menghapus siswa ini?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="px-3 py-1 bg-gray-200 rounded">Batal</button>
              <button onClick={handleDelete} className="px-3 py-1 bg-red-500 text-white rounded">Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL MASS DELETE */}
      {confirmMassDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Hapus Semua Kelas {selectedClass}</h3>
            <p className="text-sm text-gray-600 mb-4">Yakin ingin menghapus semua siswa kelas {selectedClass}?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmMassDelete(false)} className="px-3 py-1 bg-gray-200 rounded">Batal</button>
              <button onClick={handleMassDelete} className="px-3 py-1 bg-red-600 text-white rounded">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default Siswa;



// fetch(`${import.meta.env.VITE_API_SERVER}/api/Siswa`,