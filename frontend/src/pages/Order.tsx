import { useEffect, useState } from "react";
import { api } from "../api";
import ItemCard from "../components/ItemCard";
import ReceiptViewer from "../components/ReceiptViewer";
import { useNavigate } from "react-router-dom";

export default function Order() {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [paymentType, setPaymentType] = useState("cash");
  const [receiptUrl, setReceiptUrl] = useState("");
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("user_id");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    } else {
      loadItems();
    }
  }, []);

  const loadItems = async () => {
    const res = await api.getItems();
    setItems(res.items || []);
  };

  const toggleSelect = (id: number) => {
    if (!isLoggedIn) return;
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleOrder = async () => {
    if (selected.length === 0) {
    alert("Please select at least one item to order.");
    return;
  }
    const userId = Number(localStorage.getItem("user_id"));
    const res = await api.createOrder(userId, selected, paymentType);
    console.log("Order Response:", res);
    const receiptLink = await api.downloadReceipt(res.order_id);
    setReceiptUrl(receiptLink);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">Create New Order</h2>

      <div className="mb-4">
        <label className="mr-2">Payment Type:</label>
        <select
          className="input"
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
          disabled={!isLoggedIn}
        >
          <option value="cash">Cash</option>
          <option value="debit">Debit Card</option>
        </select>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500">No items available for order.</p>
      ) : (
        items.map((item) => (
          <ItemCard
            key={item.id}
            id={item.id}
            name={item.name}
            price={item.price}
            selectable={isLoggedIn}
            selected={selected.includes(item.id)}
            onToggleSelect={toggleSelect}
          />
        ))
      )}

      {isLoggedIn && (
        <button className="btn mt-4" onClick={handleOrder}>
          Confirm Order
        </button>
      )}

      {isLoggedIn && receiptUrl && <ReceiptViewer receiptUrl={receiptUrl} />}
    </div>
  );
}
