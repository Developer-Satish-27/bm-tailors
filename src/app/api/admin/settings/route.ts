import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    await requireAdminUser();

    const [settings, branches] = await Promise.all([
      prisma.storeSetting.findMany(),
      prisma.branch.findMany(),
    ]);

    const formattedSettings: Record<string, unknown> = {};
    for (const s of settings) {
      formattedSettings[s.key] = JSON.parse(s.valueJson);
    }

    return NextResponse.json({
      success: true,
      data: {
        settings: formattedSettings,
        branches,
      },
    });
  } catch (err: unknown) {
    const isAuth = err instanceof Error && (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN_ADMIN_ONLY');
    return NextResponse.json(
      { success: false, error: { code: isAuth ? 'FORBIDDEN' : 'SERVER_ERROR', message: isAuth ? 'Admin access required' : 'Settings fetch error' } },
      { status: isAuth ? 403 : 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdminUser();
    const { key, value } = await req.json();

    if (!key || !value) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Setting key and value are required.' } },
        { status: 400 }
      );
    }

    const updated = await prisma.storeSetting.upsert({
      where: { key },
      update: { valueJson: JSON.stringify(value) },
      create: {
        key,
        valueJson: JSON.stringify(value),
        description: `Configured via Admin Portal`,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: 'UPDATE_SETTINGS',
        entityType: 'SETTINGS',
        entityId: key,
        metadata: JSON.stringify({ key }),
      },
    });

    return NextResponse.json({ success: true, data: { setting: updated } });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: { code: 'UPDATE_FAILED', message: err instanceof Error ? err.message : 'Settings update failed' } },
      { status: 400 }
    );
  }
}
