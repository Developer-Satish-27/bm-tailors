import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { productAdminSchema } from '@/lib/validation';

export async function GET() {
  try {
    await requireAdminUser();

    const products = await prisma.product.findMany({
      include: {
        category: true,
        media: { orderBy: { sortOrder: 'asc' } },
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: { products } });
  } catch (err: unknown) {
    const isAuth = err instanceof Error && (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN_ADMIN_ONLY');
    return NextResponse.json(
      { success: false, error: { code: isAuth ? 'FORBIDDEN' : 'SERVER_ERROR', message: isAuth ? 'Admin access required' : 'Error fetching products' } },
      { status: isAuth ? 403 : 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdminUser();
    const body = await req.json();

    const validated = productAdminSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        name: validated.name,
        slug: validated.slug,
        shortDescription: validated.shortDescription,
        description: validated.description,
        categoryId: validated.categoryId,
        basePrice: validated.basePrice,
        compareAtPrice: validated.compareAtPrice,
        fabricDetails: validated.fabricDetails,
        fitType: validated.fitType,
        occasion: validated.occasion,
        isFeatured: validated.isFeatured,
        isBestSeller: validated.isBestSeller,
        isNewArrival: validated.isNewArrival,
        isOnSale: validated.isOnSale,
        isActive: validated.isActive,
        seoTitle: validated.seoTitle,
        seoDescription: validated.seoDescription,
        media: {
          create: (body.images || []).map((img: { url: string; altText?: string }, idx: number) => ({
            url: img.url,
            altText: img.altText || validated.name,
            sortOrder: idx,
          })),
        },
        variants: {
          create: (body.variants || []).map((v: { sku: string; size: string; color: string; fabric?: string; price?: number; stockQuantity?: number }) => ({
            sku: v.sku,
            size: v.size,
            color: v.color,
            fabric: v.fabric || validated.fabricDetails,
            price: v.price || validated.basePrice,
            stockQuantity: v.stockQuantity || 0,
          })),
        },
      },
      include: {
        variants: true,
        media: true,
      },
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: 'CREATE_PRODUCT',
        entityType: 'PRODUCT',
        entityId: product.id,
        metadata: JSON.stringify({ name: product.name, slug: product.slug }),
      },
    });

    return NextResponse.json({ success: true, data: { product } });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: { code: 'PRODUCT_CREATION_FAILED', message: err instanceof Error ? err.message : 'Failed to create product' } },
      { status: 400 }
    );
  }
}
