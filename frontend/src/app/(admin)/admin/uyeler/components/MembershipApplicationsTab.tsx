"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import { CheckCircle, XCircle, Eye, User, Mail, Phone, Calendar, FileText } from "lucide-react";
import { useMembers } from "@/contexts/MembersContext";
import { MembershipApplication } from "@/lib/types/member";

interface ApplicationModalProps {
  application: MembershipApplication | null;
  onClose: () => void;
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, notes?: string) => void;
}

function ApplicationModal({ application, onClose, onApprove, onReject }: ApplicationModalProps) {
  const [notes, setNotes] = useState("");
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  if (!application) return null;

  const handleSubmit = () => {
    if (action === 'approve') {
      onApprove(application.id, notes);
    } else if (action === 'reject') {
      onReject(application.id, notes);
    }
    onClose();
    setNotes("");
    setAction(null);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Başvuru Detayları</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sol Kolon - Kişisel Bilgiler */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Kişisel Bilgiler</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                  <p className="text-gray-900">{application.firstName} {application.lastName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cinsiyet</label>
                  <p className="text-gray-900 capitalize">{application.gender}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Doğum Tarihi</label>
                  <p className="text-gray-900">{new Date(application.birthDate).toLocaleDateString('tr-TR')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Akademik Seviye</label>
                  <p className="text-gray-900 capitalize">{application.academicLevel}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Medeni Hal</label>
                  <p className="text-gray-900 capitalize">{application.maritalStatus}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">TC Kimlik No</label>
                  <p className="text-gray-900">{application.tcId || 'Belirtilmemiş'}</p>
                </div>
              </div>
            </div>

            {/* Sağ Kolon - İletişim ve Adres */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">İletişim Bilgileri</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{application.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefon</label>
                  <p className="text-gray-900">{application.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Memleket</label>
                  <p className="text-gray-900">{application.hometown}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Doğum Yeri</label>
                  <p className="text-gray-900">{application.placeOfBirth}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Uyruk</label>
                  <p className="text-gray-900">{application.nationality}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mevcut Adres</label>
                  <p className="text-gray-900">{application.currentAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Başvuru Bilgileri */}
          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Başvuru Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Başvuru Tarihi</label>
                <p className="text-gray-900">{new Date(application.applicationDate).toLocaleDateString('tr-TR')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Durum</label>
                <Badge variant={application.status === 'pending' ? 'warning' : application.status === 'approved' ? 'success' : 'danger'}>
                  {application.status === 'pending' ? 'Beklemede' : application.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                </Badge>
              </div>
              {application.reviewedAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">İncelenme Tarihi</label>
                  <p className="text-gray-900">{new Date(application.reviewedAt).toLocaleDateString('tr-TR')}</p>
                </div>
              )}
            </div>
            {application.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Notlar</label>
                <p className="text-gray-900">{application.notes}</p>
              </div>
            )}
          </div>

          {/* Aksiyonlar */}
          {application.status === 'pending' && (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Başvuru Değerlendirmesi</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notlar</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Değerlendirme notları..."
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="px-6 py-2 text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                  İptal
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setAction('reject')}
                  className="px-6 py-2 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 transition-colors"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reddet
                </Button>
                <Button
                  onClick={() => setAction('approve')}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white transition-colors"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Onayla
                </Button>
              </div>
              {action && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    {action === 'approve' ? 'Başvuruyu onaylamak istediğinizden emin misiniz?' : 'Başvuruyu reddetmek istediğinizden emin misiniz?'}
                  </p>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAction(null)}
                      className="px-4 py-1 text-gray-700 border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      Hayır
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSubmit}
                      className={`px-4 py-1 text-white transition-colors ${
                        action === 'approve' 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      Evet
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MembershipApplicationsTab() {
  const { applications, applicationsLoading, applicationsError, updateApplicationStatus, deleteApplication } = useMembers();
  const [selectedApplication, setSelectedApplication] = useState<MembershipApplication | null>(null);

  const handleApprove = async (id: string, notes?: string) => {
    try {
      await updateApplicationStatus(id, 'approved', notes, 'Admin');
    } catch (error) {
      console.error('Error approving application:', error);
    }
  };

  const handleReject = async (id: string, notes?: string) => {
    try {
      await updateApplicationStatus(id, 'rejected', notes, 'Admin');
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu başvuruyu silmek istediğinizden emin misiniz?')) {
      try {
        await deleteApplication(id);
      } catch (error) {
        console.error('Error deleting application:', error);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((application) => (
            <Card key={application.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {application.firstName} {application.lastName}
                    </CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Mail className="w-4 h-4 mr-1" />
                      {application.email}
                    </CardDescription>
                  </div>
                  {getStatusBadge(application.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{application.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(application.applicationDate).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span className="capitalize">{application.gender} • {application.academicLevel}</span>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
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
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Onayla
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
