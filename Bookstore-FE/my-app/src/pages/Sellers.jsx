import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Container } from '../components/ProductCard';

export default function Sellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/sellers');
      setSellers(res.data || []);
    } catch (err) {
      console.error('Failed to load sellers', err);
      setError('Failed to load sellers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this vendor?')) return;
    setActionLoading(id);
    try {
      await api.delete(`/sellers/${id}`);
      setSellers(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      console.error('Delete vendor failed', err);
      alert('Delete failed. Check server logs.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Container className="py-12">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Vendors</h1>
          <div className="text-sm text-muted">{sellers.length} vendor{sellers.length !== 1 ? 's' : ''}</div>
        </div>

        {loading ? (
          <div className="text-center text-white/60">Loading vendors…</div>
        ) : error ? (
          <div className="text-center text-danger">{error}</div>
        ) : sellers.length === 0 ? (
          <div className="text-center text-white/60">No vendors yet.</div>
        ) : (
          <div className="bg-card rounded-2xl-lg border border-white/6 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-sm text-muted border-b border-white/6">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sellers.map(s => (
                  <tr key={s._id} className="border-b border-white/6">
                    <td className="px-4 py-3">
                      <div className="font-medium">{s.name || '-'}</div>
                      <div className="text-xs text-muted">{s.shopName || ''}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">{s.email}</td>
                    <td className="px-4 py-3 text-sm">{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => navigator.clipboard.writeText(s._id)}
                          className="px-3 py-1 rounded-md border border-white/6 text-sm">Copy ID</button>
                        <button onClick={() => handleDelete(s._id)}
                          disabled={actionLoading === s._id}
                          className="px-3 py-1 rounded-md border border-white/6 text-sm text-danger">
                          {actionLoading === s._id ? 'Deleting…' : 'Delete'}
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
