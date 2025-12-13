"use client";

import React, { useState, useEffect, useTransition, useRef } from "react";
import { Button, Badge, Input, Select, Textarea } from "@/components/ui";
import { Card } from "@/components/ui/Card";
import { 
  CheckCircle, 
  XCircle, 
  X,
  Eye, 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  Search,
  Trash2
} from "lucide-react";
import type { ScholarshipApplication, ScholarshipApplicationStatus } from "@/lib/types/scholarship";
import { formatDateOnly } from "@/lib/utils/dateHelpers";
import { getGenderLabel } from "@/lib/utils/genderHelpers";
import { logClientError } from "@/lib/utils/clientLogging";

interface ScholarshipApplicationModalProps {
  application: ScholarshipApplication | null;
  onClose: () => void;
  onApplicationUpdate?: (updatedApplication: ScholarshipApplication) => void;
  onApplicationDelete?: (id: string) => void;
}

function ScholarshipApplicationModal({ 
  application, 
  onClose,
  onApplicationUpdate,
  onApplicationDelete
}: ScholarshipApplicationModalProps) {
  const [reviewNotes, setReviewNotes] = useState("");
  const [action, setAction] = useState<'approve' | 'reject' | 'under_review' | 'delete' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (application) {
      setReviewNotes(application.reviewNotes || "");
      setAction(null);
      setSuccessMessage(null);
      setErrorMessage(null);
    }
  }, [application]);

  // Scroll to message when it appears
  useEffect(() => {
    if (successMessage && messageContainerRef.current && modalRef.current) {
      // Scroll modal container to show the message
      setTimeout(() => {
        if (messageContainerRef.current && modalRef.current) {
          const messageTop = messageContainerRef.current.offsetTop;
          modalRef.current.scrollTo({ top: messageTop - 20, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [successMessage]);

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

  if (!application) return null;

  const handleSubmit = async () => {
    if (!action) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      let response: Response;
      let successMsg = '';

      if (action === 'approve') {
        response = await fetch(`/api/scholarship-applications/${application.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "APPROVED",
            reviewNotes: reviewNotes || undefined,
          }),
        });
        successMsg = 'Başvuru başarıyla onaylandı';
      } else if (action === 'reject') {
        response = await fetch(`/api/scholarship-applications/${application.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "REJECTED",
            reviewNotes: reviewNotes || undefined,
          }),
        });
        successMsg = 'Başvuru başarıyla reddedildi';
      } else if (action === 'under_review') {
        response = await fetch(`/api/scholarship-applications/${application.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "UNDER_REVIEW",
            reviewNotes: reviewNotes || undefined,
          }),
        });
        successMsg = 'Başvuru incelemeye alındı';
      } else if (action === 'delete') {
        response = await fetch(`/api/scholarship-applications/${application.id}`, {
          method: "DELETE",
        });
        successMsg = 'Başvuru başarıyla silindi';
      } else {
        throw new Error("Geçersiz işlem");
      }

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Bu işlem için yetkiniz bulunmamaktadır.");
        }
        throw new Error("İşlem sırasında bir hata oluştu.");
      }

      // Show success message FIRST - this is critical!
      setSuccessMessage(successMsg);
      
      // Update parent component state
      if (action === 'delete') {
        if (onApplicationDelete) {
          onApplicationDelete(application.id);
        }
      } else {
        const updatedApplication = await response.json();
        if (onApplicationUpdate) {
          onApplicationUpdate(updatedApplication);
        }
      }
      
      // Scroll to message (message will appear and scroll happens in useEffect)
    } catch (error) {
      logClientError("[ScholarshipApplicationsPageContent][PERFORM_ACTION]", error);
      setErrorMessage(error instanceof Error ? error.message : "İşlem sırasında bir hata oluştu");
    } finally {
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

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div ref={modalRef} className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Burs Başvurusu Detayları</h2>
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
            {getStatusBadge(application.status)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sol Kolon - Kişisel Bilgiler */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Kişisel Bilgiler</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                  <p className="text-gray-900">{application.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{application.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefon</label>
                  <p className="text-gray-900">{application.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Doğum Tarihi</label>
                  <p className="text-gray-900">{formatDateOnly(application.birthDate)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Doğum Yeri</label>
                  <p className="text-gray-900">{application.birthPlace}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">TC Kimlik No</label>
                  <p className="text-gray-900">{application.tcNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kimlik Verildiği Yer</label>
                  <p className="text-gray-900">{application.idIssuePlace}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kimlik Veriliş Tarihi</label>
                  <p className="text-gray-900">{formatDateOnly(application.idIssueDate)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cinsiyet</label>
                  <p className="text-gray-900">{getGenderLabel(application.gender)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Medeni Hal</label>
                  <p className="text-gray-900">{application.maritalStatus}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Memleket</label>
                  <p className="text-gray-900">{application.hometown}</p>
                </div>
              </div>
            </div>

            {/* Sağ Kolon - Üniversite ve İletişim */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Üniversite Bilgileri</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Üniversite</label>
                  <p className="text-gray-900">{application.university}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fakülte</label>
                  <p className="text-gray-900">{application.faculty}</p>
                </div>
                {application.department && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bölüm</label>
                    <p className="text-gray-900">{application.department}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sınıf</label>
                  <p className="text-gray-900">{application.grade}</p>
                </div>
                {application.turkeyRanking && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Türkiye Sıralaması</label>
                    <p className="text-gray-900">{application.turkeyRanking}</p>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">Adres Bilgileri</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Daimi Adres</label>
                  <p className="text-gray-900">{application.permanentAddress}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Konaklama</label>
                  <p className="text-gray-900">{application.currentAccommodation}</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">Banka Bilgileri</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Banka Hesabı</label>
                  <p className="text-gray-900">{application.bankAccount}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">İBAN</label>
                  <p className="text-gray-900">{application.ibanNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Aile Bilgileri */}
          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Aile Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Aylık Gelir</label>
                <p className="text-gray-900">{application.familyMonthlyIncome.toLocaleString('tr-TR')} ₺</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Aylık Gider</label>
                <p className="text-gray-900">{application.familyMonthlyExpenses.toLocaleString('tr-TR')} ₺</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Burs/Kredi Geliri</label>
                <p className="text-gray-900">{application.scholarshipIncome}</p>
              </div>
            </div>
          </div>

          {/* Sağlık ve Engellilik */}
          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Sağlık ve Engellilik</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Fiziksel Engel</label>
                <p className="text-gray-900">{application.physicalDisability}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sağlık Sorunu</label>
                <p className="text-gray-900">{application.healthProblem}</p>
              </div>
            </div>
          </div>

          {/* Kendini Tanıtma */}
          {application.selfIntroduction && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Kendini Tanıtma</h3>
              <p className="text-gray-900 whitespace-pre-wrap">{application.selfIntroduction}</p>
            </div>
          )}

          {/* İlgi Alanları */}
          {application.interests && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">İlgi Alanları</h3>
              <p className="text-gray-900">{application.interests}</p>
            </div>
          )}

          {/* Akrabalar */}
          {application.relatives && application.relatives.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Akrabalar</h3>
              <div className="space-y-3">
                {application.relatives.map((relative, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Akrabalık:</span> {relative.kinship}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Ad Soyad:</span> {relative.name} {relative.surname}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Eğitim:</span> {relative.education}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Meslek:</span> {relative.occupation}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Gelir:</span> {relative.income.toLocaleString('tr-TR')} ₺
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Eğitim Geçmişi */}
          {application.educationHistory && application.educationHistory.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Eğitim Geçmişi</h3>
              <div className="space-y-3">
                {application.educationHistory.map((edu, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Okul:</span> {edu.schoolName}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Bölüm:</span> {edu.department}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Başlangıç:</span> {formatDateOnly(edu.startDate)}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Bitiş:</span> {formatDateOnly(edu.endDate)}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Başarı Yüzdesi:</span> {edu.percentage}%
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Referanslar */}
          {application.references && application.references.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Referanslar</h3>
              <div className="space-y-3">
                {application.references.map((ref, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Ad Soyad:</span> {ref.fullName}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">İlişki:</span> {ref.relationship}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Meslek:</span> {ref.job}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">AÇDD Üyesi:</span> {ref.isAcddMember}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Telefon:</span> {ref.phone}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Adres:</span> {ref.address}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Başvuru Bilgileri */}
          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Başvuru Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Başvuru Tarihi</label>
                <p className="text-gray-900">{formatDateOnly(application.createdAt)}</p>
              </div>
              {application.reviewedAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">İncelenme Tarihi</label>
                  <p className="text-gray-900">{formatDateOnly(application.reviewedAt)}</p>
                </div>
              )}
            </div>
            {application.reviewNotes && (
              <div>
                <label className="block text-sm font-medium text-gray-700">İnceleme Notları</label>
                <p className="text-gray-900 whitespace-pre-wrap">{application.reviewNotes}</p>
              </div>
            )}
          </div>

          {/* Aksiyonlar */}
          <div ref={messageContainerRef} className="mt-8 space-y-4">
            {/* Success Message - Butonların hemen üstünde */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                  <p className="text-green-800 font-medium">{successMessage}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSuccessMessage(null);
                    onClose();
                    setReviewNotes("");
                    setAction(null);
                  }}
                  className="border-green-300 text-green-700 hover:bg-green-100"
                >
                  Listeye Dön
                </Button>
              </div>
            )}

            {/* Error Message - Butonların hemen üstünde */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <XCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                  <p className="text-red-800 font-medium">{errorMessage}</p>
                </div>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="text-red-400 hover:text-red-600 ml-4"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <h3 className="text-lg font-semibold text-gray-900">Başvuru Değerlendirmesi</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">İnceleme Notları</label>
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
                onClick={onClose}
                disabled={isSubmitting}
              >
                İptal
              </Button>
              {application.status !== 'UNDER_REVIEW' && (
                <Button
                  variant="outline"
                  onClick={() => setAction('under_review')}
                  disabled={isSubmitting}
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
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
              <div ref={confirmationRef} className="mt-4 p-4 bg-gray-50 rounded-lg">
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
                    onClick={handleSubmit}
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
    </div>
  );
}

export default function ScholarshipApplicationsPageContent() {
  const [allApplications, setAllApplications] = useState<ScholarshipApplication[]>([]); // Sprint 14.6: Tüm başvurular (client-side filtering için)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<ScholarshipApplication | null>(null);
  const [statusFilter, setStatusFilter] = useState<ScholarshipApplicationStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  // Sprint 14.6: useTransition ile smooth filtre güncellemeleri (client-side)
  const [, startTransition] = useTransition();
  // Sprint 14.6: İlk yükleme kontrolü için ref
  const isInitialLoadRef = React.useRef(true);
  // Sprint 14.7: Scroll pozisyonunu korumak için ref
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  // Sprint 14.6: Client-side filtering (like Members page)
  const filteredApplications = React.useMemo(() => {
    return allApplications.filter((application) => {
      // Status filter
      const matchesStatus = statusFilter === "ALL" || application.status === statusFilter;
      
      // Search filter
      const matchesSearch = searchQuery.trim() === "" || 
        application.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        application.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        application.university?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        application.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        application.faculty?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  }, [allApplications, statusFilter, searchQuery]);

  // Sprint 14.6: Client-side filtering (like Members page) - fetch only on initial load
  useEffect(() => {
    fetchApplications();
  }, []); // Sadece ilk yüklemede fetch

  // Sprint 14.7: Scroll pozisyonunu korumak - filtre değişiminde scroll sıfırlanmasın
  React.useLayoutEffect(() => {
    // Filtre değişiminde scroll pozisyonu korunur (doğal davranış)
    // Sadece ilk yüklemede scroll en üste gider
  }, [statusFilter, searchQuery]);

  const fetchApplications = async () => {
    // Sprint 14.6: Sadece ilk yüklemede fetch - sonra client-side filtering
    const isInitialLoad = isInitialLoadRef.current;
    
    if (isInitialLoad) {
      setLoading(true);
      isInitialLoadRef.current = false; // İlk yükleme tamamlandı
    }
    setError(null);

    try {
      // Sprint 14.6: İlk yüklemede tüm başvuruları getir (filtre yok)
      const response = await fetch(`/api/scholarship-applications`);

      if (!response.ok) {
        // Handle auth errors first
        if (response.status === 401 || response.status === 403) {
          throw new Error("Bu sayfaya erişim yetkiniz bulunmamaktadır.");
        }

        // Try to parse error message from response
        // Use text() first, then parse JSON to avoid response body consumption issues
        let errorMessage = "Başvurular yüklenirken bir hata oluştu.";
        try {
          const text = await response.text();
          if (text) {
            try {
              const errorData = JSON.parse(text);
              // API returns { error: "...", message: "..." }
              // Prefer message over error as it contains the actual error details
              if (errorData.message && errorData.message !== "Unknown error") {
                errorMessage = errorData.message;
              } else if (errorData.error) {
                errorMessage = errorData.error;
              }
            } catch {
              // If JSON parsing fails, use text as error message (truncated if too long)
              errorMessage = text.length > 200 ? text.substring(0, 200) + "..." : text;
            }
          }
        } catch (parseError) {
          // If text() fails, use default message
          logClientError("[ScholarshipApplicationsPageContent][PARSE_ERROR]", parseError);
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      // Sprint 14.6: Tüm başvuruları kaydet (client-side filtering için)
      startTransition(() => {
        setAllApplications(data);
        if (isInitialLoad) {
          setLoading(false);
        }
      });
    } catch (err) {
      logClientError("[ScholarshipApplicationsPageContent][FETCH]", err);
      setError(err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu.");
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  };

  // Unused handler - keeping for potential future use
  /*
  const handleApprove = async (id: string, reviewNotes?: string) => {
    try {
      const response = await fetch(`/api/scholarship-applications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "APPROVED",
          reviewNotes: reviewNotes || undefined,
        }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Bu işlem için yetkiniz bulunmamaktadır.");
        }
        throw new Error("Başvuru onaylanırken bir hata oluştu.");
      }

      // Sprint 14.6: Update application in state directly (client-side filtering)
      const updatedApplication = await response.json();
      setAllApplications(prev => prev.map(app => app.id === _id ? updatedApplication : app));
      setSelectedApplication(null);
    } catch (err) {
      logClientError("[ScholarshipApplicationsPageContent][APPROVE]", err);
      alert(err instanceof Error ? err.message : "Başvuru onaylanırken bir hata oluştu.");
    }
  };
  */

  // Unused handler - keeping for potential future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleReject = async (_id: string, _reviewNotes?: string) => {
    try {
      const response = await fetch(`/api/scholarship-applications/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "REJECTED",
          reviewNotes: _reviewNotes || undefined,
        }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Bu işlem için yetkiniz bulunmamaktadır.");
        }
        throw new Error("Başvuru reddedilirken bir hata oluştu.");
      }

      // Sprint 14.6: Update application in state directly (client-side filtering)
      const updatedApplication = await response.json();
      setAllApplications(prev => prev.map(app => app.id === _id ? updatedApplication : app));
      setSelectedApplication(null);
    } catch (err) {
      logClientError("[ScholarshipApplicationsPageContent][REJECT]", err);
      alert(err instanceof Error ? err.message : "Başvuru reddedilirken bir hata oluştu.");
    }
  };

  // Unused handler - keeping for potential future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUnderReview = async (_id: string, _reviewNotes?: string) => {
    try {
      const response = await fetch(`/api/scholarship-applications/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "UNDER_REVIEW",
          reviewNotes: _reviewNotes || undefined,
        }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Bu işlem için yetkiniz bulunmamaktadır.");
        }
        throw new Error("Başvuru incelemeye alınırken bir hata oluştu.");
      }

      // Sprint 14.6: Update application in state directly (client-side filtering)
      const updatedApplication = await response.json();
      setAllApplications(prev => prev.map(app => app.id === _id ? updatedApplication : app));
      setSelectedApplication(null);
    } catch (err) {
      logClientError("[ScholarshipApplicationsPageContent][SET_UNDER_REVIEW]", err);
      alert(err instanceof Error ? err.message : "Başvuru incelemeye alınırken bir hata oluştu.");
    }
  };

  // Unused handler - keeping for potential future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDelete = async (_id: string) => {
    try {
      const response = await fetch(`/api/scholarship-applications/${_id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Bu işlem için yetkiniz bulunmamaktadır.");
        }
        throw new Error("Başvuru silinirken bir hata oluştu.");
      }

      // Sprint 14.6: Remove application from state directly (client-side filtering)
      setAllApplications(prev => prev.filter(app => app.id !== _id));
      setSelectedApplication(null);
    } catch (err) {
      logClientError("[ScholarshipApplicationsPageContent][DELETE]", err);
      alert(err instanceof Error ? err.message : "Başvuru silinirken bir hata oluştu.");
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

  return (
    <div className="p-6">
      {/* Header - Her zaman göster */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Burs Başvuruları</h2>
          <p className="text-gray-600">
            {filteredApplications.length} başvuru gösteriliyor {statusFilter !== "ALL" || searchQuery.trim() ? `(Toplam ${allApplications.length})` : ""}
          </p>
        </div>
      </div>

      {/* Filters - Her zaman göster */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="İsim veya email ile ara..."
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
        <div className="w-full md:w-64">
          <Select
            value={statusFilter}
            onChange={(e) => {
              // Sprint 14.6: Client-side filtering - useTransition ile smooth update
              startTransition(() => {
                setStatusFilter(e.target.value as ScholarshipApplicationStatus | "ALL");
              });
            }}
            options={[
              { value: "ALL", label: "Tümü" },
              { value: "PENDING", label: "Bekleyen" },
              { value: "UNDER_REVIEW", label: "İnceleniyor" },
              { value: "APPROVED", label: "Onaylanan" },
              { value: "REJECTED", label: "Reddedilen" },
            ]}
          />
        </div>
      </div>

      {/* Sprint 14.6: Error mesajı (liste varsa üstte göster) */}
      {error && allApplications.length > 0 && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Hata: {error}
        </div>
      )}

      {/* Sprint 14.6: Error gösterimi (ilk yüklemede hata varsa) */}
      {error && allApplications.length === 0 && loading && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Hata</p>
          <p className="text-sm">{error}</p>
          <Button onClick={fetchApplications} className="mt-2" size="sm">
            Tekrar Dene
          </Button>
        </div>
      )}

      {/* Applications Table */}
      {loading && allApplications.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchQuery.trim() || statusFilter !== "ALL" ? "Filtre sonucu bulunamadı" : "Henüz başvuru yok"}
          </h3>
          <p className="text-gray-600">
            {searchQuery.trim() || statusFilter !== "ALL" ? "Farklı filtreler deneyin." : "Burs başvuruları burada görünecek."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden" ref={tableContainerRef}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İsim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Üniversite
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bölüm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksiyonlar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{application.fullName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{application.university}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{application.department || application.faculty}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="w-4 h-4 mr-1 text-gray-400" />
                        {application.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Phone className="w-4 h-4 mr-1 text-gray-400" />
                        {application.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(application.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {formatDateOnly(application.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // Sprint 16 - Block F: Navigate to detail page instead of modal
                            window.location.href = `/admin/burs-basvurulari/${application.id}`;
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          İncele
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedApplication && (
        <ScholarshipApplicationModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onApplicationUpdate={(updatedApp) => {
            setAllApplications(prev => prev.map(app => app.id === updatedApp.id ? updatedApp : app));
            // Update selectedApplication so modal shows updated data, but DON'T close modal
            setSelectedApplication(updatedApp);
          }}
          onApplicationDelete={(id) => {
            setAllApplications(prev => prev.filter(app => app.id !== id));
            // For delete, close modal since application no longer exists
            setSelectedApplication(null);
          }}
        />
      )}
    </div>
  );
}
