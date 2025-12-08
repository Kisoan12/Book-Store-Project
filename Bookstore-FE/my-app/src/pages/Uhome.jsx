import React, { useEffect, useState } from 'react';
import ProductCard, { Container } from '../components/ProductCard';
import api from '../utils/api';

export default function Uhome() {
  const [books, setBooks] = useState([]);
  useEffect(() => {
    api.get('/item').then(r => setBooks(r.data || [])).catch(e => console.error(e));
  }, []);

  return (
    <Container className="py-12">
      <div className="max-w-[1280px] mx-auto">
        <section className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold">Discover your next read</h1>
            <p className="text-muted mt-2">Handpicked books from independent sellers.</p>
          </div>
          <div className="text-right">
            <a href="/books" className="inline-block px-4 py-2 rounded-md bg-gradient-to-r from-accent to-accent2 text-black">Browse all books</a>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Featured</h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {books.slice(0, 8).map(b => <ProductCard key={b._id} book={b} />)}
          </div>
        </section>
      </div>
    </Container>
  );
}
