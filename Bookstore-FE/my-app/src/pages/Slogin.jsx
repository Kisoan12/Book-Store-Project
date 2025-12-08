import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { Container } from "../components/ProductCard";

export default function Slogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/slogin", { email, password });

      if (res.data === "no user" || res.data === "login fail") {
        setError("Invalid seller credentials.");
        return;
      }

      const sellerData = res.data?.user || res.data;

      if (!sellerData) {
        setError("Unexpected server response.");
        return;
      }

      localStorage.setItem("seller", JSON.stringify(sellerData));

      navigate("/shome"); 
    } catch (err) {
      console.error("Seller login error:", err);

      if (err.response) {
        setError(err.response.data?.error || "Server error.");
      } else if (err.request) {
        setError("Unable to reach server. Check backend.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-12">
      <div className="max-w-md mx-auto bg-card rounded-2xl-lg p-6 shadow-card-md border border-white/6">
        <h2 className="text-2xl font-semibold mb-2 text-text">Seller Login</h2>
        <p className="text-sm text-muted mb-6">Sign in to manage your store & products.</p>

        {error && (
          <div
            role="alert"
            className="mb-4 text-sm text-danger bg-white/5 p-3 rounded"
          >
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm text-text/90 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-md bg-white text-black border border-gray-300 placeholder-gray-500"
              placeholder="seller@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm text-text/90 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-md bg-white text-black border border-gray-300 placeholder-gray-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md bg-gradient-to-r from-accent to-accent2 text-black font-semibold disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Login as Seller"}
          </button>
        </form>

        <div className="mt-4 text-sm text-muted">
          Don't have a seller account?{" "}
          <Link to="/signup" className="text-accent hover:underline">
            Create one
          </Link>
        </div>

        <div className="mt-2 text-sm text-muted">
          Want to login as User/Admin?{" "}
          <Link to="/login" className="text-accent hover:underline">
            Click here
          </Link>
        </div>
      </div>
    </Container>
  );
}
