"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Textarea } from "@/components/ui";
import { Select } from "@/components/ui";
import { Plus, Edit, Trash2, Shield, User, Crown, Award, Users, CheckCircle } from "lucide-react";
import { useMembers } from "@/contexts/MembersContext";
import { BoardMember, CreateBoardMemberData } from "@/lib/types/member";

interface BoardMemberModalProps {
  boardMember: BoardMember | null;
  onClose: () => void;
  onSave: (data: CreateBoardMemberData) => void;
  isEditing: boolean;
}

function BoardMemberModal({ boardMember, onClose, onSave, isEditing }: BoardMemberModalProps) {
  const [formData, setFormData] = useState<CreateBoardMemberData>({
    name: boardMember?.name || "",
    memberType: boardMember?.memberType || "boardMember",
    bio: boardMember?.bio || "",
    imageUrl: boardMember?.imageUrl || "",
    order: boardMember?.order || 0,
    isActive: boardMember?.isActive ?? true,
  });

  const memberTypes = [
    { value: "honoraryPresident", label: "Onursal Başkan" },
    { value: "foundingPresident", label: "Kurucu Başkan" },
    { value: "foundingMember", label: "Kurucu Üye" },
    { value: "formerPresident", label: "Önceki Başkan" },
    { value: "boardMember", label: "Yönetim Kurulu Üyesi" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const getMemberTypeIcon = (type: string) => {
    switch (type) {
      case "honoraryPresident":
        return <Crown className="w-5 h-5 text-yellow-600" />;
      case "foundingPresident":
        return <Award className="w-5 h-5 text-blue-600" />;
      case "foundingMember":
        return <Users className="w-5 h-5 text-green-600" />;
      case "formerPresident":
        return <Shield className="w-5 h-5 text-purple-600" />;
      default:
        return <User className="w-5 h-5 text-gray-600" />;
    }
  };

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Ad Soyad"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <Select
              label="Üye Türü"
              value={formData.memberType}
              onChange={(value) => setFormData(prev => ({ ...prev, memberType: value as any }))}
              options={memberTypes}
              required
            />

            <Input
              label="Sıralama (Düşük sayı önce görünür)"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
            />

            <Input
              label="Fotoğraf URL'si (İsteğe bağlı)"
              value={formData.imageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
            />

            <Textarea
              label="Biyografi (İsteğe bağlı)"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={3}
            />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Aktif
              </label>
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
      console.error('Error saving board member:', error);
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
        console.error('Error deleting board member:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const getMemberTypeIcon = (type: string) => {
    switch (type) {
      case "honoraryPresident":
        return <Crown className="w-5 h-5 text-yellow-600" />;
      case "foundingPresident":
        return <Award className="w-5 h-5 text-blue-600" />;
      case "foundingMember":
        return <Users className="w-5 h-5 text-green-600" />;
      case "formerPresident":
        return <Shield className="w-5 h-5 text-purple-600" />;
      default:
        return <User className="w-5 h-5 text-gray-600" />;
    }
  };

  const getMemberTypeLabel = (type: string) => {
    switch (type) {
      case "honoraryPresident":
        return "Onursal Başkan";
      case "foundingPresident":
        return "Kurucu Başkan";
      case "foundingMember":
        return "Kurucu Üye";
      case "formerPresident":
        return "Önceki Başkan";
      default:
        return "Yönetim Kurulu Üyesi";
    }
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

      {boardMembers.length === 0 ? (
        <div className="text-center py-12">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz yönetim kurulu üyesi yok</h3>
          <p className="text-gray-600">İlk üyeyi eklemek için yukarıdaki butona tıklayın.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boardMembers
            .filter(member => member.isActive)
            .sort((a, b) => a.order - b.order)
            .map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center">
                      {getMemberTypeIcon(member.memberType)}
                      <span className="ml-2">{member.name}</span>
                    </CardTitle>
                    <div className="mt-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {getMemberTypeLabel(member.memberType)}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(member)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(member.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {member.bio && (
                  <p className="text-sm text-gray-600 line-clamp-3">{member.bio}</p>
                )}
                {member.imageUrl && (
                  <div className="mt-4">
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
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
