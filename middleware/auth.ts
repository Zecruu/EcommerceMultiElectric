import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';
import { JWTPayload } from '@/types';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

export const authenticate = (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
  return async (req: AuthenticatedRequest): Promise<NextResponse> => {
    try {
      const authHeader = req.headers.get('authorization');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { success: false, error: 'No authorization token provided' },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7);
      const decoded = verifyAccessToken(token);
      
      req.user = decoded;
      return await handler(req);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
  };
};

export const requireRole = (roles: string | string[]) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  
  return (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
    return authenticate(async (req: AuthenticatedRequest): Promise<NextResponse> => {
      if (!req.user) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        );
      }

      if (!allowedRoles.includes(req.user.role)) {
        return NextResponse.json(
          { success: false, error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      return await handler(req);
    });
  };
};

export const requireCustomer = requireRole('customer');
export const requireEmployee = requireRole(['employee', 'admin']);
export const requireAdmin = requireRole('admin');
