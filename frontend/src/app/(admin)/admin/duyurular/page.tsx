import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Duyurular - Admin",
  description: "Dernek duyurularını yönetin",
};

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Duyurular</h1>
          <p className="text-gray-600">
            Dernek duyurularını görüntüleyin ve yönetin.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Duyuru Yönetimi
            </h3>
            <p className="text-gray-600 mb-4">
              Bu sayfa geliştirilme aşamasındadır. Yakında duyuruları 
              oluşturabilir, düzenleyebilir ve yayınlayabilirsiniz.
            </p>
            <div className="text-sm text-gray-500">
              Özellikler: Duyuru Oluşturma, Duyuru Düzenleme, Yayınlama, Kategorilendirme
            </div>
          </div>
        </div>
      </div>
  );
}
