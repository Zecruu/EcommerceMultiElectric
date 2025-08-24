import mongoose, { Schema, Document } from 'mongoose';
import { Product as IProduct } from '@/types';

export interface ProductDocument extends IProduct, Document {}

const ProductSchema = new Schema<ProductDocument>({
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  compareAtPrice: {
    type: Number,
    min: [0, 'Compare at price cannot be negative']
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  images: [{
    type: String,
    required: true
  }],
  categoryIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }],
  specifications: {
    type: Map,
    of: String
  },
  hot: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  brand: {
    type: String,
    trim: true
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
ProductSchema.index({ sku: 1 });
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ categoryIds: 1 });
ProductSchema.index({ active: 1, featured: -1 });
ProductSchema.index({ hot: -1, createdAt: -1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ stock: 1 });

export default mongoose.models.Product || mongoose.model<ProductDocument>('Product', ProductSchema);
