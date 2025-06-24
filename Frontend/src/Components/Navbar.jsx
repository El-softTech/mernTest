import { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/authContext";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  PencilIcon,
  AcademicCapIcon,
  CheckBadgeIcon,
  PowerIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { name: "Dashboard", to: "/dashboard", icon: PresentationChartBarIcon },
  { name: "Isi Soal", to: "/isi-soal", icon: PencilIcon },
  { name: "Ujian", to: "/ujian", icon: AcademicCapIcon },
  { name: "Penilaian", to: "/penilaian", icon: CheckBadgeIcon },
];

export function DefaultSidebar() {
  const navigate = useNavigate();
   const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);
   const { user, setUser } = useAuth();


  const userData = JSON.parse(sessionStorage.getItem("user")) || user;
  const nama = userData?.nama;
  const role = userData?.role;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  },  []);

  const isActive = (path) => {
    return location.pathname === path;
  };

    const handleLogout = () => {
    
    sessionStorage.clear();
    navigate("/");
  };


  return (
    <div>
      {/* Navbar Atas */}
    <header className="fixed top-0 left-0 right-0 bg-gray-600 p-4 z-50 shadow-md">
  <div className="flex items-center justify-between">
    <button
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="text-white focus:outline-none hover:bg-gray-500 p-1 rounded"
    >
      {sidebarOpen ? (
        <XMarkIcon className="h-6 w-6" />
      ) : (
        <Bars3Icon className="h-6 w-6" />
      )}
    </button>

    <Typography variant="h6" className="text-white mx-4 truncate">
      SMP MUHAMADIYAH 44
    </Typography>

    {/* Profile Dropdown */}
    <div className="relative" ref={dropdownRef}>
    <button
      onClick={() => setDropdownOpen(!dropdownOpen)}
      className="text-white hover:bg-gray-500 px-2 py-1 rounded focus:outline-none"
    >
      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
        {nama?.charAt(0).toUpperCase() || "U"}
      </div>
    </button>
    {dropdownOpen && (
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 overflow-hidden">
        <div className="px-4 py-2 border-b">
          <p className="text-sm font-semibold text-gray-700">{nama || "User"}</p>
          <p className="text-xs text-gray-500">{role || "Role"}</p>
        </div>
        <button
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    )}
  </div>
  </div>
</header>


      {/* Sidebar */}
      <Card
        className={`fixed h-screen ${
          isMobile
            ? sidebarOpen
              ? "w-1/2 z-10"
              : "w-0"
            : sidebarOpen
            ? "w-64"
            : "w-16"
        } bg-gray-800 text-white shadow-lg transition-all duration-300 mt-16 rounded-none`}
      >
        <div className="overflow-y-auto h-full py-4">
          <List>
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);

              return (
                <Link to={item.to} key={item.name}>
                  <ListItem
                    className={`${
                      active ? "bg-blue-600" : "hover:bg-gray-700"
                    } text-gray-300 mb-2 rounded-none`}
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    <ListItemPrefix>
                      <Icon
                        className={`h-5 w-5 ${
                          active ? "text-white" : "text-gray-300"
                        }`}
                      />
                    </ListItemPrefix>
                    {(sidebarOpen || !isMobile) && (
                      <span
                        className={`ml-2 text-sm ${
                          active ? "text-white font-medium" : "text-gray-300"
                        }`}
                      >
                        {item.name}
                      </span>
                    )}
                  </ListItem>
                </Link>
              );
            })}

            
          </List>
        </div>
      </Card>

      {/* Overlay untuk Mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-0"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
