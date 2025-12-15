const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendSubscriptionConfirmation = async (user, subscription, products) => {
  const productLines = products
    .map((p) => `<li>${p.name} — $${(p.price / 100).toFixed(2)}</li>`)
    .join("");
  const total = (subscription.total_amount / 100).toFixed(2);
  const start = subscription.start_date
    ? subscription.start_date.toLocaleString()
    : "—";
  const end = subscription.end_date
    ? subscription.end_date.toLocaleString()
    : "—";

  const html = `
<p>Hi ${user.fullName},</p>
<p>Thanks for your payment. Here are your subscription details:</p>
<ul>
${productLines}
</ul>
<p><strong>Total paid:</strong> $${total}</p>
<p><strong>Subscription start:</strong> ${start}</p>
<p><strong>Subscription end:</strong> ${end}</p>
<p>Payment status: <strong>Paid</strong></p>
<p>Thanks,<br/>The Team</p>
`;

  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Subscription confirmation",
    html,
  });

  console.log("Confirmation email sent:", info.messageId);
};
