"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button, Badge, Input, Select } from "@/components/ui";
import { 
  Eye, 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  Search,
  Trash2,
  Archive,
  CheckCircle
} from "lucide-react";
import type { ContactMessage, ContactMessageStatus } from "@/lib/types/contact";

interface ContactMessageModalProps {
  message: ContactMessage | null;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

function ContactMessageModal({ 
  message, 
  onClose, 
  onMarkAsRead,
  onArchive,
  onDelete
}: ContactMessageModalProps) {
  const [action, setAction] = useState<'read' | 'archive' | 'delete' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (message) {
      setAction(null);
    }
  }, [message]);

  if (!message) return null;

  const handleSubmit = async () => {
    if (!action) return;

    setIsSubmitting(true);
    try {
      if (action === 'read') {
        await onMarkAsRead(message.id);
      } else if (action === 'archive') {
        await onArchive(message.id);
      } else if (action === 'delete') {
        await onDelete(message.id);
      }
      onClose();
      setAction(null);
    } catch (error) {
      console.error("Error performing action:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: ContactMessageStatus) => {
    switch (status) {
      case 'NEW':
        return <Badge variant="warning">Yeni</Badge>;
      case 'READ':
        return <Badge variant="secondary">Okundu</Badge>;
      case 'ARCHIVED':
        return <Badge variant="secondary">Arşivde</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mesaj Detayları</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Status Badge */}
          <div className="mb-6">
            {getStatusBadge(message.status)}
          </div>

          <div className="space-y-6">
            {/* İletişim Bilgileri */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">İletişim Bilgileri</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                  <p className="text-gray-900">{message.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {message.email}
                  </p>
                </div>
                {message.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    <p className="text-gray-900 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {message.phone}
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gönderim Tarihi</label>
                  <p className="text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {new Date(message.createdAt).toLocaleString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Mesaj İçeriği */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mesaj İçeriği</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                  <p className="text-gray-900 font-medium">{message.subject}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj</label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-900 whitespace-pre-wrap">{message.message}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata (opsiyonel) */}
            {(message.readAt || message.archivedAt) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Durum Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {message.readAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Okunma Tarihi</label>
                      <p className="text-gray-900">
                        {new Date(message.readAt).toLocaleString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                  {message.archivedAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Arşivlenme Tarihi</label>
                      <p className="text-gray-900">
                        {new Date(message.archivedAt).toLocaleString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Aksiyonlar */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">İşlemler</h3>
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Kapat
                </Button>
                {message.status !== 'READ' && (
                  <Button
                    variant="outline"
                    onClick={() => setAction('read')}
                    disabled={isSubmitting}
                    className="border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Okundu İşaretle
                  </Button>
                )}
                {message.status !== 'ARCHIVED' && (
                  <Button
                    variant="outline"
                    onClick={() => setAction('archive')}
                    disabled={isSubmitting}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    Arşive Taşı
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setAction('delete')}
                  disabled={isSubmitting}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Sil
                </Button>
              </div>
              {action && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    {action === 'read' && 'Mesajı okundu olarak işaretlemek istediğinizden emin misiniz?'}
                    {action === 'archive' && 'Mesajı arşive taşımak istediğinizden emin misiniz?'}
                    {action === 'delete' && 'Bu mesajı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.'}
                  </p>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAction(null)}
                      disabled={isSubmitting}
                    >
                      Hayır
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className={`text-white transition-colors ${
                        action === 'delete'
                          ? 'bg-red-600 hover:bg-red-700'
                          : action === 'archive'
                          ? 'bg-gray-600 hover:bg-gray-700'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isSubmitting ? 'İşleniyor...' : 'Evet'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactMessagesPageContent() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [statusFilter, setStatusFilter] = useState<ContactMessageStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch messages
  useEffect(() => {
    fetchMessages();
  }, [statusFilter, searchQuery]);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") {
        params.append("status", statusFilter.toLowerCase());
      }
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      const response = await fetch(`/api/contact-messages?${params.toString()}`);

      if (!response.ok) {
        // Handle auth errors first
        if (response.status === 401 || response.status === 403) {
          throw new Error("Bu sayfaya erişim yetkiniz bulunmamaktadır.");
        }

        // Try to parse error message from response
        let errorMessage = "Mesajlar yüklenirken bir hata oluştu.";
        try {
          const text = await response.text();
          if (text) {
            try {
              const errorData = JSON.parse(text);
              if (errorData.message && errorData.message !== "Unknown error") {
                errorMessage = errorData.message;
              } else if (errorData.error) {
                errorMessage = errorData.error;
              }
            } catch {
              errorMessage = text.length > 200 ? text.substring(0, 200) + "..." : text;
            }
          }
        } catch (parseError) {
          console.error("Failed to read error response:", parseError);
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.error("Error fetching contact messages:", err);
      setError(err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/contact-messages/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "READ" }),
      });

      if (!response.ok) {
        throw new Error("Mesaj okundu olarak işaretlenirken bir hata oluştu.");
      }

      // Refresh messages
      await fetchMessages();
      if (selectedMessage?.id === id) {
        const updatedMessage = await response.json();
        setSelectedMessage(updatedMessage);
      }
    } catch (err) {
      console.error("Error marking message as read:", err);
      alert(err instanceof Error ? err.message : "Bir hata oluştu.");
    }
  };

  const handleArchive = async (id: string) => {
    try {
      const response = await fetch(`/api/contact-messages/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "ARCHIVED" }),
      });

      if (!response.ok) {
        throw new Error("Mesaj arşive taşınırken bir hata oluştu.");
      }

      // Refresh messages
      await fetchMessages();
      setSelectedMessage(null);
    } catch (err) {
      console.error("Error archiving message:", err);
      alert(err instanceof Error ? err.message : "Bir hata oluştu.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/contact-messages/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Mesaj silinirken bir hata oluştu.");
      }

      // Refresh messages
      await fetchMessages();
      setSelectedMessage(null);
    } catch (err) {
      console.error("Error deleting message:", err);
      alert(err instanceof Error ? err.message : "Bir hata oluştu.");
    }
  };

  const getStatusBadge = (status: ContactMessageStatus) => {
    switch (status) {
      case 'NEW':
        return <Badge variant="warning">Yeni</Badge>;
      case 'READ':
        return <Badge variant="secondary">Okundu</Badge>;
      case 'ARCHIVED':
        return <Badge variant="secondary">Arşivde</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <p className="font-medium">Hata</p>
          <p className="text-sm">{error}</p>
        </div>
        <Button onClick={fetchMessages} className="mt-4">
          Tekrar Dene
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="İsim, email veya konu ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ContactMessageStatus | "ALL")}
              options={[
                { value: "ALL", label: "Tümü" },
                { value: "NEW", label: "Yeni" },
                { value: "READ", label: "Okundu" },
                { value: "ARCHIVED", label: "Arşivde" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Messages Table */}
      {messages.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Henüz mesaj bulunmuyor.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">İsim</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Konu</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tarih</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Durum</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr
                  key={message.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    message.status === 'NEW' ? 'bg-blue-50/30 font-medium' : ''
                  }`}
                >
                  <td className="py-3 px-4 text-sm text-gray-900">{message.fullName}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{message.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{message.subject}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(message.createdAt).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(message.status)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedMessage(message)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Görüntüle
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedMessage && (
        <ContactMessageModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          onMarkAsRead={handleMarkAsRead}
          onArchive={handleArchive}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

