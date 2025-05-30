import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderForm from '../components/OrderForm';
import OrderTracker from '../components/OrderTracker';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { PlusCircle, Search, Filter, XCircle } from 'lucide-react';
import './css/orderpage.css';

function OrderPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders', {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
      toast.error('Failed to load orders');
    }
  };

  const handleOrderPlaced = (newOrder) => {
    setOrders(prev => [...prev, newOrder]);
    setCreatingOrder(false);
  };

  const handleUpdateStatus = async (order) => {
    const statusSequence = ['Placed', 'Preparation', 'Ready', 'Delivered'];
    const nextStatusIndex = statusSequence.indexOf(order.status) + 1;
    const nextStatus = statusSequence[nextStatusIndex];

    if (!nextStatus) return;

    try {
      const res = await axios.put(`/api/orders/${order._id}`, { status: nextStatus }, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      setOrders(prev =>
        prev.map(o => (o._id === order._id ? res.data : o))
      );
    } catch (err) {
      console.error('Failed to update order status', err);
      toast.error('Failed to update status');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const filteredAndSortedOrders = orders
    .filter(order =>
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (statusFilter === 'All' || order.status === statusFilter)
    )
    .sort((a, b) => {
      if (a.status === 'Delivered' && b.status !== 'Delivered') return 1;
      if (a.status !== 'Delivered' && b.status === 'Delivered') return -1;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

  return (
    <div className="order-page">
      <h1 className="page-title">🧾 Orders</h1>

      <div className="search-filter">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by customer name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <Filter size={16} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Placed">Placed</option>
            <option value="Preparation">Preparation</option>
            <option value="Ready">Ready</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
        <button
          className="new-order-button"
          onClick={() => setCreatingOrder(!creatingOrder)}
        >
          {creatingOrder ? <><XCircle size={16} /> Cancel</> : <><PlusCircle size={16} /> New Order</>}
        </button>
      </div>

      {creatingOrder && (
        <div className="order-form-inline">
          <OrderForm onOrderPlaced={handleOrderPlaced} onCancel={() => setCreatingOrder(false)} />
        </div>
      )}

      <div className="orders-grid">
        {filteredAndSortedOrders.map(order => {
          const orderTotal = order.items.reduce((sum, item) => {
            return sum + (item.itemId?.price || 0) * item.quantity;
          }, 0);

          const statusSequence = ['Placed', 'Preparation', 'Ready', 'Delivered'];
          const nextStatusIndex = statusSequence.indexOf(order.status) + 1;
          const nextStatus = statusSequence[nextStatusIndex];

          return (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h3>{order.customerName}</h3>
                <span className="order-time">{formatTime(order.createdAt)}</span>
              </div>

              <ul className="order-items">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.itemId?.name || 'Unknown Item'} × {item.quantity}
                    {item.customization && ` (${item.customization})`} – ₹{(item.itemId?.price || 0) * item.quantity}
                  </li>
                ))}
              </ul>

              <p className="order-total">Total: ₹{orderTotal.toFixed(2)}</p>
              <OrderTracker status={order.status} />

              {order.status !== 'Delivered' && nextStatus && (
                <button
                  onClick={() => handleUpdateStatus(order)}
                  className="order-button"
                >
                  Mark {nextStatus}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderPage;
