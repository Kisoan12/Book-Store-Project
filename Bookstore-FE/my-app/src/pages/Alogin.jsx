import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Container } from '../components/ProductCard';

export default function Alogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Enter both email and password");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/alogin', { email, password });

      if (res.data?.Status === "Success") {
        localStorage.setItem("admin", JSON.stringify(res.data.admin || res.data.user));
        navigate("/ahome");
      } else if (typeof res.data === "string") {
        setError(res.data);
      } else if (res.data?.user) {
        localStorage.setItem("admin", JSON.stringify(res.data.user));
        navigate("/ahome");
      } else {
        setError("Invalid admin credentials");
      }

    } catch (err) {
      console.error(err);
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-12">
      <div className="max-w-md mx-auto bg-card p-6 rounded-2xl-lg border border-white/6 shadow-card-md">

        <h2 className="text-2xl font-semibold mb-2 text-text">Admin Login</h2>
        <p className="text-sm text-muted mb-6">Sign in to the admin dashboard.</p>

        {error && (
          <div className="mb-4 text-sm text-danger bg-white/5 p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-text/90 mb-1">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded-md bg-white/4 border border-white/6 text-black
              placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent transition"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-text/90 mb-1">Password</label>
            <input
              type="password"
              className="w-full p-3 rounded-md bg-white/4 border border-white/6 text-black
              placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent transition"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md bg-gradient-to-r from-accent to-accent2 text-black
            font-semibold disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>
      </div>
    </Container>
  );
}
