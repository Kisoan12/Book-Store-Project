import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import ProductCard, { Container } from "../components/ProductCard";

export default function Categories() {
  const { genre } = useParams(); 
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    api.get("/item")
      .then(res => {
        if (!mounted) return;
        setItems(res.data || []);
      })
      .catch(err => {
        console.error("Failed to load items", err);
        setError("Failed to load books. Check server.");
      })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!genre) {
      setFiltered(items);
      return;
    }

    const g = String(genre).trim().toLowerCase();
    const result = items.filter(it => {
      const ig = (it.genre || "").toString().toLowerCase();
    
      if (!ig) return false;
      if (ig === g) return true;
      
      const parts = ig.split(",").map(p => p.trim());
      if (parts.includes(g)) return true;
    
      return ig.includes(g);
    });

    setFiltered(result);
  }, [items, genre]);

  const popular = ["All", "Classic", "Dystopia", "Fantasy", "Romance", "Business", "Self-help"];

  return (
    <Container className="py-12">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">{genre ? `${genre} Books` : "Categories"}</h1>
            <p className="text-sm text-muted">{genre ? `Showing books in category: ${genre}` : "Pick a category to view books"}</p>
          </div>

          <div className="flex gap-3 items-center">
            {popular.map(c => (
              <Link
                key={c}
                to={c === "All" ? "/books" : `/categories/${encodeURIComponent(c)}`}
                className={`text-sm px-3 py-1 rounded-md border ${(!genre && c === "All") || (genre && c.toLowerCase() === (genre || "").toLowerCase()) ? "bg-white/5" : "border-white/6"}`}
              >
                {c}
              </Link>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center text-muted">Loading books…</div>
        ) : error ? (
          <div className="text-center text-danger">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center bg-card rounded-2xl-lg p-8 border border-white/6">
            <p className="text-sm text-muted">No books found in this category.</p>
            <div className="mt-4">
              <Link to="/books" className="px-4 py-2 rounded-md border border-white/6">View all books</Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map(book => (
              <div key={book._id || book.id}>
                <ProductCard book={book} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
