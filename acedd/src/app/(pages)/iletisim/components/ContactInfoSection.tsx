"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

interface ContactInfoSectionProps {
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  content?: {
    infoSectionTitle?: string;
    infoSectionDescription?: string;
    contactInfoItems?: Array<{
      id: string;
      icon: string;
      color: string;
      title: string;
      description: string;
    }>;
  };
}

// Color mapping for icons
const COLOR_MAP: Record<string, string> = {
  blue: "text-blue-600 bg-blue-50",
  green: "text-green-600 bg-green-50",
  purple: "text-purple-600 bg-purple-50",
  indigo: "text-indigo-600 bg-indigo-50",
};

export function ContactInfoSection({ contactInfo, content }: ContactInfoSectionProps) {
  const [showEmailConfirm, setShowEmailConfirm] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  
  // Sprint 14.3: Clickable linkler kaldırıldı - sadece text gösteriliyor
  const displayAddress = contactInfo?.address || "";
  const displayPhone = contactInfo?.phone || "";
  const displayEmail = contactInfo?.email || "";
  
  // All content comes from settings with defaults from defaultContent.ts
  const sectionTitle = content?.infoSectionTitle;
  const sectionDescription = content?.infoSectionDescription;
  
  // Get contact info items from settings (includes icon, color, description)
  const contactInfoItems = content?.contactInfoItems || [];
  
  // Map items with actual contact values
  const contactInfoArray = contactInfoItems.map((item) => {
    let value = "";
    if (item.title.toLowerCase().includes("adres")) value = displayAddress;
    else if (item.title.toLowerCase().includes("telefon")) value = displayPhone;
    else if (item.title.toLowerCase().includes("posta") || item.title.toLowerCase().includes("mail")) value = displayEmail;
    
    return {
      ...item,
      value,
    };
  });

  // Rate limiting için localStorage kullan (client-side)
  const checkEmailRateLimit = (): boolean => {
    if (typeof window === "undefined") return true;
    
    const RATE_LIMIT_KEY = "email_click_rate_limit";
    const RATE_LIMIT_WINDOW = 60 * 1000; // 1 dakika
    const MAX_CLICKS = 3; // 1 dakikada maksimum 3 tıklama
    
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    const now = Date.now();
    
    if (!stored) {
      // İlk tıklama
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({
        count: 1,
        resetAt: now + RATE_LIMIT_WINDOW,
      }));
      return true;
    }
    
    try {
      const data = JSON.parse(stored);
      
      // Süre dolmuşsa sıfırla
      if (data.resetAt < now) {
        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({
          count: 1,
          resetAt: now + RATE_LIMIT_WINDOW,
        }));
        return true;
      }
      
      // Limit aşıldı mı?
      if (data.count >= MAX_CLICKS) {
        const remainingTime = Math.ceil((data.resetAt - now) / 1000);
        alert(`Çok fazla istek gönderdiniz. Lütfen ${remainingTime} saniye sonra tekrar deneyin.`);
        return false;
      }
      
      // Sayacı artır
      data.count++;
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
      return true;
    } catch {
      // Parse hatası, izin ver
      return true;
    }
  };

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>, email: string) => {
    e.preventDefault();
    
    // Rate limit kontrolü
    if (!checkEmailRateLimit()) {
      return;
    }
    
    // Onay mesajı göster
    setPendingEmail(email);
    setShowEmailConfirm(true);
  };

  const handleEmailConfirm = () => {
    if (pendingEmail) {
      window.location.href = `mailto:${pendingEmail}`;
    }
    setShowEmailConfirm(false);
    setPendingEmail(null);
  };

  const handleEmailCancel = () => {
    setShowEmailConfirm(false);
    setPendingEmail(null);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {sectionTitle}
          </h2>
          {sectionDescription && (
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {sectionDescription}
            </p>
          )}
        </div>
        
        {/* Onay Modal */}
        {showEmailConfirm && pendingEmail && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  E-posta Göndermek İstiyor musunuz?
                </h3>
              </div>
              <p className="text-gray-600 mb-2">
                E-posta istemciniz açılacak ve <strong className="text-gray-900">{pendingEmail}</strong> adresine mesaj gönderebileceksiniz.
              </p>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleEmailCancel}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  İptal
                </button>
                <button
                  onClick={handleEmailConfirm}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  E-posta Gönder
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contactInfoArray.map((info) => {
            const colorClass = COLOR_MAP[info.color] || COLOR_MAP.blue;
            const isEmail = info.title.toLowerCase().includes("posta") || info.title.toLowerCase().includes("mail");
            
            if (isEmail && info.value) {
              return (
                <a
                  key={info.id}
                  href={`mailto:${info.value}`}
                  onClick={(e) => handleEmailClick(e, info.value)}
                  className="block"
                  aria-label={`E-posta gönder: ${info.value}`}
                >
                  <Card className="text-center hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                    <CardHeader>
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 mx-auto ${colorClass} hover:scale-110 transition-transform duration-300`}>
                        {info.icon && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d={info.icon}
                            />
                          </svg>
                        )}
                      </div>
                      <CardTitle className="text-lg">{info.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">
                        {info.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </a>
              );
            }
            
            return (
              <Card 
                key={info.id} 
                className="text-center hover:shadow-lg transition-all duration-300"
              >
                <CardHeader>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 mx-auto ${colorClass}`}>
                    {info.icon && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d={info.icon}
                        />
                      </svg>
                    )}
                  </div>
                  <CardTitle className="text-lg">{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium mb-2 text-gray-900">
                    {info.value}
                  </p>
                  <CardDescription className="text-sm">
                    {info.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
