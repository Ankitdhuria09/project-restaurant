import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/dashboardpage.css';
import { TrendingUp, Receipt, PieChart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UnauthorizedPage from './UnauthorizedPage';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  if (!user || user.role !== "admin") {
    // Not logged in or not admin
    return <UnauthorizedPage />;
  }
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('https://project-restaurant-backend.onrender.com/api/orders/analytics');
        setData(res.data);
      } catch (err) {
        setError('Failed to load analytics.');
        console.error(err);
      }
    };
    fetchAnalytics();
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p className="loading">Loading analytics...</p>;

  return (
    <div className="analytics-page">
      <h1 className="page-title">📊 Analytics</h1>
       {
        isAdmin && (
          <div></div>
        )
       }
      <div className="analytics-grid">
        <div className="analytics-card highlight">
          <div className="card-header">
            <Receipt size={24} />
            <h2>Total Orders</h2>
          </div>
          <p className="metric-value">{data?.totalOrders ?? 0}</p>
        </div>

        <div className="analytics-card highlight">
          <div className="card-header">
            <TrendingUp size={24} />
            <h2>Total Revenue</h2>
          </div>
          <p className="metric-value">₹{data.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="analytics-section">
        <div className="section-header">
          <PieChart size={20} />
          <h2>Orders by Status</h2>
        </div>
        <ul className="analytics-list">
          {Object.entries(data.ordersByStatus).map(([status, count]) => (
            <li key={status}>
              <span>{status}</span>
              <span>{count}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="analytics-section">
        <div className="section-header">
          <PieChart size={20} />
          <h2>Most Ordered Items</h2>
        </div>
        <ul className="analytics-list">
          {(data?.mostOrderedItems || []).map((item) => (
            <li key={item.name}>
              <span>{item.name}</span>
              <span>{item.count} orders</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
