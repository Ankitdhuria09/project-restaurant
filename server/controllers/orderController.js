const Order = require('../models/Order');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { customerName, items ,customerPhone } = req.body;

    if (!customerName || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Customer name and items are required' });
    }

    // Generate a unique order number (e.g., ORD-<timestamp>-<random>)
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newOrder = new Order({
      customerName,
      items,
      orderNumber,
      customerPhone,
      status: 'Placed',
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.itemId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an order (e.g., status or items)
exports.updateOrder = async (req, res) => { 
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,  // accepts partial update, e.g. { status: 'In Preparation' }
      { new: true }
    ).populate('items.itemId');
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getAnalytics = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.itemId');

    const totalOrders = orders.length;

    const revenue = orders.reduce((acc, order) => {
      const orderTotal = order.items.reduce((sum, item) => {
        const price = item.itemId?.price || 0;
        return sum + price * item.quantity;
      }, 0);
      return acc + orderTotal;
    }, 0);

    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    const itemCounts = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const name = item.itemId?.name || 'Unknown';
        itemCounts[name] = (itemCounts[name] || 0) + item.quantity;
      });
    });

    const mostOrderedItems = Object.entries(itemCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.json({
      totalOrders,
      revenue,
      statusCounts,
      mostOrderedItems
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

