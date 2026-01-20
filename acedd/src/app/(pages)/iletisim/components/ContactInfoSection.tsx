"use client";

import React from "react";
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

/** E-posta adresindeki @ işaretini [@] ile değiştirir (bot toplama azaltma) */
function obfuscateEmail(email: string): string {
  return email.replace(/@/g, "[@]");
}

export function ContactInfoSection({ contactInfo, content }: ContactInfoSectionProps) {
  const displayAddress = contactInfo?.address || "";
  const displayPhone = contactInfo?.phone || "";
  const displayEmail = contactInfo?.email || "";

  const sectionTitle = content?.infoSectionTitle;
  const sectionDescription = content?.infoSectionDescription;
  const contactInfoItems = content?.contactInfoItems || [];

  const contactInfoArray = contactInfoItems.map((item) => {
    let value = "";
    if (item.title.toLowerCase().includes("adres")) value = displayAddress;
    else if (item.title.toLowerCase().includes("telefon")) value = displayPhone;
    else if (item.title.toLowerCase().includes("posta") || item.title.toLowerCase().includes("mail")) value = displayEmail;

    return { ...item, value };
  });

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
          {contactInfoArray.map((info) => {
            const colorClass = COLOR_MAP[info.color] || COLOR_MAP.blue;
            const isEmail = info.title.toLowerCase().includes("posta") || info.title.toLowerCase().includes("mail");
            const displayValue = isEmail && info.value ? obfuscateEmail(info.value) : info.value;

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
                    {displayValue}
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
