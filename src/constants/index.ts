// Categories
export const CATEGORIES = [
  { id: 'partnership', name: 'Partnership', icon: 'Handshake' },
  { id: 'franchise', name: 'Franchise', icon: 'Store' },
  { id: 'investment', name: 'Investment', icon: 'TrendingUp' },
  { id: 'consulting', name: 'Consulting', icon: 'Briefcase' },
  { id: 'advisory', name: 'Advisory', icon: 'Lightbulb' },
  { id: 'audit', name: 'Audit', icon: 'FileCheck' },
] as const;

// Industries
export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Real Estate',
  'Manufacturing',
  'Retail',
  'Education',
  'Hospitality',
  'Logistics',
  'Agriculture',
  'Energy',
  'Pharmaceuticals',
  'Automotive',
  'Construction',
  'Media & Entertainment',
  'Telecommunications',
  'Textiles',
  'Food & Beverage',
  'Chemicals',
  'Other',
] as const;

// Business Types
export const BUSINESS_TYPES = [
  { value: 'partnership', label: 'Partnership Opportunity' },
  { value: 'franchise', label: 'Franchise Opportunity' },
  { value: 'investment', label: 'Investment Opportunity' },
  { value: 'consulting', label: 'Consulting Project' },
  { value: 'advisory', label: 'Advisory Role' },
  { value: 'audit', label: 'Audit Assignment' },
  { value: 'tax', label: 'Tax Advisory' },
  { value: 'other', label: 'Other' },
] as const;

// Investment Ranges
export const INVESTMENT_RANGES = [
  { value: 'under-10l', label: 'Under ₹10 Lakhs', min: 0, max: 1000000 },
  { value: '10l-50l', label: '₹10 Lakhs - ₹50 Lakhs', min: 1000000, max: 5000000 },
  { value: '50l-1cr', label: '₹50 Lakhs - ₹1 Crore', min: 5000000, max: 10000000 },
  { value: '1cr-5cr', label: '₹1 Crore - ₹5 Crores', min: 10000000, max: 50000000 },
  { value: '5cr-10cr', label: '₹5 Crores - ₹10 Crores', min: 50000000, max: 100000000 },
  { value: 'above-10cr', label: 'Above ₹10 Crores', min: 100000000, max: Infinity },
] as const;

// States of India
export const STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Mumbai',
  'Chennai',
  'Kolkata',
  'Bangalore',
  'Hyderabad',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
] as const;

// Opportunity Status
export const OPPORTUNITY_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

// User Roles
export const USER_ROLES = {
  VISITOR: 'visitor',
  REGISTERED: 'registered',
  CA: 'ca',
  ADMIN: 'admin',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 50,
} as const;

// File Upload Limits
export const FILE_UPLOAD = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_IMAGES: 5,
  MAX_DOCUMENTS: 3,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const;

// Membership Plans
export const MEMBERSHIP_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Browse opportunities',
      'View basic opportunity details',
      'Create account',
      'Bookmark opportunities',
    ],
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 999,
    duration: 'monthly',
    features: [
      'Everything in Free',
      'View complete opportunity details',
      'Contact opportunity posters',
      'Priority support',
      'Advanced search filters',
      'Download documents',
    ],
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 4999,
    duration: 'monthly',
    features: [
      'Everything in Premium',
      'Unlimited opportunity postings',
      'Featured listings',
      'Analytics dashboard',
      'Dedicated account manager',
      'Custom branding',
    ],
  },
} as const;

// Navigation Links
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/opportunities', label: 'Opportunity Feed' },
  { href: '/membership', label: 'Membership' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
] as const;

// Admin Panel Navigation
export const ADMIN_NAV_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/admin/opportunities', label: 'Opportunities', icon: 'Briefcase' },
  { href: '/admin/users', label: 'Users', icon: 'Users' },
  { href: '/admin/analytics', label: 'Analytics', icon: 'BarChart3' },
] as const;

// Social Links
export const SOCIAL_LINKS = {
  linkedin: 'https://linkedin.com',
  twitter: 'https://twitter.com',
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
} as const;

// Contact Info
export const CONTACT_INFO = {
  email: 'hello@cacircuit.com',
  phone: '+91 98765 43210',
  address: 'Mumbai, Maharashtra, India',
} as const;

// Animation Variants
export const ANIMATION_VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  },
  slideDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  },
  slideRight: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
} as const;
