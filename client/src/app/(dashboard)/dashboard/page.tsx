'use client';

import React, { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth';

interface Product {
  _id: string;
  url: string;
  inStock: boolean;
  lastChecked: string;
}

export default function DashboardPage() {
  const { user } = useAuthenticator();
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      const res = await fetch('http://localhost:3001/api/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      if (!token) throw new Error('No auth token found');

      const res = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);

      setMessage('Link submitted successfully!');
      setUrl('');
      fetchProducts(); 
    } catch (err: any) {
      console.error(err);
      setMessage('Failed to submit link.');
    }
  };

  useEffect(() => {
    fetchProducts(); 

    const interval = setInterval(() => {
      fetchProducts();
    }, 15000); // every 15 seconds

    return () => clearInterval(interval); 
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
  
      const res = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
  
      fetchProducts();
    } catch (err) {
      console.error('Failed to delete product:', err);
      setMessage('Failed to delete item.');
    }
  };
  return (
    <div className="flex flex-col items-center justify-start mt-10 w-full px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md flex items-center space-x-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste Target item link"
          className="flex-grow px-4 py-2 border rounded text-black"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Track
        </button>
      </form>
  
      {message && <p className="mt-4 text-sm">{message}</p>}
  
      <div className="mt-10 w-full max-w-xl space-y-4">
        {loading ? (
          <p className="text-gray-500 text-center">Loading tracked products...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500 text-center">No items being tracked yet.</p>
        ) : (
          products.map((prod) => (
            <div
              key={prod._id}
              className="border p-4 rounded shadow flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div className="flex-1">
                <a
                  href={prod.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {prod.url}
                </a>
                <div className="text-sm text-gray-600 mt-1">
                  Last checked: {new Date(prod.lastChecked).toLocaleString()}
                </div>
                <div
                  className={`inline-block mt-2 px-2 py-1 text-sm rounded ${
                    prod.inStock ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}
                >
                  {prod.inStock ? 'In Stock' : 'Out of Stock'}
                </div>
              </div>
              <button
                onClick={() => handleDelete(prod._id)}
                className="mt-4 md:mt-0 md:ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
};  