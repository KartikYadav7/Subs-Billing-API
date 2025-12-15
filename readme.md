
# Subscription Billing API 

This repository provides a ready-to-run Express + MongoDB backend implementing subscription-based billing with Stripe (test mode) and automated emails using any SMTP provider (Gmail SMTP, SendGrid SMTP, etc.). Responses are JSON-only (API).

Features

Product management (stored in MongoDB)

User registration

Create subscription with chosen products

Create Stripe Checkout Session for payment

Store Stripe session/payment id on subscription record

Webhook handler to confirm payment, update DB, and send confirmation email

Uses environment variables for secrets

Clean JSON responses

product id 2 - 693f7e1ac0377d4860f0d185
product id - 693f7e1ac0377d4860f0d184
userid - "693f7ee06e4e69ec4e3f530f"