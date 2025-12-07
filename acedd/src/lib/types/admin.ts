/**
 * Admin User Types
 * 
 * These types mirror the Prisma AdminUser model and AdminRole enum.
 * Used for type safety across the application.
 */

export type AdminRole = "SUPER_ADMIN" | "ADMIN";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * AdminUser with password hash (for internal use only, never expose to frontend)
 */
export interface AdminUserWithPassword extends AdminUser {
  passwordHash: string;
}
