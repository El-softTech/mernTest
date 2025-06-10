import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Socket_io from '../Components/Socket_io';

function TokenUjian() {
  const [tokens, setTokens] = useState([]);
  const navigate = useNavigate(); // untuk navigasi

  useEffect(() => {
    // Fungsi untuk mengambil data token
    const fetchTokens = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_SERVER}/api/Token`, {
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
        setTokens(data);  
      } catch (error) {
        console.error("Gagal mengambil data token:", error);
        toast.error('❌ Gagal mengambil data token. Periksa koneksi atau server.');
      }
    };

   
    fetchTokens();

    
    const interval = setInterval(fetchTokens, 10000);

 
    return () => clearInterval(interval);
  }, []);  

  const handleTambahToken = () => {
    navigate('/token/tambah'); 
  };

  const handleDashboardRedirect = () => {
    navigate('/dashboard'); 
  };

  return (
    <>
    <div className="p-4 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Token</h2>
        <button
          onClick={handleTambahToken}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
        >
          + Tambah Token
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 border-b text-sm font-medium text-gray-700">Token</th>
              <th className="text-left px-4 py-2 border-b text-sm font-medium text-gray-700">Tipe</th>
              <th className="text-left px-4 py-2 border-b text-sm font-medium text-gray-700">Created At</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token) => (
              <tr key={token._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{token.token}</td>
                <td className="px-4 py-2 border-b">{token.type}</td>
                <td className="px-4 py-2 border-b">{new Date(token.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {tokens.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  Tidak ada token yang tersedia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-center">
        <button
          onClick={handleDashboardRedirect}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition"
        >
          Kembali ke Dashboard
        </button>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
    <Socket_io />
    </>
    
  );
}

export default TokenUjian;
