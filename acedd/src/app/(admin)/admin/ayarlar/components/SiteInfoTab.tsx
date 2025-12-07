"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import { FileUpload } from "@/components/ui";
import { Save, Loader2 } from "lucide-react";
import type { Setting } from "@/lib/types/setting";

export default function SiteInfoTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState({
    siteName: "",
    siteDescription: "",
    logoUrl: "",
    faviconUrl: "",
    footerText: "",
  });

  // Preview files (henüz database'e kaydedilmemiş)
  const [previewFiles, setPreviewFiles] = useState<{
    logo?: { id: string; preview: string; file: File };
    favicon?: { id: string; preview: string; file: File };
  }>({});

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
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

      setSettings(settingsMap);

      // Populate form with existing settings
      setFormData({
        siteName: settingsMap["site.name"] || "",
        siteDescription: settingsMap["site.description"] || "",
        logoUrl: settingsMap["site.logoUrl"] || "",
        faviconUrl: settingsMap["site.faviconUrl"] || "",
        footerText: settingsMap["footer.text"] || "",
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  // Preview dosyalarını database'e kaydet
  const uploadPreviewFiles = async (files: { id: string; preview: string; file: File }[]): Promise<string[]> => {
    const datasetIds: string[] = [];
    
    for (const fileData of files) {
      const formData = new FormData();
      formData.append('file', fileData.file);
      
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          let errorMessage = 'Dosya yüklenirken bir hata oluştu.';
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch {
            errorMessage = `${errorMessage} (${response.status}: ${response.statusText})`;
          }
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        if (data.datasetIds && Array.isArray(data.datasetIds) && data.datasetIds.length > 0) {
          datasetIds.push(data.datasetIds[0]);
        }
      } catch (error) {
        console.error('Error uploading preview file:', error);
        throw error;
      }
    }
    
    return datasetIds;
  };

  // Logo preview dosyası seçildiğinde
  const handleLogoFileSelect = (results: { id: string; preview: string; file: File }[]) => {
    if (results.length > 0) {
      const { id, preview, file } = results[0];
      setPreviewFiles((prev) => ({
        ...prev,
        logo: { id, preview, file },
      }));
      setFormData((prev) => ({ ...prev, logoUrl: preview }));
    }
  };

  // Favicon preview dosyası seçildiğinde
  const handleFaviconFileSelect = (results: { id: string; preview: string; file: File }[]) => {
    if (results.length > 0) {
      const { id, preview, file } = results[0];
      setPreviewFiles((prev) => ({
        ...prev,
        favicon: { id, preview, file },
      }));
      setFormData((prev) => ({ ...prev, faviconUrl: preview }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrors({});

    try {
      let finalLogoUrl: string | null = formData.logoUrl || null;
      let finalFaviconUrl: string | null = formData.faviconUrl || null;

      // Preview logo'yu database'e kaydet
      if (previewFiles.logo) {
        try {
          const uploadedIds = await uploadPreviewFiles([previewFiles.logo]);
          if (uploadedIds.length > 0) {
            const imageResponse = await fetch(`/api/datasets/image/${uploadedIds[0]}`);
            if (imageResponse.ok) {
              const imageData = await imageResponse.json();
              if (imageData.fileUrl) {
                finalLogoUrl = imageData.fileUrl;
              }
            }
          }
        } catch (error) {
          console.error("[SiteInfoTab] Error uploading logo preview:", error);
          setErrors({ general: "Logo yüklenirken bir hata oluştu." });
          return;
        }
      }

      // Preview favicon'u database'e kaydet
      if (previewFiles.favicon) {
        try {
          const uploadedIds = await uploadPreviewFiles([previewFiles.favicon]);
          if (uploadedIds.length > 0) {
            const imageResponse = await fetch(`/api/datasets/image/${uploadedIds[0]}`);
            if (imageResponse.ok) {
              const imageData = await imageResponse.json();
              if (imageData.fileUrl) {
                finalFaviconUrl = imageData.fileUrl;
              }
            }
          }
        } catch (error) {
          console.error("[SiteInfoTab] Error uploading favicon preview:", error);
          setErrors({ general: "Favicon yüklenirken bir hata oluştu." });
          return;
        }
      }

      // Blob URL'leri database'e kaydetme (sadece preview için kullanılır)
      if (finalLogoUrl && finalLogoUrl.startsWith('blob:')) {
        finalLogoUrl = settings["site.logoUrl"] || null;
      }
      if (finalFaviconUrl && finalFaviconUrl.startsWith('blob:')) {
        finalFaviconUrl = settings["site.faviconUrl"] || null;
      }

      // Prepare all settings to update
      const settingsToUpdate = [
        { key: "site.name", value: formData.siteName },
        { key: "site.description", value: formData.siteDescription },
        { key: "site.logoUrl", value: finalLogoUrl && finalLogoUrl.trim() && !finalLogoUrl.startsWith('blob:') ? finalLogoUrl : null },
        { key: "site.faviconUrl", value: finalFaviconUrl && finalFaviconUrl.trim() && !finalFaviconUrl.startsWith('blob:') ? finalFaviconUrl : null },
        { key: "footer.text", value: formData.footerText },
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

      // Preview dosyalarını temizle
      setPreviewFiles({});

      // Refresh settings
      await fetchSettings();

      // Show success message
      alert("Ayarlar başarıyla kaydedildi!");
    } catch (error) {
      console.error("Error saving settings:", error);
      setErrors({ general: "Ayarlar kaydedilirken bir hata oluştu." });
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
            Genel Site Bilgileri
          </h2>
          <p className="text-sm text-gray-600">
            Site kimliği ve genel bilgileri yönetin.
          </p>
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">{errors.general}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-4">
            <Input
              label="Site Adı"
              value={formData.siteName}
              onChange={(e) => handleChange("siteName", e.target.value)}
              placeholder="ACEDD"
              error={errors.siteName}
            />

            <Textarea
              label="Kısa Açıklama"
              value={formData.siteDescription}
              onChange={(e) => handleChange("siteDescription", e.target.value)}
              placeholder="Araştırma, Çevre ve Doğa Derneği"
              rows={3}
              error={errors.siteDescription}
              helperText="Site hakkında kısa açıklama. Bu metin hem SEO metadata (sayfa açıklamaları, Open Graph, Twitter cards) hem de footer'da site adının altında gösterilir."
            />
          </div>

          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900">Logo ve Favicon</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo
                </label>
                {(formData.logoUrl && (formData.logoUrl.startsWith("data:") || formData.logoUrl.startsWith("blob:"))) && (
                  <div className="mb-3">
                    <img 
                      src={formData.logoUrl} 
                      alt={previewFiles.logo ? "Yeni logo önizlemesi" : "Mevcut logo"} 
                      className="max-w-xs max-h-32 object-contain border border-gray-200 rounded"
                    />
                    {previewFiles.logo && (
                      <p className="text-xs text-blue-600 mt-1">Yeni logo önizlemesi (kaydet butonuna basıldığında kaydedilecek)</p>
                    )}
                  </div>
                )}
                <FileUpload
                  label=""
                  value={[]}
                  onChange={() => {}}
                  onFileSelect={handleLogoFileSelect}
                  multiple={false}
                  maxFiles={1}
                  previewMode={true}
                />
                {formData.logoUrl && !formData.logoUrl.startsWith("data:") && (
                  <p className="text-xs text-gray-500 mt-2">
                    Mevcut logo URL: {formData.logoUrl.substring(0, 60)}...
                  </p>
                )}
                {errors.logoUrl && (
                  <p className="text-sm text-red-600 mt-1">{errors.logoUrl}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Favicon
                </label>
                {formData.faviconUrl && formData.faviconUrl.startsWith("data:") && (
                  <div className="mb-3">
                    <img 
                      src={formData.faviconUrl} 
                      alt={previewFiles.favicon ? "Yeni favicon önizlemesi" : "Mevcut favicon"} 
                      className="w-16 h-16 object-contain border border-gray-200 rounded"
                    />
                    {previewFiles.favicon && (
                      <p className="text-xs text-blue-600 mt-1">Yeni favicon önizlemesi (kaydet butonuna basıldığında kaydedilecek)</p>
                    )}
                  </div>
                )}
                <FileUpload
                  label=""
                  value={[]}
                  onChange={() => {}}
                  onFileSelect={handleFaviconFileSelect}
                  multiple={false}
                  maxFiles={1}
                  previewMode={true}
                />
                {formData.faviconUrl && !formData.faviconUrl.startsWith("data:") && !formData.faviconUrl.startsWith("blob:") && (
                  <p className="text-xs text-gray-500 mt-2">
                    Mevcut favicon URL: {formData.faviconUrl.substring(0, 60)}...
                  </p>
                )}
                {errors.faviconUrl && (
                  <p className="text-sm text-red-600 mt-1">{errors.faviconUrl}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t pt-6">
            <Textarea
              label="Footer Metni"
              value={formData.footerText}
              onChange={(e) => handleChange("footerText", e.target.value)}
              placeholder="© 2024 ACEDD. Tüm hakları saklıdır."
              rows={2}
              error={errors.footerText}
              helperText="Footer'ın alt kısmında gösterilecek metin (copyright vb.)"
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
  );
}
