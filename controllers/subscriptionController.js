const Subscription = require("../models/Subscription");
const Product = require("../models/Product");
const User = require("../models/User");
const stripeService = require("../services/stripeService");

exports.createSubscription = async (req, res) => {
  try {
    const { user_id, product_ids} = req.body;
    if (!user_id || !Array.isArray(product_ids) || product_ids.length === 0)
      return res
        .status(400)
        .json({ error: "user_id and product_ids required in valid formats" });

    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const products = await Product.find({
      _id: { $in: product_ids },
      is_active: true,
    });
    if (products.length === 0)
      return res.status(400).json({ error: "No valid products found" });

    const total_amount = products.reduce((sum, p) => sum + p.price, 0);

    // Create subscription in DB (pending)
    const subscription = new Subscription({
      user: user._id,
      products: products.map((p) => p._id),
      total_amount,
      status: "pending",
    });
    await subscription.save();

    // Create Stripe Checkout session
    const session = await stripeService.createCheckoutSession(
      user,
      products,
      subscription,
      {
      metadata: {
  subscription_id: subscription._id.toString()
},}
    );
 

    subscription.stripe_session_id = session.id;
    await subscription.save();

    res.json({ subscription, checkoutUrl: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findById(req.params.id).populate(
      "user products"
    );
    if (!sub) return res.status(404).json({ error: "Subscription not found" });
    res.json({ subscription: sub });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
