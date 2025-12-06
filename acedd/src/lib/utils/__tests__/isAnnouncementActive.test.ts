import { describe, it, expect } from "vitest";
import { isAnnouncementActive } from "../isAnnouncementActive";

describe("isAnnouncementActive", () => {
  it("should return true when announcement has no start or end date", () => {
    const announcement = {
      startsAt: null,
      endsAt: null,
    };
    const now = new Date("2024-01-15T12:00:00Z");

    expect(isAnnouncementActive(announcement, now)).toBe(true);
  });

  it("should return true when current time is between start and end date", () => {
    const announcement = {
      startsAt: new Date("2024-01-01T00:00:00Z"),
      endsAt: new Date("2024-01-31T23:59:59Z"),
    };
    const now = new Date("2024-01-15T12:00:00Z");

    expect(isAnnouncementActive(announcement, now)).toBe(true);
  });

  it("should return false when current time is before start date", () => {
    const announcement = {
      startsAt: new Date("2024-02-01T00:00:00Z"),
      endsAt: new Date("2024-02-28T23:59:59Z"),
    };
    const now = new Date("2024-01-15T12:00:00Z");

    expect(isAnnouncementActive(announcement, now)).toBe(false);
  });

  it("should return false when current time is after end date", () => {
    const announcement = {
      startsAt: new Date("2024-01-01T00:00:00Z"),
      endsAt: new Date("2024-01-31T23:59:59Z"),
    };
    const now = new Date("2024-02-15T12:00:00Z");

    expect(isAnnouncementActive(announcement, now)).toBe(false);
  });

  it("should handle string dates (ISO 8601 format)", () => {
    const announcement = {
      startsAt: "2024-01-01T00:00:00Z",
      endsAt: "2024-01-31T23:59:59Z",
    };
    const now = new Date("2024-01-15T12:00:00Z");

    expect(isAnnouncementActive(announcement, now)).toBe(true);
  });

  it("should return true when only start date is set and current time is after it", () => {
    const announcement = {
      startsAt: new Date("2024-01-01T00:00:00Z"),
      endsAt: null,
    };
    const now = new Date("2024-01-15T12:00:00Z");

    expect(isAnnouncementActive(announcement, now)).toBe(true);
  });

  it("should return true when only end date is set and current time is before it", () => {
    const announcement = {
      startsAt: null,
      endsAt: new Date("2024-01-31T23:59:59Z"),
    };
    const now = new Date("2024-01-15T12:00:00Z");

    expect(isAnnouncementActive(announcement, now)).toBe(true);
  });
});

