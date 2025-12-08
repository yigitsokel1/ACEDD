/**
 * Tests for Settings Convenience Functions (Sprint 11)
 * 
 * Tests for:
 * - getPageContent()
 * - getPageSeo()
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { getPageContent, getPageSeo } from "../convenience";
import type { PageIdentifier } from "@/lib/types/setting";

// Mock db.ts to avoid DATABASE_URL requirement
vi.mock("@/lib/db", () => ({
  prisma: {
    setting: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

// Mock constants to avoid dependency issues
vi.mock("@/lib/constants", () => ({
  SITE_CONFIG: {
    shortName: "ACEDD",
    name: "ACEDD",
    description: "Test description",
  },
}));

// Mock getSetting module - use factory function to avoid hoisting issues
vi.mock("../getSetting", async () => {
  const actual = await vi.importActual<typeof import("../getSetting")>("../getSetting");
  return {
    ...actual,
    getSettings: vi.fn(),
  };
});

// Import mocked functions after mock is set up
import { getSettings } from "../getSetting";

describe("getPageContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return content when settings exist", async () => {
    const mockSettings = {
      "content.home.heroTitle": "Ana Sayfa Başlığı",
      "content.home.intro": "Ana sayfa açıklaması",
      "content.home.primaryButtonText": "Burs Başvurusu Yap",
    };

    vi.mocked(getSettings).mockResolvedValue(mockSettings);

    const result = await getPageContent("home");

    expect(result).toEqual({
      heroTitle: "Ana Sayfa Başlığı",
      intro: "Ana sayfa açıklaması",
      primaryButtonText: "Burs Başvurusu Yap",
    });
    expect(getSettings).toHaveBeenCalledWith("content.home");
  });

  it("should return empty object when no settings exist", async () => {
    vi.mocked(getSettings).mockResolvedValue({});

    const result = await getPageContent("home");

    expect(result).toEqual({});
  });

  it("should handle array values", async () => {
    const mockSettings = {
      "content.scholarship.requirements": [
        "Acıpayam ve çevresinde ikamet etmek",
        "Lise veya üniversite öğrencisi olmak",
      ],
    };

    vi.mocked(getSettings).mockResolvedValue(mockSettings);

    const result = await getPageContent("scholarship");

    expect(result).toEqual({
      requirements: [
        "Acıpayam ve çevresinde ikamet etmek",
        "Lise veya üniversite öğrencisi olmak",
      ],
    });
  });

  it("should exclude empty arrays", async () => {
    const mockSettings = {
      "content.home.stats": [],
      "content.home.heroTitle": "Başlık",
    };

    vi.mocked(getSettings).mockResolvedValue(mockSettings);

    const result = await getPageContent("home");

    expect(result).toEqual({
      heroTitle: "Başlık",
    });
    expect(result.stats).toBeUndefined();
  });

  it("should exclude empty strings", async () => {
    const mockSettings = {
      "content.home.heroTitle": "",
      "content.home.intro": "   ", // whitespace only
      "content.home.primaryButtonText": "Buton Metni",
    };

    vi.mocked(getSettings).mockResolvedValue(mockSettings);

    const result = await getPageContent("home");

    expect(result).toEqual({
      primaryButtonText: "Buton Metni",
    });
    expect(result.heroTitle).toBeUndefined();
    expect(result.intro).toBeUndefined();
  });

  it("should handle object values (JSON fields)", async () => {
    const mockSettings = {
      "content.about.missionVision": {
        mission: { title: "Misyon", description: "Misyon açıklaması" },
        vision: { title: "Vizyon", description: "Vizyon açıklaması" },
      },
    };

    vi.mocked(getSettings).mockResolvedValue(mockSettings);

    const result = await getPageContent("about");

    expect(result).toEqual({
      missionVision: {
        mission: { title: "Misyon", description: "Misyon açıklaması" },
        vision: { title: "Vizyon", description: "Vizyon açıklaması" },
      },
    });
  });

  it("should convert object-like arrays to proper arrays (jobDescriptions)", async () => {
    const mockSettings = {
      "content.about.jobDescriptions": {
        "0": { title: "Genel Kurul", description: "Açıklama 1" },
        "1": { title: "Yönetim Kurulu", description: "Açıklama 2" },
      },
    };

    vi.mocked(getSettings).mockResolvedValue(mockSettings);

    const result = await getPageContent("about");

    expect(result.jobDescriptions).toEqual([
      { title: "Genel Kurul", description: "Açıklama 1" },
      { title: "Yönetim Kurulu", description: "Açıklama 2" },
    ]);
  });

  it("should convert object-like arrays to proper arrays (requirements)", async () => {
    const mockSettings = {
      "content.scholarship.requirements": {
        "0": "Gereksinim 1",
        "1": "Gereksinim 2",
      },
    };

    vi.mocked(getSettings).mockResolvedValue(mockSettings);

    const result = await getPageContent("scholarship");

    expect(result.requirements).toEqual(["Gereksinim 1", "Gereksinim 2"]);
  });

  it("should skip null values", async () => {
    const mockSettings = {
      "content.home.heroTitle": "Başlık",
      "content.home.intro": null,
    };

    vi.mocked(getSettings).mockResolvedValue(mockSettings);

    const result = await getPageContent("home");

    expect(result).toEqual({
      heroTitle: "Başlık",
    });
    expect(result.intro).toBeUndefined();
  });

  it("should handle multiple pages correctly", async () => {
    const homeSettings = {
      "content.home.heroTitle": "Ana Sayfa",
    };
    const aboutSettings = {
      "content.about.heroTitle": "Hakkımızda",
    };

    vi.mocked(getSettings)
      .mockResolvedValueOnce(homeSettings)
      .mockResolvedValueOnce(aboutSettings);

    const homeResult = await getPageContent("home");
    const aboutResult = await getPageContent("about");

    expect(homeResult.heroTitle).toBe("Ana Sayfa");
    expect(aboutResult.heroTitle).toBe("Hakkımızda");
  });
});

describe("getPageSeo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mocks to default behavior
    vi.mocked(getSettings).mockReset();
  });

  it("should return SEO settings when they exist", async () => {
    const mockSettings = {
      "seo.home.title": "ACEDD | Ana Sayfa - Özel Başlık",
      "seo.home.description": "Özel açıklama metni",
    };

    // getSiteName calls getSettings("site"), so we need to mock both calls
    vi.mocked(getSettings)
      .mockResolvedValueOnce(mockSettings) // First call: getPageSeo -> getSettings("seo.home")
      .mockResolvedValueOnce({ "site.name": "ACEDD" }); // Second call: getSiteName -> getSettings("site")

    const result = await getPageSeo("home");

    expect(result).toEqual({
      title: "ACEDD | Ana Sayfa - Özel Başlık",
      description: "Özel açıklama metni",
    });
    expect(getSettings).toHaveBeenCalledWith("seo.home");
  });

  it("should use fallback title when SEO title does not exist", async () => {
    const mockSettings = {
      "seo.home.description": "Özel açıklama",
    };

    vi.mocked(getSettings)
      .mockResolvedValueOnce(mockSettings) // getSettings("seo.home")
      .mockResolvedValueOnce({ "site.name": "ACEDD" }); // getSettings("site")

    const result = await getPageSeo("home");

    expect(result.title).toBe("ACEDD | Ana Sayfa");
    expect(result.description).toBe("Özel açıklama");
  });

  it("should use fallback description when SEO description does not exist", async () => {
    const mockSettings = {
      "seo.home.title": "Özel Başlık",
    };

    vi.mocked(getSettings)
      .mockResolvedValueOnce(mockSettings) // getSettings("seo.home")
      .mockResolvedValueOnce({ "site.name": "ACEDD" }); // getSettings("site")

    const result = await getPageSeo("home");

    expect(result.title).toBe("Özel Başlık");
    expect(result.description).toBe(
      "Acıpayam ve çevresindeki öğrencilerin eğitimlerini desteklemek için kurulmuş dernek"
    );
  });

  it("should use fallbacks when no SEO settings exist", async () => {
    vi.mocked(getSettings)
      .mockResolvedValueOnce({}) // getSettings("seo.home")
      .mockResolvedValueOnce({ "site.name": "ACEDD" }); // getSettings("site")

    const result = await getPageSeo("home");

    expect(result.title).toBe("ACEDD | Ana Sayfa");
    expect(result.description).toBe(
      "Acıpayam ve çevresindeki öğrencilerin eğitimlerini desteklemek için kurulmuş dernek"
    );
  });

  it("should handle different pages with correct fallbacks", async () => {
    // Each getPageSeo call makes 2 getSettings calls: one for seo.* and one for site
    vi.mocked(getSettings)
      .mockResolvedValueOnce({}) // scholarship: seo.scholarship
      .mockResolvedValueOnce({ "site.name": "ACEDD" }) // scholarship: site
      .mockResolvedValueOnce({}) // about: seo.about
      .mockResolvedValueOnce({ "site.name": "ACEDD" }) // about: site
      .mockResolvedValueOnce({}) // contact: seo.contact
      .mockResolvedValueOnce({ "site.name": "ACEDD" }); // contact: site

    const scholarshipResult = await getPageSeo("scholarship");
    const aboutResult = await getPageSeo("about");
    const contactResult = await getPageSeo("contact");

    expect(scholarshipResult.title).toBe("ACEDD | Burs Başvurusu");
    expect(scholarshipResult.description).toBe(
      "Burs başvurusu yapmak için gerekli bilgiler ve başvuru formu"
    );

    expect(aboutResult.title).toBe("ACEDD | Hakkımızda");
    expect(aboutResult.description).toBe(
      "Derneğimiz hakkında bilgiler, misyonumuz ve vizyonumuz"
    );

    expect(contactResult.title).toBe("ACEDD | İletişim");
    expect(contactResult.description).toBe(
      "Bizimle iletişime geçmek için iletişim bilgileri ve form"
    );
  });

  it("should use site name from settings for fallback title", async () => {
    // getPageSeo calls getSettings("seo.home") first, then getSiteName() which calls getSettings("site")
    vi.mocked(getSettings)
      .mockResolvedValueOnce({}) // getSettings("seo.home")
      .mockResolvedValueOnce({ "site.name": "Özel Site Adı" }); // getSettings("site")

    const result = await getPageSeo("home");

    expect(result.title).toBe("Özel Site Adı | Ana Sayfa");
    expect(getSettings).toHaveBeenCalledWith("site");
  });

  it("should handle null SEO values by using fallbacks", async () => {
    const mockSettings = {
      "seo.home.title": null,
      "seo.home.description": null,
    };

    vi.mocked(getSettings)
      .mockResolvedValueOnce(mockSettings) // getSettings("seo.home")
      .mockResolvedValueOnce({ "site.name": "ACEDD" }); // getSettings("site")

    const result = await getPageSeo("home");

    expect(result.title).toBe("ACEDD | Ana Sayfa");
    expect(result.description).toBe(
      "Acıpayam ve çevresindeki öğrencilerin eğitimlerini desteklemek için kurulmuş dernek"
    );
  });

  it("should handle all page identifiers", async () => {
    const pageKeys: PageIdentifier[] = [
      "home",
      "scholarship",
      "membership",
      "contact",
      "about",
      "events",
      "donation",
    ];

    // Each page makes 2 calls: seo.* and site
    const mockCalls = pageKeys.flatMap(() => [
      {}, // seo.*
      { "site.name": "ACEDD" }, // site
    ]);
    
    vi.mocked(getSettings).mockResolvedValueOnce({});
    for (const mockCall of mockCalls) {
      vi.mocked(getSettings).mockResolvedValueOnce(mockCall);
    }

    for (const pageKey of pageKeys) {
      const result = await getPageSeo(pageKey);
      expect(result.title).toBeTruthy();
      expect(result.description).toBeTruthy();
      expect(typeof result.title).toBe("string");
      expect(typeof result.description).toBe("string");
    }
  });

  it("should call getSettings for site when generating fallback title", async () => {
    vi.mocked(getSettings)
      .mockResolvedValueOnce({}) // getSettings("seo.home")
      .mockResolvedValueOnce({ "site.name": "Test Site Name" }); // getSettings("site")

    await getPageSeo("home");

    expect(getSettings).toHaveBeenCalledWith("site");
  });

  it("should use custom site name in fallback title format", async () => {
    vi.mocked(getSettings)
      .mockResolvedValueOnce({}) // getSettings("seo.events")
      .mockResolvedValueOnce({ "site.name": "Custom Site" }); // getSettings("site")

    const result = await getPageSeo("events");

    expect(result.title).toBe("Custom Site | Etkinlikler");
  });
});

describe("Integration: getPageSeo with generateMetadata", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getSettings).mockReset();
  });

  it("should work correctly when used in generateMetadata context", async () => {
    // Simulate settings that would be used in generateMetadata
    const mockSettings = {
      "seo.home.title": "ACEDD | Ana Sayfa - Özel",
      "seo.home.description": "Özel açıklama metni",
    };

    vi.mocked(getSettings)
      .mockResolvedValueOnce(mockSettings) // getSettings("seo.home")
      .mockResolvedValueOnce({ "site.name": "ACEDD" }); // getSettings("site")

    const seo = await getPageSeo("home");

    // This is what generateMetadata would receive
    const metadata = {
      title: seo.title,
      description: seo.description,
    };

    expect(metadata).toEqual({
      title: "ACEDD | Ana Sayfa - Özel",
      description: "Özel açıklama metni",
    });
  });

  it("should provide fallback values when settings are missing", async () => {
    vi.mocked(getSettings)
      .mockResolvedValueOnce({}) // getSettings("seo.scholarship")
      .mockResolvedValueOnce({ "site.name": "ACEDD" }); // getSettings("site")

    const seo = await getPageSeo("scholarship");

    const metadata = {
      title: seo.title,
      description: seo.description,
    };

    expect(metadata.title).toBe("ACEDD | Burs Başvurusu");
    expect(metadata.description).toBe(
      "Burs başvurusu yapmak için gerekli bilgiler ve başvuru formu"
    );
  });

  it("should handle dynamic site name changes", async () => {
    // First call with one site name
    vi.mocked(getSettings)
      .mockResolvedValueOnce({}) // getSettings("seo.home")
      .mockResolvedValueOnce({ "site.name": "Site Name 1" }); // getSettings("site")
    
    const result1 = await getPageSeo("home");
    expect(result1.title).toBe("Site Name 1 | Ana Sayfa");

    // Second call with different site name
    vi.mocked(getSettings)
      .mockResolvedValueOnce({}) // getSettings("seo.home")
      .mockResolvedValueOnce({ "site.name": "Site Name 2" }); // getSettings("site")
    
    const result2 = await getPageSeo("home");
    expect(result2.title).toBe("Site Name 2 | Ana Sayfa");
  });
});

