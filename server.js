require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');


const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscriptions');
const webhookRoutes = require('./routes/webhook');


const app = express();
const PORT = process.env.PORT || 3000;


// Important: for webhook we need raw body. We'll mount raw body parser on /webhook route only.

app.use(cors());
app.use('/webhook', webhookRoutes);
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Welcome to the server")
})
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});