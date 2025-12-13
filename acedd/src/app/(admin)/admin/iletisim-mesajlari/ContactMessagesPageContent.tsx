"use client";

import React, { useState, useEffect, useTransition, useRef } from "react";
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
import { formatDateTimeShort } from "@/lib/utils/dateHelpers";
import { logClientError } from "@/lib/utils/clientLogging";

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
  const modalRef = useRef<HTMLDivElement>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message) {
      setAction(null);
    }
  }, [message]);

  // Auto-scroll to confirmation message when action is set
  useEffect(() => {
    if (action && confirmationRef.current && modalRef.current) {
      // Small delay to ensure DOM has updated
      setTimeout(() => {
        confirmationRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest',
          inline: 'nearest'
        });
      }, 100);
    }
  }, [action]);

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
      logClientError("[ContactMessagesPageContent][PERFORM_ACTION]", error);
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
      <div ref={modalRef} className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
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
                    {formatDateTimeShort(message.createdAt)}
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
                        {formatDateTimeShort(message.readAt)}
                      </p>
                    </div>
                  )}
                  {message.archivedAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Arşivlenme Tarihi</label>
                      <p className="text-gray-900">
                        {formatDateTimeShort(message.archivedAt)}
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
                <div ref={confirmationRef} className="mt-4 p-4 bg-gray-50 rounded-lg">
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
  const [allMessages, setAllMessages] = useState<ContactMessage[]>([]); // Sprint 14.6: Tüm mesajlar (client-side filtering için)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  // Sprint 14.6: Tab-based filtering - "Gelen Kutusu" (NEW+READ) or "Arşiv" (ARCHIVED)
  const [activeTab, setActiveTab] = useState<"inbox" | "archived">("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  // Sprint 14.6: useTransition ile smooth tab/filter geçişleri (client-side)
  const [isPending, startTransition] = useTransition();
  const isInitialLoadRef = React.useRef(true);
  // Sprint 14.7: Scroll pozisyonunu korumak için ref
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  // Sprint 14.6: Client-side filtering (like Members page)
  const filteredMessages = React.useMemo(() => {
    return allMessages.filter((message) => {
      // Tab-based filter
      if (activeTab === "inbox") {
        // Gelen Kutusu: NEW ve READ mesajları
        if (message.status !== "NEW" && message.status !== "READ") {
          return false;
        }
      } else {
        // Arşiv: Sadece ARCHIVED mesajları
        if (message.status !== "ARCHIVED") {
          return false;
        }
      }
      
      // Search filter
      if (searchQuery.trim()) {
        const searchLower = searchQuery.toLowerCase();
        return (
          message.fullName.toLowerCase().includes(searchLower) ||
          message.email.toLowerCase().includes(searchLower) ||
          message.subject.toLowerCase().includes(searchLower) ||
          message.message.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  }, [allMessages, activeTab, searchQuery]);

  // Sprint 14.6: Sadece ilk yüklemede fetch - sonra client-side filtering
  useEffect(() => {
    fetchMessages();
  }, []); // Sadece ilk yüklemede fetch

  // Sprint 14.7: Scroll pozisyonunu korumak - filtre/tab değişiminde scroll sıfırlanmasın
  React.useLayoutEffect(() => {
    // Tab/filtre değişiminde scroll pozisyonu korunur (doğal davranış)
    // Sadece ilk yüklemede scroll en üste gider
  }, [activeTab, searchQuery]);

  const fetchMessages = async () => {
    // Sprint 14.6: Sadece ilk yüklemede fetch - sonra client-side filtering
    const isInitialLoad = isInitialLoadRef.current;
    
    if (isInitialLoad) {
      setLoading(true);
      isInitialLoadRef.current = false; // İlk yükleme tamamlandı
    }
    setError(null);

    try {
      // Sprint 14.6: İlk yüklemede tüm mesajları getir (filtre yok, client-side filtering kullanılacak)
      const response = await fetch(`/api/contact-messages`);

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
          logClientError("[ContactMessagesPageContent][PARSE_ERROR]", parseError);
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      // Sprint 14.6: Tüm mesajları kaydet (client-side filtering için)
      startTransition(() => {
        setAllMessages(data);
        if (isInitialLoad) {
          setLoading(false);
        }
      });
    } catch (err) {
      logClientError("[ContactMessagesPageContent][FETCH]", err);
      setError(err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu.");
      if (isInitialLoad) {
        setLoading(false);
      }
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

      // Sprint 14.6: Update message in state directly (client-side filtering)
      const updatedMessage = await response.json();
      setAllMessages(prev => prev.map(msg => msg.id === id ? updatedMessage : msg));
      if (selectedMessage?.id === id) {
        setSelectedMessage(updatedMessage);
      }
    } catch (err) {
      logClientError("[ContactMessagesPageContent][MARK_AS_READ]", err);
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

      // Sprint 14.6: Update message in state directly (client-side filtering)
      const updatedMessage = await response.json();
      setAllMessages(prev => prev.map(msg => msg.id === id ? updatedMessage : msg));
      setSelectedMessage(null);
    } catch (err) {
      logClientError("[ContactMessagesPageContent][ARCHIVE]", err);
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

      // Sprint 14.6: Remove message from state directly (client-side filtering)
      setAllMessages(prev => prev.filter(msg => msg.id !== id));
      setSelectedMessage(null);
    } catch (err) {
      logClientError("[ContactMessagesPageContent][DELETE]", err);
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

  return (
    <div className="p-6">
      {/* Sprint 14.6: Tab-based navigation - Her zaman göster */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => {
              // Sprint 14.6: Client-side filtering - useTransition ile smooth update
              startTransition(() => {
                setActiveTab("inbox");
              });
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "inbox"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Gelen Kutusu
          </button>
          <button
            onClick={() => {
              // Sprint 14.6: Client-side filtering - useTransition ile smooth update
              startTransition(() => {
                setActiveTab("archived");
              });
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "archived"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Arşiv
          </button>
        </nav>
      </div>

      {/* Sprint 14.6: Search filter (works with both tabs) - Her zaman göster */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="İsim, email veya konu ara..."
            value={searchQuery}
            onChange={(e) => {
              // Sprint 14.6: Client-side filtering - useTransition ile smooth update
              startTransition(() => {
                setSearchQuery(e.target.value);
              });
            }}
            className="pl-10"
          />
        </div>
      </div>

      {/* Sprint 14.6: Error mesajı (liste varsa üstte göster) */}
      {error && allMessages.length > 0 && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <p className="font-medium">Hata</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Sprint 14.6: Error gösterimi (ilk yüklemede hata varsa) */}
      {error && allMessages.length === 0 && loading && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <p className="font-medium">Hata</p>
          <p className="text-sm">{error}</p>
          <Button onClick={fetchMessages} className="mt-2" size="sm">
            Tekrar Dene
          </Button>
        </div>
      )}

      {/* Messages Table */}
      {loading && allMessages.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchQuery.trim() ? "Arama sonucu bulunamadı" : activeTab === "inbox" ? "Gelen kutusunda mesaj yok" : "Arşivde mesaj yok"}
          </h3>
          <p className="text-gray-600">
            {searchQuery.trim() ? "Farklı arama terimleri deneyin." : "Henüz mesaj bulunmuyor."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto" ref={tableContainerRef}>
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
              {filteredMessages.map((message) => (
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
                    {formatDateTimeShort(message.createdAt)}
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

