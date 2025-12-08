import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import ProductCard, { Container } from '../components/ProductCard';

export default function Products() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/item')
      .then(res => {
        setBooks(res.data || []);
      })
      .catch(err => {
        console.error('Failed to load books', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleBuy = (book) => {
    alert(`Buy: ${book.title}`);
  };

  const handleWishlist = (book) => {
    const userRaw = localStorage.getItem('user');
    if (!userRaw) {
      alert('Please login to add to wishlist.');
      return;
    }
    const user = JSON.parse(userRaw);
    api.post('/wishlist/add', {
      itemId: book._id,
      title: book.title,
      itemImage: book.itemImage,
      userId: user.id || user._id || user._id || user.id,
      userName: user.name || ''
    })
      .then(() => alert('Added to wishlist'))
      .catch(err => {
        console.error('Wishlist add error', err);
        if (err.response) alert(`Server: ${JSON.stringify(err.response.data)}`);
        else alert('Failed to add to wishlist');
      });
  };

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-semibold mb-6">Books</h1>

      {loading ? (
        <div className="text-center text-white/60">Loading...</div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {books.map(b => (
            <ProductCard key={b._id} book={b}
              onBuy={handleBuy}
              onAddWishlist={handleWishlist}
            />
          ))}
        </div>
      )}
    </Container>
  );
}
