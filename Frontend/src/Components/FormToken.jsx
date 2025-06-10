import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FormToken() {
  const [type, setType] = useState("public");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER}/api/Token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({ type }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Gagal menambahkan token");
      }

      toast.success("✅ Token berhasil ditambahkan!");
      setTimeout(() => {
        navigate("/token"); // ubah ke rute dashboard token kamu
      }, 2000);
    } catch (error) {
      console.error("Gagal menambahkan token:", error);
      toast.error("❌ Gagal menambahkan token.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Form Tambah Token
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tipe Token
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="public">Public (Bisa digunakan banyak user)</option>
            <option value="private">Private (Sekali pakai)</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Simpan Token
        </button>
      </form>

      <ToastContainer position="top-center"  />
    </div>
  );
}

export default FormToken;
