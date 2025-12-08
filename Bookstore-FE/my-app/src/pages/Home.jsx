
import React, { useEffect, useState } from 'react';
import ProductCard, { Container } from '../components/ProductCard';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const HERO_BG = 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=0d4c6b28f2b1f3b9c8f0b3d6c5d3e6a4';

export default function Home() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    api.get('/item')
      .then(res => setBooks(res.data || []))
      .catch(err => console.error(err));
  }, []);

  return (
    <main>
      <section className="relative">
        <div className="h-[420px] bg-cover bg-center" style={{ backgroundImage: `url(${HERO_BG})` }}>
          <div className="absolute inset-0 bg-black/50" />
          <Container className="relative z-10 flex items-center h-full">
            <div className="max-w-2xl py-12">
              <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">Find your next favourite book</h1>
              <p className="text-muted mb-6">Explore thousands of books from independent sellers. Fast shipping, secure payments.</p>
              <div className="flex gap-3">
                <Link to="/books" className="px-5 py-3 rounded-md bg-gradient-to-r from-accent to-accent2 text-black font-semibold">Browse books</Link>
                <Link to="/categories" className="px-5 py-3 rounded-md border border-white/6 text-text">Categories</Link>
              </div>
            </div>
          </Container>
        </div>
      </section>

      <section className="py-12">
        <Container>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Featured</h2>
            <Link to="/books" className="text-sm text-accent">View all books</Link>
          </div>

          {books.length === 0 ? (
            <div className="text-center text-white/60">No books yet.</div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {books.slice(0, 8).map(b => <ProductCard key={b._id} book={b} />)}
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
