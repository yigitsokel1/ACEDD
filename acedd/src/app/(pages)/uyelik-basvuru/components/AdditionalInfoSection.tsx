import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { MEMBERSHIP_CONTENT } from "../constants";

export function AdditionalInfoSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {MEMBERSHIP_CONTENT.additionalInfo.title}
                </h3>
                <p className="text-gray-600">
                  {MEMBERSHIP_CONTENT.additionalInfo.description}{" "}
                  <a 
                    href={`mailto:${MEMBERSHIP_CONTENT.additionalInfo.email}`} 
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {MEMBERSHIP_CONTENT.additionalInfo.email}
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

