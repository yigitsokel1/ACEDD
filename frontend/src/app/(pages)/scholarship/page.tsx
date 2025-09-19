"use client";

import { useScholarshipData } from './hooks/useScholarshipData';
import FormSection from './components/FormSection';
import SuccessMessage from './components/SuccessMessage';

export default function Scholarship() {
  const {
    content,
    formSections,
    formData,
    isSubmitting,
    isSubmitted,
    handleChange,
    handleSubmit,
    handleNewApplication
  } = useScholarshipData();

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <SuccessMessage onNewApplication={handleNewApplication} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {content.title}
            </h1>
            <p className="text-gray-600">
              {content.description}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {formSections.map((section) => (
              <FormSection
                key={section.id}
                section={section}
                formData={formData}
                onChange={handleChange}
              />
            ))}

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Gönderiliyor..." : "Başvuruyu Gönder"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
