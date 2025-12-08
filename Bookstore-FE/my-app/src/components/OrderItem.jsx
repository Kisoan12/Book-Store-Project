import React from 'react';

export default function OrderItem({ order }) {
  return (
    <div className="bg-card p-4 rounded-2xl-lg border border-white/6">
      <div className="flex items-start gap-4">
        <img src={order.itemImage || 'https://via.placeholder.com/120x180?text=Cover'} alt={order.booktitle}
          className="w-20 h-28 object-cover rounded" />
        <div className="flex-1">
          <div className="font-semibold">{order.booktitle}</div>
          <div className="text-sm text-muted">by {order.bookauthor || 'Unknown'}</div>
          <div className="text-xs text-muted mt-2">Order ID: {order._id}</div>
        </div>
        <div className="text-right">
          <div className="text-accent font-bold">₹{order.totalamount}</div>
          <div className="text-sm text-muted">Delivery: {order.Delivery || 'N/A'}</div>
        </div>
      </div>
    </div>
  );
}
