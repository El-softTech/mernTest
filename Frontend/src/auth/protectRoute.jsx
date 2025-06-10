import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./authContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  // Tambahkan pengecekan jika user belum terload
  if (user === null) return <Navigate to="/protecLogin" />;

 
  if (!allowedRoles.includes(user.role)) {
    console.warn("Unauthorized access for role:", user.role);
    return <Navigate to="/unauthorized" />;
  }
  

  return <Outlet />;
};

export default ProtectedRoute;
