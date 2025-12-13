/**
 * Dashboard Stats Helper
 * 
 * Sprint 9: Helper/service katmanı - Dashboard verilerini toplar ve formatlar
 * 
 * Bu dosya:
 * - Prisma'dan tüm sayımları alır
 * - Son kayıtları getirir
 * - Gelecek etkinlikleri toplar
 * - Dashboard API'ye sade bir JSON döndürür
 */

import { prisma } from "@/lib/db";
import { isAnnouncementActive } from "@/lib/utils/isAnnouncementActive";

export interface DashboardStats {
  membership: {
    total: number;
    pending: number;
    recent: Array<{
      id: string;
      fullName: string;
      email: string;
      createdAt: string;
    }>;
  };
  scholarship: {
    total: number;
    pending: number;
    recent: Array<{
      id: string;
      fullName: string;
      university: string;
      createdAt: string;
    }>;
  };
  members: {
    total: number;
    active: number;
    recent: Array<{
      id: string;
      fullName: string;
      email: string;
      createdAt: string;
    }>;
  };
  messages: {
    unread: number;
    recent: Array<{
      id: string;
      fullName: string;
      email: string;
      subject: string;
      status: string;
      createdAt: string;
    }>;
  };
  events: {
    upcomingTotal: number;
    upcoming: Array<{
      id: string;
      title: string;
      date: string;
      location: string;
    }>;
  };
  announcements: {
    total: number;
    active: number;
    recent: Array<{
      id: string;
      title: string;
      summary: string | null;
      category: string;
      isPinned: boolean;
      isActive: boolean;
      createdAt: string;
    }>;
  };
}

/**
 * Get all dashboard statistics and recent data
 * 
 * @returns DashboardStats object with all aggregated data
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();

  // Parallel fetch all data using Promise.all for performance
  const [
    // A) Üyelik Başvuruları (Membership Applications)
    membershipTotal,
    membershipPending,
    membershipRecent,
    // B) Burs Başvuruları (Scholarship Applications)
    scholarshipTotal,
    scholarshipPending,
    scholarshipRecent,
    // C) Üyeler (Members)
    membersTotal,
    membersActive,
    membersRecent,
    // D) İletişim Mesajları (Contact Messages)
    messagesUnread,
    messagesRecent,
    // E) Etkinlikler (Events)
    eventsUpcomingTotal,
    eventsUpcoming,
    // F) Duyurular (Announcements)
    announcementsAll,
    announcementsRecent,
  ] = await Promise.all([
    // Membership Applications
    prisma.membershipApplication.count(),
    prisma.membershipApplication.count({
      where: { status: "PENDING" },
    }),
    prisma.membershipApplication.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
    }),
    // Scholarship Applications
    prisma.scholarshipApplication.count(),
    prisma.scholarshipApplication.count({
      where: { status: "PENDING" },
    }),
    prisma.scholarshipApplication.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        university: true,
        createdAt: true,
      },
    }),
    // Members
    prisma.member.count(),
    prisma.member.count({
      where: { status: "ACTIVE" },
    }),
    prisma.member.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
    }),
    // Contact Messages
    prisma.contactMessage.count({
      where: { status: "NEW" },
    }),
    prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        email: true,
        subject: true,
        status: true,
        createdAt: true,
      },
    }),
    // Events
    prisma.event.count({
      where: {
        date: {
          gte: now,
        },
      },
    }),
    prisma.event.findMany({
      take: 3,
      where: {
        date: {
          gte: now,
        },
      },
      orderBy: { date: "asc" },
      select: {
        id: true,
        title: true,
        date: true,
        location: true,
      },
    }),
    // Announcements
    prisma.announcement.findMany({
      select: {
        id: true,
        title: true,
        startsAt: true,
        endsAt: true,
        isPinned: true,
        createdAt: true,
      },
    }),
    // Sprint 14: Active announcements only for recent list
    prisma.announcement.findMany({
      take: 10, // Take more to filter active ones
      orderBy: [
        { isPinned: "desc" },
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        title: true,
        summary: true,
        category: true,
        startsAt: true,
        endsAt: true,
        isPinned: true,
        createdAt: true,
      },
    }),
  ]);

  // Count active announcements using helper function
  const announcementsActive = announcementsAll.filter((announcement) =>
    isAnnouncementActive(announcement, now)
  ).length;

  // Sprint 14: Filter and sort recent announcements (active only, pinned first)
  const activeRecentAnnouncements = announcementsRecent
    .filter((announcement) => isAnnouncementActive(announcement, now))
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 5); // Take top 5 active announcements

  // Format and return response
  return {
    membership: {
      total: membershipTotal,
      pending: membershipPending,
      recent: membershipRecent.map((app) => ({
        id: app.id,
        fullName: `${app.firstName} ${app.lastName}`,
        email: app.email,
        createdAt: app.createdAt.toISOString(),
      })),
    },
    scholarship: {
      total: scholarshipTotal,
      pending: scholarshipPending,
      recent: scholarshipRecent.map((app) => ({
        id: app.id,
        fullName: `${app.firstName} ${app.lastName}`,
        university: app.university,
        createdAt: app.createdAt.toISOString(),
      })),
    },
    members: {
      total: membersTotal,
      active: membersActive,
      recent: membersRecent.map((member) => ({
        id: member.id,
        fullName: `${member.firstName} ${member.lastName}`,
        email: member.email,
        createdAt: member.createdAt.toISOString(),
      })),
    },
    messages: {
      unread: messagesUnread,
      recent: messagesRecent.map((msg) => ({
        id: msg.id,
        fullName: msg.fullName,
        email: msg.email,
        subject: msg.subject,
        status: msg.status,
        createdAt: msg.createdAt.toISOString(),
      })),
    },
    events: {
      upcomingTotal: eventsUpcomingTotal,
      upcoming: eventsUpcoming.map((event) => ({
        id: event.id,
        title: event.title,
        date: event.date.toISOString(),
        location: event.location,
      })),
    },
    announcements: {
      total: announcementsAll.length,
      active: announcementsActive,
      recent: activeRecentAnnouncements.map((announcement) => ({
        id: announcement.id,
        title: announcement.title,
        summary: announcement.summary,
        category: announcement.category,
        isPinned: announcement.isPinned,
        isActive: true, // Sprint 14: Recent list only contains active announcements
        createdAt: announcement.createdAt.toISOString(),
      })),
    },
  };
}
