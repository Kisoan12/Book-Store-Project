import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Container } from '../components/ProductCard';

const PLACEHOLDER = 'https://via.placeholder.com/300x450?text=Book+Cover';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderOpen, setOrderOpen] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState(null);

  const [orderForm, setOrderForm] = useState({
    flatno: '',
    city: '',
    state: '',
    pincode: '',
    totalamount: '',
    BookingDate: new Date().toISOString().slice(0,10),
    Delivery: '',
    description: ''
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/item/${id}`)
      .then(res => setBook(res.data))
      .catch(err => console.error('Failed to load book', err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddWishlist = async () => {
    try {
      const userRaw = localStorage.getItem('user');
      if (!userRaw) return alert('Please login to add to wishlist.');
      const user = JSON.parse(userRaw);
      const payload = {
        itemId: book._id,
        title: book.title,
        itemImage: book.itemImage,
        userId: user.id || user._id || user._id || user.id,
        userName: user.name || ''
      };
      const res = await api.post('/wishlist/add', payload);
      if (res.status === 201 || res.data?._id) {
        alert('Added to wishlist');
      } else {
        alert('Added to wishlist');
      }
    } catch (err) {
      console.error('Wishlist add error:', err);
      if (err.response) {
        alert(`Server: ${JSON.stringify(err.response.data)}`);
      } else {
        alert('Failed to add to wishlist');
      }
    }
  };

  const openOrder = () => {
    setOrderForm(prev => ({ ...prev, totalamount: book?.price || '' }));
    setOrderOpen(true);
  };

  const handleOrderChange = (e) => {
    setOrderForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    setOrderError(null);

    const userRaw = localStorage.getItem('user');
    if (!userRaw) return alert('Please login to place an order.');
    const user = JSON.parse(userRaw);

    if (!orderForm.flatno || !orderForm.city || !orderForm.pincode) {
      setOrderError('Please fill in address fields.');
      return;
    }

    const payload = {
      ...orderForm,
      seller: book.userName || '',
      sellerId: book.userId || '',
      userId: user.id || user._id || user._id || user.id,
      userName: user.name || '',
      booktitle: book.title,
      bookauthor: book.author,
      bookgenre: book.genre,
      itemImage: book.itemImage || PLACEHOLDER
    };

    try {
      setOrderLoading(true);
      const res = await api.post('/userorder', payload);
      if (res.status === 201 || res.data?._id) {
        alert('Order placed successfully!');
        setOrderOpen(false);
        navigate('/myorders');
      } else {
        setOrderError('Unexpected server response.');
        console.warn('order response', res.data);
      }
    } catch (err) {
      console.error(err);
      setOrderError('Failed to place order. Try again later.');
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-16">
        <div className="text-center text-white/60">Loading book…</div>
      </Container>
    );
  }

  if (!book) {
    return (
      <Container className="py-16">
        <div className="text-center text-white/60">Book not found.</div>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <div className="max-w-[980px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-card rounded-2xl-lg p-4 border border-white/6">
            <img
              src={book.itemImage || PLACEHOLDER}
              alt={book.title || 'Book cover'}
              className="w-full h-96 object-cover rounded"
              onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
            />
            <div className="mt-4 flex gap-2">
              <button onClick={handleAddWishlist} className="flex-1 px-3 py-2 rounded-md border border-white/6">Add to wishlist</button>
              <button onClick={openOrder} className="flex-1 px-3 py-2 rounded-md bg-gradient-to-r from-accent to-accent2 text-black font-semibold">Buy now</button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold">{book.title}</h1>
          <p className="text-sm text-muted mt-1">{book.author || 'Unknown author'}</p>

          <div className="mt-4 flex items-center gap-4">
            <div className="text-accent font-bold text-2xl">₹{book.price}</div>
            <div className="text-sm text-muted">Genre: {book.genre || '—'}</div>
          </div>

          <div className="mt-6 bg-card rounded p-4 border border-white/5">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-white/80 whitespace-pre-line">{book.description || 'No description provided.'}</p>
          </div>

          <div className="mt-6 flex items-center justify-between bg-transparent p-0">
            <div>
              <div className="text-xs text-muted">Seller</div>
              <div className="text-sm text-text">{book.userName || 'Unknown'}</div>
            </div>
            <div>
              <div className="text-xs text-muted">Posted</div>
              <div className="text-sm text-text">{new Date(book.createdAt || Date.now()).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>

      {orderOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOrderOpen(false)} />
          <div className="relative z-50 max-w-lg w-full mx-4">
            <div className="bg-card rounded-2xl-lg p-6 border border-white/6 shadow-card-md">
              <h3 className="text-xl font-semibold mb-3">Place order</h3>

              {orderError && <div className="text-sm text-danger mb-3">{orderError}</div>}

              <form onSubmit={submitOrder} className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <input name="flatno" placeholder="Flat / House no" value={orderForm.flatno} onChange={handleOrderChange}
                    className="p-3 rounded-md bg-white text-black border border-gray-300" />
                  <input name="city" placeholder="City" value={orderForm.city} onChange={handleOrderChange}
                    className="p-3 rounded-md bg-white text-black border border-gray-300" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input name="state" placeholder="State" value={orderForm.state} onChange={handleOrderChange}
                    className="p-3 rounded-md bg-white text-black border border-gray-300" />
                  <input name="pincode" placeholder="Pincode" value={orderForm.pincode} onChange={handleOrderChange}
                    className="p-3 rounded-md bg-white text-black border border-gray-300" />
                </div>

                <div>
                  <label className="text-sm text-muted block mb-1">Delivery date (optional)</label>
                  <input name="Delivery" type="date" value={orderForm.Delivery} onChange={handleOrderChange}
                    className="p-3 rounded-md bg-white text-black border border-gray-300 w-full" />
                </div>

                <div>
                  <label className="text-sm text-muted block mb-1">Notes (optional)</label>
                  <textarea name="description" rows={3} value={orderForm.description} onChange={handleOrderChange}
                    className="p-3 rounded-md bg-white text-black border border-gray-300 w-full" />
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="text-sm text-muted">Total</div>
                  <div className="text-accent font-bold">₹{orderForm.totalamount || book.price}</div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <button type="submit" disabled={orderLoading}
                    className="flex-1 px-4 py-2 rounded-md bg-gradient-to-r from-accent to-accent2 text-black font-semibold">
                    {orderLoading ? 'Placing…' : 'Place order'}
                  </button>
                  <button type="button" onClick={() => setOrderOpen(false)} className="px-4 py-2 rounded-md border border-white/6">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
