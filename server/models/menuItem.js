const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // e.g., Drinks, Main Course, Desserts
  price: { type: Number, required: true },
  size: { type: String }, // e.g., Small, Medium, Large
  description: { type: String },
  availability: { type: Boolean, default: true }, // to indicate if the item is in stock
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MenuItem", menuItemSchema);
