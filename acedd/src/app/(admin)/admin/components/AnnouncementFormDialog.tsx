"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { X, XCircle } from "lucide-react";
import type {
  Announcement,
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
} from "@/lib/types/announcement";
import { ANNOUNCEMENT_CATEGORY_LABELS } from "@/lib/types/announcement";

interface AnnouncementFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAnnouncementRequest | UpdateAnnouncementRequest) => Promise<void>;
  announcement?: Announcement | null;
  isLoading?: boolean;
}

// Sprint 14.3: Merkezi kategori label map'inden kullanılıyor
const CATEGORY_OPTIONS = [
  { value: "general", label: ANNOUNCEMENT_CATEGORY_LABELS.general },
  { value: "scholarship", label: ANNOUNCEMENT_CATEGORY_LABELS.scholarship },
  { value: "event", label: ANNOUNCEMENT_CATEGORY_LABELS.event },
  { value: "system", label: ANNOUNCEMENT_CATEGORY_LABELS.system },
];

export function AnnouncementFormDialog({
  isOpen,
  onClose,
  onSubmit,
  announcement,
  isLoading = false,
}: AnnouncementFormDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    category: "general",
    startsAt: "",
    endsAt: "",
    isPinned: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title,
        summary: announcement.summary || "",
        content: announcement.content,
        category: announcement.category,
        startsAt: announcement.startsAt
          ? new Date(announcement.startsAt).toISOString().slice(0, 16)
          : "",
        endsAt: announcement.endsAt
          ? new Date(announcement.endsAt).toISOString().slice(0, 16)
          : "",
        isPinned: announcement.isPinned,
      });
    } else {
      setFormData({
        title: "",
        summary: "",
        content: "",
        category: "general",
        startsAt: "",
        endsAt: "",
        isPinned: false,
      });
    }
    setErrors({});
  }, [announcement, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const now = new Date();

    if (!formData.title.trim()) {
      newErrors.title = "Başlık zorunludur";
    }

    if (!formData.content.trim()) {
      newErrors.content = "İçerik zorunludur";
    }

    if (!formData.category) {
      newErrors.category = "Kategori zorunludur";
    }

    // Validate startsAt
    if (formData.startsAt) {
      const starts = new Date(formData.startsAt);
      if (isNaN(starts.getTime())) {
        newErrors.startsAt = "Geçerli bir tarih giriniz";
      } else if (starts < now) {
        // Allow past dates but warn (not an error, just informational)
        // We'll show a warning in the helper text instead
      }
    }

    // Validate endsAt
    if (formData.endsAt) {
      const ends = new Date(formData.endsAt);
      if (isNaN(ends.getTime())) {
        newErrors.endsAt = "Geçerli bir tarih giriniz";
      } else if (ends < now) {
        newErrors.endsAt = "Bitiş tarihi geçmiş bir tarih olamaz (duyuru pasif olur)";
      }
    }

    // Validate date range logic
    if (formData.startsAt && formData.endsAt) {
      const starts = new Date(formData.startsAt);
      const ends = new Date(formData.endsAt);
      if (starts >= ends) {
        newErrors.endsAt = "Bitiş tarihi başlangıç tarihinden sonra olmalıdır";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const submitData: CreateAnnouncementRequest | UpdateAnnouncementRequest = {
      title: formData.title.trim(),
      summary: formData.summary.trim() || null,
      content: formData.content.trim(),
      category: formData.category,
      startsAt: formData.startsAt ? new Date(formData.startsAt).toISOString() : null,
      endsAt: formData.endsAt ? new Date(formData.endsAt).toISOString() : null,
      isPinned: formData.isPinned,
    };

    await onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>
            {announcement ? "Duyuruyu Düzenle" : "Yeni Duyuru Oluştur"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Input
              label="Başlık *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              error={errors.title}
              required
            />

            <Textarea
              label="Özet"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              error={errors.summary}
              rows={2}
              helperText="Kısa bir özet (opsiyonel)"
            />

            <Textarea
              label="İçerik *"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              error={errors.content}
              rows={6}
              required
            />

            <Select
              label="Kategori *"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={CATEGORY_OPTIONS}
              error={errors.category}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="relative">
                  <Input
                    label="Başlangıç Tarihi"
                    type="datetime-local"
                    value={formData.startsAt}
                    onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
                    error={errors.startsAt}
                    helperText={
                      formData.startsAt && new Date(formData.startsAt) > new Date()
                        ? "Gelecekteki bir tarih seçtiniz - duyuru bu tarihe kadar pasif kalacak"
                        : "Opsiyonel - Boş bırakırsanız duyuru hemen aktif olur"
                    }
                    className={formData.startsAt ? "pr-8" : ""}
                  />
                  {formData.startsAt && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, startsAt: "" })}
                      className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 transition-colors"
                      title="Tarihi temizle"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <div className="relative">
                  <Input
                    label="Bitiş Tarihi"
                    type="datetime-local"
                    value={formData.endsAt}
                    onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })}
                    error={errors.endsAt}
                    helperText={
                      formData.endsAt && new Date(formData.endsAt) < new Date()
                        ? "Geçmiş bir tarih seçtiniz - duyuru pasif olacak"
                        : "Opsiyonel - Boş bırakırsanız duyuru süresiz aktif kalır"
                    }
                    className={formData.endsAt ? "pr-8" : ""}
                  />
                  {formData.endsAt && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, endsAt: "" })}
                      className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 transition-colors"
                      title="Tarihi temizle"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPinned"
                checked={formData.isPinned}
                onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPinned" className="text-sm font-medium text-gray-700">
                Sabitle (Pinned)
              </label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              İptal
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              {announcement ? "Güncelle" : "Oluştur"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
