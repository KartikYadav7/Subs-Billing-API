const Product = require('../models/Product');


exports.listActive = async (req, res) => {
try {
const products = await Product.find({ is_active: true });
res.json({ products });
} catch(err) {
console.error(err);
res.status(500).json({ error: 'Server error' });
}
};