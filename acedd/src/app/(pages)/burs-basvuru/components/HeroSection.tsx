import React from "react";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 pt-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Burs Başvurusu
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Eğitim hayatınızı desteklemek için burs başvurusu yapabilirsiniz. 
            Başvurunuzu eksiksiz doldurarak değerlendirme sürecine katılın.
          </p>
        </div>
      </div>
    </section>
  );
}
