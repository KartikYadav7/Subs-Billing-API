const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (user, products, subscription) => {
  const line_items = products.map((p) => ({
    price_data: {
      currency: "usd",
      unit_amount: p.price, // cents
      product_data: { name: p.name, description: p.description },
    },
    quantity: 1,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: user.email,
    line_items,
    metadata: {
      subscription_id: subscription._id.toString(),
    },
    success_url: "https://example.com/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "https://example.com/cancel",
  });

  return session;
};

exports.retrieveSession = (id) =>
  stripe.checkout.sessions.retrieve(id, { expand: ["payment_intent"] });
