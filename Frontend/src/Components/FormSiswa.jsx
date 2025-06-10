import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FormTambahSiswa() {
  const [formData, setFormData] = useState({
    id: '',
    nama: '',
    kelas: '7'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "id" && !/^\d*$/.test(value)) return;

    const updatedValue = name === "nama" ? value.toUpperCase() : value;

    setFormData({
      ...formData,
      [name]: updatedValue
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.id.trim()) newErrors.id = 'ID wajib diisi';
    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama wajib diisi';
    } else if (formData.nama.trim().length < 3) {
      newErrors.nama = 'Nama minimal 3 karakter';
    }

    if (!['7', '8', '9'].includes(formData.kelas)) {
      newErrors.kelas = 'Kelas tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_SERVER}/api/Siswa`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menambahkan siswa');
      }

      toast.success('Siswa berhasil ditambahkan!');
      setTimeout(() => navigate('/siswa'), 2000); // delay agar user sempat lihat toast
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Gagal menambahkan siswa: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md max-w-md mx-auto">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tambah Siswa Baru</h2>
      
      <form onSubmit={handleSubmit}>
        {/* ID Input */}
        <div className="mb-4">
          <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">
            ID Siswa <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="id"
            name="id"
            value={formData.id}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.id ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukkan ID siswa"
          />
          {errors.id && <p className="mt-1 text-sm text-red-500">{errors.id}</p>}
        </div>

        {/* Nama Input */}
        <div className="mb-4">
          <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
            Nama Siswa <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="nama"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.nama ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukkan nama lengkap"
          />
          {errors.nama && <p className="mt-1 text-sm text-red-500">{errors.nama}</p>}
        </div>

        {/* Kelas Select */}
        <div className="mb-6">
          <label htmlFor="kelas" className="block text-sm font-medium text-gray-700 mb-1">
            Kelas <span className="text-red-500">*</span>
          </label>
          <select
            id="kelas"
            name="kelas"
            value={formData.kelas}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.kelas ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="7">Kelas 7</option>
            <option value="8">Kelas 8</option>
            <option value="9">Kelas 9</option>
          </select>
          {errors.kelas && <p className="mt-1 text-sm text-red-500">{errors.kelas}</p>}
        </div>

        {/* Tombol */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/siswa')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
       <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default FormTambahSiswa;
