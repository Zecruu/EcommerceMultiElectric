import mongoose, { Schema, Document } from 'mongoose';
import { Order as IOrder } from '@/types';

export interface OrderDocument extends IOrder, Document {}

const OrderSchema = new Schema<OrderDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    sku: {
      type: String,
      required: true
    }
  }],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Preparing', 'Ready', 'PickedUp', 'Refunded', 'Cancelled'],
    default: 'Pending'
  },
  payment: {
    provider: {
      type: String,
      enum: ['stripe'],
      default: 'stripe'
    },
    intentId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    method: String
  },
  customer: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  pickup: {
    code: {
      type: String,
      required: true
    },
    instructions: String,
    readyAt: Date,
    pickedUpAt: Date,
    pickedUpBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  notes: String
}, {
  timestamps: true
});

// Indexes for performance
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ 'payment.intentId': 1 });
OrderSchema.index({ 'pickup.code': 1 });

// Generate order number before saving
OrderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ME${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

export default mongoose.models.Order || mongoose.model<OrderDocument>('Order', OrderSchema);
