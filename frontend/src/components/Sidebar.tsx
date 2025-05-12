import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="h-screen w-48 bg-blue-700 text-white flex flex-col p-4 shadow-md">
      <div className="text-xl font-bold mb-6">Store Dashboard</div>
      <nav className="flex flex-col gap-4">
        <Link to="/dashboard" className="hover:text-gray-200">Dashboard</Link>
        <Link to="/items" className="hover:text-gray-200">Items</Link>
        <Link to="/order" className="hover:text-gray-200">Order</Link>
      </nav>
    </aside>
  );
}
