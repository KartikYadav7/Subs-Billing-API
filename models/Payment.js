const mongoose = require('mongoose');
const PaymentSchema = new mongoose.Schema({
subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
stripe_payment_id: String,
amount: Number,
status: String,
created_at: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Payment', PaymentSchema);