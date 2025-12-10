"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Phone, Mail, MapPin } from "lucide-react";

interface ContactInfoSectionProps {
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  content?: {
    infoSectionTitle?: string;
    infoSectionDescription?: string;
  };
}

export function ContactInfoSection({ contactInfo, content }: ContactInfoSectionProps) {
  // Sprint 14.3: Clickable linkler kaldırıldı - sadece text gösteriliyor
  // Use settings only (no constants fallback - getContactInfo() already has fallback)
  const displayAddress = contactInfo?.address || "";
  const displayPhone = contactInfo?.phone || "";
  const displayEmail = contactInfo?.email || "";
  
  // Get section title and description from settings
  const sectionTitle = content?.infoSectionTitle || "İletişim Bilgileri";
  const sectionDescription = content?.infoSectionDescription || "Size en uygun yöntemle bizimle iletişime geçebilirsiniz";

  const contactInfoArray = [
    {
      title: "Adres",
      value: displayAddress,
      icon: MapPin,
      description: "Dernek merkezimiz Acıpayam'da bulunmaktadır",
    },
    {
      title: "Telefon",
      value: displayPhone,
      icon: Phone,
      description: "Bizimle iletişime geçin",
    },
    {
      title: "E-posta",
      value: displayEmail,
      icon: Mail,
      description: "E-posta ile iletişime geçin",
    },
  ];

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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contactInfoArray.map((info, index) => (
            <Card 
              key={index} 
              className="text-center hover:shadow-lg transition-all duration-300"
            >
              <CardHeader>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 mx-auto ${
                  info.title === "Telefon" 
                    ? "bg-green-100" 
                    : info.title === "E-posta"
                    ? "bg-blue-100"
                    : "bg-gray-100"
                }`}>
                  <info.icon className={`h-8 w-8 ${
                    info.title === "Telefon" 
                      ? "text-green-600" 
                      : info.title === "E-posta"
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`} />
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
          ))}
        </div>
      </div>
    </section>
  );
}
