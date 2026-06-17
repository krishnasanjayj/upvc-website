import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'upvc_premium_secret_key_2026';

export interface AuthUser {
  id: number;
  username: string;
}

export function signToken(user: AuthUser): string {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '8h' });
}

export function verifyAuthToken(req: NextRequest): AuthUser | null {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch {
    return null;
  }
}

export function unauthorizedResponse(message = 'Access denied. No token provided.') {
  return NextResponse.json({ message }, { status: 401 });
}

export function forbiddenResponse(message = 'Invalid or expired token.') {
  return NextResponse.json({ message }, { status: 403 });
}

/** Extracts and verifies auth. Returns the user or an error NextResponse. */
export function requireAuth(req: NextRequest): AuthUser | NextResponse {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return unauthorizedResponse();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch {
    return forbiddenResponse();
  }
}
