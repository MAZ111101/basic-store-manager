export default function Dashboard() {
    const userId = localStorage.getItem("user_id");
    return (
      <div className="p-8">
        <h1 className="text-3xl">Welcome, User #{userId}</h1>
        <p className="mt-2">Use the navbar to manage items and create orders.</p>
      </div>
    );
  }
  