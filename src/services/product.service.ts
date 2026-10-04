import { prisma } from '../lib/db';

export interface ProductFilterParams {
  categorySlug?: string;
  size?: string;
  color?: string;
  fabric?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isOnSale?: boolean;
  isFeatured?: boolean;
  limit?: number;
  offset?: number;
}

export class ProductService {
  static async getProducts(params: ProductFilterParams = {}) {
    const {
      categorySlug,
      size,
      color,
      fabric,
      search,
      minPrice,
      maxPrice,
      isBestSeller,
      isNewArrival,
      isOnSale,
      isFeatured,
      limit = 24,
      offset = 0,
    } = params;

    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (isBestSeller !== undefined) where.isBestSeller = isBestSeller;
    if (isNewArrival !== undefined) where.isNewArrival = isNewArrival;
    if (isOnSale !== undefined) where.isOnSale = isOnSale;
    if (isFeatured !== undefined) where.isFeatured = isFeatured;

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.basePrice = {
        ...(minPrice !== undefined ? { gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { fabricDetails: { contains: search } },
        { occasion: { contains: search } },
        { category: { name: { contains: search } } },
      ];
    }

    // Variant filters (size, color, fabric)
    if (size || color || fabric) {
      where.variants = {
        some: {
          isActive: true,
          ...(size ? { size: { contains: size } } : {}),
          ...(color ? { color: { contains: color } } : {}),
          ...(fabric ? { fabric: { contains: fabric } } : {}),
        },
      };
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          media: {
            orderBy: { sortOrder: 'asc' },
          },
          variants: {
            where: { isActive: true },
          },
          reviews: {
            where: { status: 'APPROVED' },
            select: { rating: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.product.count({ where }),
    ]);

    // Calculate rating averages
    const enriched = products.map((p) => {
      const avgRating =
        p.reviews.length > 0
          ? Number((p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length).toFixed(1))
          : 5.0; // default luxury standard display
      return {
        ...p,
        rating: avgRating,
        reviewCount: p.reviews.length,
      };
    });

    return {
      products: enriched,
      totalCount,
    };
  }

  static async getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        media: {
          orderBy: { sortOrder: 'asc' },
        },
        variants: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
        },
        reviews: {
          where: { status: 'APPROVED' },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product || !product.isActive) return null;

    const avgRating =
      product.reviews.length > 0
        ? Number((product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1))
        : 5.0;

    return {
      ...product,
      rating: avgRating,
      reviewCount: product.reviews.length,
    };
  }

  static async getBestSellers(limit = 8) {
    return this.getProducts({ isBestSeller: true, limit });
  }

  static async getRelatedProducts(categoryId: string, excludeProductId: string, limit = 4) {
    const products = await prisma.product.findMany({
      where: {
        categoryId,
        id: { not: excludeProductId },
        isActive: true,
      },
      include: {
        category: true,
        media: { orderBy: { sortOrder: 'asc' } },
        variants: { where: { isActive: true } },
      },
      take: limit,
    });
    return products;
  }
}
