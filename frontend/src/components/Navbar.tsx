import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    setIsLoggedIn(!!userId);
  }, []);

  const handleLogout = async () => {
    const userId = Number(localStorage.getItem("user_id"));
    if (!userId) return;

    await api.logout(userId);
    localStorage.removeItem("user_id");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-blue-700 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-semibold cursor-pointer" onClick={() => navigate("/")}>
        🏬 Store Manager
      </h1>
      <div className="flex items-center gap-4">
        <span>{isLoggedIn ? "Logged in" : "Guest"}</span>
        {isLoggedIn && (
          <button
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
