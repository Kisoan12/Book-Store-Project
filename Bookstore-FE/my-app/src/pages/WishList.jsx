
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard, { Container } from '../components/ProductCard';

const PLACEHOLDER = 'https://via.placeholder.com/300x450?text=Book+Cover';

export default function WishList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

  const userRaw = localStorage.getItem('user');
  const user = userRaw ? JSON.parse(userRaw) : null;
  const userId = user ? (user.id || user._id || user._id || user.id) : null;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setItems([]);
      return;
    }
    setLoading(true);
    api.get(`/wishlist/${userId}`)
      .then(res => setItems(res.data || []))
      .catch(err => {
        console.error(err);
        setError('Failed to load wishlist.');
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleRemove = async (itemId) => {
    if (!itemId) return;
    setActionLoading(itemId);
    try {
      await api.post('/wishlist/remove', { itemId, userId });
      setItems(prev => prev.filter(i => String(i.itemId) !== String(itemId) && String(i._id) !== String(itemId)));
    } catch (err) {
      console.error(err);
      setError('Failed to remove item.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBuy = (book) => {
    navigate(`/book/${book.itemId || book._id}`);
  };

  if (!user) {
    return (
      <Container className="py-16">
        <div className="max-w-md mx-auto bg-card rounded-2xl-lg p-6 text-center border border-white/6">
          <h3 className="text-lg font-semibold mb-2">Your wishlist</h3>
          <p className="text-sm text-muted mb-4">Please sign in to view your wishlist.</p>
          <div className="flex justify-center gap-3">
            <Link to="/login" className="px-4 py-2 rounded-md border border-white/6">Sign in</Link>
            <Link to="/signup" className="px-4 py-2 rounded-md bg-gradient-to-r from-accent to-accent2 text-black">Create account</Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">My Wishlist</h1>
          <div className="text-sm text-muted">{items.length} item{items.length !== 1 ? 's' : ''}</div>
        </div>

        {loading ? (
          <div className="text-center text-white/60">Loading wishlist…</div>
        ) : items.length === 0 ? (
          <div className="text-center bg-card rounded-2xl-lg p-8 border border-white/6">
            <p className="text-sm text-muted">You don't have anything in your wishlist yet.</p>
            <Link to="/books" className="mt-4 inline-block px-4 py-2 rounded-md bg-accent text-black">Browse books</Link>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((w) => {
              const book = {
                _id: w.itemId || w._id,
                title: w.title || (w.item && w.item.title) || 'Untitled',
                author: w.item && w.item.author ? w.item.author : w.author || 'Unknown author',
                genre: w.item && w.item.genre ? w.item.genre : w.genre,
                price: w.item && w.item.price ? w.item.price : w.price || '—',
                itemImage: w.itemImage || (w.item && w.item.itemImage) || PLACEHOLDER,
              };

              const itemId = w.itemId || w._id;

              return (
                <div key={itemId} className="relative">
                  <ProductCard
                    book={book}
                    onBuy={() => handleBuy(book)}
                    onAddWishlist={() => {/* already in wishlist */}}
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <button
                      onClick={() => handleRemove(itemId)}
                      disabled={actionLoading === itemId}
                      className="px-3 py-1 rounded-md border border-white/6 text-sm"
                    >
                      {actionLoading === itemId ? 'Removing…' : 'Remove'}
                    </button>
                    <button
                      onClick={() => handleBuy(book)}
                      className="px-3 py-1 rounded-md bg-gradient-to-r from-accent to-accent2 text-black text-sm font-semibold"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {error && <div className="mt-4 text-sm text-danger">{error}</div>}
      </div>
    </Container>
  );
}
