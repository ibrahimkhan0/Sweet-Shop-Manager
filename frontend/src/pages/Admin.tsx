import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

const Admin = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [form, setForm] = useState({ name: '', category: '', price: 0, quantity: 0 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      const res = await api.get('/sweets');
      setSweets(res.data);
    } catch (error) {
      console.error('Failed to fetch sweets');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/sweets/${editingId}`, form);
      } else {
        await api.post('/sweets', form);
      }
      setForm({ name: '', category: '', price: 0, quantity: 0 });
      setEditingId(null);
      fetchSweets();
    } catch (error) {
      alert('Operation failed');
    }
  };

  const handleEdit = (sweet: Sweet) => {
    setForm({ name: sweet.name, category: sweet.category, price: sweet.price, quantity: sweet.quantity });
    setEditingId(sweet.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/sweets/${id}`);
      fetchSweets();
    } catch (error) {
      alert('Delete failed');
    }
  };

  const handleRestock = async (id: number) => {
    const qty = prompt('Enter quantity to add:');
    if (!qty) return;
    try {
      await api.post(`/sweets/${id}/restock`, { quantity: Number(qty) });
      fetchSweets();
    } catch (error) {
      alert('Restock failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Admin Dashboard</h1>
        <button onClick={() => navigate('/dashboard')} className="bg-gray-500 text-white px-4 py-2 rounded">Back to Shop</button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Sweet' : 'Add New Sweet'}</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
            className="border p-2 rounded"
            required
          />
        </div>
        <div className="mt-4 flex gap-2">
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            {editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setForm({ name: '', category: '', price: 0, quantity: 0 });
                setEditingId(null);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Quantity</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sweets.map((sweet) => (
              <tr key={sweet.id} className="border-t">
                <td className="p-4">{sweet.name}</td>
                <td className="p-4">{sweet.category}</td>
                <td className="p-4">${sweet.price}</td>
                <td className="p-4">{sweet.quantity}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => handleEdit(sweet)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                  <button onClick={() => handleRestock(sweet.id)} className="bg-yellow-500 text-white px-2 py-1 rounded">Restock</button>
                  <button onClick={() => handleDelete(sweet.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
