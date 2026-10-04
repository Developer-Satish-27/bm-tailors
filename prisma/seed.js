const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding B M Tailors database...');

  // 1. Seed Store Settings
  const settings = [
    {
      key: 'business_info',
      valueJson: JSON.stringify({
        brandName: 'B M Tailors',
        tagline: 'Crafting Confidence Since 1990',
        establishedYear: 1990,
        heritageStatement: 'Combining decades of Jaipur tailoring craftsmanship with modern bespoke precision.',
        phone: '[BUSINESS PHONE]',
        whatsapp: '[WHATSAPP NUMBER]',
        email: '[BUSINESS EMAIL]',
        city: 'Jaipur',
        state: 'Rajasthan',
        country: 'India',
        branchCount: 2,
        currencySymbol: '₹',
        currencyCode: 'INR',
      }),
      description: 'Core brand identity and contact settings',
    },
    {
      key: 'shipping_rules',
      valueJson: JSON.stringify({
        cityScope: 'Urban Jaipur (Phase 1: Expanding to Rajasthan and Pan India)',
        standardShippingFee: 99,
        freeShippingThreshold: 2999,
        codAvailable: true,
        codFee: 120,
        estimatedDeliveryDays: '2 - 4 Business Days in Jaipur',
        supportedPincodes: ['302001', '302002', '302003', '302004', '302005', '302006', '302012', '302015', '302017', '302018', '302019', '302020', '302021'],
      }),
      description: 'Shipping charges and COD fee rules',
    },
    {
      key: 'exchange_policy',
      valueJson: JSON.stringify({
        readyMadeAllowed: true,
        exchangeWindowDays: 7,
        codOrdersExchangeable: false,
        customTailoredExchangeable: false,
        conditionNotice: 'Garment must be unworn, undamaged, with original tags intact and invoice attached.',
        importantNotice: 'IMPORTANT: Cash on Delivery (COD) orders and Custom Made-to-Measure garments are strictly NOT eligible for return or exchange.',
      }),
      description: 'Official exchange and return eligibility rules',
    },
    {
      key: 'gst_config',
      valueJson: JSON.stringify({
        isGstActive: false,
        gstin: '[GSTIN NOT CONFIGURED YET]',
        cgstPercent: 6,
        sgstPercent: 6,
        igstPercent: 12,
        defaultHsn: '6203',
        invoicePrefix: 'BMT/2026/',
      }),
      description: 'Future-ready GST tax configuration',
    },
    {
      key: 'appointment_config',
      valueJson: JSON.stringify({
        slots: ['10:30 AM', '12:00 PM', '02:30 PM', '04:30 PM', '06:30 PM', '08:00 PM'],
        durationMinutes: 45,
        maxPerSlot: 2,
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      }),
      description: 'Appointment slot and timing availability',
    },
  ];

  for (const s of settings) {
    await prisma.storeSetting.upsert({
      where: { key: s.key },
      update: { valueJson: s.valueJson, description: s.description },
      create: s,
    });
  }

  // 2. Seed Branches (Hidden by default as per requirement #39)
  const branches = [
    {
      id: 'branch-jaipur-1',
      name: 'B M Tailors — Flagship Atelier (Branch 1)',
      address: '[FLAGSHIP STORE ADDRESS, JAIPUR, RAJASTHAN]',
      phone: '[BUSINESS PHONE]',
      whatsapp: '[WHATSAPP NUMBER]',
      mapsUrl: null,
      openingHoursJson: JSON.stringify({ days: 'Mon - Sun', hours: '10:30 AM - 9:00 PM' }),
      isActive: false,
    },
    {
      id: 'branch-jaipur-2',
      name: 'B M Tailors — Studio & Workshop (Branch 2)',
      address: '[STUDIO WORKSHOP ADDRESS, JAIPUR, RAJASTHAN]',
      phone: '[BUSINESS PHONE]',
      whatsapp: '[WHATSAPP NUMBER]',
      mapsUrl: null,
      openingHoursJson: JSON.stringify({ days: 'Mon - Sat', hours: '10:30 AM - 8:30 PM' }),
      isActive: false,
    },
  ];

  for (const b of branches) {
    await prisma.branch.upsert({
      where: { id: b.id },
      update: b,
      create: b,
    });
  }

  // 3. Seed Users (Admin & Customer)
  const adminPassword = await bcrypt.hash('BMTailors@Admin1990!', 10);
  const customerPassword = await bcrypt.hash('Customer1990!', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@bmtailors.com' },
    update: {},
    create: {
      email: 'admin@bmtailors.com',
      phone: '+919999900001',
      passwordHash: adminPassword,
      role: 'ADMIN',
      profile: {
        create: {
          firstName: 'B M Tailors',
          lastName: 'Administration',
          displayName: 'Master Tailor Admin',
          preferredLanguage: 'en',
        },
      },
    },
  });

  const demoCustomer = await prisma.user.upsert({
    where: { email: 'customer@bmtailors.com' },
    update: {},
    create: {
      email: 'customer@bmtailors.com',
      phone: '+919999900002',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
      profile: {
        create: {
          firstName: 'Rohit',
          lastName: 'Sharma',
          displayName: 'Rohit Sharma',
          preferredLanguage: 'en',
        },
      },
      addresses: {
        create: {
          label: 'Home',
          fullName: 'Rohit Sharma',
          phone: '+919999900002',
          addressLine1: 'Flat 402, Royal Palms Apartment',
          addressLine2: 'Near Central Park, C-Scheme',
          landmark: 'Statue Circle',
          city: 'Jaipur',
          state: 'Rajasthan',
          pincode: '302005',
          country: 'India',
          isDefault: true,
        },
      },
    },
  });

  // 4. Seed Categories
  const categoriesData = [
    {
      name: "Men's Western Wear",
      slug: 'mens-western-wear',
      description: 'Impeccable blazers, formal trousers, tailored shirts, and sharp western silhouettes.',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      sortOrder: 1,
      seoTitle: "Men's Western Wear in Jaipur | B M Tailors",
      seoDescription: "Shop luxury men's western suits, trousers, and shirts crafted with royal precision.",
    },
    {
      name: 'Indian Wear',
      slug: 'indian-wear',
      description: 'Timeless kurtas, Bandis, pathani suits, and traditional gentleman attire.',
      image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
      sortOrder: 2,
      seoTitle: 'Indian Ethnic Wear for Men | B M Tailors Jaipur',
      seoDescription: 'Handcrafted Indian kurtas and ethnic ensembles with heritage Rajasthani craftsmanship.',
    },
    {
      name: 'Traditional / Ethnic Wear',
      slug: 'traditional-ethnic-wear',
      description: 'Royal Rajasthani Angrakhas, regal Bandhgalas, and festive classics since 1990.',
      image: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=800&q=80',
      sortOrder: 3,
      seoTitle: 'Traditional Rajasthani Ethnic Wear | B M Tailors',
      seoDescription: 'Authentic royal traditional wear crafted in Jaipur for special celebrations.',
    },
    {
      name: 'Indo-Western',
      slug: 'indo-western',
      description: 'Contemporary fusion achkans, asymmetric silhouettes, and statement party wear.',
      image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
      sortOrder: 4,
      seoTitle: 'Indo-Western Groom & Party Outfits | B M Tailors Jaipur',
      seoDescription: 'Sleek Indo-Western menswear combining European tailoring with Indian royal fabrics.',
    },
    {
      name: 'Suits & Tuxedos',
      slug: 'suits-tuxedos',
      description: 'Bespoke two-piece, three-piece executive suits, and satin lapel evening tuxedos.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      sortOrder: 5,
      seoTitle: 'Bespoke Suits & Luxury Tuxedos Jaipur | B M Tailors',
      seoDescription: 'Handcrafted tuxedos and three-piece suits made with premium merino wool and Italian cuts.',
    },
    {
      name: 'Sherwani',
      slug: 'sherwani',
      description: 'Masterpiece groom sherwanis, intricately hand-embroidered royal wedding ensembles.',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      sortOrder: 6,
      seoTitle: 'Royal Groom Sherwanis Jaipur | B M Tailors Since 1990',
      seoDescription: 'Signature groom wedding sherwanis and accessories crafted in the Pink City.',
    },
    {
      name: "Boys Collection",
      slug: 'boys-collection',
      description: 'Little gentlemen collection featuring celebratory suits, kurtas, and miniature sherwanis.',
      image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=800&q=80',
      sortOrder: 7,
      seoTitle: "Boys Wedding & Formal Wear | B M Tailors Jaipur",
      seoDescription: "Premium comfortable formal and ethnic clothing tailored for young boys and teens.",
    },
    {
      name: 'Ready-made',
      slug: 'ready-made',
      description: 'Ready-to-wear tailored shirts, everyday trousers, safari suits, and festive kurtas.',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      sortOrder: 8,
      seoTitle: 'Ready-to-Wear Premium Men’s Fashion | B M Tailors',
      seoDescription: 'Immediate delivery ready-made men’s fashion crafted to our exacting tailoring standards.',
    },
  ];

  const catMap = {};
  for (const c of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
    catMap[c.slug] = created.id;
  }

  // 5. Seed Real Products with Variants & Media
  const products = [
    {
      name: 'Royal Jodhpur Bandhgala Suit',
      slug: 'royal-jodhpur-bandhgala-suit',
      shortDescription: 'Classic Rajasthani imperial Bandhgala suit in rich Italian wool blend with antique brass crested buttons.',
      description: 'Crafted with master tailoring heritage since 1990, this Royal Jodhpur Bandhgala features a structured Mandarin collar, hand-finished pocket jets, and a tailored slim silhouette. Suitable for grand receptions, black-tie dinners, and royal celebrations.',
      categoryId: catMap['traditional-ethnic-wear'],
      basePrice: 12499,
      compareAtPrice: 15999,
      fabricDetails: 'Premium Italian Merino Wool Blend (320 GSM)',
      fitType: 'Tailored Slim Fit',
      occasion: 'Wedding Receptions & Formal Galas',
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      media: [
        { url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80', sortOrder: 0, altText: 'Royal Jodhpur Bandhgala Suit' },
        { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80', sortOrder: 1, altText: 'Bandhgala Collar Detail' },
      ],
      variants: [
        { sku: 'BMT-JODH-NAVY-38', size: '38 (S)', color: 'Midnight Navy', fabric: 'Italian Wool Blend', fit: 'Tailored Slim Fit', price: 12499, compareAtPrice: 15999, stockQuantity: 8 },
        { sku: 'BMT-JODH-NAVY-40', size: '40 (M)', color: 'Midnight Navy', fabric: 'Italian Wool Blend', fit: 'Tailored Slim Fit', price: 12499, compareAtPrice: 15999, stockQuantity: 12 },
        { sku: 'BMT-JODH-NAVY-42', size: '42 (L)', color: 'Midnight Navy', fabric: 'Italian Wool Blend', fit: 'Tailored Slim Fit', price: 12499, compareAtPrice: 15999, stockQuantity: 7 },
        { sku: 'BMT-JODH-BLK-40', size: '40 (M)', color: 'Imperial Black', fabric: 'Italian Wool Blend', fit: 'Tailored Slim Fit', price: 12499, compareAtPrice: 15999, stockQuantity: 9 },
      ],
    },
    {
      name: 'Imperial Hand-Embroidered Groom Sherwani Set',
      slug: 'imperial-hand-embroidered-groom-sherwani-set',
      shortDescription: 'Regal ivory raw silk sherwani adorned with tonal threadwork, paired with matching churidar and stole.',
      description: 'The pinnacle of B M Tailors wedding craftsmanship. Handcrafted in Jaipur with exquisite French knot detailing, a stiffened regal collar, and handcrafted silk potli buttons. Designed exclusively for grooms who demand timeless grandeur.',
      categoryId: catMap['sherwani'],
      basePrice: 28999,
      compareAtPrice: 35000,
      fabricDetails: 'Pure Raw Silk with Tonal Zari & Resham Embroidery',
      fitType: 'Royal Bespoke Silhouette',
      occasion: 'Wedding Day / Groom Ceremony',
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      media: [
        { url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80', sortOrder: 0, altText: 'Imperial Groom Sherwani' },
      ],
      variants: [
        { sku: 'BMT-SHER-IVR-38', size: '38 (S)', color: 'Ivory Gold', fabric: 'Raw Silk', fit: 'Royal Bespoke', price: 28999, compareAtPrice: 35000, stockQuantity: 4 },
        { sku: 'BMT-SHER-IVR-40', size: '40 (M)', color: 'Ivory Gold', fabric: 'Raw Silk', fit: 'Royal Bespoke', price: 28999, compareAtPrice: 35000, stockQuantity: 6 },
        { sku: 'BMT-SHER-IVR-42', size: '42 (L)', color: 'Ivory Gold', fabric: 'Raw Silk', fit: 'Royal Bespoke', price: 28999, compareAtPrice: 35000, stockQuantity: 5 },
      ],
    },
    {
      name: 'Satin Peak Lapel Black-Tie Tuxedo (2-Piece)',
      slug: 'satin-peak-lapel-black-tie-tuxedo',
      shortDescription: 'Sleek black tuxedo featuring pure silk satin peak lapels, single satin-covered button, and matching trousers.',
      description: 'Architected for the modern gentleman. Built with floating canvas chest construction for natural drape, dual side vents, and satin piping along the trouser outseams. Ideal for cocktail galas, sangeet evenings, and black-tie affairs.',
      categoryId: catMap['suits-tuxedos'],
      basePrice: 16999,
      compareAtPrice: 21999,
      fabricDetails: 'Super 120s Fine Wool with Pure Silk Satin Facing',
      fitType: 'Modern Euro-Slim Fit',
      occasion: 'Black Tie / Cocktail / Sangeet',
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
      media: [
        { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80', sortOrder: 0, altText: 'Satin Peak Lapel Tuxedo' },
      ],
      variants: [
        { sku: 'BMT-TUX-BLK-38', size: '38 (S)', color: 'Obsidian Black', fabric: 'Super 120s Wool', fit: 'Euro-Slim Fit', price: 16999, compareAtPrice: 21999, stockQuantity: 5 },
        { sku: 'BMT-TUX-BLK-40', size: '40 (M)', color: 'Obsidian Black', fabric: 'Super 120s Wool', fit: 'Euro-Slim Fit', price: 16999, compareAtPrice: 21999, stockQuantity: 7 },
        { sku: 'BMT-TUX-BLK-42', size: '42 (L)', color: 'Obsidian Black', fabric: 'Super 120s Wool', fit: 'Euro-Slim Fit', price: 16999, compareAtPrice: 21999, stockQuantity: 4 },
        { sku: 'BMT-TUX-BLK-44', size: '44 (XL)', color: 'Obsidian Black', fabric: 'Super 120s Wool', fit: 'Euro-Slim Fit', price: 16999, compareAtPrice: 21999, stockQuantity: 3 },
      ],
    },
    {
      name: 'Asymmetric Indo-Western Achkan with Brocade Details',
      slug: 'asymmetric-indo-western-achkan',
      shortDescription: 'Contemporary overlapping achkan with subtle Banarasi brocade inner panel and welt pockets.',
      description: 'Bridging timeless Indian opulence and clean contemporary tailoring. Structured with high armholes and a dramatic asymmetric front placket with handcrafted metallic buttons.',
      categoryId: catMap['indo-western'],
      basePrice: 14499,
      compareAtPrice: 18000,
      fabricDetails: 'Textured Poly-Viscose Suiting with Banarasi Silk Accent',
      fitType: 'Structured Slim Fit',
      occasion: 'Sangeet, Engagement & Cocktail',
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: true,
      media: [
        { url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=80', sortOrder: 0, altText: 'Asymmetric Indo-Western Achkan' },
      ],
      variants: [
        { sku: 'BMT-INDO-WINE-38', size: '38 (S)', color: 'Wine Burgundy', fabric: 'Textured Suiting', fit: 'Structured Slim Fit', price: 14499, compareAtPrice: 18000, stockQuantity: 6 },
        { sku: 'BMT-INDO-WINE-40', size: '40 (M)', color: 'Wine Burgundy', fabric: 'Textured Suiting', fit: 'Structured Slim Fit', price: 14499, compareAtPrice: 18000, stockQuantity: 8 },
        { sku: 'BMT-INDO-WINE-42', size: '42 (L)', color: 'Wine Burgundy', fabric: 'Textured Suiting', fit: 'Structured Slim Fit', price: 14499, compareAtPrice: 18000, stockQuantity: 5 },
      ],
    },
    {
      name: 'Executive Three-Piece Charcoal Tweed Suit',
      slug: 'executive-three-piece-charcoal-tweed-suit',
      shortDescription: 'Timeless business suit consisting of tailored jacket, double-breasted vest, and flat-front trousers.',
      description: 'Engineered for executive authority. Constructed using breathable wool-blend fabric designed for day-long comfort in boardrooms, client presentations, and prestigious meetings.',
      categoryId: catMap['mens-western-wear'],
      basePrice: 15499,
      compareAtPrice: 19500,
      fabricDetails: 'Fine Tweed Wool Blend (280 GSM)',
      fitType: 'Classic Tailored Fit',
      occasion: 'Corporate / Business / Formal',
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      media: [
        { url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80', sortOrder: 0, altText: 'Executive Three-Piece Suit' },
      ],
      variants: [
        { sku: 'BMT-3PC-CHAR-38', size: '38 (S)', color: 'Charcoal Grey', fabric: 'Tweed Wool Blend', fit: 'Classic Tailored', price: 15499, compareAtPrice: 19500, stockQuantity: 7 },
        { sku: 'BMT-3PC-CHAR-40', size: '40 (M)', color: 'Charcoal Grey', fabric: 'Tweed Wool Blend', fit: 'Classic Tailored', price: 15499, compareAtPrice: 19500, stockQuantity: 11 },
        { sku: 'BMT-3PC-CHAR-42', size: '42 (L)', color: 'Charcoal Grey', fabric: 'Tweed Wool Blend', fit: 'Classic Tailored', price: 15499, compareAtPrice: 19500, stockQuantity: 8 },
      ],
    },
    {
      name: 'Pure Linen Royal Festive Kurta Set',
      slug: 'pure-linen-royal-festive-kurta-set',
      shortDescription: 'Breathable 100% French linen kurta with concealed placket and tapered cotton churidar.',
      description: 'Understated luxury for festive mornings, pujas, and family gatherings. Crafted in pure linen with hand-stitched detailing along the cuffs and collar.',
      categoryId: catMap['indian-wear'],
      basePrice: 4499,
      compareAtPrice: 5999,
      fabricDetails: '100% Pure French Linen (60s count)',
      fitType: 'Comfort Regular Fit',
      occasion: 'Festive / Haldi / Family Gathering',
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: true,
      media: [
        { url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1200&q=80', sortOrder: 0, altText: 'Pure Linen Festive Kurta Set' },
      ],
      variants: [
        { sku: 'BMT-KURT-MUST-38', size: '38 (S)', color: 'Ochre Yellow', fabric: '100% Pure Linen', fit: 'Comfort Regular', price: 4499, compareAtPrice: 5999, stockQuantity: 14 },
        { sku: 'BMT-KURT-MUST-40', size: '40 (M)', color: 'Ochre Yellow', fabric: '100% Pure Linen', fit: 'Comfort Regular', price: 4499, compareAtPrice: 5999, stockQuantity: 18 },
        { sku: 'BMT-KURT-MUST-42', size: '42 (L)', color: 'Ochre Yellow', fabric: '100% Pure Linen', fit: 'Comfort Regular', price: 4499, compareAtPrice: 5999, stockQuantity: 10 },
      ],
    },
    {
      name: "Boys Royal Heritage Kurta Jacket Set",
      slug: 'boys-royal-heritage-kurta-jacket-set',
      shortDescription: 'Regal printed Nehru jacket, comfortable silk-blend kurta, and elasticated churidar for young boys.',
      description: 'Crafted with soft cotton inner lining to keep young boys comfortable throughout wedding ceremonies and festivals. Easy-to-wear tailored fit with elegant brocade accents.',
      categoryId: catMap['boys-collection'],
      basePrice: 3899,
      compareAtPrice: 4999,
      fabricDetails: 'Silk Blend with Breathable 100% Cotton Lining',
      fitType: 'Boys Comfort Fit',
      occasion: 'Weddings & Celebrations',
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: true,
      media: [
        { url: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=1200&q=80', sortOrder: 0, altText: "Boys Royal Heritage Kurta Jacket Set" },
      ],
      variants: [
        { sku: 'BMT-BOY-6Y', size: '6-7 Years', color: 'Maroon & Cream', fabric: 'Silk Blend', fit: 'Kids Comfort', price: 3899, compareAtPrice: 4999, stockQuantity: 8 },
        { sku: 'BMT-BOY-8Y', size: '8-9 Years', color: 'Maroon & Cream', fabric: 'Silk Blend', fit: 'Kids Comfort', price: 3899, compareAtPrice: 4999, stockQuantity: 9 },
        { sku: 'BMT-BOY-10Y', size: '10-11 Years', color: 'Maroon & Cream', fabric: 'Silk Blend', fit: 'Kids Comfort', price: 3899, compareAtPrice: 4999, stockQuantity: 6 },
      ],
    },
    {
      name: 'Tailored Everyday Egyptian Cotton Shirt',
      slug: 'tailored-everyday-egyptian-cotton-shirt',
      shortDescription: 'Crisp white formal shirt with cutaway collar, mother-of-pearl buttons, and double-needle stitching.',
      description: 'The foundation of the modern gentleman’s wardrobe. Woven from 120/2 two-ply Giza Egyptian cotton, offering a smooth finish, wrinkle resistance, and impeccable breathability.',
      categoryId: catMap['ready-made'],
      basePrice: 2299,
      compareAtPrice: 2999,
      fabricDetails: '100% Giza Egyptian Cotton (120/2 Two-Ply)',
      fitType: 'Smart Tailored Fit',
      occasion: 'Business & Daily Sophistication',
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      media: [
        { url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80', sortOrder: 0, altText: 'Tailored Egyptian Cotton Shirt' },
      ],
      variants: [
        { sku: 'BMT-SHIRT-WHT-39', size: '39 (M / 15.5")', color: 'Crisp White', fabric: '100% Giza Cotton', fit: 'Smart Tailored Fit', price: 2299, compareAtPrice: 2999, stockQuantity: 20 },
        { sku: 'BMT-SHIRT-WHT-40', size: '40 (L / 16.0")', color: 'Crisp White', fabric: '100% Giza Cotton', fit: 'Smart Tailored Fit', price: 2299, compareAtPrice: 2999, stockQuantity: 25 },
        { sku: 'BMT-SHIRT-WHT-42', size: '42 (XL / 16.5")', color: 'Crisp White', fabric: '100% Giza Cotton', fit: 'Smart Tailored Fit', price: 2299, compareAtPrice: 2999, stockQuantity: 18 },
      ],
    },
  ];

  for (const p of products) {
    const { media, variants, ...prodData } = p;
    const createdProduct = await prisma.product.upsert({
      where: { slug: prodData.slug },
      update: prodData,
      create: prodData,
    });

    // Seed Media
    for (const m of media) {
      const existingMedia = await prisma.productMedia.findFirst({
        where: { productId: createdProduct.id, url: m.url },
      });
      if (!existingMedia) {
        await prisma.productMedia.create({
          data: {
            productId: createdProduct.id,
            url: m.url,
            sortOrder: m.sortOrder,
            altText: m.altText,
          },
        });
      }
    }

    // Seed Variants
    for (const v of variants) {
      await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          stockQuantity: v.stockQuantity,
          size: v.size,
          color: v.color,
          fabric: v.fabric,
          fit: v.fit,
        },
        create: {
          ...v,
          productId: createdProduct.id,
        },
      });
    }
  }

  // 6. Seed Coupons
  const coupons = [
    {
      code: 'ROYAL10',
      type: 'PERCENTAGE',
      value: 10,
      minimumCartValue: 1999,
      maximumDiscount: 1500,
      usageLimit: 1000,
      isActive: true,
    },
    {
      code: 'JAIPUR500',
      type: 'FIXED',
      value: 500,
      minimumCartValue: 4999,
      maximumDiscount: 500,
      usageLimit: 500,
      isActive: true,
    },
  ];

  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });
  }

  // 7. Seed CMS Pages
  const cmsPages = [
    {
      slug: 'brand-heritage',
      title: 'Crafting Confidence Since 1990 — The B M Tailors Story',
      contentJson: JSON.stringify({
        heading: 'Crafting Confidence Since 1990',
        subheading: 'Decades of Jaipur Tailoring Heritage & Modern Bespoke Artistry',
        introText: 'For more than three decades, B M Tailors has stood as a hallmark of bespoke men’s tailoring and refined sartorial elegance in Jaipur, Rajasthan. What began in 1990 as a passion for personalized fitting has grown into an esteemed tailoring house trusted across generations.',
        pillars: [
          { title: 'Jaipur Heritage', desc: 'Rooted in the timeless royal sartorial culture of the Pink City.' },
          { title: 'Master Craftsmanship', desc: 'Decades of hands-on cutting, drafting, and finishing expertise.' },
          { title: 'Modern Precision', desc: 'Contemporary cuts and global styling tailored to your distinct identity.' },
        ],
      }),
      seoTitle: 'Brand Story | B M Tailors Jaipur Since 1990',
      seoDesc: 'Discover the heritage, craftsmanship, and bespoke tailoring tradition of B M Tailors in Jaipur.',
    },
    {
      slug: 'policies',
      title: 'Policies & Customer Protection',
      contentJson: JSON.stringify({
        exchange: 'Ready-made purchases are eligible for exchange within 7 days in unworn condition with original tags. IMPORTANT: Cash on Delivery (COD) orders and Custom Made-to-Measure garments are strictly non-exchangeable.',
        shipping: 'Urban Jaipur orders are dispatched promptly and delivered within 2-4 business days. Regional and Pan-India delivery options are being expanded.',
        cancellation: 'Ready-made orders may be cancelled before shipment. Custom tailoring orders can be cancelled or adjusted during initial consultation before fabric cutting begins.',
      }),
      seoTitle: 'Store Policies & Exchange Terms | B M Tailors',
      seoDesc: 'Read our transparent policies on 7-day exchanges, COD restrictions, custom tailoring consultations, and shipping.',
    },
  ];

  for (const p of cmsPages) {
    await prisma.cMSPage.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  console.log('B M Tailors database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
