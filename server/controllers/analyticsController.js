const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

exports.getAnalytics = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.itemId');

    // Total Orders
    const totalOrders = orders.length;

    // Total Revenue
    const totalRevenue = orders.reduce((total, order) => {
      return (
        total +
        order.items.reduce((sum, item) => {
          return sum + (item.itemId?.price || 0) * item.quantity;
        }, 0)
      );
    }, 0);

    // Orders by Status
    const ordersByStatus = {};
    orders.forEach(order => {
      const status = order.status || 'Unknown';
      ordersByStatus[status] = (ordersByStatus[status] || 0) + 1;
    });

    // Most Ordered Items
    const itemCountMap = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const name = item.itemId?.name;
        if (!name) return;
        itemCountMap[name] = (itemCountMap[name] || 0) + item.quantity;
      });
    });

    const mostOrderedItems = Object.entries(itemCountMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5

    res.json({
      totalOrders,
      totalRevenue,
      ordersByStatus,
      mostOrderedItems,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
