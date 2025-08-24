import AuditLog from '@/models/AuditLog';
import connectDB from '@/lib/mongodb';

export interface AuditLogData {
  actorId: string;
  actorName: string;
  action: string;
  targetType: 'product' | 'order' | 'user' | 'inventory' | 'system';
  targetId: string;
  before?: Record<string, any>;
  after?: Record<string, any>;
  ip: string;
  userAgent?: string;
}

export const createAuditLog = async (data: AuditLogData): Promise<void> => {
  try {
    await connectDB();
    await AuditLog.create(data);
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw error to avoid breaking the main operation
  }
};

export const getAuditLogs = async (filters: {
  actorId?: string;
  targetType?: string;
  targetId?: string;
  action?: string;
  page?: number;
  limit?: number;
}) => {
  await connectDB();
  
  const {
    actorId,
    targetType,
    targetId,
    action,
    page = 1,
    limit = 50
  } = filters;

  const query: any = {};
  
  if (actorId) query.actorId = actorId;
  if (targetType) query.targetType = targetType;
  if (targetId) query.targetId = targetId;
  if (action) query.action = { $regex: action, $options: 'i' };

  const skip = (page - 1) * limit;
  
  const [logs, total] = await Promise.all([
    AuditLog.find(query)
      .populate('actorId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    AuditLog.countDocuments(query)
  ]);

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};
