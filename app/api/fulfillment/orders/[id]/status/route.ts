import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { requireEmployee, AuthenticatedRequest } from '@/middleware/auth';
import { createAuditLog } from '@/lib/audit';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  return requireEmployee(async (req: AuthenticatedRequest) => {
    try {
      await connectDB();

      const { status } = await req.json();
      const orderId = params.id;

      if (!status) {
        return NextResponse.json(
          { success: false, error: 'Status is required' },
          { status: 400 }
        );
      }

      const validStatuses = ['Paid', 'Preparing', 'Ready', 'PickedUp', 'Cancelled'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { success: false, error: 'Invalid status' },
          { status: 400 }
        );
      }

      // Find the order
      const order = await Order.findById(orderId);
      if (!order) {
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404 }
        );
      }

      const oldStatus = order.status;

      // Update order status
      order.status = status;
      
      // Set timestamps for specific statuses
      if (status === 'Ready') {
        order.pickup.readyAt = new Date();
      } else if (status === 'PickedUp') {
        order.pickup.pickedUpAt = new Date();
        order.pickup.pickedUpBy = req.user!.userId;
      }

      await order.save();

      // Create audit log
      await createAuditLog({
        actorId: req.user!.userId,
        actorName: req.user!.email,
        action: 'order.status_update',
        targetType: 'order',
        targetId: orderId,
        before: { status: oldStatus },
        after: { status: status },
        ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        userAgent: req.headers.get('user-agent') || undefined
      });

      return NextResponse.json({
        success: true,
        data: { 
          orderId,
          oldStatus,
          newStatus: status,
          updatedAt: new Date()
        }
      });

    } catch (error) {
      console.error('Order status update error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update order status' },
        { status: 500 }
      );
    }
  })(request);
}
