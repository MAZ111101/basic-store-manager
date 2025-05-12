import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await api.login(email, password);
    if (res.user_id) {
      localStorage.setItem("user_id", res.user_id); // Simple session
      navigate("/dashboard");
    } else alert("Invalid login");
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Login</h1>
      <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="input mt-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="btn mt-4" onClick={handleLogin}>Login</button>
    </div>
  );
}
