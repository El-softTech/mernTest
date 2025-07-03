import { useEffect, useState } from "react";

import { FaChalkboardTeacher, FaUserGraduate, FaKey ,FaBook} from "react-icons/fa";
import DashboardCard from "../Components/DashboardCard";

const Dashboard = () => {
  const [jumlahSiswa, setJumlahSiswa] = useState(0);
  const [jumlahGuru,setJumlahGuru]= useState(0)

 useEffect(() => {
  fetch(`${import.meta.env.VITE_API_SERVER}/api/Siswaa/count`, {
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    }
  })
    .then((res) => res.json() )
    .then((data) =>  setJumlahSiswa(data.totala))
    .catch((err) => console.error("Gagal ambil siswa:", err));

  fetch(`${import.meta.env.VITE_API_SERVER}/api/Guruu/count`, {
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    }
  })
    .then((res) => res.json())
    .then((data) => setJumlahGuru(data.total))
    .catch((err) => console.error("Gagal ambil guru:", err));
}, []);

  
  return (
    <div className="flex flex-col items-center mb-10 px-4">
      <h1 className="font-bold text-4xl text-purple-700 mt-10 mb-6 flex items-center gap-2">
        📊 Dashboard
      </h1>
      <p className="text-gray-600 mb-10 text-center max-w-xl">
        Selamat datang di halaman dashboard. Silakan pilih menu untuk mengelola
        data siswa, guru, dan token ujian.
      </p>

      

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        <DashboardCard
          icon={<FaUserGraduate size={30} className="text-blue-500" />}
          title="Data Siswa"
          description={`${jumlahSiswa} siswa`}
          href="/siswa"
        />
        <DashboardCard
          icon={<FaChalkboardTeacher size={30} className="text-green-500" />}
          title="Data Guru"
          description={`${jumlahGuru} guru`}
          href="/guru"
        />
        <DashboardCard
          icon={<FaKey size={30} className="text-yellow-500" />}
          title="Token"
          description="Token digunakan untuk masuk halaman ujian"
          href="/token"
        />
         <DashboardCard
          icon={<FaBook size={30} className="text-teal-300" />}
          title="Mata pelajaran"
          description="Mata pelajaran yang tersedia"
          href="/mapel"
        />
      </div>
    </div>
  );
};

export default Dashboard;
