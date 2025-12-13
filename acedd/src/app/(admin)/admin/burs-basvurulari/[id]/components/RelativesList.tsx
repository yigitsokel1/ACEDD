"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { formatDateOnly } from "@/lib/utils/dateHelpers";
import type { ScholarshipRelative } from "@/lib/types/scholarship";

/**
 * RelativesList Component
 * 
 * Sprint 16 - Block F: Read-only list component for displaying relatives
 * 
 * Displays all relatives associated with a scholarship application.
 * No CRUD operations - read-only display only.
 */
interface RelativesListProps {
  relatives: ScholarshipRelative[];
}

export function RelativesList({ relatives }: RelativesListProps) {
  if (!relatives || relatives.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Akraba bilgisi bulunmamaktadır.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {relatives.map((relative, index) => (
        <Card key={index} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Akrabalık Derecesi
              </label>
              <p className="text-gray-900">{relative.kinship}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ad Soyad
              </label>
              <p className="text-gray-900">{relative.name} {relative.surname}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Doğum Tarihi
              </label>
              <p className="text-gray-900">{formatDateOnly(relative.birthDate)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Öğrenim Durumu
              </label>
              <p className="text-gray-900">{relative.education}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meslek
              </label>
              <p className="text-gray-900">{relative.occupation}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İş Yeri/Bölüm
              </label>
              <p className="text-gray-900">{relative.workplace || "-"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sağlık Sigortası
              </label>
              <p className="text-gray-900">{relative.healthInsurance}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sağlık Engeli
              </label>
              <p className="text-gray-900">{relative.healthDisability}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gelir (TL)
              </label>
              <p className="text-gray-900">{relative.income.toLocaleString('tr-TR')} ₺</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon
              </label>
              <p className="text-gray-900">{relative.phone}</p>
            </div>
            {relative.additionalNotes && (
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ek Notlar
                </label>
                <p className="text-gray-900 whitespace-pre-wrap">{relative.additionalNotes}</p>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

