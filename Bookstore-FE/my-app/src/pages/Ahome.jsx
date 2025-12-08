import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Container } from '../components/ProductCard';

export default function Ahome() {
  const [users, setUsers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/users').then(r => setUsers(r.data || [])).catch(()=>{});
    api.get('/sellers').then(r => setSellers(r.data || [])).catch(()=>{});
    api.get('/item').then(r => setItems(r.data || [])).catch(()=>{});
    api.get('/orders').then(r => setOrders(r.data || [])).catch(()=>{});
  }, []);

  return (
    <Container className="py-12">
      <div className="max-w-[1280px] mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-card p-4 rounded-2xl-lg border border-white/6">
            <div className="text-sm text-muted">Users</div>
            <div className="text-2xl font-bold">{users.length}</div>
          </div>
          <div className="bg-card p-4 rounded-2xl-lg border border-white/6">
            <div className="text-sm text-muted">Sellers</div>
            <div className="text-2xl font-bold">{sellers.length}</div>
          </div>
          <div className="bg-card p-4 rounded-2xl-lg border border-white/6">
            <div className="text-sm text-muted">Items</div>
            <div className="text-2xl font-bold">{items.length}</div>
          </div>
          <div className="bg-card p-4 rounded-2xl-lg border border-white/6">
            <div className="text-sm text-muted">Orders</div>
            <div className="text-2xl font-bold">{orders.length}</div>
          </div>
        </div>
      </div>
    </Container>
  );
}
