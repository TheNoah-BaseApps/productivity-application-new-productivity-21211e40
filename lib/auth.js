import { verifyToken } from './jwt';

export async function verifyAuth(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token);
    
    if (!payload) {
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      role: payload.role
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

export function requireAuth(handler) {
  return async (request, context) => {
    const user = await verifyAuth(request);
    
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return handler(request, { ...context, user });
  };
}

export function requireRole(roles) {
  return (handler) => {
    return async (request, context) => {
      const user = await verifyAuth(request);
      
      if (!user) {
        return new Response(
          JSON.stringify({ success: false, error: 'Unauthorized' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (!roles.includes(user.role)) {
        return new Response(
          JSON.stringify({ success: false, error: 'Forbidden: Insufficient permissions' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return handler(request, { ...context, user });
    };
  };
}

export function isAdmin(user) {
  return user && user.role === 'admin';
}

export function isManager(user) {
  return user && (user.role === 'manager' || user.role === 'admin');
}

export function canApprove(user) {
  return isManager(user);
}