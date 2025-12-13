"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import { CheckCircle, XCircle, Eye, Phone, Calendar, FileText, ChevronDown, ChevronUp, Mail, MapPin, User, Droplet } from "lucide-react";
import { useMembers } from "@/contexts/MembersContext";
import { MembershipApplication } from "@/lib/types/member";
import { formatDateOnly } from "@/lib/utils/dateHelpers";
import { getGenderLabel } from "@/lib/utils/genderHelpers";
import { getBloodTypeLabel } from "@/lib/utils/bloodTypeHelpers";
import { logClientError } from "@/lib/utils/clientLogging";

interface ApplicationModalProps {
  application: MembershipApplication | null;
  onClose: () => void;
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, notes?: string) => void;
  onSaveNotes?: (id: string, notes: string) => void;
}

// Sprint 15.3: Collapsible section component with improved styling
function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all flex items-center justify-between group"
      >
        <div className="flex items-center space-x-3">
          {Icon && <Icon className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />}
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
        )}
      </button>
      {isOpen && <div className="p-6 bg-white">{children}</div>}
    </div>
  );
}

function ApplicationModal({ application, onClose, onApprove, onReject, onSaveNotes }: ApplicationModalProps) {
  const [notes, setNotes] = useState(application?.notes || "");
  const [action, setAction] = useState<'approve' | 'reject' | 'save-notes' | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);

  // Update notes when application changes
  useEffect(() => {
    if (application) {
      setNotes(application.notes || "");
    }
  }, [application]);

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
    try {
      if (action === 'approve') {
        await onApprove(application.id, notes);
      } else if (action === 'reject') {
        await onReject(application.id, notes);
      } else if (action === 'save-notes' && onSaveNotes) {
        await onSaveNotes(application.id, notes);
        setAction(null);
        return; // Don't close modal for save-notes
      }
      onClose();
      setAction(null);
    } catch (error) {
      logClientError("[MembershipApplicationsTab][PERFORM_ACTION]", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div ref={modalRef} className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Başvuru Detayları</h2>
              <p className="text-gray-600">
                {application.firstName} {application.lastName} - {application.identityNumber}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Kapat"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Sprint 15.3: Collapsible sections with improved readability */}
          <div className="space-y-6">
            {/* Kişisel Bilgiler */}
            <CollapsibleSection title="Kişisel Bilgiler" icon={User} defaultOpen={true}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ad Soyad</label>
                  <p className="text-base font-medium text-gray-900">{application.firstName} {application.lastName}</p>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">TC Kimlik No</label>
                  <p className="text-base font-mono text-gray-900 tracking-wider">{application.identityNumber}</p>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Cinsiyet</label>
                  <p className="text-base text-gray-900">{getGenderLabel(application.gender)}</p>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Kan Grubu</label>
                  <p className="text-base text-gray-900">{getBloodTypeLabel(application.bloodType)}</p>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Doğum Tarihi</label>
                  <p className="text-base text-gray-900 font-medium">
                    {application.birthDate && application.birthDate !== "" ? formatDateOnly(application.birthDate) : "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Doğum Yeri</label>
                  <p className="text-base text-gray-900">{application.birthPlace}</p>
                </div>
              </div>
            </CollapsibleSection>

            {/* İletişim Bilgileri */}
            <CollapsibleSection title="İletişim Bilgileri" icon={Mail} defaultOpen={true}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">E-posta Adresi</label>
                  <p className="text-base text-gray-900 break-all font-medium">{application.email}</p>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Telefon Numarası</label>
                  <p className="text-base text-gray-900 font-medium">{application.phone}</p>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">İkamet Edilen Şehir</label>
                  <p className="text-base text-gray-900">{application.city}</p>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Adres</label>
                  <p className="text-base text-gray-900 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {application.address}
                  </p>
                </div>
              </div>
            </CollapsibleSection>

            {/* Başvuru Bilgileri */}
            <CollapsibleSection title="Başvuru Bilgileri" icon={FileText} defaultOpen={true}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Başvuru Tarihi</label>
                  <p className="text-base text-gray-900 font-medium">{formatDateOnly(application.applicationDate)}</p>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Durum</label>
                  <div className="mt-1">
                    <Badge variant={application.status === 'pending' ? 'warning' : application.status === 'approved' ? 'success' : 'danger'}>
                      {application.status === 'pending' ? 'Beklemede' : application.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                    </Badge>
                  </div>
                </div>
                {application.reviewedAt && (
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">İncelenme Tarihi</label>
                    <p className="text-base text-gray-900 font-medium">{formatDateOnly(application.reviewedAt)}</p>
                  </div>
                )}
              </div>
              {application.notes && (
                <div className="mt-6 space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Değerlendirme Notları</label>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-base text-gray-900 whitespace-pre-wrap leading-relaxed">{application.notes}</p>
                  </div>
                </div>
              )}
            </CollapsibleSection>
          </div>

          {/* Aksiyonlar */}
          <div className="mt-10 space-y-6 border-t-2 border-gray-300 pt-8">
            <div className="flex items-center space-x-2 mb-6">
              <FileText className="w-6 h-6 text-gray-700" />
              <h3 className="text-xl font-bold text-gray-900">Başvuru Değerlendirmesi</h3>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Değerlendirme Notları</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base leading-relaxed resize-none"
                rows={4}
                placeholder="Başvuru hakkında değerlendirme notlarınızı buraya yazabilirsiniz..."
              />
            </div>
            <div className="flex flex-wrap justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="px-6 py-2.5 text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
              >
                İptal
              </Button>
              {onSaveNotes && (
                <Button
                  variant="outline"
                  onClick={() => setAction('save-notes')}
                  className="px-6 py-2.5 text-blue-700 border-2 border-blue-300 hover:bg-blue-50 hover:border-blue-400 transition-all font-medium"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Sadece Not Kaydet
                </Button>
              )}
              {application.status === 'pending' && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setAction('reject')}
                    className="px-6 py-2.5 text-red-700 border-2 border-red-300 hover:bg-red-50 hover:border-red-400 transition-all font-medium"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reddet
                  </Button>
                  <Button
                    onClick={() => setAction('approve')}
                    className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white transition-all font-medium shadow-md hover:shadow-lg"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Onayla
                  </Button>
                </>
              )}
            </div>
            {action && action !== 'save-notes' && (
              <div ref={confirmationRef} className="mt-6 p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200">
                <div className="flex items-start space-x-3 mb-4">
                  {action === 'approve' ? (
                    <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                  )}
                  <p className="text-base font-medium text-gray-900 flex-1">
                    {action === 'approve' 
                      ? 'Bu başvuruyu onaylamak istediğinizden emin misiniz? Onaylandığında üye olarak eklenecektir.' 
                      : 'Bu başvuruyu reddetmek istediğinizden emin misiniz?'}
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAction(null)}
                    className="px-5 py-2 text-gray-700 border-2 border-gray-300 hover:bg-gray-50 transition-all font-medium"
                  >
                    Hayır, İptal
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    className={`px-5 py-2 text-white transition-all font-medium shadow-md hover:shadow-lg ${
                      action === 'approve' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    Evet, {action === 'approve' ? 'Onayla' : 'Reddet'}
                  </Button>
                </div>
              </div>
            )}
            {action === 'save-notes' && (
              <div ref={confirmationRef} className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
                <div className="flex items-start space-x-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-base font-medium text-blue-900 flex-1">
                    Notları kaydetmek istediğinizden emin misiniz? Bu işlem başvuru durumunu değiştirmez.
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAction(null)}
                    className="px-5 py-2 text-gray-700 border-2 border-gray-300 hover:bg-gray-50 transition-all font-medium"
                  >
                    Hayır, İptal
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    className="px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 transition-all font-medium shadow-md hover:shadow-lg"
                  >
                    Evet, Kaydet
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

export default function MembershipApplicationsTab() {
  const { applications, applicationsLoading, applicationsError, updateApplicationStatus, deleteApplication, refreshMembers, refreshApplications } = useMembers();
  const [selectedApplication, setSelectedApplication] = useState<MembershipApplication | null>(null);

  const handleApprove = async (id: string, notes?: string) => {
    try {
      await updateApplicationStatus(id, 'approved', notes, 'Admin');
      // Refresh members list to show the newly created member
      await refreshMembers();
      setSelectedApplication(null);
    } catch (error) {
      // Error is already handled in context
    }
  };

  const handleReject = async (id: string, notes?: string) => {
    try {
      await updateApplicationStatus(id, 'rejected', notes, 'Admin');
      setSelectedApplication(null);
    } catch (error) {
      // Error is already handled in context
    }
  };

  const handleSaveNotes = async (id: string, notes: string) => {
    try {
      await updateApplicationStatus(id, undefined, notes, 'Admin');
      // Refresh applications to show updated notes
      await refreshApplications();
      setSelectedApplication(null);
    } catch (error) {
      // Error is already handled in context
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu başvuruyu silmek istediğinizden emin misiniz?')) {
      try {
        await deleteApplication(id);
      } catch (error) {
        // Error is already handled in context
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Beklemede</Badge>;
      case 'approved':
        return <Badge variant="success">Onaylandı</Badge>;
      case 'rejected':
        return <Badge variant="danger">Reddedildi</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (applicationsLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (applicationsError) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Hata: {applicationsError}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Üyelik Başvuruları</h2>
          <p className="text-gray-600">Toplam {applications.length} başvuru</p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz başvuru yok</h3>
          <p className="text-gray-600">Üyelik başvuruları burada görünecek.</p>
        </div>
      ) : (
        // Sprint 15.3: Table layout for better readability
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-3">Ad Soyad</div>
              <div className="col-span-2">Şehir</div>
              <div className="col-span-2">Telefon</div>
              <div className="col-span-2">Başvuru Tarihi</div>
              <div className="col-span-1">Durum</div>
              <div className="col-span-2">İşlemler</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {applications.map((application) => (
              <div key={application.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Ad Soyad */}
                  <div className="col-span-3">
                    <div className="font-medium text-gray-900">{application.firstName} {application.lastName}</div>
                  </div>

                  {/* Şehir */}
                  <div className="col-span-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                      <span>{application.city}</span>
                    </div>
                  </div>

                  {/* Telefon */}
                  <div className="col-span-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-1 text-gray-400" />
                      <span>{application.phone}</span>
                    </div>
                  </div>

                  {/* Başvuru Tarihi */}
                  <div className="col-span-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                      <span>{formatDateOnly(application.applicationDate)}</span>
                    </div>
                  </div>

                  {/* Durum */}
                  <div className="col-span-1">
                    {getStatusBadge(application.status)}
                  </div>

                  {/* İşlemler */}
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedApplication(application)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        İncele
                      </Button>
                      {application.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleApprove(application.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(application.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Sil
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onSaveNotes={handleSaveNotes}
        />
      )}
    </div>
  );
}
