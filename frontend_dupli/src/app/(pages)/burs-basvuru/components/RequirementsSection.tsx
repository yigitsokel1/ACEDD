import React from "react";
import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { SCHOLARSHIP_REQUIREMENTS, APPLICATION_STEPS } from "../constants";

export function RequirementsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Başvuru Şartları</CardTitle>
              <CardDescription>
                Burs başvurusu yapabilmek için aşağıdaki şartları sağlamanız gerekmektedir.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {SCHOLARSHIP_REQUIREMENTS.map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Application Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Başvuru Süreci</CardTitle>
              <CardDescription>
                Başvuru sürecinin nasıl işlediğini öğrenin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {APPLICATION_STEPS.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{step.step}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                      <p className="text-gray-600 text-sm">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
