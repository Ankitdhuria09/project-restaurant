const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
      quantity: Number,
      customization: String,
      notes: String
    }
  ],
  orderNumber: {
    type: String,
    required: true,
    unique: true // 👈 Ensures no duplicates
  },
  status: {
    type: String,
    enum: ['Placed', 'In Preparation', 'Ready', 'Delivered'],
    default: 'Placed'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
