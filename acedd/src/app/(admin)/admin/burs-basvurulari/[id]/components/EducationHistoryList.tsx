"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { formatDateOnly } from "@/lib/utils/dateHelpers";
import type { ScholarshipEducationHistory } from "@/lib/types/scholarship";

/**
 * EducationHistoryList Component
 * 
 * Sprint 16 - Block F: Read-only list component for displaying education history
 * 
 * Displays all education history records associated with a scholarship application.
 * No CRUD operations - read-only display only.
 */
interface EducationHistoryListProps {
  educationHistory: ScholarshipEducationHistory[];
}

export function EducationHistoryList({ educationHistory }: EducationHistoryListProps) {
  if (!educationHistory || educationHistory.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Eğitim geçmişi bilgisi bulunmamaktadır.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {educationHistory.map((edu, index) => (
        <Card key={index} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Okul Adı
              </label>
              <p className="text-gray-900">{edu.schoolName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bölüm
              </label>
              <p className="text-gray-900">{edu.department}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Başlangıç Tarihi
              </label>
              <p className="text-gray-900">{formatDateOnly(edu.startDate)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bitiş Tarihi
              </label>
              <p className="text-gray-900">{formatDateOnly(edu.endDate)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mezuniyet
              </label>
              <p className="text-gray-900">{edu.graduation}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Başarı Yüzdesi
              </label>
              <p className="text-gray-900">%{edu.percentage}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

