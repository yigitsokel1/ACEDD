/**
 * Tests for Settings Helper Functions (Sprint 10)
 * 
 * Tests for:
 * - getSetting()
 * - getSettings()
 * - getSettingValue()
 * - getAllSettings()
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { getSetting, getSettings, getSettingValue, getAllSettings } from "../getSetting";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

// Mock Prisma
vi.mock("@/lib/db", () => ({
  prisma: {
    setting: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

describe("getSetting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return setting value when setting exists", async () => {
    const mockSetting = {
      id: "setting-1",
      key: "site.name",
      value: "ACEDD",
      updatedAt: new Date("2024-01-15T10:00:00Z"),
      updatedBy: "admin-1",
    };

    vi.mocked(prisma.setting.findUnique).mockResolvedValue(mockSetting as any);

    const result = await getSetting("site.name");

    expect(result).toBe("ACEDD");
    expect(prisma.setting.findUnique).toHaveBeenCalledWith({
      where: { key: "site.name" },
    });
  });

  it("should return null when setting does not exist", async () => {
    vi.mocked(prisma.setting.findUnique).mockResolvedValue(null);

    const result = await getSetting("site.name");

    expect(result).toBeNull();
  });

  it("should return null when setting value is null", async () => {
    const mockSetting = {
      id: "setting-1",
      key: "site.logoUrl",
      value: null,
      updatedAt: new Date("2024-01-15T10:00:00Z"),
      updatedBy: "admin-1",
    };

    vi.mocked(prisma.setting.findUnique).mockResolvedValue(mockSetting as any);

    const result = await getSetting("site.logoUrl");

    expect(result).toBeNull();
  });

  it("should handle database errors gracefully", async () => {
    vi.mocked(prisma.setting.findUnique).mockRejectedValue(
      new Error("Database connection error")
    );

    const result = await getSetting("site.name");

    expect(result).toBeNull();
  });
});

describe("getSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return settings filtered by prefix", async () => {
    const mockSettings = [
      {
        id: "setting-1",
        key: "site.name",
        value: "ACEDD",
        updatedAt: new Date("2024-01-15T10:00:00Z"),
        updatedBy: "admin-1",
      },
      {
        id: "setting-2",
        key: "site.description",
        value: "Araştırma, Çevre ve Doğa Derneği",
        updatedAt: new Date("2024-01-15T10:00:00Z"),
        updatedBy: "admin-1",
      },
    ];

    vi.mocked(prisma.setting.findMany).mockResolvedValue(mockSettings as any);

    const result = await getSettings("site");

    expect(result).toEqual({
      "site.name": "ACEDD",
      "site.description": "Araştırma, Çevre ve Doğa Derneği",
    });
    expect(prisma.setting.findMany).toHaveBeenCalledWith({
      where: {
        key: {
          startsWith: "site.",
        },
      },
      orderBy: { key: "asc" },
    });
  });

  it("should handle prefix with wildcard", async () => {
    const mockSettings = [
      {
        id: "setting-1",
        key: "site.name",
        value: "ACEDD",
        updatedAt: new Date("2024-01-15T10:00:00Z"),
        updatedBy: "admin-1",
      },
    ];

    vi.mocked(prisma.setting.findMany).mockResolvedValue(mockSettings as any);

    const result = await getSettings("site.*");

    expect(result).toEqual({
      "site.name": "ACEDD",
    });
    expect(prisma.setting.findMany).toHaveBeenCalledWith({
      where: {
        key: {
          startsWith: "site.",
        },
      },
      orderBy: { key: "asc" },
    });
  });

  it("should return empty object when no settings match prefix", async () => {
    vi.mocked(prisma.setting.findMany).mockResolvedValue([]);

    const result = await getSettings("nonexistent");

    expect(result).toEqual({});
  });

  it("should handle database errors gracefully", async () => {
    vi.mocked(prisma.setting.findMany).mockRejectedValue(
      new Error("Database connection error")
    );

    const result = await getSettings("site");

    expect(result).toEqual({});
  });

  it("should filter different prefixes correctly", async () => {
    const mockSiteSettings = [
      {
        id: "setting-1",
        key: "site.name",
        value: "ACEDD",
        updatedAt: new Date("2024-01-15T10:00:00Z"),
        updatedBy: "admin-1",
      },
    ];

    const mockSocialSettings = [
      {
        id: "setting-2",
        key: "social.instagram",
        value: "https://instagram.com/acedd",
        updatedAt: new Date("2024-01-15T10:00:00Z"),
        updatedBy: "admin-1",
      },
    ];

    vi.mocked(prisma.setting.findMany)
      .mockResolvedValueOnce(mockSiteSettings as any)
      .mockResolvedValueOnce(mockSocialSettings as any);

    const siteResult = await getSettings("site");
    const socialResult = await getSettings("social");

    expect(siteResult).toEqual({
      "site.name": "ACEDD",
    });
    expect(socialResult).toEqual({
      "social.instagram": "https://instagram.com/acedd",
    });
  });
});

describe("getAllSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return all settings", async () => {
    const mockSettings = [
      {
        id: "setting-1",
        key: "site.name",
        value: "ACEDD",
        updatedAt: new Date("2024-01-15T10:00:00Z"),
        updatedBy: "admin-1",
      },
      {
        id: "setting-2",
        key: "contact.email",
        value: "info@acedd.org",
        updatedAt: new Date("2024-01-15T10:00:00Z"),
        updatedBy: "admin-1",
      },
    ];

    vi.mocked(prisma.setting.findMany).mockResolvedValue(mockSettings as any);

    const result = await getAllSettings();

    expect(result).toEqual({
      "site.name": "ACEDD",
      "contact.email": "info@acedd.org",
    });
    expect(prisma.setting.findMany).toHaveBeenCalledWith({
      orderBy: { key: "asc" },
    });
  });

  it("should return empty object when no settings exist", async () => {
    vi.mocked(prisma.setting.findMany).mockResolvedValue([]);

    const result = await getAllSettings();

    expect(result).toEqual({});
  });
});

describe("getSettingValue", () => {
  it("should return setting value when it exists", () => {
    const settings = {
      "site.name": "ACEDD",
      "site.description": "Araştırma, Çevre ve Doğa Derneği",
    };

    const result = getSettingValue(settings, "site.name", "Default Name");

    expect(result).toBe("ACEDD");
  });

  it("should return fallback when setting does not exist", () => {
    const settings = {
      "site.description": "Araştırma, Çevre ve Doğa Derneği",
    };

    const result = getSettingValue(settings, "site.name", "ACEDD");

    expect(result).toBe("ACEDD");
  });

  it("should return fallback when setting value is null", () => {
    const settings = {
      "site.name": null,
    };

    const result = getSettingValue(settings, "site.name", "ACEDD");

    expect(result).toBe("ACEDD");
  });

  it("should return fallback when setting value is undefined", () => {
    const settings = {
      "site.name": undefined,
    };

    const result = getSettingValue(settings, "site.name", "ACEDD");

    expect(result).toBe("ACEDD");
  });

  it("should return fallback when key does not exist in settings", () => {
    const settings = {};

    const result = getSettingValue(settings, "site.name", "ACEDD");

    expect(result).toBe("ACEDD");
  });

  it("should handle number values", () => {
    const settings = {
      "site.version": 2,
    };

    const result = getSettingValue(settings, "site.version", 1);

    expect(result).toBe(2);
  });

  it("should handle boolean values", () => {
    const settings = {
      "site.enabled": true,
    };

    const result = getSettingValue(settings, "site.enabled", false);

    expect(result).toBe(true);
  });

  it("should handle object values", () => {
    const settings = {
      "site.config": { theme: "dark", language: "tr" },
    };

    const fallback = { theme: "light", language: "en" };
    const result = getSettingValue(settings, "site.config", fallback);

    expect(result).toEqual({ theme: "dark", language: "tr" });
  });

  it("should return fallback when value type does not match fallback type", () => {
    const settings = {
      "site.name": 123, // number instead of string
    };

    const result = getSettingValue(settings, "site.name", "ACEDD");

    expect(result).toBe("ACEDD"); // Should return fallback due to type mismatch
  });

  it("should handle undefined fallback", () => {
    const settings = {
      "social.instagram": "https://instagram.com/acedd",
    };

    const result = getSettingValue(settings, "social.instagram", undefined);

    expect(result).toBe("https://instagram.com/acedd");
  });

  it("should return undefined when key does not exist and fallback is undefined", () => {
    const settings = {};

    const result = getSettingValue(settings, "social.instagram", undefined);

    expect(result).toBeUndefined();
  });

  it("should handle null fallback", () => {
    const settings = {
      "site.logoUrl": null,
    };

    const result = getSettingValue(settings, "site.logoUrl", null);

    expect(result).toBeNull();
  });

  it("should return fallback when value is null and fallback is not null", () => {
    const settings = {
      "site.logoUrl": null,
    };

    const result = getSettingValue(settings, "site.logoUrl", "default-logo.png");

    expect(result).toBe("default-logo.png");
  });
});

