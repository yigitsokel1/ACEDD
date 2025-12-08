import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { CheckCircle } from "lucide-react";
import { getPageContent, getContactInfo } from "@/lib/settings/convenience";

export async function ThankYouSection() {
  const content = await getPageContent("donation");
  const contactInfo = await getContactInfo();
  
  // Get content from settings with minimal fallbacks
  const thankYouTitle = content.thankYouTitle || "Bağışınız İçin Teşekkürler";
  const thankYouDescription = content.thankYouDescription || "Bağışınız öğrencilerin eğitim hayatına katkı sağlayacaktır.";
  const contactMessage = content.contactMessage || "Sorularınız için bizimle iletişime geçebilirsiniz:";
  const contactEmail = contactInfo.email || "";

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-8">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
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
                {contactEmail && (
                  <a 
                    href={`mailto:${contactEmail}`} 
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {contactEmail}
                  </a>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

