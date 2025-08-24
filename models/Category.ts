import mongoose, { Schema, Document } from 'mongoose';
import { Category as ICategory } from '@/types';

export interface CategoryDocument extends ICategory, Document {}

const CategorySchema = new Schema<CategoryDocument>({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  image: String,
  active: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
CategorySchema.index({ slug: 1 });
CategorySchema.index({ parentId: 1, sortOrder: 1 });
CategorySchema.index({ active: 1, sortOrder: 1 });

export default mongoose.models.Category || mongoose.model<CategoryDocument>('Category', CategorySchema);
