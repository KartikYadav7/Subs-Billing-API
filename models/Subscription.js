const mongoose = require('mongoose');
const SubscriptionSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
total_amount: Number, // cents
status: { type: String, enum: ['pending','paid','cancelled'], default: 'pending' },
stripe_session_id: String,
stripe_payment_id: String,
start_date: Date,
end_date: Date
}, { timestamps: true });
module.exports = mongoose.model('Subscription', SubscriptionSchema);