export interface Service {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  category: string;
  price: number;
  duration: number;
  image?: string;
  icon?: string;
  homeServiceAvailable: boolean;
  salonServiceAvailable: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  featured: boolean;
  sortOrder: number;
}

export interface Package {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  services: Service[] | string[];
  packagePrice: number;
  originalPrice?: number;
  duration: number;
  image?: string;
  status: 'ACTIVE' | 'INACTIVE';
  featured: boolean;
  sortOrder: number;
  validity?: string;
  terms?: string;
}

export interface Settings {
  whatsappNumber: string;
  whatsappMessageTemplate: string;
  businessName: string;
  phone: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  openingTime: string;
  closingTime: string;
  workingDays: string[];
  homeServiceFee: number;
  logoUrl: string;
}

export interface BookingCustomer {
  name: string;
  phone: string;
  email?: string;
}

export interface BookingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CreateBookingPayload {
  customer: BookingCustomer;
  serviceIds: string[];
  packageIds: string[];
  serviceType: 'HOME' | 'SALON';
  address?: BookingAddress;
  appointmentDate: string;
  timeSlot: string;
  notes?: string;
  couponCode?: string;
}

export interface BookedItem {
  refId: string;
  name: string;
  price: number;
}

export interface Booking {
  _id: string;
  bookingNumber: string;
  customer: BookingCustomer;
  services: BookedItem[];
  packages: BookedItem[];
  serviceType: 'HOME' | 'SALON';
  address?: BookingAddress;
  appointmentDate: string;
  timeSlot: string;
  subtotal: number;
  homeServiceFee: number;
  couponCode?: string | null;
  discountAmount?: number;
  totalAmount: number;
  bookingStatus: string;
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED';
  whatsappNumber: string;
  createdAt: string;
}

export interface CreateBookingResponse {
  booking: Booking;
  whatsappMessage: string;
  whatsappUrl: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  username?: string | null;
  role: 'CUSTOMER' | 'ADMIN';
}

export interface Coupon {
  _id: string;
  code: string;
  description?: string;
  type: 'PERCENTAGE' | 'FLAT';
  value: number;
  isActive: boolean;
  validFrom?: string | null;
  validUntil?: string | null;
  minOrderAmount: number;
  maxDiscountAmount?: number | null;
  usageLimit?: number | null;
  usedCount: number;
  createdAt?: string;
}

export interface AuthResponse {
  user: AdminUser;
  accessToken: string;
  refreshToken: string;
}

export interface Staff {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  image?: string;
  skills: string[];
  services: Service[] | string[];
  workingDays: string[];
  workingHours: { start: string; end: string };
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED';
  adminNotes?: string;
  createdAt: string;
}

export interface UserAddress {
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Profile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'ADMIN';
  addresses: UserAddress[];
  dateOfBirth?: string | null;
  gender?: 'FEMALE' | 'MALE' | 'OTHER' | null;
  profilePhoto?: string | null;
  createdAt?: string;
}

export interface Review {
  _id: string;
  booking: string;
  customer: { _id: string; name: string } | string;
  rating: number;
  comment: string;
  status: 'PENDING' | 'PUBLISHED' | 'REJECTED';
  createdAt: string;
}

export interface HeroContent {
  _id: string;
  heading: string;
  subheading: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Testimonial {
  _id: string;
  name: string;
  image?: string;
  rating: number;
  text: string;
  status: 'ACTIVE' | 'INACTIVE';
  sortOrder: number;
}

export interface Faq {
  _id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface TrustFeature {
  _id: string;
  icon: string;
  label: string;
  sortOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface DashboardStats {
  totalBookings: number;
  todaysBookings: number;
  upcomingBookings: number;
  pendingWhatsappConfirmations: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalCustomers: number;
  totalBookingValue: number;
  popularServices: { name: string; count: number }[];
  popularPackages: { name: string; count: number }[];
  recentBookings: Booking[];
}
