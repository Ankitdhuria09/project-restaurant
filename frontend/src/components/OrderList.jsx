import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const nextStatus = {
  'Placed': 'In Preparation',
  'In Preparation': 'Ready',
  'Ready': 'Delivered',
  'Delivered': 'Delivered', // or null if no further step
};

export default function OrderList() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/orders', {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setOrders(res.data);
    } catch (err) {
      toast.error('Failed to fetch orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (order) => {
    const newStatus = nextStatus[order.status];
    if (!newStatus || newStatus === order.status) {
      toast.info('No further status update possible');
      return;
    }

    try {
      const res = await axios.put(`/api/orders/${order._id}`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      // update state for that order
      setOrders((prevOrders) =>
        prevOrders.map((o) => (o._id === order._id ? res.data : o))
      );
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update order status');
      console.error(err);
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Existing Orders</h2>
      {orders.length === 0 && <p>No orders yet.</p>}
      {orders.map((order) => (
        <div key={order._id} className="border p-4 mb-2 rounded">
          <div>
            <strong>Customer:</strong> {order.customerName}
          </div>
          <div>
            <strong>Status:</strong> {order.status}
          </div>
          <div>
            <strong>Items:</strong>
            <ul className="list-disc ml-5">
              {order.items.map(({ itemId, quantity }) => (
                <li key={itemId._id || itemId}>
                  {itemId.name || 'Item'} x {quantity}
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => handleUpdateStatus(order)}
            className="bg-blue-600 text-white px-3 py-1 rounded mt-2 hover:bg-blue-700"
            disabled={order.status === 'Delivered'}
          >
            Mark as {nextStatus[order.status]}
          </button>
        </div>
      ))}
    </div>
  );
}
