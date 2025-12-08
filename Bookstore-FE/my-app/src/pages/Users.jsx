import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Container } from '../components/ProductCard';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/users');
      setUsers(res.data || []);
    } catch (err) {
      console.error('Failed to load users', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this user? This action cannot be undone.')) return;
    setActionLoading(id);
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      console.error('Delete user failed', err);
      alert('Delete failed. Check server logs.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Container className="py-12">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">All Users</h1>
          <div className="text-sm text-muted">{users.length} user{users.length !== 1 ? 's' : ''}</div>
        </div>

        {loading ? (
          <div className="text-center text-white/60">Loading users…</div>
        ) : error ? (
          <div className="text-center text-danger">{error}</div>
        ) : users.length === 0 ? (
          <div className="text-center text-white/60">No users found.</div>
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
                {users.map(u => (
                  <tr key={u._id} className="border-b border-white/6">
                    <td className="px-4 py-3">
                      <div className="font-medium">{u.name || '-'}</div>
                      <div className="text-xs text-muted">{u.phone || ''}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">{u.email}</td>
                    <td className="px-4 py-3 text-sm">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => navigator.clipboard.writeText(u._id)}
                          className="px-3 py-1 rounded-md border border-white/6 text-sm">Copy ID</button>
                        <button onClick={() => handleDelete(u._id)}
                          disabled={actionLoading === u._id}
                          className="px-3 py-1 rounded-md border border-white/6 text-sm text-danger">
                          {actionLoading === u._id ? 'Deleting…' : 'Delete'}
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
