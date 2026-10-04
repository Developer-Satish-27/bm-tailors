import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, createSessionToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { registerSchema } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: validated.email }, { phone: validated.phone }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_EXISTS', message: 'An account with this email or phone already exists.' } },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(validated.password);

    const user = await prisma.user.create({
      data: {
        email: validated.email,
        phone: validated.phone,
        passwordHash,
        role: 'CUSTOMER',
        profile: {
          create: {
            firstName: validated.firstName,
            lastName: validated.lastName,
            displayName: `${validated.firstName} ${validated.lastName}`,
          },
        },
      },
      include: { profile: true },
    });

    const token = createSessionToken(user.id, user.email, 'CUSTOMER');

    const res = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.profile?.displayName,
        },
      },
    });

    res.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: { code: 'REGISTRATION_ERROR', message: err instanceof Error ? err.message : 'Registration failed' } },
      { status: 400 }
    );
  }
}
