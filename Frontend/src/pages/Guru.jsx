import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function GuruTable() {
  const [guruList, setGuruList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_SERVER}/api/Guru`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    })
      .then((res) => res.json())
      .then((data) => setGuruList(data))
      .catch((err) => toast.error("❌ Gagal fetch guru"));
  }, []);

  const totalPages = Math.ceil(guruList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = guruList.slice(startIndex, startIndex + itemsPerPage);

  const handleEdit = (id) => {
    navigate(`/guru/edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_SERVER}/api/Guru/${selectedId}`, {
        method: "DELETE",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!response.ok) throw new Error("Gagal hapus guru");

      setGuruList((prev) => prev.filter((g) => g.id !== selectedId));
      toast.success("✅ Guru berhasil dihapus");
    } catch (error) {
      toast.error("❌ Gagal menghapus guru");
    } finally {
      setShowModal(false);
      setSelectedId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-indigo-700">Daftar Guru</h2>
        <button
          onClick={() => navigate("/guru/tambah")}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          ➕ Tambah Guru
        </button>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-indigo-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Nama</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((guru) => (
            <tr key={guru.id} className="text-center">
              <td className="border px-4 py-2">{guru.id}</td>
              <td className="border px-4 py-2">{guru.nama}</td>
              <td className="border px-4 py-2">{guru.role}</td>
              <td className="border px-4 py-2 space-x-2">
                 <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                   <button
                  onClick={() => handleEdit(guru.id)}
                  className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-white"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteClick(guru.id)}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
                >
                  🗑️
                </button>
                 </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="bg-gray-300 hover:bg-gray-400 px-4 py-1 rounded"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-700 font-medium">
          Halaman {currentPage} dari {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="bg-gray-300 hover:bg-gray-400 px-4 py-1 rounded"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Modal Konfirmasi */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4 text-red-600">Konfirmasi Hapus</h3>
            <p className="mb-4">Yakin ingin menghapus guru ini?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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

export default GuruTable;
