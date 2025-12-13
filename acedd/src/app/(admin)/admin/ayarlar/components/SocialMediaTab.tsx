"use client";

import React, { useState, useEffect } from "react";
import { Button, Input } from "@/components/ui";
import { Save, Loader2, Instagram, Twitter, Facebook, Linkedin, Youtube } from "lucide-react";
import type { Setting } from "@/lib/types/setting";
import { logClientError } from "@/lib/utils/clientLogging";

export default function SocialMediaTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState({
    instagram: "",
    twitter: "",
    facebook: "",
    linkedin: "",
    youtube: "",
  });

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/settings?prefix=social");
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

      // Populate form with existing settings
      setFormData({
        instagram: settingsMap["social.instagram"] || "",
        twitter: settingsMap["social.twitter"] || "",
        facebook: settingsMap["social.facebook"] || "",
        linkedin: settingsMap["social.linkedin"] || "",
        youtube: settingsMap["social.youtube"] || "",
      });
    } catch (error) {
      logClientError("[SocialMediaTab][FETCH]", error);
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

  const handleSave = async () => {
    setIsSaving(true);
    setErrors({});

    try {
      // Prepare all settings to update
      const settingsToUpdate = [
        { key: "social.instagram", value: formData.instagram },
        { key: "social.twitter", value: formData.twitter },
        { key: "social.facebook", value: formData.facebook },
        { key: "social.linkedin", value: formData.linkedin },
        { key: "social.youtube", value: formData.youtube },
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
      alert("Sosyal medya linkleri başarıyla kaydedildi!");
    } catch (error) {
      logClientError("[SocialMediaTab][SAVE]", error);
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

  const socialFields = [
    {
      key: "instagram" as const,
      label: "Instagram",
      icon: Instagram,
      placeholder: "https://instagram.com/acedd",
    },
    {
      key: "twitter" as const,
      label: "Twitter",
      icon: Twitter,
      placeholder: "https://twitter.com/acedd",
    },
    {
      key: "facebook" as const,
      label: "Facebook",
      icon: Facebook,
      placeholder: "https://facebook.com/acedd",
    },
    {
      key: "linkedin" as const,
      label: "LinkedIn",
      icon: Linkedin,
      placeholder: "https://linkedin.com/company/acedd",
    },
    {
      key: "youtube" as const,
      label: "YouTube",
      icon: Youtube,
      placeholder: "https://youtube.com/@acedd",
    },
  ];

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Sosyal Medya Linkleri
          </h2>
          <p className="text-sm text-gray-600">
            Sosyal medya platform linklerini yönetin.
          </p>
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">{errors.general}</p>
          </div>
        )}

        <div className="space-y-4">
          {socialFields.map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.key} className="relative">
                <div className="absolute left-3 top-9 text-gray-400">
                  <Icon className="h-5 w-5" />
                </div>
                <Input
                  label={field.label}
                  type="url"
                  value={formData[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  error={errors[field.key]}
                  className="pl-10"
                />
              </div>
            );
          })}
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

