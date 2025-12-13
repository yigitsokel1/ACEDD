"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle, Clock, Trash2, X } from "lucide-react";
import { Button, Badge, Textarea } from "@/components/ui";
import { CollapsibleSection } from "@/components/admin/CollapsibleSection";
import { RelativesList } from "./components/RelativesList";
import { EducationHistoryList } from "./components/EducationHistoryList";
import { ReferencesList } from "./components/ReferencesList";
import type { ScholarshipApplication, ScholarshipApplicationStatus } from "@/lib/types/scholarship";
import { formatDateOnly } from "@/lib/utils/dateHelpers";
import { getGenderLabel } from "@/lib/utils/genderHelpers";

/**
 * Scholarship Application Detail Page (V2)
 * 
 * Sprint 16 - Block F: Admin burs başvurusu detay sayfası (read-only)
 * 
 * Displays all application data in collapsible sections.
 * Dynamic lists (relatives, educationHistory, references) are read-only.
 * Only application-level actions (status change) are available.
 */
export default function ScholarshipApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [application, setApplication] = useState<ScholarshipApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject' | 'under_review' | 'delete' | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const successMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchApplication();
  }, [id]);

  // Auto-scroll to top of page when success message appears
  useEffect(() => {
    if (successMessage) {
      // Wait for DOM to fully render the success message
      // Then scroll to the top of the page so the message is visible
      const scrollToTop = () => {
        // Scroll to the very top of the page
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      };

      // Triple RAF ensures React has fully rendered the component
      // This is necessary because React batches updates and the DOM might not be ready
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            scrollToTop();
          });
        });
      });
    }
  }, [successMessage]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/scholarship-applications/${id}`);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Bu sayfaya erişim yetkiniz bulunmamaktadır.");
        }
        if (response.status === 404) {
          throw new Error("Başvuru bulunamadı.");
        }
        throw new Error("Başvuru yüklenirken bir hata oluştu.");
      }

      const data = await response.json();
      setApplication(data);
      setReviewNotes(data.reviewNotes || "");
    } catch (err) {
      console.error("Error fetching application:", err);
      setError(err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: ScholarshipApplicationStatus | null, notes?: string) => {
    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/scholarship-applications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(status ? { status } : {}),
          reviewNotes: notes || undefined,
        }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Bu işlem için yetkiniz bulunmamaktadır.");
        }
        throw new Error("Başvuru güncellenirken bir hata oluştu.");
      }

      const updatedApplication = await response.json();
      setApplication(updatedApplication);
      setReviewNotes(updatedApplication.reviewNotes || "");
      setAction(null);
      
      // Clear any previous errors
      setError(null);
      
      // Show success message
      if (status) {
        const statusMessages: Record<string, string> = {
          'APPROVED': 'Başvuru başarıyla onaylandı',
          'REJECTED': 'Başvuru başarıyla reddedildi',
          'UNDER_REVIEW': 'Başvuru incelemeye alındı',
        };
        setSuccessMessage(statusMessages[status] || 'Başvuru başarıyla güncellendi');
      } else {
        setSuccessMessage('İnceleme notu başarıyla kaydedildi');
      }
      
      // Auto-scroll to success message (no auto-redirect)
      // Scroll will happen in useEffect when successMessage changes
    } catch (err) {
      console.error("Error updating application:", err);
      setError(err instanceof Error ? err.message : "Başvuru güncellenirken bir hata oluştu.");
      setSuccessMessage(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/scholarship-applications/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Bu işlem için yetkiniz bulunmamaktadır.");
        }
        throw new Error("Başvuru silinirken bir hata oluştu.");
      }

      // Clear any previous errors
      setError(null);
      
      // Show success message and redirect
      setSuccessMessage("Başvuru başarıyla silindi");
      setTimeout(() => {
        setSuccessMessage(null);
        router.push("/admin/burs-basvurulari");
      }, 1500);
    } catch (err) {
      console.error("Error deleting application:", err);
      setError(err instanceof Error ? err.message : "Başvuru silinirken bir hata oluştu.");
      setSuccessMessage(null);
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: ScholarshipApplicationStatus) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="warning">Beklemede</Badge>;
      case 'APPROVED':
        return <Badge variant="success">Onaylandı</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">Reddedildi</Badge>;
      case 'UNDER_REVIEW':
        return <Badge variant="secondary">İnceleniyor</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="space-y-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Hata</p>
          <p className="text-sm">{error || "Başvuru bulunamadı"}</p>
          <Button onClick={() => router.push("/admin/burs-basvurulari")} className="mt-2" size="sm">
            Geri Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div 
          ref={successMessageRef}
          className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between"
        >
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSuccessMessage(null);
              router.push("/admin/burs-basvurulari");
            }}
            className="border-green-300 text-green-700 hover:bg-green-100"
          >
            Listeye Dön
          </Button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <XCircle className="w-5 h-5 text-red-600 mr-3" />
            <p className="text-red-800 font-medium">{error}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setError(null)}
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/burs-basvurulari")}
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Dön
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Burs Başvurusu Detayları</h1>
            <p className="text-gray-600 mt-1">
              Başvuru ID: {application.id}
            </p>
          </div>
        </div>
        <div>
          {getStatusBadge(application.status)}
        </div>
      </div>

      {/* Genel Bilgi */}
      <CollapsibleSection title="Genel Bilgi" defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sol Kolon: Temel Bilgiler ve Kimlik (10 alan - fazlalık solda) */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Ad Soyad
              </label>
              <p className="text-base text-gray-900 font-normal">{application.fullName}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                E-posta
              </label>
              <p className="text-base text-gray-900 font-normal">{application.email}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Telefon
              </label>
              <p className="text-base text-gray-900 font-normal">{application.phone}</p>
            </div>
            {application.alternativePhone && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Alternatif Telefon
                </label>
                <p className="text-base text-gray-900 font-normal">{application.alternativePhone}</p>
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Doğum Tarihi
              </label>
              <p className="text-base text-gray-900 font-normal">{formatDateOnly(application.birthDate)}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Doğum Yeri
              </label>
              <p className="text-base text-gray-900 font-normal">{application.birthPlace}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Memleket
              </label>
              <p className="text-base text-gray-900 font-normal">{application.hometown}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                TC Kimlik No
              </label>
              <p className="text-base text-gray-900 font-normal">{application.tcNumber}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Kimlik Verildiği Yer
              </label>
              <p className="text-base text-gray-900 font-normal">{application.idIssuePlace}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Kimlik Veriliş Tarihi
              </label>
              <p className="text-base text-gray-900 font-normal">{formatDateOnly(application.idIssueDate)}</p>
            </div>
          </div>

          {/* Sağ Kolon: Eğitim ve Adres Bilgileri (9 alan) */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Cinsiyet
              </label>
              <p className="text-base text-gray-900 font-normal">{getGenderLabel(application.gender)}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Medeni Hal
              </label>
              <p className="text-base text-gray-900 font-normal">{application.maritalStatus}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Üniversite
              </label>
              <p className="text-base text-gray-900 font-normal">{application.university}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Fakülte
              </label>
              <p className="text-base text-gray-900 font-normal">{application.faculty}</p>
            </div>
            {application.department && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Bölüm
                </label>
                <p className="text-base text-gray-900 font-normal">{application.department}</p>
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Sınıf
              </label>
              <p className="text-base text-gray-900 font-normal">{application.grade}</p>
            </div>
            {application.turkeyRanking && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Türkiye Sıralaması
                </label>
                <p className="text-base text-gray-900 font-normal">{application.turkeyRanking}</p>
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Daimi Adres
              </label>
              <p className="text-gray-900 whitespace-pre-wrap">{application.permanentAddress}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Mevcut Konaklama
              </label>
              <p className="text-gray-900 whitespace-pre-wrap">{application.currentAccommodation}</p>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Aile & Akrabalar */}
      <CollapsibleSection title="Aile & Akrabalar" defaultOpen={false}>
        <RelativesList relatives={application.relatives || []} />
      </CollapsibleSection>

      {/* Okul Geçmişi */}
      <CollapsibleSection title="Okul Geçmişi" defaultOpen={false}>
        <EducationHistoryList educationHistory={application.educationHistory || []} />
      </CollapsibleSection>

      {/* Referanslar */}
      <CollapsibleSection title="Referanslar" defaultOpen={false}>
        <ReferencesList references={application.references || []} />
      </CollapsibleSection>

      {/* Finansal Bilgiler */}
      <CollapsibleSection title="Finansal Bilgiler" defaultOpen={false}>
        <div className="space-y-6">
          {/* Gelir-Gider Bilgileri */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Aylık Toplam Gelir
              </label>
              <p className="text-base text-gray-900 font-normal">
                {application.familyMonthlyIncome.toLocaleString('tr-TR')} ₺
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Aylık Zorunlu Gider
              </label>
              <p className="text-base text-gray-900 font-normal">
                {application.familyMonthlyExpenses.toLocaleString('tr-TR')} ₺
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Burs/Kredi Geliri
              </label>
              <p className="text-base text-gray-900 font-normal">{application.scholarshipIncome}</p>
            </div>
          </div>
          
          {/* Banka Bilgileri */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Banka Bilgileri</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Banka Adı
                </label>
                <p className="text-base text-gray-900 font-normal">{application.bankAccount}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  IBAN
                </label>
                <p className="text-base text-gray-900 font-normal font-mono">{application.ibanNumber}</p>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Sağlık ve Engellilik */}
      <CollapsibleSection title="Sağlık ve Engellilik" defaultOpen={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Fiziksel Engel
            </label>
            <p className="text-base text-gray-900 font-normal">{application.physicalDisability}</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Sağlık Sorunu
            </label>
            <p className="text-base text-gray-900 font-normal">{application.healthProblem}</p>
          </div>
        </div>
      </CollapsibleSection>

      {/* Ek Bilgiler */}
      {(application.selfIntroduction || application.interests) && (
        <CollapsibleSection title="Ek Bilgiler" defaultOpen={false}>
          <div className="space-y-4">
            {application.selfIntroduction && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Kendini Tanıt
                </label>
                <p className="text-gray-900 whitespace-pre-wrap">{application.selfIntroduction}</p>
              </div>
            )}
            {application.interests && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  İlgi Alanları
                </label>
                <p className="text-gray-900 whitespace-pre-wrap">{application.interests}</p>
              </div>
            )}
          </div>
        </CollapsibleSection>
      )}

      {/* Başvuru Bilgileri */}
      <CollapsibleSection title="Başvuru Bilgileri" defaultOpen={false}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Başvuru Tarihi
              </label>
              <p className="text-base text-gray-900 font-normal">{formatDateOnly(application.createdAt)}</p>
            </div>
            {application.reviewedAt && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  İncelenme Tarihi
                </label>
                <p className="text-base text-gray-900 font-normal">{formatDateOnly(application.reviewedAt)}</p>
              </div>
            )}
          </div>
          {application.reviewNotes && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                İnceleme Notları
              </label>
              <p className="text-base text-gray-900 font-normal whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200">
                {application.reviewNotes}
              </p>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Başvuru Değerlendirmesi */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Başvuru Değerlendirmesi</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İnceleme Notları
            </label>
            <Textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              rows={3}
              placeholder="Değerlendirme notları..."
            />
          </div>
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/burs-basvurulari")}
              disabled={isSubmitting}
            >
              İptal
            </Button>
            <Button
              variant="outline"
              onClick={() => handleStatusUpdate(null, reviewNotes)}
              disabled={isSubmitting || !reviewNotes.trim()}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Sadece Notu Kaydet
            </Button>
            {application.status !== 'UNDER_REVIEW' && (
              <Button
                variant="outline"
                onClick={() => setAction('under_review')}
                disabled={isSubmitting}
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <Clock className="w-4 h-4 mr-2" />
                İncelemeye Al
              </Button>
            )}
            {application.status !== 'REJECTED' && (
              <Button
                variant="outline"
                onClick={() => setAction('reject')}
                disabled={isSubmitting}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reddet
              </Button>
            )}
            {application.status !== 'APPROVED' && (
              <Button
                onClick={() => setAction('approve')}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Onayla
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
                {action === 'approve' && 'Başvuruyu onaylamak istediğinizden emin misiniz?'}
                {action === 'reject' && 'Başvuruyu reddetmek istediğinizden emin misiniz?'}
                {action === 'under_review' && 'Başvuruyu incelemeye almak istediğinizden emin misiniz?'}
                {action === 'delete' && 'Bu başvuruyu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.'}
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
                  onClick={() => {
                    if (action === 'delete') {
                      handleDelete();
                    } else {
                      handleStatusUpdate(
                        action === 'approve' ? 'APPROVED' :
                        action === 'reject' ? 'REJECTED' :
                        'UNDER_REVIEW',
                        reviewNotes
                      );
                    }
                  }}
                  disabled={isSubmitting}
                  className={`text-white transition-colors ${
                    action === 'approve' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : action === 'reject' || action === 'delete'
                      ? 'bg-red-600 hover:bg-red-700'
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
  );
}

