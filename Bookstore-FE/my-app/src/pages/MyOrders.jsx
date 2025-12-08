import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { Container } from "../components/ProductCard";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState(null);
  const navigate = useNavigate();

  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;
  const userId = user ? user._id || user.id : null;

  useEffect(() => {
    if (!userId) {
      setOrders([]);
      setLoading(false);
      return;
    }
    api
      .get(`/getorders/${userId}`)
      .then((res) => setOrders(res.data || []))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [userId]);

  const openBookFromOrder = async (order) => {
    const id = order.itemId || order.bookId;
    if (id) {
      navigate(`/book/${id}`);
      return;
    }

    try {
      const all = await api.get("/item");
      const items = all.data || [];
      const title = (order.booktitle || "").toLowerCase().trim();
      const match = items.find((i) =>
        (i.title || "").toLowerCase().trim() === title
      );

      if (match) {
        navigate(`/book/${match._id}`);
        return;
      }

      alert("Book not found for this order.");
    } catch (err) {
      alert("Error locating book details.");
    }
  };

  const cancelOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      setAction(orderId);
      await api.delete(`/orders/${orderId}`);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err) {
      alert("Failed to cancel order.");
    } finally {
      setAction(null);
    }
  };

  return (
    <Container className="py-12">
      <h1 className="text-2xl font-semibold mb-6">My Orders</h1>

      {loading ? (
        <div className="text-center text-muted">Loading orders…</div>
      ) : orders.length === 0 ? (
        <div className="text-center bg-card p-8 rounded-2xl border border-white/6">
          <p className="text-muted">You have no orders yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((o) => (
            <div
              key={o._id}
              className="bg-card rounded-2xl-lg border border-white/6 p-5 shadow-card-md"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{o.booktitle}</h2>
                  <p className="text-sm text-muted">{o.bookauthor}</p>
                  <p className="text-sm mt-2">
                    <span className="font-semibold">Amount:</span> ₹{o.totalamount}
                  </p>
                  <p className="text-sm text-muted">
                    Ordered on: {new Date(o.BookingDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted">
                    Delivery: {o.Delivery || "—"}
                  </p>
                </div>

                <img
                  src={o.itemImage}
                  className="w-24 h-32 object-cover rounded-md"
                  alt="Book"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => openBookFromOrder(o)}
                  className="px-3 py-2 rounded-md border border-white/6 hover:bg-white/5 transition"
                >
                  View
                </button>

                <button
                  disabled={action === o._id}
                  onClick={() => cancelOrder(o._id)}
                  className="px-3 py-2 rounded-md border border-white/6 text-danger hover:bg-white/5 transition disabled:opacity-40"
                >
                  {action === o._id ? "Cancelling…" : "Cancel Order"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
