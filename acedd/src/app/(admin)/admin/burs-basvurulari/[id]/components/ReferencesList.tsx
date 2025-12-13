"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import type { ScholarshipReference } from "@/lib/types/scholarship";

/**
 * ReferencesList Component
 * 
 * Sprint 16 - Block F: Read-only list component for displaying references
 * 
 * Displays all references associated with a scholarship application.
 * No CRUD operations - read-only display only.
 */
interface ReferencesListProps {
  references: ScholarshipReference[];
}

export function ReferencesList({ references }: ReferencesListProps) {
  if (!references || references.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Referans bilgisi bulunmamaktadır.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {references.map((ref, index) => (
        <Card key={index} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İlişki
              </label>
              <p className="text-gray-900">{ref.relationship}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ad Soyad
              </label>
              <p className="text-gray-900">{ref.fullName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ACEDD Üyesi mi?
              </label>
              <p className="text-gray-900">{ref.isAcddMember}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İş/Meslek
              </label>
              <p className="text-gray-900">{ref.job}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon
              </label>
              <p className="text-gray-900">{ref.phone}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adres
              </label>
              <p className="text-gray-900 whitespace-pre-wrap">{ref.address}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

