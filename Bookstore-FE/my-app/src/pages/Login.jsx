import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { Container } from '../components/ProductCard';

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState('user'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const endpointForRole = (r) => {
    if (r === 'seller') return '/slogin';
    if (r === 'admin') return '/alogin';
    return '/login';
  };

  const storageKeyForRole = (r) => {
    if (r === 'seller') return 'seller';
    if (r === 'admin') return 'admin';
    return 'user';
  };

  const redirectForRole = (r) => {
    if (r === 'seller') return '/shome';
    if (r === 'admin') return '/ahome';
    return '/books';
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const endpoint = endpointForRole(role);
      const res = await api.post(endpoint, { email, password });

      // Backend returns strings on failure; object on success
      const failStrings = ['User not found', 'Invalid Password', 'no user', 'login fail'];
      if (typeof res.data === 'string' && failStrings.includes(res.data)) {
        setError(res.data);
        return;
      }

      // success: response may be { Status: 'Success', user: {...} } or user object
      const payloadUser = res.data?.user || (typeof res.data === 'object' ? res.data : null);
      if (!payloadUser) {
        // some backends may return nested object or different shape — fallback
        setError('Unexpected server response.');
        console.warn('login response', res.data);
        return;
      }

      const key = storageKeyForRole(role);
      localStorage.setItem(key, JSON.stringify(payloadUser));

      // after login, update navbar (it polls localStorage) and redirect
      navigate(redirectForRole(role));
    } catch (err) {
      console.error('Login error:', err);
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
        <h2 className="text-2xl font-semibold mb-2 text-text">Sign in</h2>
        <p className="text-sm text-muted mb-4">Choose account type and sign in.</p>

        {error && (
          <div role="alert" className="mb-4 text-sm text-danger bg-white/5 p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-text/90 mb-1">Sign in as</label>
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
              className="w-full p-3 rounded-md bg-white text-black border border-gray-300 placeholder-gray-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md bg-gradient-to-r from-accent to-accent2 text-black font-semibold disabled:opacity-60"
          >
            {loading ? 'Signing in…' : `Sign in as ${role === 'user' ? 'User' : role === 'seller' ? 'Seller' : 'Admin'}`}
          </button>
        </form>

        <div className="mt-4 text-sm text-muted">
          New here?{' '}
          <Link to="/signup" className="text-accent hover:underline">Create an account</Link>
        </div>
      </div>
    </Container>
  );
}
