const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  
  flatno: { type: String, required: false },
  city: { type: String, required: false },
  state: { type: String, required: false },
  pincode: { type: String, required: false },

  totalamount: { type: String, required: true },

  seller: { type: String, required: false },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: false },

  BookingDate: { type: String, required: false },
  Delivery: { type: String, required: false },

  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  userName: { type: String, required: false },

  booktitle: { type: String, required: true },
  bookauthor: { type: String, required: false },
  bookgenre: { type: String, required: false },
  itemImage: { type: String, required: false },

  description: { type: String, required: false },

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
