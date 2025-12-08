import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  const readAccount = () => {
    const a = localStorage.getItem("admin");
    const s = localStorage.getItem("seller");
    const u = localStorage.getItem("user");

    if (a) {
      const admin = JSON.parse(a);
      return setAccount({ role: "admin", name: admin.name || admin.email });
    }
    if (s) {
      const seller = JSON.parse(s);
      return setAccount({ role: "seller", name: seller.name || seller.email });
    }
    if (u) {
      const user = JSON.parse(u);
      return setAccount({ role: "user", name: user.name || user.email });
    }
    setAccount(null);
  };

  useEffect(() => {
    readAccount();
    const id = setInterval(readAccount, 800);
    return () => clearInterval(id);
  }, []);

  const logout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("seller");
    localStorage.removeItem("user");
    setAccount(null);
    navigate("/login");
  };

  return (
    <header className="bg-card/95 backdrop-blur-md border-b border-white/5 sticky top-0 z-30">
      <div className="max-w-[1280px] mx-auto px-4 py-3 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl-lg bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-black font-extrabold">B</div>
          <div className="leading-tight">
            <div className="text-text font-semibold">BookBazaar</div>
            <div className="text-xs text-muted -mt-1">Read. Learn. Grow.</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/home" className="text-sm text-text/90 hover:text-accent transition">Home</Link>
          <Link to="/books" className="text-sm text-text/90 hover:text-accent transition">Books</Link>
          <Link to="/categories" className="text-sm text-text/90 hover:text-accent transition">Categories</Link>
          <Link to="/about" className="text-sm text-text/90 hover:text-accent transition">About</Link>
        </nav>

        <div className="flex items-center gap-3">
          
          <Link to="/wishlist" className="hidden sm:inline text-sm hover:text-accent transition">
            Wishlist
          </Link>

          {account?.role === "user" && (
            <Link 
              to="/myorders"
              className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-md border border-white/6 text-sm hover:bg-white/5 transition"
            >
              My Orders
            </Link>
          )}

          {account?.role === "seller" && (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/addbook" className="text-sm px-3 py-2 rounded-md border border-white/6">Add Book</Link>
              <Link to="/myproducts" className="text-sm px-3 py-2 rounded-md border border-white/6">My Products</Link>
              <Link to="/shome" className="text-sm px-3 py-2 rounded-md bg-white/5">Seller</Link>
            </div>
          )}

          {account?.role === "admin" && (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/ahome" className="text-sm px-3 py-2 rounded-md border border-white/6">Admin</Link>
              <Link to="/users" className="text-sm px-3 py-2 rounded-md border border-white/6">Users</Link>
              <Link to="/vendors" className="text-sm px-3 py-2 rounded-md border border-white/6">Vendors</Link>
              <Link to="/orders" className="text-sm px-3 py-2 rounded-md border border-white/6">Orders</Link>
            </div>
          )}

          {account ? (
            <div className="hidden md:flex items-center gap-3">
              <div className="text-sm text-text/90">Hi, <strong>{account.name}</strong></div>
              <button onClick={logout} className="text-sm px-3 py-1 rounded-md border border-white/6">Logout</button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="text-sm px-3 py-2 rounded-md border border-white/6">Login</Link>
              <Link to="/signup" className="text-sm px-3 py-2 rounded-md bg-white/5">Sign up</Link>
            </div>
          )}

          
          <button onClick={() => setOpen(!open)} className="ml-1 md:hidden p-2 rounded-md border border-white/6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor">
              <path strokeWidth="2" d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

    
      {open && (
        <nav className="md:hidden border-t border-white/5 bg-card/95">
          <div className="px-4 py-3 space-y-2">
            <Link to="/home" onClick={() => setOpen(false)} className="block py-2 text-text/90">Home</Link>
            <Link to="/books" onClick={() => setOpen(false)} className="block py-2 text-text/90">Books</Link>
            <Link to="/categories" onClick={() => setOpen(false)} className="block py-2 text-text/90">Categories</Link>
            <Link to="/about" onClick={() => setOpen(false)} className="block py-2 text-text/90">About</Link>
            <Link to="/wishlist" onClick={() => setOpen(false)} className="block py-2 text-text/90">Wishlist</Link>

            {account?.role === "user" && (
              <Link to="/myorders" onClick={() => setOpen(false)} className="block py-2 text-text/90">
                My Orders
              </Link>
            )}

            {account?.role === "seller" && (
              <>
                <Link to="/addbook" onClick={() => setOpen(false)} className="block py-2">Add Book</Link>
                <Link to="/myproducts" onClick={() => setOpen(false)} className="block py-2">My Products</Link>
                <Link to="/shome" onClick={() => setOpen(false)} className="block py-2">Seller Dashboard</Link>
              </>
            )}

            {account?.role === "admin" && (
              <>
                <Link to="/ahome" onClick={() => setOpen(false)} className="block py-2">Admin</Link>
                <Link to="/users" onClick={() => setOpen(false)} className="block py-2">Users</Link>
                <Link to="/vendors" onClick={() => setOpen(false)} className="block py-2">Vendors</Link>
                <Link to="/orders" onClick={() => setOpen(false)} className="block py-2">Orders</Link>
              </>
            )}

            <div className="pt-2 border-t border-white/5">
              {account ? (
                <button
                  onClick={() => { setOpen(false); logout(); }}
                  className="w-full text-left py-2 text-danger"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="block py-2">Login</Link>
                  <Link to="/signup" onClick={() => setOpen(false)} className="block py-2">Sign up</Link>
                </>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
