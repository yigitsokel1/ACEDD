import React from "react";
import { Metadata } from "next";
import ContactMessagesPageContent from "./ContactMessagesPageContent";

export const metadata: Metadata = {
  title: "İletişim Mesajları - Admin",
  description: "İletişim mesajlarını yönetin",
};

export default function ContactMessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">İletişim Mesajları</h1>
        <p className="text-gray-600">
          Tüm iletişim mesajlarını görüntüleyin ve yönetin.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <ContactMessagesPageContent />
      </div>
    </div>
  );
}

