// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Products from './pages/Products';
import BookDetail from './pages/BookDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import WishList from './pages/WishList';
import MyOrders from './pages/MyOrders';
import MyProducts from './pages/MyProducts';
import AddBook from './pages/AddBook';
import Uhome from './pages/Uhome';
import Shome from './pages/Shome';
import Ahome from './pages/Ahome';
import Alogin from './pages/Alogin';
import Asignup from './pages/Asignup';
import Users from './pages/Users';
import Sellers from './pages/Sellers';
import Orders from './pages/Orders'; 
import Categories from './pages/Categories';
import About from './pages/About';
import Slogin from './pages/Slogin';

function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Page not found</h2>
        <p className="text-muted mt-2">We couldn't find the page you're looking for.</p>
        <a href="/" className="inline-block mt-4 px-4 py-2 rounded-md bg-accent text-black">Go home</a>
      </div>
    </div>
  );
}

export default function App(){
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />

            <Route path="/home" element={<Home />} />
            <Route path="/books" element={<Products />} />
            <Route path="/book/:id" element={<BookDetail />} />
           
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:genre" element={<Categories />} />

            <Route path="/about" element={<About />} />

            <Route path="/wishlist" element={<WishList />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/slogin" element={<Slogin />} />
            <Route path="/ssignup" element={<Asignup />} />
            <Route path="/alogin" element={<Alogin />} />
            <Route path="/ahome" element={<Ahome />} />

            <Route path="/myorders" element={<MyOrders />} />
            <Route path="/myproducts" element={<MyProducts />} />
            <Route path="/addbook" element={<AddBook />} />
            <Route path="/shome" element={<Shome />} />

            <Route path="/users" element={<Users />} />
            <Route path="/vendors" element={<Sellers />} />
            <Route path="/orders" element={<Orders />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
