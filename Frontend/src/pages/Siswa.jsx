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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSiswa = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_SERVER}/api/Siswa`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, response: ${errorData}`);
        }

        const data = await response.json();
        setSiswaData(data);
      } catch (error) {
        console.error("Gagal mengambil data siswa:", error);
        toast.error('❌ Gagal mengambil data siswa. Periksa koneksi atau server.');
      }
    };

    fetchSiswa();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://fb5b-180-244-21-1.ngrok-free.app/api/Siswa/${deleteId}`, {
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

  const filteredSiswa = selectedClass === 'all'
    ? siswaData
    : siswaData.filter(siswa => siswa.kelas === selectedClass);

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

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
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            + Tambah Siswa
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center space-x-3">
        <span className="text-sm text-gray-700 font-medium">Filter Kelas:</span>
        <select
          value={selectedClass}
          onChange={handleClassChange}
          className="border border-gray-300 rounded px-3 py-1 text-sm"
        >
          <option value="all">Semua</option>
          <option value="7">Kelas 7</option>
          <option value="8">Kelas 8</option>
          <option value="9">Kelas 9</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 border-b text-sm font-medium text-gray-700">ID</th>
              <th className="text-left px-4 py-2 border-b text-sm font-medium text-gray-700">Nama</th>
              <th className="text-left px-4 py-2 border-b text-sm font-medium text-gray-700">Kelas</th>
              <th className="text-left px-4 py-2 border-b text-sm font-medium text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((siswa) => (
              <tr key={siswa.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{siswa.id}</td>
                <td className="px-4 py-2 border-b">{siswa.nama}</td>
                <td className="px-4 py-2 border-b">Kelas {siswa.kelas}</td>
                <td className="px-4 py-2 border-b">
                  <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                    <button 
                      onClick={() => handleEdit(siswa.id)} 
                      className="px-2 py-1 bg-blue-500 text-white rounded text-xs sm:text-sm hover:bg-blue-600"
                    >
                     
                      <span >✏️</span>
                    </button>
                    <button 
                      onClick={() => {
                        setDeleteId(siswa.id);
                        setShowDeleteModal(true);
                      }} 
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs sm:text-sm hover:bg-red-600"
                    >
                      <span >🗑️</span>
                    </button>
                  </div>
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

      {totalPages > 1 && (
        <div className="mt-4 flex justify-end items-center space-x-2">
          <button
            onClick={() => handlePageChange(Math.max(page - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-200 text-sm hover:bg-gray-300 disabled:opacity-50"
          >
            &larr; Prev
          </button>
          <span className="text-sm text-gray-700">Halaman {page} dari {totalPages}</span>
          <button
            onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-gray-200 text-sm hover:bg-gray-300 disabled:opacity-50"
          >
            Next &rarr;
          </button>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Konfirmasi Hapus</h3>
            <p className="text-sm text-gray-600 mb-6">Apakah Anda yakin ingin menghapus data siswa ini?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default Siswa;
