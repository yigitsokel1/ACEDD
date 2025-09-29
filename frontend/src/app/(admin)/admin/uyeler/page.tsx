"use client";

import React, { useState } from "react";
import { Metadata } from "next";
import { Users, FileText, Shield, UserPlus } from "lucide-react";
import { Button } from "@/components/ui";
import { useMembers } from "@/contexts/MembersContext";

// Components
import MemberManagementTab from "./components/MemberManagementTab";
import MembershipApplicationsTab from "./components/MembershipApplicationsTab";
import BoardMembersTab from "./components/BoardMembersTab";

export default function MembersPage() {
  const [activeTab, setActiveTab] = useState<'members' | 'applications' | 'board'>('members');

  const tabs = [
    {
      id: 'members' as const,
      label: 'Üye Yönetimi',
      icon: Users,
      description: 'Üyeleri görüntüle, ekle, düzenle ve sil'
    },
    {
      id: 'applications' as const,
      label: 'Başvurular',
      icon: FileText,
      description: 'Üyelik başvurularını incele ve onayla'
    },
    {
      id: 'board' as const,
      label: 'Yönetim Kurulu',
      icon: Shield,
      description: 'Yönetim kurulu üyelerini yönet'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Üye Yönetimi</h1>
        <p className="text-gray-600">
          Dernek üyelerini, başvuruları ve yönetim kurulunu yönetin.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className={`mr-2 h-5 w-5 ${
                  activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                }`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow">
        {activeTab === 'members' && <MemberManagementTab />}
        {activeTab === 'applications' && <MembershipApplicationsTab />}
        {activeTab === 'board' && <BoardMembersTab />}
      </div>
    </div>
  );
}
