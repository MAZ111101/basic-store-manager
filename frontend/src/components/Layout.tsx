import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <div className="fixed">
          <Sidebar />
        </div>
        <main className="ml-48 flex-1 overflow-y-auto p-4 bg-gray-100 h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
