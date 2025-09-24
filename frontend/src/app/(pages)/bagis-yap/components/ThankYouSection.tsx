import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { CheckCircle } from "lucide-react";
import { DONATION_CONTENT } from "../constants";

export function ThankYouSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-8">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {DONATION_CONTENT.thankYou.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {DONATION_CONTENT.thankYou.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {DONATION_CONTENT.contact.message}{" "}
              <a 
                href={`mailto:${DONATION_CONTENT.contact.email}`} 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {DONATION_CONTENT.contact.email}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

