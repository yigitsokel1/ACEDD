"use client";

import React, { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Textarea } from "@/components/ui";
import { Select } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Plus, Edit, Trash2, User, Mail, Phone, Calendar, MapPin, Search, ToggleLeft, ToggleRight, Eye, ChevronDown, ChevronUp, Droplet } from "lucide-react";
import { useMembers } from "@/contexts/MembersContext";
import { Member, CreateMemberData, UpdateMemberData, CreateMemberFormData, MembershipKind, MemberTag, BloodType } from "@/lib/types/member";
import { getBoardRoleLabel } from "@/lib/utils/memberHelpers";
import { formatDateOnly, isoToDateInput } from "@/lib/utils/dateHelpers";
import { getGenderLabel } from "@/lib/utils/genderHelpers";
import { getBloodTypeLabel } from "@/lib/utils/bloodTypeHelpers";
import { FileUpload } from "@/components/ui/FileUpload";
import { logClientError } from "@/lib/utils/clientLogging";

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
  const [formErrors, setFormErrors] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateMemberFormData>({
    firstName: member?.firstName || "",
    lastName: member?.lastName || "",
    gender: member?.gender || "",
    email: member?.email || "",
    phone: member?.phone || "",
    birthDate: isoToDateInput(member?.birthDate),
    placeOfBirth: member?.placeOfBirth || "",
    currentAddress: member?.currentAddress || "",
    tcId: member?.tcId || "",
    lastValidDate: isoToDateInput(member?.lastValidDate),
    titles: member?.titles || [],
    status: member?.status || "",
    membershipDate: isoToDateInput(member?.membershipDate),
    // Sprint 5: Yeni alanlar
    membershipKind: member?.membershipKind || "MEMBER",
    tags: member?.tags || [],
    // Sprint 15: Membership Application'dan gelen yeni alanlar
    bloodType: member?.bloodType || null,
    city: member?.city || null,
    // Sprint 17: CV Upload
    cvDatasetId: member?.cvDatasetId || null,
  });

  // Update formData and clear errors when member changes
  useEffect(() => {
    setFormErrors(null);
    if (member) {
      setFormData({
        firstName: member.firstName || "",
        lastName: member.lastName || "",
        gender: member.gender || "",
        email: member.email || "",
        phone: member.phone || "",
        birthDate: isoToDateInput(member.birthDate),
        placeOfBirth: member.placeOfBirth || "",
        currentAddress: member.currentAddress || "",
        tcId: member.tcId || "",
        lastValidDate: isoToDateInput(member.lastValidDate),
        titles: member.titles || [],
        status: member.status || "",
        membershipDate: isoToDateInput(member.membershipDate),
        membershipKind: member.membershipKind || "MEMBER",
        tags: member.tags || [],
        bloodType: member.bloodType || null,
        city: member.city || null,
        cvDatasetId: member.cvDatasetId || null,
      });
    } else {
      // Reset form when member is null (new member)
      setFormData({
        firstName: "",
        lastName: "",
        gender: "",
        email: "",
        phone: "",
        birthDate: "",
        placeOfBirth: "",
        currentAddress: "",
        tcId: "",
        lastValidDate: "",
        titles: [],
        status: "",
        membershipDate: "",
        membershipKind: "MEMBER",
        tags: [],
        bloodType: null,
        city: null,
        cvDatasetId: null,
      });
    }
  }, [member]);

  const genderOptions = [
    { value: "erkek", label: "Erkek" },
    { value: "kadın", label: "Kadın" },
  ];


  // Unused - keeping for potential future use
  // const titleOptions = [
  //   { value: "Onursal Başkan", label: "Onursal Başkan" },
  //   { value: "Kurucu Başkan", label: "Kurucu Başkan" },
  //   { value: "Önceki Başkan", label: "Önceki Başkan" },
  //   { value: "Başkan", label: "Başkan" },
  //   { value: "Kurucu Üye", label: "Kurucu Üye" },
  //   { value: "Başkan Yardımcısı", label: "Başkan Yardımcısı" },
  //   { value: "Sayman", label: "Sayman" },
  //   { value: "Genel Sekreter", label: "Genel Sekreter" },
  //   { value: "Üye", label: "Üye" },
  //   { value: "Gönüllü", label: "Gönüllü" },
  // ];

  const statusOptions = [
    { value: "", label: "Seçiniz" },
    { value: "active", label: "Aktif" },
    { value: "inactive", label: "Pasif" },
  ];

  // Sprint 5: MembershipKind options
  const membershipKindOptions = [
    { value: "MEMBER", label: "Üye" },
    { value: "VOLUNTEER", label: "Gönüllü" },
  ];

  // Sprint 5: MemberTag options (etiketler)
  const tagOptions: { value: MemberTag; label: string }[] = [
    { value: "HONORARY_PRESIDENT", label: "Onursal Başkan" },
    { value: "FOUNDING_PRESIDENT", label: "Kurucu Başkan" },
    { value: "FOUNDING_MEMBER", label: "Kurucu Üye" },
    { value: "PAST_PRESIDENT", label: "Önceki Başkan" },
  ];

  // Sprint 15: Blood type options
  const bloodTypeOptions = [
    { value: "", label: "Seçiniz" },
    { value: "A_POSITIVE", label: "A Rh+" },
    { value: "A_NEGATIVE", label: "A Rh-" },
    { value: "B_POSITIVE", label: "B Rh+" },
    { value: "B_NEGATIVE", label: "B Rh-" },
    { value: "AB_POSITIVE", label: "AB Rh+" },
    { value: "AB_NEGATIVE", label: "AB Rh-" },
    { value: "O_POSITIVE", label: "0 Rh+" },
    { value: "O_NEGATIVE", label: "0 Rh-" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors(null);

    // Zorunlu alanlar: Ad, Soyad, Durum, Üye Türü
    const missing: string[] = [];
    if (!formData.firstName?.trim()) missing.push("Ad");
    if (!formData.lastName?.trim()) missing.push("Soyad");
    if (!formData.status || (formData.status !== "active" && formData.status !== "inactive")) missing.push("Durum");
    if (!formData.membershipKind || (formData.membershipKind !== "MEMBER" && formData.membershipKind !== "VOLUNTEER")) missing.push("Üye Türü");

    if (missing.length > 0) {
      setFormErrors(`Lütfen zorunlu alanları doldurun: ${missing.join(", ")}`);
      return;
    }

    // Zorunlu + opsiyonel alanlar; boş opsiyoneller null/"" ile API’ye gidiyor
    const memberData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      status: formData.status as "active" | "inactive",
      membershipKind: (formData.membershipKind || "MEMBER") as MembershipKind,
      gender: (formData.gender === "erkek" || formData.gender === "kadın") ? formData.gender : null,
      email: formData.email?.trim() || null,
      phone: formData.phone?.trim() || null,
      birthDate: formData.birthDate?.trim() || null,
      placeOfBirth: formData.placeOfBirth?.trim() || "",
      currentAddress: formData.currentAddress?.trim() || "",
      membershipDate: formData.membershipDate?.trim() || null,
      tcId: formData.tcId?.trim() || null,
      lastValidDate: formData.lastValidDate?.trim() || null,
      titles: formData.titles ?? [],
      tags: formData.tags ?? [],
      bloodType: formData.bloodType || null,
      city: formData.city?.trim() || null,
      cvDatasetId: formData.cvDatasetId || null,
    } as CreateMemberData;

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
            {formErrors && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" role="alert">
                {formErrors}
              </div>
            )}
            {/* Sprint 15: Üyelik başvuru formuna göre düzenlenmiş alanlar; zorunlu: Ad, Soyad, Durum, Üye Türü */}
            <div className="space-y-6">
              {/* Satır 1: Ad Soyad | TC Kimlik No */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ad Soyad <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Ad"
                      required
                    />
                    <Input
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Soyad"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    TC Kimlik No
                  </label>
                  <Input
                    value={formData.tcId || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, tcId: e.target.value }))}
                    placeholder="11 haneli TC kimlik numarası"
                  />
                </div>
              </div>

              {/* Satır 2: Cinsiyet | İkamet Ettiğiniz Şehir */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cinsiyet</label>
                  <Select
                    value={formData.gender}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as "" | "erkek" | "kadın" }))}
                    options={genderOptions}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    İkamet Ettiğiniz Şehir
                  </label>
                  <Input
                    value={formData.city || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="İkamet ettiğiniz şehir"
                  />
                </div>
              </div>

              {/* Satır 3: Doğum Yeri | Doğum Tarihi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Doğum Yeri</label>
                  <Input
                    value={formData.placeOfBirth}
                    onChange={(e) => setFormData(prev => ({ ...prev, placeOfBirth: e.target.value }))}
                    placeholder="Doğum yeri"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Doğum Tarihi</label>
                  <Input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                  />
                </div>
              </div>

              {/* Satır 4: E-posta | Telefon Numarası */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">E-posta</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="ornek@email.com"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Telefon Numarası</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="05551234567"
                  />
                </div>
              </div>

              {/* Satır 5: Kan Grubu (Tam genişlik) */}
              <div className="flex flex-col">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kan Grubu
                </label>
                <Select
                  value={formData.bloodType || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, bloodType: (e.target.value === "" ? null : e.target.value) as BloodType | null }))}
                  options={bloodTypeOptions}
                />
              </div>

              {/* Satır 6: Adres (Tam genişlik) */}
              <div className="flex flex-col">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Adres</label>
                <Textarea
                  value={formData.currentAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentAddress: e.target.value }))}
                  placeholder="Tam adresinizi girin"
                  rows={4}
                />
              </div>
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
              />
              
              {/* Sprint 5: Üye Türü (membershipKind) */}
              <Select
                label="Üye Türü *"
                value={formData.membershipKind || "MEMBER"}
                onChange={(e) => setFormData(prev => ({ ...prev, membershipKind: e.target.value as MembershipKind }))}
                options={membershipKindOptions}
                required
              />
              
              {/* Sprint 5: Etiketler (tags) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Etiketler (İsteğe bağlı)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {tagOptions.map((option) => (
                    <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.tags?.includes(option.value) || false}
                        onChange={(e) => {
                          const currentTags = formData.tags || [];
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              tags: [...currentTags, option.value]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              tags: currentTags.filter(tag => tag !== option.value)
                            }));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sprint 17: CV Upload */}
              <div className="flex flex-col space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CV (PDF)
                </label>
                <FileUpload
                  label=""
                  value={formData.cvDatasetId ? [formData.cvDatasetId] : []}
                  onChange={(datasetIds) => {
                    setFormData(prev => ({ ...prev, cvDatasetId: datasetIds.length > 0 ? datasetIds[0] : null }));
                  }}
                  multiple={false}
                  maxFiles={1}
                  accept="application/pdf"
                />
                <p className="text-xs text-gray-500">
                  Maksimum 10MB. Sadece PDF dosyaları kabul edilir.
                </p>
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

// Sprint 5: Helper functions (shared between components)
function getMembershipKindLabel(kind: MembershipKind | undefined): string {
  return kind === "VOLUNTEER" ? "Gönüllü" : "Üye";
}

function getTagLabel(tag: MemberTag): string {
  const tagMap: Record<MemberTag, string> = {
    HONORARY_PRESIDENT: "Onursal Başkan",
    FOUNDING_PRESIDENT: "Kurucu Başkan",
    FOUNDING_MEMBER: "Kurucu Üye",
    PAST_PRESIDENT: "Önceki Başkan",
  };
  return tagMap[tag] || tag;
}

// CollapsibleSection component for MemberDetailsModal
function CollapsibleSectionMember({
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

function MemberDetailsModal({ member, onClose }: MemberDetailsModalProps) {
  const { boardMembers } = useMembers();
  
  if (!member) return null;

  // Get board member role
  const boardMember = boardMembers.find(bm => bm.memberId === member.id);
  const boardRoleLabel = boardMember ? getBoardRoleLabel(boardMember.role) : null;
  const memberTitles = member.titles || [];

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Üye Detayları</h2>
              <p className="text-gray-600">
                {member.firstName} {member.lastName}
                {member.tcId && ` - ${member.tcId}`}
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

          <div className="space-y-6">
            {/* Kişisel Bilgiler */}
            <CollapsibleSectionMember title="Kişisel Bilgiler" icon={User} defaultOpen={true}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ad</label>
                  <p className="text-base font-medium text-gray-900">{member.firstName}</p>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Soyad</label>
                  <p className="text-base font-medium text-gray-900">{member.lastName}</p>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">TC Kimlik No</label>
                  <p className="text-base font-mono text-gray-900 tracking-wider">{member.tcId || "-"}</p>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Cinsiyet</label>
                  <p className="text-base text-gray-900 font-medium">{getGenderLabel(member.gender)}</p>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Doğum Tarihi</label>
                  <p className="text-base text-gray-900 font-medium">
                    {member.birthDate && member.birthDate !== "" ? formatDateOnly(member.birthDate) : "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Doğum Yeri</label>
                  <p className="text-base text-gray-900 font-medium">{member.placeOfBirth || "-"}</p>
                </div>
                {member.bloodType && (
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Kan Grubu</label>
                    <p className="text-base text-gray-900 font-medium flex items-center">
                      <Droplet className="w-4 h-4 mr-2 text-red-500" />
                      {getBloodTypeLabel(member.bloodType)}
                    </p>
                  </div>
                )}
                {member.city && (
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">İkamet Ettiği Şehir</label>
                    <p className="text-base text-gray-900 font-medium flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                      {member.city}
                    </p>
                  </div>
                )}
              </div>
            </CollapsibleSectionMember>

            {/* İletişim Bilgileri */}
            <CollapsibleSectionMember title="İletişim Bilgileri" icon={Mail} defaultOpen={true}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">E-posta</label>
                  <p className="text-base text-gray-900 font-medium flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-blue-500" />
                    {member.email || "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Telefon Numarası</label>
                  <p className="text-base text-gray-900 font-medium flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-green-500" />
                    {member.phone || "-"}
                  </p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Adres</label>
                  <p className="text-base text-gray-900 font-medium">{member.currentAddress || "-"}</p>
                </div>
              </div>
            </CollapsibleSectionMember>

            {/* Üyelik Bilgileri */}
            <CollapsibleSectionMember title="Üyelik Bilgileri" icon={Calendar} defaultOpen={true}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Üye Türü</label>
                  <Badge variant={member.membershipKind === "VOLUNTEER" ? "default" : "success"} className="text-sm">
                    {getMembershipKindLabel(member.membershipKind)}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Durum</label>
                  {member.status === 'active' ? (
                    <Badge variant="success">Aktif</Badge>
                  ) : (
                    <Badge variant="secondary">Pasif</Badge>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Üyelik Tarihi</label>
                  <p className="text-base text-gray-900 font-medium flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                    {member.membershipDate && member.membershipDate !== "" ? formatDateOnly(member.membershipDate) : "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Kayıt Tarihi</label>
                  <p className="text-base text-gray-900 font-medium">
                    {member.createdAt && member.createdAt !== "" ? formatDateOnly(member.createdAt) : "-"}
                  </p>
                </div>
                {member.lastValidDate && (
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Son Geçerlilik Tarihi</label>
                    <p className="text-base text-gray-900 font-medium">
                      {formatDateOnly(member.lastValidDate)}
                    </p>
                  </div>
                )}
                {member.tags && member.tags.length > 0 && (
                  <div className="space-y-1 md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Etiketler</label>
                    <div className="flex flex-wrap gap-2">
                      {member.tags.map((tag, index) => (
                        <Badge key={index} variant="default" className="text-sm font-semibold bg-purple-100 text-purple-800">
                          {getTagLabel(tag)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="space-y-1 md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ünvanlar</label>
                  <div className="flex flex-wrap gap-2">
                    {!boardRoleLabel && memberTitles.length === 0 ? (
                      <span className="text-sm text-gray-400">Ünvan yok</span>
                    ) : (
                      <>
                        {boardRoleLabel && (
                          <Badge variant="default" className="text-sm font-semibold bg-indigo-100 text-indigo-800">
                            {boardRoleLabel}
                          </Badge>
                        )}
                        {memberTitles.map((title, index) => (
                          <Badge key={index} variant="default" className="text-sm font-semibold">
                            {title}
                          </Badge>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CollapsibleSectionMember>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MemberManagementTab() {
  const { members, membersLoading, membersError, addMember, updateMember, deleteMember, boardMembers } = useMembers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  // Sprint 5: Eski titleFilter yerine membershipKind ve tag filtreleri
  const [membershipKindFilter, setMembershipKindFilter] = useState<'all' | 'MEMBER' | 'VOLUNTEER'>('all');
  const [tagFilter, setTagFilter] = useState<MemberTag | 'all'>('all');
  // Sprint 14.5: useTransition ile smooth filtre güncellemeleri
  const [, startTransition] = useTransition();
  // Sprint 14.7: Scroll pozisyonunu korumak için ref
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  // Sprint 5: MembershipKind filter options
  const membershipKindFilterOptions = [
    { value: "all", label: "Tümü" },
    { value: "MEMBER", label: "Üye" },
    { value: "VOLUNTEER", label: "Gönüllü" },
  ];

  // Sprint 5: Tag filter options
  const tagFilterOptions: { value: MemberTag | 'all'; label: string }[] = [
    { value: "all", label: "Tümü" },
    { value: "HONORARY_PRESIDENT", label: "Onursal Başkan" },
    { value: "FOUNDING_PRESIDENT", label: "Kurucu Başkan" },
    { value: "FOUNDING_MEMBER", label: "Kurucu Üye" },
    { value: "PAST_PRESIDENT", label: "Önceki Başkan" },
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
      logClientError("[MemberManagementTab][SAVE_MEMBER]", error);
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
        logClientError("[MemberManagementTab][DELETE_MEMBER]", error);
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
      logClientError("[MemberManagementTab][UPDATE_STATUS]", error);
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


  // Sprint 6: BoardRole'ü Türkçe'ye çevir - helper fonksiyon kullan
  // getBoardRoleLabel helper fonksiyonu import edildi, doğrudan kullanılabilir

  // Sprint 5: Ünvanları göster - BoardMember rolü + member.titles
  const getMemberTitlesBadges = (member: Member) => {
    // Önce BoardMember rolünü kontrol et
    const boardMember = boardMembers.find(bm => bm.memberId === member.id);
    const boardRoleLabel = boardMember ? getBoardRoleLabel(boardMember.role) : null;
    
    // Member'ın titles alanı
    const memberTitles = member.titles || [];
    
    // Eğer ne BoardMember rolü ne de titles varsa
    if (!boardRoleLabel && (!memberTitles || memberTitles.length === 0)) {
      return <Badge variant="secondary">Ünvan Yok</Badge>;
    }
    
    return (
      <div className="flex flex-wrap gap-1">
        {/* Sprint 5: BoardMember rolü öncelikli göster (varsa) */}
        {boardRoleLabel && (
          <Badge key="board-role" variant="default" className="text-xs font-semibold bg-indigo-100 text-indigo-800">
            {boardRoleLabel}
          </Badge>
        )}
        {/* Member'ın diğer ünvanları */}
        {memberTitles.map((title, index) => (
          <Badge key={index} variant="default" className="text-xs font-semibold">
            {title}
          </Badge>
        ))}
      </div>
    );
  };

  // Sprint 5: Get tags badges
  const getTagsBadges = (tags: MemberTag[] | undefined) => {
    if (!tags || tags.length === 0) {
      return null;
    }
    
    return (
      <div className="flex flex-wrap gap-1">
        {tags.map((tag, index) => (
          <Badge key={index} variant="default" className="text-xs font-semibold bg-purple-100 text-purple-800">
            {getTagLabel(tag)}
          </Badge>
        ))}
      </div>
    );
  };

  // Sprint 14.7: useMemo ile filtreleme optimizasyonu - flash effect'i önlemek için
  const filteredMembers = React.useMemo(() => {
    return members.filter(member => {
      const matchesSearch =
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.phone && member.phone.includes(searchTerm));

      const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
      
      // Sprint 5: membershipKind filtreleme
      const matchesMembershipKind = membershipKindFilter === 'all' || member.membershipKind === membershipKindFilter;
      
      // Sprint 5: tag filtreleme
      const matchesTag = tagFilter === 'all' || (member.tags && member.tags.includes(tagFilter));

      return matchesSearch && matchesStatus && matchesMembershipKind && matchesTag;
    });
  }, [members, searchTerm, statusFilter, membershipKindFilter, tagFilter]);

  if (membersLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {membersError && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" role="alert">
          Hata: {membersError}
        </div>
      )}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Search */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Arama</label>
              <div className="relative">
                <Search className="absolute left-3 top-[30%] -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none z-10" />
                <Input
                  placeholder="Ad, email, telefon, memleket..."
                  value={searchTerm}
                  onChange={(e) => {
                    // Sprint 14.5: useTransition ile smooth update
                    startTransition(() => {
                      setSearchTerm(e.target.value);
                    });
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="space-y-2">
              <Select
                label="Durum"
                value={statusFilter}
                onChange={(e) => {
                  // Sprint 14.5: useTransition ile smooth update
                  startTransition(() => {
                    setStatusFilter(e.target.value as "active" | "inactive" | "all");
                  });
                }}
                options={[
                  { value: "all", label: "Tümü" },
                  { value: "active", label: "Aktif" },
                  { value: "inactive", label: "Pasif" },
                ]}
              />
            </div>
            
            {/* Sprint 5: MembershipKind Filter */}
            <div className="space-y-2">
              <Select
                label="Üye Türü"
                value={membershipKindFilter}
                onChange={(e) => {
                  // Sprint 14.5: useTransition ile smooth update
                  startTransition(() => {
                    setMembershipKindFilter(e.target.value as 'all' | 'MEMBER' | 'VOLUNTEER');
                  });
                }}
                options={membershipKindFilterOptions}
              />
            </div>
            
            {/* Sprint 5: Tag Filter */}
            <div className="space-y-2">
              <Select
                label="Etiket"
                value={tagFilter}
                onChange={(e) => {
                  // Sprint 14.5: useTransition ile smooth update
                  startTransition(() => {
                    setTagFilter(e.target.value as MemberTag | 'all');
                  });
                }}
                options={tagFilterOptions}
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" ref={tableContainerRef}>
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-2">Ad Soyad</div>
              <div className="col-span-2">İletişim</div>
              <div className="col-span-1">Tür</div>
              <div className="col-span-3">Etiketler</div>
              <div className="col-span-2">Ünvanlar</div>
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
                  <div className="col-span-2">
                    <div className="font-medium text-gray-900">
                      {member.firstName} {member.lastName}
                    </div>
                  </div>
                  
                  {/* İletişim */}
                  <div className="col-span-2">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-3 h-3 mr-2 text-blue-500" />
                        <span className="truncate">{member.email || "-"}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-3 h-3 mr-2 text-green-500" />
                        {member.phone || "-"}
                      </div>
                    </div>
                  </div>
                  
                  {/* Sprint 5: Üye Türü */}
                  <div className="col-span-1">
                    <Badge variant={member.membershipKind === "VOLUNTEER" ? "default" : "success"} className="text-xs">
                      {getMembershipKindLabel(member.membershipKind)}
                    </Badge>
                  </div>
                  
                  {/* Sprint 5: Etiketler */}
                  <div className="col-span-3">
                    {getTagsBadges(member.tags) || <span className="text-xs text-gray-400">Etiket yok</span>}
                  </div>
                  
                  {/* Sprint 5: Ünvanlar - BoardMember rolü + member.titles */}
                  <div className="col-span-2">
                    {getMemberTitlesBadges(member)}
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
