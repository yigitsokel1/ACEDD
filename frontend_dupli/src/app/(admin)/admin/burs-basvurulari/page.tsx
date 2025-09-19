import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Burs Başvuruları - Admin",
  description: "Burs başvurularını yönetin",
};

export default function ScholarshipApplicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Burs Başvuruları</h1>
        <p className="text-gray-600">
          Tüm burs başvurularını görüntüleyin ve yönetin.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Burs Başvuruları Yönetimi
          </h3>
          <p className="text-gray-600 mb-4">
            Bu sayfa geliştirilme aşamasındadır. Yakında tüm başvuruları 
            filtreleyebilir, detaylarını görüntüleyebilir ve durumlarını güncelleyebilirsiniz.
          </p>
          <div className="text-sm text-gray-500">
            Özellikler: Filtreleme, Arama, Durum Güncelleme, Detay Görüntüleme
          </div>
        </div>
      </div>
    </div>
  );
}
