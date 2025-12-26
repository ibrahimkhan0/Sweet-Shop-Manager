import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

interface CartItem extends Sweet {
  cartQuantity: number;
}

const Dashboard = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role === 'ADMIN') {
          setIsAdmin(true);
        }
      } catch (e) {
        console.error('Failed to parse token');
      }
    }
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

  const handleSearch = async () => {
    try {
      const res = await api.get(`/sweets/search?q=${search}`);
      setSweets(res.data);
    } catch (error) {
      console.error('Failed to search sweets');
    }
  };

  const addToCart = (sweet: Sweet) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === sweet.id);
      if (existing) {
        if (existing.cartQuantity >= sweet.quantity) {
          alert('Cannot add more than available stock');
          return prev;
        }
        return prev.map((item) =>
          item.id === sweet.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item
        );
      }
      return [...prev, { ...sweet, cartQuantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCartQuantity = (id: number, delta: number) => {
    setCart((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          const newQty = item.cartQuantity + delta;
          if (newQty > item.quantity) {
            alert('Cannot add more than available stock');
            return item;
          }
          if (newQty <= 0) return item;
          return { ...item, cartQuantity: newQty };
        }
        return item;
      });
    });
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      const items = cart.map((item) => ({ id: item.id, quantity: item.cartQuantity }));
      await api.post('/inventory/checkout', { items });
      alert('Purchase successful!');
      setCart([]);
      setIsCartOpen(false);
      fetchSweets();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Checkout failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.cartQuantity, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-8 relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Sweet Shop Dashboard</h1>
        <div className="flex gap-4">
          {isAdmin && (
            <button 
              onClick={() => navigate('/admin')} 
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Admin Panel
            </button>
          )}
          <button 
            onClick={() => setIsCartOpen(!isCartOpen)} 
            className="bg-yellow-500 text-white px-4 py-2 rounded relative"
          >
            Cart ({cart.reduce((acc, item) => acc + item.cartQuantity, 0)})
          </button>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </div>
      </div>

      {isCartOpen && (
        <div className="absolute right-8 top-20 bg-white p-6 rounded shadow-xl w-96 z-10 border">
          <h2 className="text-xl font-bold mb-4">Your Cart</h2>
          {cart.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            <>
              <div className="max-h-60 overflow-y-auto mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center mb-2 border-b pb-2">
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sm text-gray-600">${item.price} x {item.cartQuantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateCartQuantity(item.id, -1)} className="px-2 bg-gray-200 rounded">-</button>
                      <span>{item.cartQuantity}</span>
                      <button onClick={() => updateCartQuantity(item.id, 1)} className="px-2 bg-gray-200 rounded">+</button>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500 ml-2">x</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-lg mb-4">
                <span>Total:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <button onClick={handleCheckout} className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
                Checkout
              </button>
            </>
          )}
        </div>
      )}

      <div className="mb-8 flex gap-4">
        <input
          type="text"
          placeholder="Search sweets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full max-w-md"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
        <button onClick={fetchSweets} className="bg-gray-500 text-white px-4 py-2 rounded">Reset</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sweets.map((sweet) => (
          <div key={sweet.id} className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-2">{sweet.name}</h2>
            <p className="text-gray-600 mb-1">Category: {sweet.category}</p>
            <p className="text-gray-800 font-bold mb-1">${sweet.price}</p>
            <p className={`mb-4 ${sweet.quantity === 0 ? 'text-red-500' : 'text-green-500'}`}>
              In Stock: {sweet.quantity}
            </p>
            <button
              onClick={() => addToCart(sweet)}
              disabled={sweet.quantity === 0}
              className={`w-full py-2 rounded text-white ${
                sweet.quantity === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {sweet.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
