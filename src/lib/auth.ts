import { cookies } from 'next/headers';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from './db';

const AUTH_COOKIE_NAME = 'bm_tailors_session';
const AUTH_SECRET = process.env.AUTH_SECRET || 'bmt-secret-fallback-key-2026-safe-production';

export interface SessionPayload {
  userId: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  exp: number;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createSessionToken(userId: string, email: string, role: 'CUSTOMER' | 'ADMIN'): string {
  const payload: SessionPayload = {
    userId,
    email,
    role,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  };

  const dataStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(dataStr)
    .digest('base64url');

  return `${dataStr}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [dataStr, signature] = parts;

    const expectedSignature = crypto
      .createHmac('sha256', AUTH_SECRET)
      .update(dataStr)
      .digest('base64url');

    if (signature !== expectedSignature) return null;

    const payload: SessionPayload = JSON.parse(Buffer.from(dataStr, 'base64url').toString('utf8'));
    if (Date.now() > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}

export async function getSessionUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifySessionToken(token);
    if (!payload) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        profile: true,
      },
    });

    if (!user || !user.isActive) return null;
    return user;
  } catch {
    return null;
  }
}

export async function requireAuthUser() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

export async function requireAdminUser() {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    throw new Error('FORBIDDEN_ADMIN_ONLY');
  }
  return user;
}

export { AUTH_COOKIE_NAME };
