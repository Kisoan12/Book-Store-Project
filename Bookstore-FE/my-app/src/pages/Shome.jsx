import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Container } from '../components/ProductCard';

export default function Shome() {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  useEffect(() => {
    api.get('/item').then(r => setItems(r.data || [])).catch(() => {});
    api.get('/orders').then(r => setOrders(r.data || [])).catch(()=>{});
    api.get('/sellers').then(r => setVendors(r.data || [])).catch(()=>{});
  }, []);

  return (
    <Container className="py-12">
      <div className="max-w-[1280px] mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Seller Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded-2xl-lg border border-white/6">
            <div className="text-sm text-muted">Your Products</div>
            <div className="text-2xl font-bold">{items.length}</div>
            <Link to="/myproducts" className="mt-3 inline-block text-accent">Manage</Link>
          </div>
          <div className="bg-card p-4 rounded-2xl-lg border border-white/6">
            <div className="text-sm text-muted">Orders</div>
            <div className="text-2xl font-bold">{orders.length}</div>
            <Link to="/orders" className="mt-3 inline-block text-accent">View</Link>
          </div>
          <div className="bg-card p-4 rounded-2xl-lg border border-white/6">
            <div className="text-sm text-muted">Vendors</div>
            <div className="text-2xl font-bold">{vendors.length}</div>
            <Link to="/vendors" className="mt-3 inline-block text-accent">Vendors</Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
