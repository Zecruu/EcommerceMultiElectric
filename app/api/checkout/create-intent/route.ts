import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { authenticate } from '@/middleware/auth';
import { generatePickupCode } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export const POST = authenticate(async (request) => {
  try {
    await connectDB();

    const { items, customerInfo } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Items are required' },
        { status: 400 }
      );
    }

    if (!customerInfo || !customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      return NextResponse.json(
        { success: false, error: 'Customer information is required' },
        { status: 400 }
      );
    }

    // Validate and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.active) {
        return NextResponse.json(
          { success: false, error: `Product ${item.productId} not found or inactive` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        sku: product.sku
      });
    }

    const tax = 0; // Configure tax calculation as needed
    const total = subtotal + tax;

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId: request.user!.userId,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
      },
    });

    // Create order in database
    const order = await Order.create({
      userId: request.user!.userId,
      items: orderItems,
      subtotal,
      tax,
      total,
      status: 'Pending',
      payment: {
        provider: 'stripe',
        intentId: paymentIntent.id,
        status: 'requires_payment_method'
      },
      customer: customerInfo,
      pickup: {
        code: generatePickupCode()
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        orderId: order._id,
        orderNumber: order.orderNumber,
        total: total
      }
    });

  } catch (error) {
    console.error('Create payment intent error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
});
