import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/services/product.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const size = searchParams.get('size') || undefined;
    const color = searchParams.get('color') || undefined;
    const fabric = searchParams.get('fabric') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const isBestSeller = searchParams.get('isBestSeller') === 'true' ? true : undefined;
    const isNewArrival = searchParams.get('isNewArrival') === 'true' ? true : undefined;
    const isOnSale = searchParams.get('isOnSale') === 'true' ? true : undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 24;

    const data = await ProductService.getProducts({
      categorySlug,
      search,
      size,
      color,
      fabric,
      minPrice,
      maxPrice,
      isBestSeller,
      isNewArrival,
      isOnSale,
      limit,
    });

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: { code: 'PRODUCTS_FETCH_ERROR', message: err instanceof Error ? err.message : 'Failed to fetch products' } },
      { status: 500 }
    );
  }
}
