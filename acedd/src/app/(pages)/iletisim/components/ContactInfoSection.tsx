"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { CONTACT_INFO as FALLBACK_CONTACT_INFO } from "@/lib/constants";
import { Phone, Mail, MapPin } from "lucide-react";

interface ContactInfoSectionProps {
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

export function ContactInfoSection({ contactInfo }: ContactInfoSectionProps) {
  const handleContactClick = (type: string, value: string) => {
    if (type === "Telefon") {
      window.open(`tel:${value}`, '_self');
    } else if (type === "E-posta") {
      window.open(`mailto:${value}`, '_self');
    }
  };

  // Use settings if available, otherwise fallback to constants
  const displayAddress = contactInfo?.address || FALLBACK_CONTACT_INFO.address;
  const displayPhone = contactInfo?.phone || FALLBACK_CONTACT_INFO.phone;
  const displayEmail = contactInfo?.email || FALLBACK_CONTACT_INFO.email;

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
            İletişim Bilgileri
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Size en uygun yöntemle bizimle iletişime geçebilirsiniz
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contactInfoArray.map((info, index) => (
            <Card 
              key={index} 
              className={`text-center hover:shadow-lg transition-all duration-300 ${
                info.title === "Telefon" || info.title === "E-posta"
                  ? "cursor-pointer hover:scale-105 hover:shadow-xl" 
                  : ""
              }`}
              onClick={() => handleContactClick(info.title, info.value)}
            >
              <CardHeader>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 mx-auto ${
                  info.title === "Telefon" 
                    ? "bg-green-100 group-hover:bg-green-200" 
                    : info.title === "E-posta"
                    ? "bg-blue-100 group-hover:bg-blue-200"
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
                <p className={`font-medium mb-2 ${
                  info.title === "Telefon" || info.title === "E-posta"
                    ? "text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    : "text-gray-900"
                }`}>
                  {info.value}
                </p>
                <CardDescription className="text-sm">
                  {info.description}
                </CardDescription>
                {(info.title === "Telefon" || info.title === "E-posta") && (
                  <p className="text-xs text-gray-500 mt-2">
                    {info.title === "Telefon" 
                      ? "Tıklayarak ara" 
                      : "Tıklayarak mail at"
                    }
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
