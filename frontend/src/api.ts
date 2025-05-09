const BASE_URL = "http://localhost:5000";

export const api = {
  async register(email: string, password: string) {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async login(email: string, password: string) {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async getItems() {
    const res = await fetch(`${BASE_URL}/items`);
    const data = await res.json();
    return data;
  },

  async addItem(name: string) {
    const res = await fetch(`${BASE_URL}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    return res.json();
  },

  async deleteItem(id: number) {
    const res = await fetch(`${BASE_URL}/items/${id}`, {
      method: "DELETE"
    });
    return res.json();
  },

  async createOrder(userId: number, itemIds: number[], paymentType: string) {
    const res = await fetch(`${BASE_URL}/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, items: itemIds, payment_type: paymentType })
    });
    return res.json();
  },

  async downloadReceipt(orderId: number) {
    const res = await fetch(`${BASE_URL}/receipt/${orderId}`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    return url;
  }
};
