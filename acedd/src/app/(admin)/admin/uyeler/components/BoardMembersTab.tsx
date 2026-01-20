"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Select } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Plus, Edit, Trash2, Shield, Search, CheckCircle } from "lucide-react";
import { useMembers } from "@/contexts/MembersContext";
import { BoardMember, CreateBoardMemberData, BoardRole } from "@/lib/types/member";
import { sortBoardMembersByRole, getBoardRoleLabel, getBoardMemberFullName } from "@/lib/utils/memberHelpers";
import { logClientError } from "@/lib/utils/clientLogging";

interface BoardMemberModalProps {
  boardMember: BoardMember | null;
  onClose: () => void;
  onSave: (data: CreateBoardMemberData) => void;
  isEditing: boolean;
}

function BoardMemberModal({ boardMember, onClose, onSave, isEditing }: BoardMemberModalProps) {
  const { members } = useMembers();
  const [memberSearchTerm, setMemberSearchTerm] = useState("");
  
  // Sprint 5: Yeni form yapısı - memberId ve role (order ve isActive kaldırıldı)
  const [formData, setFormData] = useState<CreateBoardMemberData>({
    memberId: boardMember?.memberId || "",
    role: boardMember?.role || "BOARD_MEMBER",
    termStart: boardMember?.termStart || undefined,
    termEnd: boardMember?.termEnd || undefined,
  });

  // Sprint 5: BoardRole options
  const boardRoleOptions = [
    { value: "PRESIDENT", label: "Başkan" },
    { value: "VICE_PRESIDENT", label: "Başkan Yardımcısı" },
    { value: "SECRETARY_GENERAL", label: "Genel Sekreter" },
    { value: "TREASURER", label: "Sayman" },
    { value: "BOARD_MEMBER", label: "Yönetim Kurulu Üyesi" },
  ];

  // Sprint 5: Filter members for selection (active members only)
  const filteredMembers = members
    .filter(m => m.status === 'active')
    .filter(m => {
      const searchLower = memberSearchTerm.toLowerCase();
      const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();
      return fullName.includes(searchLower) || 
             m.email.toLowerCase().includes(searchLower);
    })
    .slice(0, 50); // Limit to 50 for performance

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.memberId) {
      alert("Lütfen bir üye seçin");
      return;
    }
    
    if (!formData.role) {
      alert("Lütfen bir rol seçin");
      return;
    }
    
    onSave(formData);
  };

  // Sprint 5: Get selected member info
  const selectedMember = members.find(m => m.id === formData.memberId);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? "Yönetim Kurulu Üyesi Düzenle" : "Yeni Yönetim Kurulu Üyesi"}
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
            {/* Sprint 5: Member Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Üye Seç * {selectedMember && `(${selectedMember.firstName} ${selectedMember.lastName})`}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Üye ara (ad, soyad, email)..."
                  value={memberSearchTerm}
                  onChange={(e) => setMemberSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {memberSearchTerm && (
                <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-lg">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, memberId: member.id }));
                          setMemberSearchTerm("");
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors ${
                          formData.memberId === member.id ? 'bg-blue-100' : ''
                        }`}
                      >
                        <div className="font-medium text-gray-900">
                          {member.firstName} {member.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{member.email || "-"}</div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">Üye bulunamadı</div>
                  )}
                </div>
              )}
              {formData.memberId && selectedMember && (
                <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                  <div className="text-sm font-medium text-gray-900">
                    Seçili: {selectedMember.firstName} {selectedMember.lastName}
                  </div>
                  <div className="text-xs text-gray-600">{selectedMember.email}</div>
                </div>
              )}
            </div>

            {/* Sprint 5: BoardRole Selection */}
            <Select
              label="Rol *"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as BoardRole }))}
              options={boardRoleOptions}
              required
            />

            {/* Sprint 5: Term Dates (Optional) */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Dönem Başlangıç (İsteğe bağlı)"
                type="date"
                value={formData.termStart ? formData.termStart.split('T')[0] : ""}
                onChange={(e) => setFormData(prev => ({ ...prev, termStart: e.target.value ? new Date(e.target.value).toISOString() : undefined }))}
              />
              <Input
                label="Dönem Bitiş (İsteğe bağlı)"
                type="date"
                value={formData.termEnd ? formData.termEnd.split('T')[0] : ""}
                onChange={(e) => setFormData(prev => ({ ...prev, termEnd: e.target.value ? new Date(e.target.value).toISOString() : undefined }))}
              />
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
                <CheckCircle className="w-4 h-4" />
                <span>{isEditing ? "Güncelle" : "Kaydet"}</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Sprint 6: Get role label in Turkish - helper fonksiyon kullan
const getRoleLabel = getBoardRoleLabel;

export default function BoardMembersTab() {
  const { boardMembers, boardMembersLoading, boardMembersError, addBoardMember, updateBoardMember, deleteBoardMember } = useMembers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<BoardMember | null>(null);

  const handleSave = async (data: CreateBoardMemberData) => {
    try {
      if (editingMember) {
        await updateBoardMember(editingMember.id, data);
      } else {
        await addBoardMember(data);
      }
      setIsModalOpen(false);
      setEditingMember(null);
    } catch (error) {
      logClientError("[BoardMembersTab][SAVE]", error);
    }
  };

  const handleEdit = (member: BoardMember) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu yönetim kurulu üyesini silmek istediğinizden emin misiniz?')) {
      try {
        await deleteBoardMember(id);
      } catch (error) {
        logClientError("[BoardMembersTab][DELETE]", error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  if (boardMembersLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (boardMembersError) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Hata: {boardMembersError}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Yönetim Kurulu</h2>
          <p className="text-gray-600">Toplam {boardMembers.length} üye</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Üye Ekle</span>
        </Button>
      </div>

      {/* Sprint 5: Tablo formatında listeleme */}
      {boardMembers.length === 0 ? (
        <div className="text-center py-12">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz yönetim kurulu üyesi yok</h3>
          <p className="text-gray-600">İlk üyeyi eklemek için yukarıdaki butona tıklayın.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-5">Ad Soyad</div>
              <div className="col-span-5">Rol</div>
              <div className="col-span-2">İşlemler</div>
            </div>
          </div>
          
          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {sortBoardMembersByRole(boardMembers).map((boardMember) => {
                const fullName = getBoardMemberFullName(boardMember);
                const roleLabel = getRoleLabel(boardMember.role);
                const member = boardMember.member;
                
                return (
                  <div key={boardMember.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Ad Soyad */}
                      <div className="col-span-5">
                        <div className="font-medium text-gray-900">{fullName}</div>
                        <div className="text-sm text-gray-500">{member.email || "-"}</div>
                      </div>
                      
                      {/* Rol */}
                      <div className="col-span-5">
                        <Badge variant="default" className="text-sm">
                          {roleLabel}
                        </Badge>
                      </div>
                      
                      {/* İşlemler */}
                      <div className="col-span-2">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(boardMember)}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(boardMember.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {isModalOpen && (
        <BoardMemberModal
          boardMember={editingMember}
          onClose={handleCloseModal}
          onSave={handleSave}
          isEditing={!!editingMember}
        />
      )}
    </div>
  );
}
