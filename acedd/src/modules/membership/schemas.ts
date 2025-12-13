/**
 * Membership Application Zod Schemas
 * 
 * Single source of truth for membership application form validation and type inference.
 * All schemas use Turkish error messages.
 * 
 * Architecture:
 * - Uses shared common schemas from @/lib/schemas/common
 * - Domain-specific validation rules
 * - Type-safe form data inference
 */

import { z } from "zod";
import {
  firstNameSchema,
  lastNameSchema,
  phoneSchema,
  emailSchema,
  tcNumberSchema,
  dateSchema,
  citySchema,
  addressSchema,
  genderSchema,
  bloodTypeSchema,
  conditionsAcceptedSchema,
} from "@/lib/schemas/common";

// ============================================================================
// Membership Application Schema
// ============================================================================

/**
 * Membership Application Form Schema
 * 
 * Maps to Prisma MembershipApplication model:
 * - firstName, lastName → Prisma: firstName, lastName
 * - identityNumber → Prisma: identityNumber
 * - gender → Prisma: gender (MemberGender enum)
 * - bloodType → Prisma: bloodType (BloodType enum)
 * - birthPlace → Prisma: birthPlace
 * - birthDate → Prisma: birthDate (DateTime)
 * - city → Prisma: city
 * - phone → Prisma: phone
 * - email → Prisma: email
 * - address → Prisma: address (Text)
 * - conditionsAccepted → Prisma: conditionsAccepted (Boolean)
 */
export const MembershipApplicationSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  identityNumber: tcNumberSchema,
  gender: genderSchema,
  bloodType: z.union([bloodTypeSchema, z.null()]).optional(), // Optional and nullable (matches Prisma: BloodType?)
  birthPlace: citySchema,
  birthDate: dateSchema,
  city: citySchema,
  phone: phoneSchema,
  email: emailSchema,
  address: addressSchema,
  conditionsAccepted: conditionsAcceptedSchema,
});

/**
 * Type inference from schema
 * Use this type for form data and API request/response
 */
export type MembershipApplicationInput = z.infer<typeof MembershipApplicationSchema>;

/**
 * Optional: Schema for API request (with reCAPTCHA token)
 */
export const MembershipApplicationRequestSchema = MembershipApplicationSchema.extend({
  recaptchaToken: z.string().optional(),
});

export type MembershipApplicationRequest = z.infer<typeof MembershipApplicationRequestSchema>;

