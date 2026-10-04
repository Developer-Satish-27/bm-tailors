import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Mobile number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const addressSchema = z.object({
  label: z.string().default('Home'),
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  addressLine1: z.string().min(5, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().default('Jaipur'),
  state: z.string().default('Rajasthan'),
  pincode: z.string().regex(/^\d{6}$/, 'Please enter a valid 6-digit Indian PIN code'),
  isDefault: z.boolean().default(false),
});

export const checkoutSchema = z.object({
  addressId: z.string().optional(),
  newAddress: addressSchema.optional(),
  paymentMethod: z.enum(['UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'COD']),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

export const appointmentSchema = z.object({
  type: z.enum(['CUSTOM_TAILORING', 'WEDDING_CONSULTATION', 'MEASUREMENT', 'STORE_VISIT']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please select a valid date (YYYY-MM-DD)'),
  startTime: z.string().min(1, 'Please select a time slot'),
  customerName: z.string().min(2, 'Name is required'),
  customerPhone: z.string().min(10, 'Valid mobile number is required'),
  customerEmail: z.string().email('Valid email is required').optional().or(z.literal('')),
  notes: z.string().optional(),
});

export const uniformEnquirySchema = z.object({
  name: z.string().min(2, 'Contact person name is required'),
  organization: z.string().min(2, 'Organization name is required'),
  sector: z.string().min(2, 'Please select your industry sector'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email is required'),
  quantity: z.coerce.number().min(5, 'Minimum uniform enquiry is 5 pieces'),
  uniformType: z.string().min(2, 'Please specify uniform garment type'),
  fabricPreference: z.string().optional(),
  color: z.string().optional(),
  designRequirements: z.string().optional(),
  additionalRequirements: z.string().optional(),
});

export const customOrderSchema = z.object({
  customerName: z.string().min(2, 'Customer name is required'),
  customerPhone: z.string().min(10, 'Phone is required'),
  customerEmail: z.string().email().optional().or(z.literal('')),
  garmentType: z.string().min(2, 'Garment type is required'),
  fabric: z.string().optional(),
  color: z.string().optional(),
  collar: z.string().optional(),
  buttons: z.string().optional(),
  cuff: z.string().optional(),
  trouserStyle: z.string().optional(),
  suitStyle: z.string().optional(),
  fit: z.string().optional(),
  measurementProfileId: z.string().optional(),
  notes: z.string().optional(),
});

export const measurementProfileSchema = z.object({
  name: z.string().min(2, 'Profile label is required (e.g. Wedding Suit)'),
  garmentType: z.string().min(2, 'Garment type is required'),
  chest: z.coerce.number().positive().optional(),
  waist: z.coerce.number().positive().optional(),
  shoulder: z.coerce.number().positive().optional(),
  sleeve: z.coerce.number().positive().optional(),
  shirtLength: z.coerce.number().positive().optional(),
  trouserWaist: z.coerce.number().positive().optional(),
  trouserLength: z.coerce.number().positive().optional(),
  inseam: z.coerce.number().positive().optional(),
  thigh: z.coerce.number().positive().optional(),
  neck: z.coerce.number().positive().optional(),
  notes: z.string().optional(),
});

export const productAdminSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  slug: z.string().min(2, 'Slug is required'),
  shortDescription: z.string().optional(),
  description: z.string().min(10, 'Detailed description is required'),
  categoryId: z.string().min(1, 'Category is required'),
  basePrice: z.coerce.number().positive('Base price must be positive'),
  compareAtPrice: z.coerce.number().positive().optional().nullable(),
  fabricDetails: z.string().optional(),
  fitType: z.string().optional(),
  occasion: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isNewArrival: z.boolean().default(true),
  isOnSale: z.boolean().default(false),
  isActive: z.boolean().default(true),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});
