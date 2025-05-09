import { useEffect, useState } from "react";
import { api } from "../api";
import ItemCard from "../components/ItemCard";

export default function Items() {
  const [items, setItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState("");

  // Load items from the backend
  const loadItems = async () => {
    const res = await api.getItems();  // Make sure 'res.items' is returned
    console.log("Fetched items:", res.items);  // Debugging line
    setItems(res.items || []);  // Ensure you're accessing the items correctly
  };

  const handleAdd = async () => {
    if (!newItem) return;
    await api.addItem(newItem);  // Ensure this is calling the backend to add the item
    setNewItem("");  // Reset the input
    loadItems();  // Reload the items after adding
  };

  const handleDelete = async (id: number) => {
    await api.deleteItem(id);
    loadItems();  // Reload the list after deletion
  };

  useEffect(() => {
    loadItems();
  }, []);  // This effect will run once when the component mounts

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">Manage Items</h2>

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

      {items.length === 0 ? (
        <p className="text-gray-500">No items found.</p>
      ) : (
        items.map((item) => (
          <ItemCard
            key={item.id}
            id={item.id}
            name={item.name}
            price={item.price}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}
