
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { Container } from '../components/ProductCard';

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const endpointForRole = (r) => {
    if (r === 'seller') return '/ssignup';
    if (r === 'admin') return '/asignup';
    return '/signup';
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError('Please fill all fields.');
      return;
    }

    try {
      setLoading(true);
      const endpoint = endpointForRole(role);
      const payload = { name, email, password };

      const res = await api.post(endpoint, payload);

      
      if (res.data === 'Already have an account') {
        setError('An account with this email already exists.');
        return;
      }

      if (res.data === 'Account Created' || res.status === 201) {
        
        if (role === 'admin') {
          
          navigate('/alogin');
        } else if (role === 'seller') {
          navigate('/slogin');
        } else {
          navigate('/login');
        }
        return;
      }

      if (res.data && typeof res.data === 'object') {
        if (role === 'seller') navigate('/slogin');
        else if (role === 'admin') navigate('/alogin');
        else navigate('/login');
        return;
      }

      setError('Unexpected response from server.');
      console.warn('signup response', res.data);
    } catch (err) {
      console.error('Signup error:', err);
      if (err.response) {
        const data = err.response.data;
        const message =
          (typeof data === 'string' && data) ||
          data?.error ||
          data?.msg ||
          JSON.stringify(data);
        setError(`Server error: ${message}`);
      } else if (err.request) {
        setError('Cannot reach server. Check backend (http://localhost:4000).');
      } else {
        setError(`Unexpected error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-12">
      <div className="max-w-md mx-auto bg-card rounded-2xl-lg p-6 shadow-card-md border border-white/6">
        <h2 className="text-2xl font-semibold mb-2 text-text">Create an account</h2>
        <p className="text-sm text-muted mb-4">Choose your role and sign up.</p>

        {error && (
          <div role="alert" className="mb-4 text-sm text-danger bg-white/5 p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-text/90 mb-1">Account type</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 rounded-md bg-white text-black border border-gray-300"
            >
              <option value="user">User (Buyer)</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm text-text/90 mb-1">Full name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 rounded-md bg-white text-black border border-gray-300 placeholder-gray-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-text/90 mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-md bg-white text-black border border-gray-300 placeholder-gray-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-text/90 mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full p-3 rounded-md bg-white text-black border border-gray-300 placeholder-gray-500"
              placeholder="Create a password (min 6 chars)"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md bg-gradient-to-r from-accent to-accent2 text-black font-semibold disabled:opacity-60"
          >
            {loading ? 'Creating account…' : `Create ${role === 'user' ? 'User' : role === 'seller' ? 'Seller' : 'Admin'} account`}
          </button>
        </form>

        <div className="mt-4 text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:underline">Sign in</Link>
        </div>
      </div>
    </Container>
  );
}
