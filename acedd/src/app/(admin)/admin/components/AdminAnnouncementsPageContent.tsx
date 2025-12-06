"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Plus, AlertCircle } from "lucide-react";
import { AdminAnnouncementsTable } from "./AdminAnnouncementsTable";
import { AnnouncementFormDialog } from "./AnnouncementFormDialog";
import type {
  Announcement,
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
} from "@/lib/types/announcement";

export function AdminAnnouncementsPageContent() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/announcements");
      if (!response.ok) {
        throw new Error("Duyurular yüklenirken bir hata oluştu");
      }
      const data = await response.json();
      setAnnouncements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = () => {
    setEditingAnnouncement(null);
    setIsFormOpen(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu duyuruyu silmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Duyuru silinirken bir hata oluştu");
      }

      // Refresh list
      await fetchAnnouncements();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu");
    }
  };

  const handleTogglePin = async (id: string, currentPinStatus: boolean) => {
    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPinned: !currentPinStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Pin durumu güncellenirken bir hata oluştu");
      }

      // Refresh list
      await fetchAnnouncements();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu");
    }
  };

  const handleFormSubmit = async (
    data: CreateAnnouncementRequest | UpdateAnnouncementRequest
  ) => {
    try {
      setIsSubmitting(true);
      const url = editingAnnouncement
        ? `/api/announcements/${editingAnnouncement.id}`
        : "/api/announcements";
      const method = editingAnnouncement ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "İşlem başarısız oldu");
      }

      // Close form and refresh list
      setIsFormOpen(false);
      setEditingAnnouncement(null);
      await fetchAnnouncements();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Duyurular</h1>
          <p className="text-gray-600 mt-1">
            Dernek duyurularını görüntüleyin ve yönetin.
          </p>
        </div>
        <Button onClick={handleCreate} variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Duyuru
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <AdminAnnouncementsTable
        announcements={announcements}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onTogglePin={handleTogglePin}
        isLoading={loading}
      />

      <AnnouncementFormDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingAnnouncement(null);
        }}
        onSubmit={handleFormSubmit}
        announcement={editingAnnouncement}
        isLoading={isSubmitting}
      />
    </div>
  );
}
