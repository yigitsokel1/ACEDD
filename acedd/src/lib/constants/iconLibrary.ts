/**
 * Centralized SVG Icon Library
 * 
 * All icons are stored as SVG path strings (d attribute)
 * This ensures consistency across the application and allows icons to be stored in database/settings
 * 
 * Icons are from Lucide (https://lucide.dev/)
 * Each icon's SVG path is extracted from the original icon
 */

export const ICON_LIBRARY = {
  // General Purpose
  target: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z", // Target (Mission)
  award: "M12 15l-3.5 1.85 0.67-3.9L6.34 10.2l3.94-0.57L12 6l1.72 3.63 3.94 0.57-2.83 2.75 0.67 3.9L12 15zm0-13C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z", // Award (Vision)
  
  // Stats & Achievements
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75", // Users (Bursiyer, Members)
  trendingUp: "M23 6l-9.5 9.5-5-5L1 18", // Trending Up (Stats growth)
  dollarSign: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", // Dollar (Burs amount)
  heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z", // Heart (Burs Desteği, Love)
  calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z", // Calendar (Events, Years)
  percent: "M19 5L5 19M9 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM15 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z", // Percent (Success rate)
  
  // Education & Goals
  bookOpen: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z", // Book Open (Education, Secretary)
  graduationCap: "M22 10v6M12 2l10 5-10 5L2 7l10-5z", // Graduation Cap (Education, Students)
  lightbulb: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4", // Lightbulb (Project Coordinator, Ideas)
  globe: "M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z", // Globe (Treasurer, Global reach)
  
  // Activities & Social
  users2: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M19 8.13a4 4 0 0 1 0 7.75", // Users2 (Member Relations, Community)
  handHeart: "M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16M7 20H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h3M20 12V8a2 2 0 0 0-2-2h-3M20 12l1.4 1.4a2 2 0 0 1-.4 3.1l-4 2.5a4 4 0 0 1-2.1.6H9M15 5l-1-1a2 2 0 0 0-2.8 0L10 5", // HandHeart (Education Coordinator, Volunteering)
  sparkles: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z", // Sparkles (Social Events, Activities)
  partyPopper: "M5.8 11.3L2 22l10.7-3.79M4 3h.01M22 8h.01M15 2h.01M22 20h.01M22 2l-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10M11 3l-1.5 1.5M9.5 5.5L8 7M13 9l1.5 1.5", // Party Popper (Events, Celebrations)
  
  // Trust & Reliability
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", // Shield (Security, Trust, Audit Committee)
  checkCircle: "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3", // Check Circle (Verified, Requirements)
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", // Zap (Fast, Speed)
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z", // Eye (Transparency)
  
  // Contact & Communication
  mapPin: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", // MapPin (Address, Location)
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z", // Phone
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6", // Mail (Email)
  
  // Finance & Donation
  banknote: "M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2M2 16v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM11 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM15 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM19 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0z", // Banknote (Bank Account)
  wallet: "M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16M18 12h.01", // Wallet (Donation)
  
  // Organization & Management
  crown: "M2 4l3.9 16h12.2L22 4M6.5 4L12 7l5.5-3M12 7v13", // Crown (President, Leadership)
  userCheck: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17 11l2 2 4-4", // UserCheck (Approved Members, Board)
  history: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5M12 7v5l4 2", // History (Scholarship Tracking)
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", // User (Single user)
  
  // Process & Steps
  clipboardList: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 12h6M9 16h6M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z", // Clipboard List (Requirements, Steps)
  fileText: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8", // File Text (Documents)
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12", // Upload (Document Upload)
  search: "M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM21 21l-4.35-4.35", // Search (Review, Evaluation)
  
  // Additional useful icons
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z", // Star (Featured, Quality)
  trophy: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z", // Trophy (Achievement, Success)
  gift: "M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z", // Gift (Donation, Support)
  building: "M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16", // Building (Organization)
} as const;

/**
 * Get SVG path for an icon by name
 * Falls back to a default icon if not found
 */
export function getIconSvgPath(iconName: string): string {
  const normalizedName = iconName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const icon = ICON_LIBRARY[normalizedName as keyof typeof ICON_LIBRARY];
  return icon || ICON_LIBRARY.target; // Default fallback
}

/**
 * Icon name type for TypeScript autocomplete
 */
export type IconName = keyof typeof ICON_LIBRARY;

