import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const userId = localStorage.getItem("user_id");
    const isLoggedIn = !!localStorage.getItem("user_id");
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
          navigate("/");
        } 
      }, []);

    return (
      <div className="p-8">
        <h1 className="text-3xl">Welcome, User #{userId}</h1>
        <p className="mt-2">Use the sidebar to manage items and create orders.</p>
      </div>
    );
  }
  