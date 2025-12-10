"use client";

import React, { useState, useTransition } from "react";
import { Globe, Mail, Share2, FileText, Search } from "lucide-react";
// Sprint 14.6: Direct imports - all tabs mount immediately for instant switching
import SiteInfoTab from "./components/SiteInfoTab";
import ContactInfoTab from "./components/ContactInfoTab";
import SocialMediaTab from "./components/SocialMediaTab";
import ContentTab from "./components/ContentTab";
import SEOTab from "./components/SEOTab";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'site' | 'contact' | 'social' | 'content' | 'seo'>('site');
  // Sprint 14.6: useTransition ile smooth tab geçişleri
  const [, startTransition] = useTransition();

  const tabs = [
    {
      id: 'site' as const,
      label: 'Genel Site Bilgileri',
      icon: Globe,
      description: 'Site adı, açıklama, logo ve footer ayarları'
    },
    {
      id: 'contact' as const,
      label: 'İletişim Bilgileri',
      icon: Mail,
      description: 'E-posta, telefon, adres ve harita bilgileri'
    },
    {
      id: 'social' as const,
      label: 'Sosyal Medya',
      icon: Share2,
      description: 'Sosyal medya platform linkleri'
    },
    {
      id: 'content' as const,
      label: 'İçerik',
      icon: FileText,
      description: 'Sayfa içerikleri (hero başlık, alt başlık, açıklama)'
    },
    {
      id: 'seo' as const,
      label: 'SEO',
      icon: Search,
      description: 'SEO ayarları (başlık ve açıklama)'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Ayarlar</h1>
        <p className="text-gray-600">
          Sistem ayarlarını görüntüleyin ve yönetin.
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
                onClick={() => {
                  // Sprint 14.6: Tab değişikliği useTransition ile smooth
                  startTransition(() => {
                    setActiveTab(tab.id);
                  });
                }}
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

      {/* Tab Content - Sprint 14.6: All tabs mounted, only visibility changes for instant switching */}
      <div className="bg-white rounded-lg shadow">
        <div className={activeTab !== 'site' ? 'hidden' : ''}>
          <SiteInfoTab />
        </div>
        <div className={activeTab !== 'contact' ? 'hidden' : ''}>
          <ContactInfoTab />
        </div>
        <div className={activeTab !== 'social' ? 'hidden' : ''}>
          <SocialMediaTab />
        </div>
        <div className={activeTab !== 'content' ? 'hidden' : ''}>
          <ContentTab />
        </div>
        <div className={activeTab !== 'seo' ? 'hidden' : ''}>
          <SEOTab />
        </div>
      </div>
    </div>
  );
}
