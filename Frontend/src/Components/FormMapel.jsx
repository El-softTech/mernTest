import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FormMapel = () => {
  const [namaMapel, setNama] = useState('');
  const [mapelList, setMapelList] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchMapel = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_SERVER}/api/mapel`);
      const data = await res.json();
      setMapelList(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMapel();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { nama: namaMapel };

    try {
      const url = editId
        ? `${import.meta.env.VITE_API_SERVER}/api/mapel/${editId}`
        : `${import.meta.env.VITE_API_SERVER}/api/mapel`;

      const method = editId ? 'PUT' : 'POST';
      console.log('Payload:', payload);

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('Response:', data);

      if (editId) {
        toast.success(`Mapel berhasil diubah: ${data.data.nama}`);
      } else {
        toast.success(`Mapel "${data.data.nama}" berhasil ditambahkan!`);
      }

      setNama('');
      setEditId(null);
      fetchMapel();
    } catch (err) {
      console.error(err);
      toast.error('Gagal memproses mapel');
    }
  };

  const handleEdit = (mapel) => {
    setNama(mapel.nama);
    setEditId(mapel._id);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_SERVER}/api/mapel/${id}`, {
        method: 'DELETE',
      });
      toast.success('Mapel berhasil dihapus');
      fetchMapel();
    } catch (err) {
      console.error(err);
      toast.error('Gagal menghapus mapel');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-10 border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">Tambah Mata Pelajaran</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Nama Mapel</label>
          <input
            type="text"
            value={namaMapel}
            onChange={(e) => setNama(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contoh: Matematika"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          {editId ? 'Simpan Perubahan' : 'Tambah Mapel'}
        </button>
      </form>

      {/* List Mapel */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Daftar Mapel</h3>
        {mapelList.length === 0 ? (
          <p className="text-gray-500">Belum ada mapel.</p>
        ) : (
          <ul className="space-y-2">
            {mapelList.map((mapel) => (
              <li
                key={mapel._id}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border"
              >
                <span className="text-gray-800">{mapel.nama}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(mapel)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(mapel._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
};

export default FormMapel;
