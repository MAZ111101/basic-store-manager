import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-br bg-white">
      <div className="bg-blue-100 rounded-2xl shadow-xl p-10 max-w-xl text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to Store Manager!</h1>
        <p className="text-lg text-gray-700 mb-6">
          Your all-in-one platform to manage store items and track orders efficiently.
        </p>
        <p className="text-md text-gray-600 mb-6">
          New here? <span className="font-semibold">Register an account</span> to get started.
          Already have one? <span className="font-semibold">Login</span> to access your dashboard.
        </p>
        <div className="flex justify-center space-x-6">
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition duration-300"
          >
            Register
          </Link>
          <Link
            to="/login"
            className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-2 rounded-full transition duration-300"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
