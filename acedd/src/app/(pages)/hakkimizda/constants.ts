import { Users, Target, Award, Heart, BookOpen, Globe, Users2, Shield, Lightbulb, HandHeart } from "lucide-react";

/**
 * Sprint 11: VALUES, GOALS_ACTIVITIES, MISSION_VISION moved to settings
 * Content is now managed via Admin UI (content.about.*)
 * 
 * Icon components remain here for component usage (React components can't be stored in settings)
 * ORGANIZATION_STRUCTURE and ORGANIZATION_MEMBERS remain here as technical/organizational data
 */

/**
 * ORGANIZATION_STRUCTURE - Technical data only (icon)
 * Title and description are now managed via Admin UI (content.about.jobDescriptions)
 * Sprint 11: Title/description moved to settings, only icon remains here for matching
 */
export const ORGANIZATION_STRUCTURE = [
  {
    title: "Genel Kurul", // Used only for matching with settings data
    icon: Users,
  },
  {
    title: "Yönetim Kurulu", // Used only for matching with settings data
    icon: Shield,
  },
  {
    title: "Denetim Kurulu", // Used only for matching with settings data
    icon: Award,
  },
  {
    title: "Dernek Başkanı", // Used only for matching with settings data
    icon: Target,
  },
  {
    title: "Genel Sekreter", // Used only for matching with settings data
    icon: BookOpen,
  },
  {
    title: "Sayman", // Used only for matching with settings data
    icon: Globe,
  },
  {
    title: "Burs Komisyonu", // Used only for matching with settings data
    icon: Heart,
  },
  {
    title: "Proje Koordinatörü", // Used only for matching with settings data
    icon: Lightbulb,
  },
  {
    title: "Üye İlişkileri", // Used only for matching with settings data
    icon: Users2,
  },
  {
    title: "Eğitim Koordinatörü", // Used only for matching with settings data
    icon: HandHeart,
  },
  {
    title: "Bursiyer Takip Ekibi", // Used only for matching with settings data
    icon: Shield,
  },
  {
    title: "Gönüllü Eğitmenler", // Used only for matching with settings data
    icon: Users,
  },
] as const;

/**
 * MISSION_VISION icon components (React components can't be stored in settings)
 * These are used in MissionVisionSection component
 */
export const MISSION_VISION_ICONS = {
  mission: Target,
  vision: Award,
} as const;

/**
 * ORGANIZATION_MEMBERS - Only boardOfDirectors.title is used
 * Actual member data comes from database (Member model with tags)
 * Sprint 6: Member data is now fetched from Prisma, only title remains here
 */
export const ORGANIZATION_MEMBERS = {
  boardOfDirectors: {
    title: "YÖNETİM KURULUMUZ",
  }
} as const;
