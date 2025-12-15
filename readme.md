
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

