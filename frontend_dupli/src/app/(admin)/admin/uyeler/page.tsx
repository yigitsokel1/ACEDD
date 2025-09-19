import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Üyeler - Admin",
  description: "Dernek üyelerini yönetin",
};

export default function MembersPage() {
  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Üyeler</h1>
          <p className="text-gray-600">
            Dernek üyelerini görüntüleyin ve yönetin.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Üye Yönetimi
            </h3>
            <p className="text-gray-600 mb-4">
              Bu sayfa geliştirilme aşamasındadır. Yakında üyeleri 
              görüntüleyebilir, yeni üye ekleyebilir ve üye bilgilerini güncelleyebilirsiniz.
            </p>
            <div className="text-sm text-gray-500">
              Özellikler: Üye Listesi, Yeni Üye Ekleme, Üye Detayları, Üye Güncelleme
            </div>
          </div>
        </div>
      </div>
  );
}
