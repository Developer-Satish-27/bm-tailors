import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ success: true, data: { user: null } });
  }

  return NextResponse.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        firstName: user.profile?.firstName,
        lastName: user.profile?.lastName,
        displayName: user.profile?.displayName,
      },
    },
  });
}
