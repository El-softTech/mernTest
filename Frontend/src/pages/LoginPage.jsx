import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = formData.get("password");
    const name = formData.get("Name");
  
    try {
      const res = await fetch(`${import.meta.env.VITE_API_SERVER}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: id, name: name }),
      });

      const data = await res.json();
      console.log("Response data:", data);
      const userData = { role: data.role, nama: data.nama };
      setUser(userData);
      sessionStorage.setItem("user", JSON.stringify(userData));

      if (res.status === 200 && data.success) {
        if (data.role === "Admin") navigate("/dashboard", { replace: false });
        else if (data.role === "Guru")
          navigate("/isi-soal", { replace: false });
        else if (data.role === "siswa") navigate("/ujian", { replace: true });
        else {
          setModalMessage("Role tidak dikenal");
          setShowModal(true);
        }
      } else {
        setModalMessage(data.message || "Login gagal");
        setShowModal(true);
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Terjadi kesalahan server");
    }
  };

  return (
    <div className="container mx-auto flex justify-center items-center h-screen bg-transparent">
      <div className="border p-4 rounded bg-transparent flex justify-center items-center gap-8">
        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="Nama"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nama
            </label>
            <input
              type="Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="email"
              name="Name"
              //   aria-describedby="emailHelp"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="password"
              name="password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Submit
          </button>
        </form>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full">
              <h2 className="text-lg font-semibold mb-4">Pemberitahuan</h2>
              <p className="mb-4">{modalMessage}</p>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;

{
  /* <div className="hidden md:block">
          <dotlottie-player
            src="https://lottie.host/01ebc23e-134d-4098-a7ab-eae2ab103b42/3sVr3Iu2mB.json"
            background="transparent"
            speed="1"
            style={{ width: '300px', height: '300px' }}
            loop
            autoplay
          ></dotlottie-player>
        </div> */
}
