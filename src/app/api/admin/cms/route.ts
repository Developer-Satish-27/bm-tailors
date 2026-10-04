import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    await requireAdminUser();

    const [cmsPages, storeSettings] = await Promise.all([
      prisma.cMSPage.findMany(),
      prisma.storeSetting.findMany(),
    ]);

    const formattedPages: Record<string, any> = {};
    for (const page of cmsPages) {
      try {
        formattedPages[page.slug] = {
          ...page,
          content: JSON.parse(page.contentJson),
        };
      } catch {
        formattedPages[page.slug] = {
          ...page,
          content: page.contentJson,
        };
      }
    }

    const formattedSettings: Record<string, any> = {};
    for (const setting of storeSettings) {
      try {
        formattedSettings[setting.key] = JSON.parse(setting.valueJson);
      } catch {
        formattedSettings[setting.key] = setting.valueJson;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        pages: formattedPages,
        settings: formattedSettings,
      },
    });
  } catch (err: unknown) {
    const isAuth = err instanceof Error && (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN_ADMIN_ONLY');
    return NextResponse.json(
      { success: false, error: { code: isAuth ? 'FORBIDDEN' : 'SERVER_ERROR', message: isAuth ? 'Admin access required' : 'Error fetching CMS data' } },
      { status: isAuth ? 403 : 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdminUser();
    const { slug, title, content, seoTitle, seoDesc } = await req.json();

    if (!slug || !content) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Slug and content are required.' } },
        { status: 400 }
      );
    }

    const updated = await prisma.cMSPage.upsert({
      where: { slug },
      update: {
        ...(title ? { title } : {}),
        contentJson: typeof content === 'string' ? content : JSON.stringify(content),
        ...(seoTitle !== undefined ? { seoTitle } : {}),
        ...(seoDesc !== undefined ? { seoDesc } : {}),
      },
      create: {
        slug,
        title: title || slug,
        contentJson: typeof content === 'string' ? content : JSON.stringify(content),
        seoTitle,
        seoDesc,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: 'UPDATE_CMS_PAGE',
        entityType: 'CMS_PAGE',
        entityId: slug,
        metadata: JSON.stringify({ slug, title }),
      },
    });

    return NextResponse.json({ success: true, data: { page: updated } });
  } catch (err: unknown) {
    const isAuth = err instanceof Error && (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN_ADMIN_ONLY');
    return NextResponse.json(
      { success: false, error: { code: isAuth ? 'FORBIDDEN' : 'UPDATE_FAILED', message: err instanceof Error ? err.message : 'CMS update failed' } },
      { status: isAuth ? 403 : 400 }
    );
  }
}
