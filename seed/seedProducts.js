require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

mongoose.connect(process.env.MONGO_URI).then(async () => {
console.log('Connected, seeding products...');
const data = [
{ name: 'Basic Plan', description: 'Basic monthly subscription', price: 500, is_active: true },
{ name: 'Pro Plan', description: 'Pro monthly subscription', price: 1500, is_active: true },
{ name: 'Enterprise Plan', description: 'Enterprise monthly subscription', price: 5000, is_active: false }
];
await Product.deleteMany({});
await Product.insertMany(data);
console.log('Seed complete');
process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });