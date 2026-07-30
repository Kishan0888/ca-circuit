// User Roles
export type UserRole = 'visitor' | 'registered' | 'ca' | 'admin';

// Opportunity Status
export type OpportunityStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'published' | 'archived';

// Business Type
export type BusinessType = 'partnership' | 'franchise' | 'investment' | 'consulting' | 'advisory' | 'audit' | 'tax' | 'other';

// Investment Range
export type InvestmentRange = 'under-10l' | '10l-50l' | '50l-1cr' | '1cr-5cr' | '5cr-10cr' | 'above-10cr';

// User Interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  profileImage?: string;
  companyName?: string;
  designation?: string;
  city?: string;
  state?: string;
  membershipType?: 'free' | 'premium' | 'enterprise';
  membershipExpiry?: Date;
  isVerified: boolean;
  isSuspended?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Category Interface
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Opportunity Interface
export interface Opportunity {
  id: string;
  title: string;
  slug: string;
  category: string;
  categoryId: string;
  industry: string;
  businessType: BusinessType;
  investmentRange: InvestmentRange;
  investmentMin?: number;
  investmentMax?: number;
  city: string;
  state: string;
  location: string;
  shortDescription: string;
  description: string;
  requirements?: string;
  images: string[];
  documents?: string[];
  contactPreference: 'email' | 'phone' | 'both';
  contactEmail?: string;
  contactPhone?: string;
  postedBy: string;
  postedByName: string;
  postedByImage?: string;
  status: OpportunityStatus;
  isFeatured: boolean;
  isUrgent: boolean;
  viewCount: number;
  interestedCount: number;
  bookmarkCount: number;
  rejectionReason?: string;
  adminNotes?: string;
  publishedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Bookmark Interface
export interface Bookmark {
  id: string;
  userId: string;
  opportunityId: string;
  createdAt: Date;
}

// Interest Interface
export interface Interest {
  id: string;
  userId: string;
  opportunityId: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

// Notification Interface
export interface Notification {
  id: string;
  userId: string;
  type: 'opportunity_approved' | 'opportunity_rejected' | 'new_opportunity' | 'interest_received' | 'interest_accepted' | 'interest_rejected' | 'system';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
}

// Testimonial Interface
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  image?: string;
  content: string;
  rating: number;
  isVerified: boolean;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// FAQ Interface
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Contact Message Interface
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

// Homepage Settings Interface
export interface HomepageSettings {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;
  heroBackgroundImage?: string;
  stats: {
    totalOpportunities: number;
    totalMembers: number;
    totalConnections: number;
    totalInvestments: string;
  };
  featuredOpportunityIds: string[];
  latestOpportunityIds: string[];
  testimonialIds: string[];
  bannerImage?: string;
  bannerTitle?: string;
  bannerLink?: string;
  updatedAt: Date;
}

// Analytics Interface
export interface Analytics {
  id: string;
  date: Date;
  totalUsers: number;
  totalCAs: number;
  totalOpportunities: number;
  publishedOpportunities: number;
  pendingOpportunities: number;
  totalViews: number;
  totalInterests: number;
  totalBookmarks: number;
  newUsers: number;
  newOpportunities: number;
}

// Admin: Audit Log Interface
export type AuditAction =
  | 'opportunity_approved'
  | 'opportunity_rejected'
  | 'opportunity_created'
  | 'opportunity_updated'
  | 'opportunity_deleted'
  | 'opportunity_featured'
  | 'opportunity_unfeatured'
  | 'user_role_changed'
  | 'user_suspended'
  | 'user_reactivated';

export interface AuditLog {
  id: string;
  action: AuditAction;
  targetType: 'opportunity' | 'user';
  targetId: string;
  targetLabel: string;
  adminId: string;
  adminName: string;
  details?: string;
  createdAt: Date;
}

// Admin: Dashboard Overview Stats
export interface AdminOverviewStats {
  totalUsers: number;
  totalCAs: number;
  newUsersLast7Days: number;
  totalOpportunities: number;
  pendingOpportunities: number;
  publishedOpportunities: number;
  rejectedOpportunities: number;
  draftOpportunities: number;
  archivedOpportunities: number;
  totalViews: number;
  totalInterests: number;
  totalBookmarks: number;
}

// Admin: Trend point for charts
export interface TrendPoint {
  label: string;
  value: number;
}

// Filter Options Interface
export interface FilterOptions {
  category?: string;
  industry?: string;
  investmentRange?: InvestmentRange;
  location?: string;
  businessType?: BusinessType;
  postedDate?: 'today' | 'week' | 'month' | 'all';
  status?: OpportunityStatus;
}

// Search Query Interface
export interface SearchQuery {
  query: string;
  filters: FilterOptions;
  sortBy?: 'latest' | 'popular' | 'investment_high' | 'investment_low';
}

// Pagination Interface
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// API Response Interface
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface CreateOpportunityForm {
  title: string;
  category: string;
  industry: string;
  businessType: BusinessType;
  investmentRange: InvestmentRange;
  investmentMin?: number;
  investmentMax?: number;
  city: string;
  state: string;
  shortDescription: string;
  description: string;
  requirements?: string;
  images: File[];
  documents?: File[];
  contactPreference: 'email' | 'phone' | 'both';
  contactEmail?: string;
  contactPhone?: string;
}

export interface UpdateOpportunityForm extends Partial<CreateOpportunityForm> {
  id: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
}

export interface UpdateProfileForm {
  name: string;
  phone?: string;
  companyName?: string;
  designation?: string;
  city?: string;
  state?: string;
  profileImage?: File;
}
