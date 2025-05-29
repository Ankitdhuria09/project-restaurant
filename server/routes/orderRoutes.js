const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  updateOrder,
  deleteOrder
} = require('../controllers/orderController');

const { getAnalytics } = require('../controllers/analyticsController'); // ✅ Add this

router.get('/', getOrders);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

// ✅ New analytics route
router.get('/analytics', getAnalytics);

module.exports = router;
