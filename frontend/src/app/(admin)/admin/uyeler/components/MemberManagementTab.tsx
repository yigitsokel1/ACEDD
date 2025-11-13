"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Textarea } from "@/components/ui";
import { Select } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Plus, Edit, Trash2, User, Mail, Phone, Calendar, MapPin, Search, Filter, ToggleLeft, ToggleRight, Eye } from "lucide-react";
import { useMembers } from "@/contexts/MembersContext";
import { Member, CreateMemberData, UpdateMemberData, CreateMemberFormData } from "@/lib/types/member";

interface MemberModalProps {
  member: Member | null;
  onClose: () => void;
  onSave: (data: CreateMemberData | UpdateMemberData) => void;
  isEditing: boolean;
}

interface MemberDetailsModalProps {
  member: Member | null;
  onClose: () => void;
}

function MemberModal({ member, onClose, onSave, isEditing }: MemberModalProps) {
  const [formData, setFormData] = useState<CreateMemberFormData>({
    firstName: member?.firstName || "",
    lastName: member?.lastName || "",
    gender: member?.gender || "",
    email: member?.email || "",
    phone: member?.phone || "",
    birthDate: member?.birthDate || "",
    academicLevel: member?.academicLevel || "",
    maritalStatus: member?.maritalStatus || "",
    hometown: member?.hometown || "",
    placeOfBirth: member?.placeOfBirth || "",
    nationality: member?.nationality || "",
    currentAddress: member?.currentAddress || "",
    tcId: member?.tcId || "",
    lastValidDate: member?.lastValidDate || "",
    titles: member?.titles || [],
    status: member?.status || "",
    membershipDate: member?.membershipDate || "",
  });

  const genderOptions = [
    { value: "erkek", label: "Erkek" },
    { value: "kadın", label: "Kadın" },
  ];

  const academicLevelOptions = [
    { value: "ilkokul", label: "İlkokul" },
    { value: "ortaokul", label: "Ortaokul" },
    { value: "lise", label: "Lise" },
    { value: "onlisans", label: "Önlisans" },
    { value: "lisans", label: "Lisans" },
    { value: "yukseklisans", label: "Yüksek Lisans" },
    { value: "doktora", label: "Doktora" },
  ];

  const maritalStatusOptions = [
    { value: "bekar", label: "Bekar" },
    { value: "evli", label: "Evli" },
    { value: "dul", label: "Dul" },
    { value: "bosanmis", label: "Boşanmış" },
  ];

  const titleOptions = [
    { value: "Onursal Başkan", label: "Onursal Başkan" },
    { value: "Kurucu Başkan", label: "Kurucu Başkan" },
    { value: "Önceki Başkan", label: "Önceki Başkan" },
    { value: "Başkan", label: "Başkan" },
    { value: "Kurucu Üye", label: "Kurucu Üye" },
    { value: "Başkan Yardımcısı", label: "Başkan Yardımcısı" },
    { value: "Sayman", label: "Sayman" },
    { value: "Genel Sekreter", label: "Genel Sekreter" },
    { value: "Üye", label: "Üye" },
    { value: "Gönüllü", label: "Gönüllü" },
  ];

  const statusOptions = [
    { value: "active", label: "Aktif" },
    { value: "inactive", label: "Pasif" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // FormData'yı CreateMemberData'ya dönüştür
    const memberData: CreateMemberData = {
      ...formData,
      gender: formData.gender as 'erkek' | 'kadın',
      academicLevel: formData.academicLevel as 'ilkokul' | 'ortaokul' | 'lise' | 'onlisans' | 'lisans' | 'yukseklisans' | 'doktora',
      maritalStatus: formData.maritalStatus as 'bekar' | 'evli' | 'dul' | 'bosanmis',
      status: formData.status as 'active' | 'inactive',
    };
    
    onSave(memberData);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? "Üye Düzenle" : "Yeni Üye Ekle"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Kişisel Bilgiler */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Kişisel Bilgiler</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Ad"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
                <Input
                  label="Soyad"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                />
                <Select
                  label="Cinsiyet"
                  value={formData.gender}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as "" | "erkek" | "kadın" }))}
                  options={genderOptions}
                  required
                />
                <Input
                  label="Doğum Tarihi"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                  required
                />
                <Select
                  label="Akademik Seviye"
                  value={formData.academicLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, academicLevel: e.target.value as "" | "ilkokul" | "ortaokul" | "lise" | "onlisans" | "lisans" | "yukseklisans" | "doktora" }))}
                  options={academicLevelOptions}
                  required
                />
                <Select
                  label="Medeni Hal"
                  value={formData.maritalStatus}
                  onChange={(e) => setFormData(prev => ({ ...prev, maritalStatus: e.target.value as "" | "bekar" | "evli" | "bosanmis" | "dul" }))}
                  options={maritalStatusOptions}
                  required
                />
              </div>
            </div>

            {/* İletişim Bilgileri */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">İletişim Bilgileri</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
                <Input
                  label="Telefon"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Adres Bilgileri */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Adres Bilgileri</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Memleket"
                  value={formData.hometown}
                  onChange={(e) => setFormData(prev => ({ ...prev, hometown: e.target.value }))}
                  required
                />
                <Input
                  label="Doğum Yeri"
                  value={formData.placeOfBirth}
                  onChange={(e) => setFormData(prev => ({ ...prev, placeOfBirth: e.target.value }))}
                  required
                />
                <Input
                  label="Uyruk"
                  value={formData.nationality}
                  onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
                  required
                />
                <Input
                  label="TC Kimlik No"
                  value={formData.tcId}
                  onChange={(e) => setFormData(prev => ({ ...prev, tcId: e.target.value }))}
                />
              </div>
              <Textarea
                label="Mevcut Adres"
                value={formData.currentAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, currentAddress: e.target.value }))}
                required
                rows={3}
              />
            </div>

            {/* Üyelik Bilgileri */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Üyelik Bilgileri</h3>
              
              {/* Üyelik Tarihi */}
              <Input
                label="Üyelik Tarihi"
                type="date"
                value={formData.membershipDate}
                onChange={(e) => setFormData(prev => ({ ...prev, membershipDate: e.target.value }))}
                required
              />
              
              {/* Ünvan Seçimi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ünvanlar *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {titleOptions.map((option) => (
                    <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.titles.includes(option.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              titles: [...prev.titles, option.value]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              titles: prev.titles.filter(title => title !== option.value)
                            }));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                {formData.titles.length === 0 && (
                  <p className="text-sm text-red-600 mt-1">En az bir ünvan seçmelisiniz</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Durum"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as "" | "active" | "inactive" }))}
                  options={statusOptions}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="px-6 py-2 text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                İptal
              </Button>
              <Button 
                type="submit" 
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>{isEditing ? "Güncelle" : "Kaydet"}</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function MemberDetailsModal({ member, onClose }: MemberDetailsModalProps) {
  if (!member) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Üye Detayları</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sol Kolon - Kişisel Bilgiler */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kişisel Bilgiler</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                      <p className="text-gray-900 font-medium">{member.firstName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                      <p className="text-gray-900 font-medium">{member.lastName}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cinsiyet</label>
                      <p className="text-gray-900 capitalize">{member.gender}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Doğum Tarihi</label>
                      <p className="text-gray-900">{new Date(member.birthDate).toLocaleDateString('tr-TR')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Akademik Seviye</label>
                      <p className="text-gray-900 capitalize">{member.academicLevel}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medeni Hal</label>
                      <p className="text-gray-900 capitalize">{member.maritalStatus}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">TC Kimlik No</label>
                    <p className="text-gray-900">{member.tcId || 'Belirtilmemiş'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">İletişim Bilgileri</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{member.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    <p className="text-gray-900">{member.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mevcut Adres</label>
                    <p className="text-gray-900">{member.currentAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ Kolon - Adres ve Üyelik Bilgileri */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Adres Bilgileri</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Memleket</label>
                    <p className="text-gray-900">{member.hometown}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Doğum Yeri</label>
                    <p className="text-gray-900">{member.placeOfBirth}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Uyruk</label>
                    <p className="text-gray-900">{member.nationality}</p>
                  </div>
                  {member.lastValidDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Son Geçerlilik Tarihi</label>
                      <p className="text-gray-900">{new Date(member.lastValidDate).toLocaleDateString('tr-TR')}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Üyelik Bilgileri</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ünvanlar</label>
                    <div className="flex flex-wrap gap-2">
                      {member.titles.map((title, index) => (
                        <Badge key={index} variant="default" className="text-sm font-semibold">
                          {title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                    <div className="flex items-center space-x-2">
                      {member.status === 'active' ? (
                        <Badge variant="success">Aktif</Badge>
                      ) : (
                        <Badge variant="secondary">Pasif</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Üyelik Tarihi</label>
                    <p className="text-gray-900">{new Date(member.membershipDate).toLocaleDateString('tr-TR')}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kayıt Tarihi</label>
                    <p className="text-gray-900">{new Date(member.createdAt).toLocaleDateString('tr-TR')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MemberManagementTab() {
  const { members, membersLoading, membersError, addMember, updateMember, deleteMember } = useMembers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [titleFilter, setTitleFilter] = useState<string>('all');

  const titleOptions = [
    { value: "Onursal Başkan", label: "Onursal Başkan" },
    { value: "Kurucu Başkan", label: "Kurucu Başkan" },
    { value: "Önceki Başkan", label: "Önceki Başkan" },
    { value: "Başkan", label: "Başkan" },
    { value: "Kurucu Üye", label: "Kurucu Üye" },
    { value: "Başkan Yardımcısı", label: "Başkan Yardımcısı" },
    { value: "Sayman", label: "Sayman" },
    { value: "Genel Sekreter", label: "Genel Sekreter" },
    { value: "Üye", label: "Üye" },
    { value: "Gönüllü", label: "Gönüllü" },
  ];

  const handleSave = async (data: CreateMemberData | UpdateMemberData) => {
    try {
      if (editingMember) {
        await updateMember(editingMember.id, data);
      } else {
        await addMember(data as CreateMemberData);
      }
      setIsModalOpen(false);
      setEditingMember(null);
    } catch (error) {
      console.error('Error saving member:', error);
    }
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleViewDetails = (member: Member) => {
    setViewingMember(member);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu üyeyi silmek istediğinizden emin misiniz?')) {
      try {
        await deleteMember(id);
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
  };

  const handleToggleStatus = async (member: Member) => {
    try {
      const newStatus = member.status === 'active' ? 'inactive' : 'active';
      
      // Korunacak ünvanlar (pasif yapıldığında silinmeyecek)
      const protectedTitles = [
        'Kurucu Başkan',
        'Önceki Başkan', 
        'Onursal Başkan',
        'Kurucu Üye'
      ];
      
      let updatedTitles = member.titles;
      
      // Eğer aktif'ten pasif'e geçiyorsa, korunacak ünvanları hariç tut
      if (member.status === 'active' && newStatus === 'inactive') {
        updatedTitles = member.titles.filter(title => protectedTitles.includes(title));
      }
      
      await updateMember(member.id, { 
        status: newStatus,
        titles: updatedTitles
      });
    } catch (error) {
      console.error('Error updating member status:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const handleCloseDetailsModal = () => {
    setViewingMember(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Aktif</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Pasif</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getMemberTitlesBadges = (titles: string[]) => {
    if (!titles || titles.length === 0) {
      return <Badge variant="secondary">Ünvan Yok</Badge>;
    }
    
    return (
      <div className="flex flex-wrap gap-1">
        {titles.map((title, index) => (
          <Badge key={index} variant="default" className="text-xs font-semibold">
            {title}
          </Badge>
        ))}
      </div>
    );
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm) ||
      member.hometown.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    
    const matchesTitle = titleFilter === 'all' || titleFilter === '' || member.titles.includes(titleFilter);

    return matchesSearch && matchesStatus && matchesTitle;
  });

  if (membersLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (membersError) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Hata: {membersError}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Üye Yönetimi</h2>
          <p className="text-gray-600">Toplam {members.length} üye</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Üye Ekle</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* Search */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Arama</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Ad, email, telefon, memleket..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="space-y-2">
              <Select
                label="Durum"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "active" | "inactive" | "all")}
                placeholder="Tümü"
                options={[
                  { value: "active", label: "Aktif" },
                  { value: "inactive", label: "Pasif" },
                ]}
              />
            </div>
            
            {/* Title Filter */}
            <div className="space-y-2">
              <Select
                label="Ünvan"
                value={titleFilter}
                onChange={(e) => setTitleFilter(e.target.value)}
                placeholder="Tümü"
                options={titleOptions}
              />
            </div>
          </div>
          
          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{filteredMembers.length}</span> üye bulundu
              </div>
              <div className="text-xs text-gray-500">
                Toplam {members.length} üye
              </div>
            </div>
          </div>
        </div>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm ? "Arama sonucu bulunamadı" : "Henüz üye yok"}
          </h3>
          <p className="text-gray-600">
            {searchTerm ? "Farklı arama terimleri deneyin." : "İlk üyeyi eklemek için yukarıdaki butona tıklayın."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-3">Ad Soyad</div>
              <div className="col-span-3">İletişim</div>
              <div className="col-span-4">Ünvanlar</div>
              <div className="col-span-1">Durum</div>
              <div className="col-span-1">İşlemler</div>
            </div>
          </div>
          
          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {filteredMembers.map((member) => (
              <div key={member.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Ad Soyad */}
                  <div className="col-span-3">
                    <div className="font-medium text-gray-900">
                      {member.firstName} {member.lastName}
                    </div>
                  </div>
                  
                  {/* İletişim */}
                  <div className="col-span-3">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-3 h-3 mr-2 text-blue-500" />
                        {member.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-3 h-3 mr-2 text-green-500" />
                        {member.phone}
                      </div>
                    </div>
                  </div>
                  
                  {/* Ünvanlar */}
                  <div className="col-span-4">
                    {getMemberTitlesBadges(member.titles)}
                  </div>
                  
                  {/* Durum */}
                  <div className="col-span-1">
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(member.status)}
                      <button
                        onClick={() => handleToggleStatus(member)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title={member.status === 'active' ? 'Pasif yap' : 'Aktif yap'}
                      >
                        {member.status === 'active' ? (
                          <ToggleRight className="w-5 h-5 text-green-500" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* İşlemler */}
                  <div className="col-span-1">
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(member)}
                        className="text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors p-1"
                        title="Detayları Görüntüle"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(member)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-colors p-1"
                        title="Düzenle"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(member.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors p-1"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isModalOpen && (
        <MemberModal
          member={editingMember}
          onClose={handleCloseModal}
          onSave={handleSave}
          isEditing={!!editingMember}
        />
      )}

      {viewingMember && (
        <MemberDetailsModal
          member={viewingMember}
          onClose={handleCloseDetailsModal}
        />
      )}
    </div>
  );
}
