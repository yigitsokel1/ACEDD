"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import { Save, Loader2 } from "lucide-react";
import type { Setting } from "@/lib/types/setting";
import type { PageIdentifier } from "@/lib/types/setting";
import { getContentPrefix, getContentKey } from "@/lib/settings/keys";
import EnhancedJsonEditor from "./EnhancedJsonEditor";
import { PAGE_SCHEMAS } from "@/lib/constants/settingsSchema";
import { logClientError } from "@/lib/utils/clientLogging";

const PAGES: Array<{ key: PageIdentifier; label: string }> = [
  { key: "home", label: "Ana Sayfa" },
  { key: "about", label: "Hakkımızda" },
  { key: "events", label: "Etkinlikler" },
  { key: "scholarship", label: "Burs Başvurusu" },
  { key: "donation", label: "Bağış Yap" },
  { key: "membership", label: "Üyelik Başvurusu" },
  { key: "contact", label: "İletişim" },
];

/**
 * Page-specific content fields configuration
 * Defines which fields are available for each page
 */
const PAGE_FIELDS: Record<PageIdentifier, Array<{ key: string; label: string; type: "input" | "textarea" | "json"; rows?: number; helperText?: string }>> = {
  home: [
    // Hero Section
    { key: "heroTitle", label: "Hero Başlık", type: "input", helperText: "Ana sayfanın en üst kısmında görünecek ana başlık" },
    { key: "intro", label: "Hero Açıklama", type: "textarea", rows: 3, helperText: "Hero bölümündeki ana açıklama metni" },
    { key: "primaryButtonText", label: "Hero Birincil Buton", type: "input", helperText: "Hero bölümündeki birincil buton metni" },
    { key: "secondaryButtonText", label: "Hero İkincil Buton", type: "input", helperText: "Hero bölümündeki ikincil buton metni" },
    // Stats Section
    { key: "stats", label: "İstatistikler", type: "json", helperText: "İstatistikler listesi (value, label). Icon ve color otomatik eklenir." },
    
    { key: "visualCardTitle", label: "Görsel Kart Başlığı", type: "input", helperText: "Hero bölümündeki sağ taraftaki görsel kartın başlığı" },
    { key: "visualCardDescription", label: "Görsel Kart Açıklaması", type: "input", helperText: "Görsel kartın altındaki kısa açıklama metni" },
    // Activities Section
    { key: "activities", label: "Aktiviteler", type: "json", helperText: "Aktiviteler listesi (title, description). Icon ve color otomatik eklenir." },
    
   
    
    // Mission Section
    { key: "missionTitle", label: "Misyon Bölümü Başlığı", type: "input", helperText: "Misyon bölümünün başlığı" },
    { key: "missionDescription", label: "Misyon Bölümü Açıklaması", type: "textarea", rows: 3, helperText: "Misyon bölümündeki açıklama metni" },
    { key: "missions", label: "Misyon Kartları", type: "json", helperText: "Misyon kartları listesi (title, description). Icon ve color otomatik eklenir." },
    { key: "missionFooter", label: "Misyon Bölümü Alt Metni", type: "textarea", rows: 2, helperText: "Misyon bölümünün altındaki kapanış metni" },
    
    
    // CTA Section
    { key: "ctaTitle", label: "CTA Bölümü Başlığı", type: "input", helperText: "Sayfa sonundaki CTA bölümünün başlığı" },
    { key: "ctaDescription", label: "CTA Bölümü Açıklaması", type: "textarea", rows: 3, helperText: "CTA bölümündeki açıklama metni" },
    { key: "ctaPrimaryButtonText", label: "CTA Birincil Buton", type: "input", helperText: "CTA bölümündeki birincil buton metni" },
    { key: "ctaSecondaryButtonText", label: "CTA İkincil Buton", type: "input", helperText: "CTA bölümündeki ikincil buton metni" },
    { key: "trustIndicators", label: "Güven Göstergeleri", type: "json", helperText: "Güven göstergeleri listesi (label). Icon ve color otomatik eklenir." },
  ],
  scholarship: [
    { key: "heroTitle", label: "Hero Başlık", type: "input", helperText: "Burs başvurusu sayfasının ana başlığı" },
    { key: "intro", label: "Hero Açıklama", type: "textarea", rows: 4, helperText: "Hero bölümündeki açıklama metni" },
    { key: "requirements", label: "Başvuru Şartları", type: "json", helperText: "Burs başvurusu için gerekli şartlar listesi (string array)" },
    { key: "applicationSteps", label: "Başvuru Süreci", type: "json", helperText: "Başvuru süreci adımları (step, title, description). Icon ve color otomatik eklenir." },
  ],
  membership: [
    { key: "heroTitle", label: "Hero Başlık", type: "input", helperText: "Üyelik başvurusu sayfasının ana başlığı" },
    { key: "intro", label: "Hero Açıklama", type: "textarea", rows: 4, helperText: "Hero bölümündeki açıklama metni" },
    { key: "membershipConditionsText", label: "Üyelik Şartları", type: "textarea", rows: 8, helperText: "Başvuru formunda gösterilecek üyelik şartları metni" },
    { key: "additionalInfoTitle", label: "Ek Bilgi Başlığı", type: "input", helperText: "Sayfa altındaki ek bilgi bölümünün başlığı" },
    { key: "additionalInfoDescription", label: "Ek Bilgi Açıklaması", type: "textarea", rows: 3, helperText: "Ek bilgi bölümündeki açıklama metni" },
  ],
  about: [
    { key: "heroTitle", label: "Hero Başlık", type: "input", helperText: "Hakkımızda sayfasının ana başlığı" },
    { key: "intro", label: "Hero Açıklama", type: "textarea", rows: 4, helperText: "Hero bölümündeki açıklama metni" },
    { key: "missionVisionTitle", label: "Misyon/Vizyon Bölümü Başlığı", type: "input", helperText: "Misyon ve Vizyon bölümünün başlığı" },
    { key: "missionVisionSubtitle", label: "Misyon/Vizyon Bölümü Alt Başlığı", type: "input", helperText: "Misyon ve Vizyon bölümünün alt başlığı" },
    { key: "missionVision", label: "Misyon ve Vizyon", type: "json", helperText: "Misyon ve vizyon içerikleri (mission: {title, description}, vision: {title, description}). Icon ve color otomatik eklenir." },
    { key: "valuesTitle", label: "Değerler Bölümü Başlığı", type: "input", helperText: "Değerler bölümünün başlığı" },
    { key: "valuesSubtitle", label: "Değerler Bölümü Alt Başlığı", type: "textarea", rows: 2, helperText: "Değerler bölümünün alt başlığı/açıklaması" },
    { key: "values", label: "Değerler Listesi", type: "json", helperText: "Değerler listesi (title, description). Icon ve color otomatik eklenir." },
    { key: "valuesFooter", label: "Değerler Bölümü Alt Metni", type: "textarea", rows: 2, helperText: "Değerler bölümünün altındaki kapanış metni" },
    { key: "goalsTitle", label: "Hedefler Bölümü Başlığı", type: "input", helperText: "Hedefler bölümünün başlığı" },
    { key: "goalsSubtitle", label: "Hedefler Bölümü Alt Başlığı", type: "input", helperText: "Hedefler bölümünün alt başlığı" },
    { key: "goalsMainTitle", label: "Ana Hedef Başlığı", type: "input", helperText: "Ana hedef kartının başlığı" },
    { key: "goalsMainDescription", label: "Ana Hedef Açıklaması", type: "textarea", rows: 3, helperText: "Ana hedef kartının açıklama metni" },
    { key: "goalsActivitiesTitle", label: "Faaliyetler Başlığı", type: "input", helperText: "Faaliyetler listesinin üstündeki başlık" },
    { key: "goalsActivitiesSubtitle", label: "Faaliyetler Alt Başlığı", type: "input", helperText: "Faaliyetler listesinin üstündeki açıklama" },
    { key: "goals", label: "Hedefler ve Faaliyetler Listesi", type: "json", helperText: "Hedefler ve faaliyetler listesi (title, description). Icon ve color otomatik eklenir." },
    { key: "goalsFooter", label: "Hedefler Bölümü Alt Metni", type: "textarea", rows: 2, helperText: "Hedefler bölümünün altındaki kapanış metni" },
    { key: "jobDescriptionsTitle", label: "Görev Tanımları Başlığı", type: "input", helperText: "Görev tanımları bölümünün başlığı" },
    { key: "jobDescriptions", label: "Görev Tanımları Listesi", type: "json", helperText: "Görev tanımları listesi (title, description). Icon ve color otomatik eklenir." },
    { key: "organizationStructureTitle", label: "Organizasyon Yapısı Başlığı", type: "input", helperText: "Organizasyon yapısı bölümünün başlığı" },
    { key: "organizationStructureDescription", label: "Organizasyon Yapısı Açıklaması", type: "textarea", rows: 3, helperText: "Organizasyon yapısı bölümündeki açıklama metni" },
  ],
  contact: [
    { key: "heroTitle", label: "Hero Başlık", type: "input", helperText: "İletişim sayfasının ana başlığı" },
    { key: "intro", label: "Hero Açıklama", type: "textarea", rows: 4, helperText: "Hero bölümündeki açıklama metni" },
    { key: "infoSectionTitle", label: "İletişim Bilgileri Başlığı", type: "input", helperText: "İletişim bilgileri bölümünün başlığı" },
    { key: "infoSectionDescription", label: "İletişim Bilgileri Açıklaması", type: "textarea", rows: 2, helperText: "İletişim bilgileri bölümündeki açıklama metni" },
    { key: "contactInfoItems", label: "İletişim Kartları", type: "json", helperText: "İletişim kartları listesi (title, description). Icon ve color otomatik eklenir." },
  ],
  events: [
    { key: "heroTitle", label: "Hero Başlık", type: "input", helperText: "Etkinlikler sayfasının ana başlığı" },
    { key: "intro", label: "Hero Açıklama", type: "textarea", rows: 3, helperText: "Hero bölümündeki açıklama metni" },
    { key: "ctaTitle", label: "CTA Bölümü Başlığı", type: "input", helperText: "Sayfa sonundaki CTA bölümünün başlığı" },
    { key: "ctaSubtitle", label: "CTA Bölümü Alt Başlığı", type: "input", helperText: "CTA bölümündeki alt başlık" },
    { key: "ctaPrimaryButtonText", label: "CTA Birincil Buton Metni", type: "input", helperText: "CTA bölümündeki birincil buton metni" },
    { key: "ctaSecondaryButtonText", label: "CTA İkincil Buton Metni", type: "input", helperText: "CTA bölümündeki ikincil buton metni" },
  ],
  donation: [
    // Hero Section
    { key: "heroTitle", label: "Hero Başlık", type: "input", helperText: "Bağış yap sayfasının ana başlığı" },
    { key: "intro", label: "Hero Açıklama", type: "textarea", rows: 3, helperText: "Hero bölümündeki açıklama metni" },
    
    // Bank Accounts Section
    { key: "introduction", label: "Banka Hesapları Giriş", type: "textarea", rows: 2, helperText: "Banka hesapları bölümünün üstündeki giriş metni" },
    { key: "bankAccounts", label: "Banka Hesapları", type: "json", helperText: "Banka hesapları listesi (currency, bank, accountName, iban). Icon ve color otomatik eklenir." },
    
    // Thank You Section
    { key: "thankYouTitle", label: "Teşekkür Başlığı", type: "input", helperText: "Teşekkür bölümünün başlığı" },
    { key: "thankYouDescription", label: "Teşekkür Açıklaması", type: "textarea", rows: 3, helperText: "Teşekkür bölümündeki açıklama metni" },
    { key: "contactMessage", label: "İletişim Mesajı", type: "textarea", rows: 2, helperText: "Teşekkür bölümünün altındaki iletişim mesajı" },
  ],
};

export default function ContentTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPage, setSelectedPage] = useState<PageIdentifier>("home");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dynamic form state based on selected page
  // Can contain both string values and parsed JSON objects/arrays
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Fetch settings on mount and when page changes
  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      // Use prefix parameter to fetch only relevant settings for selected page
      const prefix = getContentPrefix(selectedPage);
      const response = await fetch(`/api/settings?prefix=${encodeURIComponent(prefix)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }

      const data: Setting[] = await response.json();

      // Convert settings array to object for easy access
      // Handle both string and JSON values
      const settingsMap: Record<string, any> = {};
      data.forEach((setting) => {
        if (setting.value !== null) {
          settingsMap[setting.key] = setting.value;
        }
      });

      // Populate form with existing settings for selected page
      const pageFields = PAGE_FIELDS[selectedPage];
      const initialFormData: Record<string, any> = {};

      pageFields.forEach((field) => {
        const key = getContentKey(selectedPage, field.key);
        const value = settingsMap[key];
        
        if (field.type === "json") {
          // For JSON fields, keep as object/array
          initialFormData[field.key] = value || (Array.isArray(value) ? [] : {});
        } else {
          // For string fields, keep as string
          initialFormData[field.key] = typeof value === "string" ? value : "";
        }
      });

      setFormData(initialFormData);
    } catch (error) {
      logClientError("[ContentTab][FETCH]", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedPage]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (field: string, value: string | any) => {
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
      const pageFields = PAGE_FIELDS[selectedPage];
      const settingsToUpdate: Array<{ key: string; value: any }> = [];
      
      // Prepare settings to update
      for (const field of pageFields) {
        const value = formData[field.key];
        const settingKey = getContentKey(selectedPage, field.key);
        
        // Handle different field types
        if (field.type === "json") {
          // For JSON fields, use the value as-is (already parsed from EnhancedJsonEditor)
          // Accept null, empty array, empty object, or valid JSON structure
          if (value === undefined || value === null) {
            settingsToUpdate.push({ key: settingKey, value: null });
          } else if (Array.isArray(value)) {
            settingsToUpdate.push({ key: settingKey, value: value });
          } else if (typeof value === "object") {
            settingsToUpdate.push({ key: settingKey, value: value });
          } else {
            // Invalid JSON value - try to parse if it's a string
            try {
              const parsed = typeof value === "string" ? JSON.parse(value) : value;
              settingsToUpdate.push({ key: settingKey, value: parsed });
            } catch {
              // Invalid JSON value - skip this field
            }
          }
        } else {
          // For string fields, trim and use string or null
          const stringValue = typeof value === "string" ? value.trim() : "";
          settingsToUpdate.push({
            key: settingKey,
            value: stringValue || null,
          });
        }
      }

      if (settingsToUpdate.length === 0) {
        setErrors({ general: "Kaydedilecek ayar bulunamadı." });
        setIsSaving(false);
        return;
      }

      // Update all settings sequentially to ensure proper error handling
      const updateResults: Array<{ success: boolean; key: string; error?: string }> = [];
      
      for (const setting of settingsToUpdate) {
        try {
          const response = await fetch("/api/settings", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(setting),
          });

          if (!response.ok) {
            let errorMessage = `Failed to update ${setting.key}`;
            try {
              const errorData = await response.json();
              errorMessage = errorData.message || errorData.error || errorMessage;
            } catch {
              // If JSON parsing fails, use default message
              errorMessage = `HTTP ${response.status}: Failed to update ${setting.key}`;
            }
            updateResults.push({ 
              success: false, 
              key: setting.key,
              error: errorMessage
            });
          } else {
            updateResults.push({ success: true, key: setting.key });
          }
        } catch (error) {
          updateResults.push({ 
            success: false, 
            key: setting.key,
            error: error instanceof Error ? error.message : `Network error while updating ${setting.key}` 
          });
        }
      }

      // Check for errors
      const failedUpdates = updateResults.filter(r => !r.success);
      
      if (failedUpdates.length > 0) {
        const errorMessages = failedUpdates
          .map(r => `${r.key}: ${r.error || "Bilinmeyen hata"}`)
          .join("; ");
        setErrors({ general: `Bazı ayarlar kaydedilemedi: ${errorMessages}` });
        
        // Still refresh to show what was saved
        await fetchSettings();
        return;
      }

      // All updates successful - refresh settings to show updated values
      await fetchSettings();

      // Show success message
      alert(`İçerik ayarları başarıyla kaydedildi! (${settingsToUpdate.length} ayar güncellendi)`);
    } catch (error) {
      logClientError("[ContentTab][SAVE]", error);
      setErrors({ 
        general: error instanceof Error ? error.message : "İçerik ayarları kaydedilirken bir hata oluştu." 
      });
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

  const pageFields = PAGE_FIELDS[selectedPage];
  const selectedPageLabel = PAGES.find((p) => p.key === selectedPage)?.label;

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Sayfa İçerikleri
          </h2>
          <p className="text-sm text-gray-600">
            Her sayfa için hero başlık, alt başlık, açıklama metinleri ve diğer statik içerikleri yönetin.
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
                  {selectedPageLabel} - İçerik Ayarları
                </h3>

                <div className="space-y-4">
                  {pageFields.map((field) => {
                    const fieldValue = formData[field.key];

                    if (field.type === "json") {
                      // Find corresponding field schema
                      const pageSchemas = PAGE_SCHEMAS[selectedPage as PageIdentifier] || [];
                      const fieldSchema = pageSchemas.find(schema => schema.key === field.key);
                      
                      if (!fieldSchema) {
                        return (
                          <div key={field.key} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              {field.label}
                            </label>
                            <div className="bg-red-50 border border-red-200 rounded-md p-3">
                              <p className="text-xs text-red-800">
                                ⚠️ Schema tanımı bulunamadı: {field.key}
                              </p>
                            </div>
                          </div>
                        );
                      }
                      
                      return (
                        <div key={field.key} className="space-y-2">
                          <EnhancedJsonEditor
                            fieldSchema={fieldSchema}
                            value={fieldValue}
                            onChange={(value) => handleChange(field.key, value)}
                            error={errors[field.key]}
                          />
                        </div>
                      );
                    }

                    if (field.type === "textarea") {
                      return (
                        <Textarea
                          key={field.key}
                          label={field.label}
                          value={typeof fieldValue === "string" ? fieldValue : ""}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          placeholder={`${field.label} girin`}
                          rows={field.rows || 4}
                          error={errors[field.key]}
                          helperText={field.helperText}
                        />
                      );
                    }

                    return (
                      <Input
                        key={field.key}
                        label={field.label}
                        value={typeof fieldValue === "string" ? fieldValue : ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={`${field.label} girin`}
                        error={errors[field.key]}
                        helperText={field.helperText}
                      />
                    );
                  })}
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

