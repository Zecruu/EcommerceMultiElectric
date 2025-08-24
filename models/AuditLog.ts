import mongoose, { Schema, Document } from 'mongoose';
import { AuditLog as IAuditLog } from '@/types';

export interface AuditLogDocument extends IAuditLog, Document {}

const AuditLogSchema = new Schema<AuditLogDocument>({
  actorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  actorName: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  targetType: {
    type: String,
    enum: ['product', 'order', 'user', 'inventory', 'system'],
    required: true
  },
  targetId: {
    type: String,
    required: true
  },
  before: {
    type: Schema.Types.Mixed
  },
  after: {
    type: Schema.Types.Mixed
  },
  ip: {
    type: String,
    required: true
  },
  userAgent: String
}, {
  timestamps: true
});

// Indexes for audit trail queries
AuditLogSchema.index({ actorId: 1, createdAt: -1 });
AuditLogSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1, createdAt: -1 });
AuditLogSchema.index({ createdAt: -1 });

export default mongoose.models.AuditLog || mongoose.model<AuditLogDocument>('AuditLog', AuditLogSchema);
