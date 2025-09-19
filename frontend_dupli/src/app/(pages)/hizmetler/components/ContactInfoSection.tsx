import React from "react";
import { CONTACT_INFO } from "../constants";

export function ContactInfoSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Sorularınız mı var?
          </h2>
          <p className="text-lg text-gray-600">
            Hizmetlerimiz hakkında detaylı bilgi almak için bizimle iletişime geçin.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {CONTACT_INFO.map((info, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <info.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
              <p className="text-gray-600">{info.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
