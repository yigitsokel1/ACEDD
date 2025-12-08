"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import { Save, Loader2 } from "lucide-react";
import type { Setting } from "@/lib/types/setting";
import type { PageIdentifier } from "@/lib/types/setting";

const PAGES: Array<{ key: PageIdentifier; label: string }> = [
  { key: "home", label: "Ana Sayfa" },
  { key: "about", label: "Hakkımızda" },
  { key: "events", label: "Etkinlikler" },
  { key: "scholarship", label: "Burs Başvurusu" },
  { key: "donation", label: "Bağış Yap" },
  { key: "membership", label: "Üyelik Başvurusu" },
  { key: "contact", label: "İletişim" },
];

export default function SEOTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPage, setSelectedPage] = useState<PageIdentifier>("home");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  // Fetch settings on mount and when page changes
  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/settings");
      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }

      const data: Setting[] = await response.json();

      // Convert settings array to object for easy access
      const settingsMap: Record<string, string> = {};
      data.forEach((setting) => {
        if (setting.value !== null && typeof setting.value === "string") {
          settingsMap[setting.key] = setting.value;
        }
      });

      // Populate form with existing settings for selected page
      const prefix = `seo.${selectedPage}`;
      setFormData({
        title: settingsMap[`${prefix}.title`] || "",
        description: settingsMap[`${prefix}.description`] || "",
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedPage]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrors({});

    try {
      const prefix = `seo.${selectedPage}`;
      const settingsToUpdate = [
        { key: `${prefix}.title`, value: formData.title || null },
        { key: `${prefix}.description`, value: formData.description || null },
      ];

      // Update all settings in parallel
      const updatePromises = settingsToUpdate.map((setting) =>
        fetch("/api/settings", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(setting),
        })
      );

      const results = await Promise.all(updatePromises);

      // Check for errors
      const errors: string[] = [];
      for (const result of results) {
        if (!result.ok) {
          const errorData = await result.json();
          errors.push(errorData.message || "Failed to update setting");
        }
      }

      if (errors.length > 0) {
        setErrors({ general: errors.join(", ") });
        return;
      }

      // Refresh settings
      await fetchSettings();

      // Show success message
      alert("SEO ayarları başarıyla kaydedildi!");
    } catch (error) {
      console.error("Error saving SEO settings:", error);
      setErrors({ general: "SEO ayarları kaydedilirken bir hata oluştu." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Ayarlar yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            SEO Ayarları
          </h2>
          <p className="text-sm text-gray-600">
            Her sayfa için SEO başlık ve açıklama metinlerini yönetin. Bu ayarlar arama motorları ve sosyal medya paylaşımları için kullanılır.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            <strong>Not:</strong> SEO ve içerik ayarları sadece SUPER_ADMIN tarafından değiştirilebilir.
          </p>
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">{errors.general}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Page Selection */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Sayfa Seçimi
              </h3>
              <div className="space-y-2">
                {PAGES.map((page) => (
                  <button
                    key={page.key}
                    onClick={() => setSelectedPage(page.key)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedPage === page.key
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {PAGES.find((p) => p.key === selectedPage)?.label} - SEO Ayarları
                </h3>

                <div className="space-y-4">
                  <Input
                    label="SEO Title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Sayfa başlığı (ör: ACEDD | Ana Sayfa)"
                    error={errors.title}
                    helperText="Arama motorlarında ve tarayıcı sekmesinde görünecek başlık. 50-60 karakter arası önerilir."
                  />

                  <Textarea
                    label="SEO Description"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Sayfa açıklaması"
                    rows={4}
                    error={errors.description}
                    helperText="Arama motorlarında görünecek açıklama metni. 150-160 karakter arası önerilir."
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="min-w-[120px]"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Kaydet
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

