const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Subscription = require("../models/Subscription");
const Payment = require("../models/Payment");
const emailService = require("../services/emailService");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Stripe requires the raw body to validate signature. Use bodyParser.raw for this route.
router.post(
  "/",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed.", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("Webhook metadata:", session.metadata);
      // Fulfill the purchase
      const subscriptionId =
        session.metadata && session.metadata.subscription_id;
      const paymentIntentId = session.payment_intent;

      try {
        const sub = await Subscription.findById(subscriptionId).populate(
          "user products"
        );
        if (!sub) {
          console.warn(
            "Subscription not found for webhook session",
            subscriptionId
          );
        } else {
          sub.status = "paid";
          sub.stripe_payment_id = paymentIntentId || session.payment_intent;
          sub.start_date = new Date();
          // end_date = +1 month (simple)
          const end = new Date(sub.start_date);
          end.setMonth(end.getMonth() + 1);
          sub.end_date = end;
          await sub.save();

          const payment = new Payment({
            subscription: sub._id,
            stripe_payment_id: sub.stripe_payment_id,
            amount: sub.total_amount,
            status: "succeeded",
          });
          await payment.save();
          await emailService.sendSubscriptionConfirmation(
            sub.user,
            sub,
            sub.products
          );
          console.log(
            "Subscription payment processed and confirmation email sent."
          );
        }
      } catch (err) {
        console.error("Error handling checkout.session.completed webhook", err);
        return res.status(500).send(error.message);
      }
    }

    res.json({ received: true });
  }
);

module.exports = router;
