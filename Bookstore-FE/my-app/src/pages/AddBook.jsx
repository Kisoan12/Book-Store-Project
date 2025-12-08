import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Container } from '../components/ProductCard';

export default function AddBook() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    price: '',
    itemImage: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const onChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
    setSuccessMsg(null);
  };

  const validate = () => {
    if (!form.title?.trim()) return 'Title is required.';
    if (!form.price?.trim()) return 'Price is required.';
    return null;
  };


const submit = async (e) => {
  e.preventDefault();
  setError(null);
  setSuccessMsg(null);

  const v = validate();
  if (v) {
    setError(v);
    return;
  }

  try {
    setLoading(true);

    const userRaw = localStorage.getItem('seller') || localStorage.getItem('user');
    let sellerId = null;
    let sellerName = '';

    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        
        sellerId = user._id || user.id || null;
        sellerName = user.name || user.username || user.email || '';
      } catch (e) {
        console.warn('Failed to parse user from localStorage', e);
      }
    }

    const payload = {
      title: form.title,
      author: form.author,
      genre: form.genre,
      description: form.description,
      price: form.price,
      itemImage: form.itemImage || '',
      userId: sellerId,
      userName: sellerName,
    };

    console.log('AddBook payload:', payload);
    const res = await api.post('/items', payload);

    if (res.status === 201 || res.data?._id) {
      setSuccessMsg('Book added successfully.');
      setTimeout(() => navigate('/myproducts'), 900);
    } else {
      setError('Unexpected server response.');
    }
  } catch (err) {
    console.error('AddBook error:', err);
    if (err.response) setError(`Server error: ${JSON.stringify(err.response.data)}`);
    else if (err.request) setError('Cannot reach server. Check backend.');
    else setError(`Unexpected error: ${err.message}`);
  } finally {
    setLoading(false);
  }
};


  return (
    <Container className="py-12">
      <div className="max-w-2xl mx-auto bg-card rounded-2xl-lg p-6 shadow-card-md border border-white/6">
        <h2 className="text-2xl font-semibold mb-2 text-text">Add a Book</h2>
        <p className="text-sm text-muted mb-6">Create a new listing. Use a public URL for the cover image.</p>

        {error && (
          <div role="alert" className="mb-4 text-sm text-danger bg-white/5 p-3 rounded">
            {error}
          </div>
        )}
        {successMsg && (
          <div role="status" className="mb-4 text-sm text-success bg-white/5 p-3 rounded">
            {successMsg}
          </div>
        )}

        <form onSubmit={submit} className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm text-text/90 mb-1">Title *</label>
            <input name="title" value={form.title} onChange={onChange}
              className="w-full p-3 rounded-md bg-white text-black border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent transition"
              placeholder="Book title" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text/90 mb-1">Author</label>
              <input name="author" value={form.author} onChange={onChange}
                className="w-full p-3 rounded-md bg-white text-black border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent transition"
                placeholder="Author name" />
            </div>
            <div>
              <label className="block text-sm text-text/90 mb-1">Genre</label>
              <input name="genre" value={form.genre} onChange={onChange}
                className="w-full p-3 rounded-md bg-white text-black border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent transition"
                placeholder="e.g. Fiction, Self-help" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-text/90 mb-1">Price (₹) *</label>
            <input name="price" value={form.price} onChange={onChange}
              className="w-full p-3 rounded-md bg-white text-black border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent transition"
              placeholder="199" />
          </div>

          <div>
            <label className="block text-sm text-text/90 mb-1">Cover image URL (optional)</label>
            <input name="itemImage" value={form.itemImage} onChange={onChange}
              className="w-full p-3 rounded-md bg-white text-black border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent transition"
              placeholder="https://example.com/cover.jpg" />
          </div>

          <div>
            <label className="block text-sm text-text/90 mb-1">Short description</label>
            <textarea name="description" value={form.description} onChange={onChange}
              rows={4}
              className="w-full p-3 rounded-md bg-white text-black border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent transition"
              placeholder="A brief description or notes about the book." />
          </div>

          <div className="flex items-center justify-between gap-4 mt-2">
            <div className="flex items-center gap-3">
              <button type="submit" disabled={loading}
                className="px-4 py-2 rounded-md bg-gradient-to-r from-accent to-accent2 text-black font-semibold">
                {loading ? 'Saving…' : 'Add Book'}
              </button>
              <button type="button" onClick={() => navigate('/myproducts')}
                className="px-4 py-2 rounded-md border border-white/6 text-text/90">
                Cancel
              </button>
            </div>

            <div className="w-28">
              <div className="text-xs text-muted mb-1">Preview</div>
              <div className="bg-white/5 p-2 rounded">
                <img
                  src={form.itemImage || 'https://via.placeholder.com/120x180?text=Cover'}
                  alt="preview"
                  className="w-full h-40 object-cover rounded"
                  onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/120x180?text=Cover'}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </Container>
  );
}
