import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../assets/lottie.json"; // pastikan path ini benar

const ProtecLogin = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <Lottie 
        animationData={animationData} 
        loop={true} 
        style={{ width: 300, height: 300 }} 
      />
      <div className="text-center">
        
        <h1 className="mt-4 text-lg">Harap selesaikan login anda terlebih dahulu.</h1>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Kembali ke Halaman Login
        </button>
      </div>
    </div>
  );
};

export default ProtecLogin;
