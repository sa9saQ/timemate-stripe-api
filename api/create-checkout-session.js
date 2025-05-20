// api/create-checkout-session.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: 'TimeMate 予約セッション（30分）',
            },
            unit_amount: 55000, // 550円（×100）
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://timemate.vercel.app/success',
      cancel_url: 'https://timemate.vercel.app/cancel',
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
