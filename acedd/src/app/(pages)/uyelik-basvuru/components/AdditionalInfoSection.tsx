import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { getPageContent, getContactInfo } from "@/lib/settings/convenience";

export async function AdditionalInfoSection() {
  const content = await getPageContent("membership");
  const contactInfo = await getContactInfo();
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {content.additionalInfoTitle || "Başvuru Hakkında"}
                </h3>
                <p className="text-gray-600">
                  {content.additionalInfoDescription || "Üyelik başvurunuz değerlendirildikten sonra size e-posta veya telefon ile geri dönüş yapılacaktır. Sorularınız için bizimle iletişime geçebilirsiniz."}{" "}
                  {contactInfo.email && (
                    <a 
                      href={`mailto:${contactInfo.email}`} 
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {contactInfo.email}
                    </a>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

