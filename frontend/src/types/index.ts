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
  totalAmount: number;
  bookingStatus: string;
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
  role: 'CUSTOMER' | 'ADMIN';
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
