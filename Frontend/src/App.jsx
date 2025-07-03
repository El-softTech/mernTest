import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Ujian from "./pages/Ujian";
import Layout from "./pages/lyot/layout";
import Dashboard from "./pages/Dashboard";
import InputSoal from "./pages/InputSoal";
import Penilaian from "./pages/Penilaian";
import Siswa from "./pages/Siswa";
import FormTambahSiswa from "./Components/FormSiswa";
import SiswaEdit from "./pages/SiswaEdit";
import GuruTable from "./pages/Guru";
import TambahGuru from "./Components/FormGuru";
import GuruEdit from "./pages/Guruedit";
import TokenUjian from "./pages/Token";
import FormToken from "./Components/FormToken";
import ViewSoal from "./Components/ViewSoal";
import ProtectedRoute from "./auth/protectRoute"; // Pastikan path ini sesuai dengan struktur folder Anda
import Unauthorized from "./pages/Unauthorized"; 
import ProtecLogin from "./pages/protecLogin"; 
import SoalUjian from "./pages/SoalUjian"; // Pastikan path ini sesuai dengan struktur folder Anda
import FormMapel from "./Components/FormMapel"; 
import SuccessPage from "./Components/SuccesPage";
import Failpage from "./Components/FailPage"; // Pastikan path ini sesuai dengan struktur folder Anda


function App() {
  return (
   <BrowserRouter>
  <Routes>
    {/* Public */}
    <Route path="/" element={<LoginPage />} />
    {/* Unauthorized page kalau ada */}
    <Route path="/unauthorized" element={<Unauthorized />} />
    <Route path="/protecLogin" element={<ProtecLogin />} />
     <Route element={<ProtectedRoute allowedRoles={["Admin", "Guru", "siswa"]} />}>
       
        <Route path="/ujian/:id" element={<SoalUjian />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/fail" element={<Failpage />} />
      </Route>
    {/* Semua halaman protected di dalam layout */}
    <Route path="/" element={<Layout />}>
      {/* Admin only */}
      <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="siswa" element={<Siswa />} />
        <Route path="siswa/tambah" element={<FormTambahSiswa />} />
        <Route path="siswa/edit/:id" element={<SiswaEdit />} />
        <Route path="guru" element={<GuruTable />} />
        <Route path="guru/tambah" element={<TambahGuru />} />
        <Route path="guru/edit/:id" element={<GuruEdit />} />
        <Route path="token" element={<TokenUjian />} />
        <Route path="token/tambah" element={<FormToken />} />
        <Route path="mapel" element={<FormMapel />} />
      </Route>

      
      <Route element={<ProtectedRoute allowedRoles={["Admin", "Guru"]} />}>
        <Route path="isi-soal" element={<InputSoal />} />
        <Route path="penilaian" element={<Penilaian />} />
        <Route path="liat-soal" element={<ViewSoal />} />
      </Route>
      
      

      
      <Route element={<ProtectedRoute allowedRoles={["Admin", "Guru", "siswa"]} />}>
        <Route path="ujian" element={<Ujian />} />
        <Route path="/ujian/:id" element={<SoalUjian />} />
      </Route>
    </Route>
    
    
  </Routes>
</BrowserRouter>

  );
}

export default App;
