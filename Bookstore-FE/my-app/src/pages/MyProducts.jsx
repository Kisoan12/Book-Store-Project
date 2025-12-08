import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard, { Container } from '../components/ProductCard';

export default function MyProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const rawSeller = localStorage.getItem('seller');
  const rawUser = localStorage.getItem('user');
  let sellerObj = null;
  try {
    if (rawSeller) sellerObj = JSON.parse(rawSeller);
    else if (rawUser) sellerObj = JSON.parse(rawUser);
  } catch (e) {
    console.warn('Failed parsing account from localStorage', e);
  }

  const sellerId = sellerObj ? (sellerObj._id || sellerObj.id || sellerObj.userId || null) : null;

  useEffect(() => {
    const fetchItems = async () => {
      if (!sellerId) {
        setItems([]);
        setLoading(false);
        setError('No seller account found. Please sign in as a seller to see your products.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await api.get(`/getitem/${sellerId}`);
        setItems(res.data || []);
      } catch (err) {
        console.error('Failed to fetch seller items', err);
        const msg = err.response?.data?.error || err.response?.data || err.message || 'Failed to fetch items';
        setError(String(msg));
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [sellerId]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this book? This action cannot be undone.')) return;
    setActionLoading(id);
    try {
      await api.delete(`/itemdelete/${id}`);
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
      const msg = err.response?.data?.error || err.response?.data || err.message || 'Delete failed';
      alert(String(msg));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Container className="py-12">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">My Products</h1>
          <button onClick={() => navigate('/addbook')} className="px-4 py-2 rounded-md bg-accent text-black">Add book</button>
        </div>

        {loading ? (
          <div className="text-center text-white/60">Loading…</div>
        ) : error ? (
          <div className="text-center bg-card rounded-2xl-lg p-6 border border-white/6">
            <p className="text-sm text-danger mb-4">{error}</p>
            {!sellerId && (
              <div>
                <button onClick={() => navigate('/slogin')} className="mr-2 px-4 py-2 rounded-md border border-white/6">Seller login</button>
                <button onClick={() => navigate('/signup')} className="px-4 py-2 rounded-md bg-accent text-black">Create seller account</button>
              </div>
            )}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center bg-card rounded-2xl-lg p-8 border border-white/6">
            <p className="text-sm text-muted">You haven't added any products yet.</p>
            <button onClick={() => navigate('/addbook')} className="mt-4 inline-block px-4 py-2 rounded-md bg-accent text-black">Add your first book</button>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map(it => (
              <div key={it._id} className="relative">
                <ProductCard book={it} />
                <div className="mt-2 flex gap-2">
                  <Link to={`/editbook/${it._id}`} className="px-3 py-1 rounded-md border border-white/6">Edit</Link>
                  <button
                    onClick={() => handleDelete(it._id)}
                    disabled={actionLoading === it._id}
                    className="px-3 py-1 rounded-md border border-white/6 text-danger"
                  >
                    {actionLoading === it._id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
