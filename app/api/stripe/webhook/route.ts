import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { createAuditLog } from '@/lib/audit';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    await connectDB();

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.refunded':
        await handleRefund(event.data.object as Stripe.Charge);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    const order = await Order.findOne({ 'payment.intentId': paymentIntent.id });
    
    if (!order) {
      console.error('Order not found for payment intent:', paymentIntent.id);
      return;
    }

    // Update order status
    order.status = 'Paid';
    order.payment.status = 'succeeded';
    await order.save();

    // Reduce product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Create audit log
    await createAuditLog({
      actorId: 'system',
      actorName: 'Stripe Webhook',
      action: 'payment.succeeded',
      targetType: 'order',
      targetId: order._id.toString(),
      before: { status: 'Pending' },
      after: { status: 'Paid' },
      ip: 'stripe-webhook'
    });

    // TODO: Send order confirmation email
    console.log(`Payment succeeded for order ${order.orderNumber}`);

  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    const order = await Order.findOne({ 'payment.intentId': paymentIntent.id });
    
    if (!order) {
      console.error('Order not found for payment intent:', paymentIntent.id);
      return;
    }

    order.payment.status = 'failed';
    await order.save();

    // Create audit log
    await createAuditLog({
      actorId: 'system',
      actorName: 'Stripe Webhook',
      action: 'payment.failed',
      targetType: 'order',
      targetId: order._id.toString(),
      ip: 'stripe-webhook'
    });

    // TODO: Send payment failed notification
    console.log(`Payment failed for order ${order.orderNumber}`);

  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handleRefund(charge: Stripe.Charge) {
  try {
    const paymentIntentId = charge.payment_intent as string;
    const order = await Order.findOne({ 'payment.intentId': paymentIntentId });
    
    if (!order) {
      console.error('Order not found for charge:', charge.id);
      return;
    }

    // Update order status
    order.status = 'Refunded';
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } }
      );
    }

    // Create audit log
    await createAuditLog({
      actorId: 'system',
      actorName: 'Stripe Webhook',
      action: 'payment.refunded',
      targetType: 'order',
      targetId: order._id.toString(),
      after: { status: 'Refunded' },
      ip: 'stripe-webhook'
    });

    console.log(`Refund processed for order ${order.orderNumber}`);

  } catch (error) {
    console.error('Error handling refund:', error);
  }
}
