import React from 'react';
import { Container } from '../components/ProductCard';

export default function About() {
  return (
    <Container className="py-12">
      <div className="max-w-[880px] mx-auto">
        <h1 className="text-3xl font-bold mb-4">About BookBazaar</h1>
        <p className="text-muted mb-4">
          BookBazaar is a marketplace for readers and sellers. We connect book lovers with independent sellers across the country.
        </p>

        <section className="bg-card p-6 rounded-2xl-lg border border-white/6">
          <h2 className="text-xl font-semibold mb-2">Our mission</h2>
          <p className="text-sm text-white/80">To make books accessible, affordable, and discoverable — while supporting independent sellers.</p>
        </section>
      </div>
    </Container>
  );
}
