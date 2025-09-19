import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { CONTACT_INFO } from "../constants";

export function ContactInfoSection() {
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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {CONTACT_INFO.map((info, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 mx-auto">
                  <info.icon className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{info.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900 font-medium mb-2">{info.value}</p>
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
