import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { getPageContent, getContactInfo } from "@/lib/settings/convenience";

export async function ThankYouSection() {
  const content = await getPageContent("donation");
  const contactInfo = await getContactInfo();
  
  // All content comes from settings with defaults from defaultContent.ts
  const thankYouTitle = content.thankYouTitle;
  const thankYouDescription = content.thankYouDescription;
  const contactMessage = content.contactMessage;
  const contactEmail = contactInfo.email || "";

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-8">
              <div className="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16 text-green-600 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3"
                  />
                </svg>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {thankYouTitle}
                </h3>
                {thankYouDescription && (
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {thankYouDescription}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          {contactMessage && (
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                {contactMessage}{" "}
                {/* Sprint 14.3: Clickable link kaldırıldı - sadece text gösteriliyor */}
                {contactEmail && (
                  <span className="text-blue-600 font-medium">
                    {contactEmail}
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

