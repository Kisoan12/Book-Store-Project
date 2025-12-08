const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  
  itemImage: { type: String, required: false },

  title: { type: String, required: true, trim: true },
  author: { type: String, required: false, trim: true },
  genre: { type: String, required: false, trim: true },
  description: { type: String, required: false },

  price: { type: String, required: true },

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
  userName: { type: String, required: false },
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
