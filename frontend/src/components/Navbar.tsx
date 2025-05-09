import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="p-4 bg-blue-600 text-white flex justify-between">
      <div className="font-bold">Store Manager</div>
      <div className="space-x-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/items">Items</Link>
        <Link to="/order">Order</Link>
      </div>
    </nav>
  );
}
