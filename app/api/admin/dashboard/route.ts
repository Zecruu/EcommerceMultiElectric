import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { requireAdmin } from '@/middleware/auth';

export const GET = requireAdmin(async (request) => {
  try {
    await connectDB();

    // Get dashboard statistics
    const [
      totalOrders,
      totalRevenue,
      totalProducts,
      totalUsers,
      recentOrders,
      lowStockProducts
    ] = await Promise.all([
      // Total orders count
      Order.countDocuments(),
      
      // Total revenue from completed orders
      Order.aggregate([
        { $match: { status: { $in: ['Paid', 'Preparing', 'Ready', 'PickedUp'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]).then(result => result[0]?.total || 0),
      
      // Total active products
      Product.countDocuments({ active: true }),
      
      // Total users
      User.countDocuments(),
      
      // Recent orders (last 10)
      Order.find()
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(10)
        .select('orderNumber customer total status createdAt')
        .lean(),
      
      // Low stock products (stock <= 10)
      Product.find({ 
        active: true, 
        stock: { $lte: 10 } 
      })
        .select('name sku stock')
        .sort({ stock: 1 })
        .limit(10)
        .lean()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        totalProducts,
        totalUsers,
        recentOrders,
        lowStockProducts
      }
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
});
