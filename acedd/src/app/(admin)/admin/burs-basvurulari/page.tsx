import React from "react";
import { Metadata } from "next";
import ScholarshipApplicationsPageContent from "./ScholarshipApplicationsPageContent";

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

      <div className="bg-white rounded-lg shadow">
        <ScholarshipApplicationsPageContent />
      </div>
    </div>
  );
}
