const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  title: { type: String, required: false },
  itemImage: { type: String, required: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: false },
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
