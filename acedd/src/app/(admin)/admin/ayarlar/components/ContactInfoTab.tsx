"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import { Save, Loader2 } from "lucide-react";
import type { Setting } from "@/lib/types/setting";

export default function ContactInfoTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    address: "",
  });

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/settings?prefix=contact");
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
        email: settingsMap["contact.email"] || "",
        phone: settingsMap["contact.phone"] || "",
        address: settingsMap["contact.address"] || "",
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

  const handleSave = async () => {
    setIsSaving(true);
    setErrors({});

    try {
      // Prepare all settings to update
      const settingsToUpdate = [
        { key: "contact.email", value: formData.email },
        { key: "contact.phone", value: formData.phone },
        { key: "contact.address", value: formData.address },
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
      alert("İletişim bilgileri başarıyla kaydedildi!");
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
            İletişim Bilgileri
          </h2>
          <p className="text-sm text-gray-600">
            İletişim bilgilerini yönetin.
          </p>
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">{errors.general}</p>
          </div>
        )}

        <div className="space-y-4">
          <Input
            label="E-posta"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="info@acedd.org"
            error={errors.email}
          />

          <Input
            label="Telefon"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+90 555 123 4567"
            error={errors.phone}
          />

          <Textarea
            label="Adres"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Yukarı Mahalle, Atatürk Bulvarı, No:32, Özcan Plaza, Kat 1, Acıpayam, Denizli, Türkiye"
            rows={3}
            error={errors.address}
            helperText="Tam adres bilgisi"
          />
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
