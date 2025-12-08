import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Container } from '../components/ProductCard';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/orders'); 
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to load orders', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this order?')) return;
    setActionLoading(id);
    try {
      await api.delete(`/orders/${id}`);
      setOrders(prev => prev.filter(o => o._id !== id));
    } catch (err) {
      console.error('Delete order failed', err);
      alert('Delete failed. Check server logs.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Container className="py-12">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">All Orders</h1>
          <div className="text-sm text-muted">{orders.length} order{orders.length !== 1 ? 's' : ''}</div>
        </div>

        {loading ? (
          <div className="text-center text-white/60">Loading orders…</div>
        ) : error ? (
          <div className="text-center text-danger">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-white/60">No orders yet.</div>
        ) : (
          <div className="bg-card rounded-2xl-lg border border-white/6 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-sm text-muted border-b border-white/6">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Seller</th>
                  <th className="px-4 py-3">Book</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Placed</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders.map(o => (
                  <tr key={o._id} className="border-b border-white/6">
                    <td className="px-4 py-3 text-sm">{o._id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{o.userName || '-'}</div>
                      <div className="text-xs text-muted">{o.userId}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">{o.seller || o.sellerId || '-'}</td>
                    <td className="px-4 py-3 text-sm">{o.booktitle || '-'}</td>
                    <td className="px-4 py-3 text-sm">₹{o.totalamount || '-'}</td>
                    <td className="px-4 py-3 text-sm">{o.BookingDate ? new Date(o.BookingDate).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => navigator.clipboard.writeText(o._id)} className="px-3 py-1 rounded-md border border-white/6 text-sm">Copy ID</button>
                        <button onClick={() => handleDelete(o._id)} disabled={actionLoading === o._id}
                          className="px-3 py-1 rounded-md border border-white/6 text-sm text-danger">
                          {actionLoading === o._id ? 'Deleting…' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Container>
  );
}
