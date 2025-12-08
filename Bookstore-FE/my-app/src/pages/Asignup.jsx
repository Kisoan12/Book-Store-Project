import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Container } from '../components/ProductCard';

export default function Asignup() {
  const navigate = useNavigate();
  const [name,email,password] = React.useState('');
 

  return (
    <Container className="py-12">
      <div className="max-w-md mx-auto bg-card p-6 rounded-2xl-lg border border-white/6">
        <h2 className="text-xl font-semibold mb-4">Admin Signup</h2>
        <p className="text-sm text-muted">Use server-side admin creation if required.</p>
      </div>
    </Container>
  );
}
