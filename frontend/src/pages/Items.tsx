import { useEffect, useState } from "react";
import { api } from "../api";
import ItemCard from "../components/ItemCard";
import { useNavigate } from "react-router-dom";

export default function Items() {
  const [items, setItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState("");
  const isLoggedIn = !!localStorage.getItem("user_id");
  const navigate = useNavigate();

  const loadItems = async () => {
    const res = await api.getItems();
    console.log("Fetched items:", res.items);
    setItems(res.items || []);
  };

  const handleAdd = async () => {
    if (!newItem || !isLoggedIn) return;
    await api.addItem(newItem);
    setNewItem("");
    loadItems();
  };

  const handleDelete = async (id: number) => {
    await api.deleteItem(id);
    loadItems();
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    } else {
      loadItems();
    }
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">Manage Items</h2>

      {isLoggedIn ? (
        <div className="flex gap-2 mb-6">
          <input
            className="input flex-1"
            placeholder="New item name"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <button className="btn" onClick={handleAdd}>
            Add
          </button>
        </div>
      ) : (
        <p className="text-red-500 mb-6">Please log in to add items.</p>
      )}

      {items.length === 0 ? (
        <p className="text-gray-500">No items found.</p>
      ) : (
        items.map((item) => (
          <ItemCard
            key={item.id}
            id={item.id}
            name={item.name}
            price={item.price}
            onDelete={isLoggedIn ? handleDelete : undefined}
          />
        ))
      )}
    </div>
  );
}
