/**
 * Checks if an announcement is currently active based on its start and end dates.
 * 
 * An announcement is considered active if:
 * - No startsAt is set OR current time is after startsAt
 * - AND no endsAt is set OR current time is before endsAt
 * 
 * @param announcement - The announcement object with optional startsAt and endsAt dates
 * @param now - The current date/time to compare against (defaults to new Date())
 * @returns true if the announcement is active, false otherwise
 */
export function isAnnouncementActive(
  announcement: {
    startsAt?: Date | string | null;
    endsAt?: Date | string | null;
  },
  now: Date = new Date()
): boolean {
  // Convert string dates to Date objects if needed
  const startsAt = announcement.startsAt
    ? typeof announcement.startsAt === "string"
      ? new Date(announcement.startsAt)
      : announcement.startsAt
    : null;

  const endsAt = announcement.endsAt
    ? typeof announcement.endsAt === "string"
      ? new Date(announcement.endsAt)
      : announcement.endsAt
    : null;

  // Check if announcement has started
  if (startsAt && now < startsAt) {
    return false;
  }

  // Check if announcement has ended
  if (endsAt && now > endsAt) {
    return false;
  }

  return true;
}

