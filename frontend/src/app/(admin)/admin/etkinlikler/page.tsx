import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Etkinlikler - Admin",
  description: "Dernek etkinliklerini yönetin",
};

export default function EventsPage() {
  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Etkinlikler</h1>
          <p className="text-gray-600">
            Dernek etkinliklerini görüntüleyin ve yönetin.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Etkinlik Yönetimi
            </h3>
            <p className="text-gray-600 mb-4">
              Bu sayfa geliştirilme aşamasındadır. Yakında etkinlikleri 
              oluşturabilir, düzenleyebilir ve katılımcıları yönetebilirsiniz.
            </p>
            <div className="text-sm text-gray-500">
              Özellikler: Etkinlik Oluşturma, Etkinlik Düzenleme, Katılımcı Yönetimi, Takvim Görünümü
            </div>
          </div>
        </div>
      </div>
  );
}
