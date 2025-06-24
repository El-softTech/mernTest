import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TambahGuru() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '',
    nama: '',
    role: 'Guru'
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id || !formData.nama || !formData.role) {
      toast.error('❌ Semua field wajib diisi');
      return;
    }

    setLoading(true);
    setSuccessMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_SERVER}/api/Guru`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (errorText.toLowerCase().includes('id sudah digunakan')) {
          toast.error('❌ ID sudah digunakan, silakan gunakan ID lain');
        } else {
          toast.error('❌ Gagal menambahkan user, gunakan ID yang lain');
        }
        return;
      }

      setSuccessMessage('🎉 Yey! User berhasil ditambahkan');
      setTimeout(() => navigate('/guru'), 2000);
    } catch (error) {
      console.error(error);
      toast.error('❌ Terjadi kesalahan saat menambahkan user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Tambah User Baru</h2>

      {successMessage && (
        <div className="text-green-600 text-center font-semibold mb-4">{successMessage}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan ID user"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan nama user"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="Guru">Guru</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z" />
                </svg>
                Menyimpan...
              </span>
            ) : (
              'Simpan'
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/guru')}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            disabled={loading}
          >
            Batal
          </button>
        </div>
      </form>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default TambahGuru;
