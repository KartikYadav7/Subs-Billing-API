const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
name: String,
description: String,
price: Number, // cents
is_active: { type: Boolean, default: true }
});
module.exports = mongoose.model('Product', ProductSchema);