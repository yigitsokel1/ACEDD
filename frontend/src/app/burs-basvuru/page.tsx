"use client";

import { useState } from "react";
import Link from "next/link";

interface FormData {
  adSoyad: string;
  email: string;
  telefon: string;
  universite: string;
  bolum: string;
  sinif: string;
  gpa: string;
  aileGelir: string;
  acilDurum: string;
  motivasyon: string;
}

export default function BursBasvuru() {
  const [formData, setFormData] = useState<FormData>({
    adSoyad: "",
    email: "",
    telefon: "",
    universite: "",
    bolum: "",
    sinif: "",
    gpa: "",
    aileGelir: "",
    acilDurum: "",
    motivasyon: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold text-indigo-600">Eğitim Burs Derneği</Link>
              </div>
              <nav className="hidden md:flex space-x-8">
                <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium">Ana Sayfa</Link>
                <Link href="/hakkimizda" className="text-gray-700 hover:text-indigo-600 font-medium">Hakkımızda</Link>
                <Link href="/burs-basvuru" className="text-indigo-600 font-medium">Burs Başvuru</Link>
                <Link href="/iletisim" className="text-gray-700 hover:text-indigo-600 font-medium">İletişim</Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Başvurunuz Alındı!</h1>
            <p className="text-gray-600 mb-6">
              Burs başvurunuz başarıyla gönderildi. Değerlendirme süreci 2-3 hafta sürmektedir. 
              Sonuçlar e-posta adresinize gönderilecektir.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Ana Sayfaya Dön
              </Link>
              <button
                onClick={() => setIsSubmitted(false)}
                className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                Yeni Başvuru Yap
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">Eğitim Burs Derneği</Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium">Ana Sayfa</Link>
              <Link href="/hakkimizda" className="text-gray-700 hover:text-indigo-600 font-medium">Hakkımızda</Link>
              <Link href="/burs-basvuru" className="text-indigo-600 font-medium">Burs Başvuru</Link>
              <Link href="/iletisim" className="text-gray-700 hover:text-indigo-600 font-medium">İletişim</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Burs Başvuru Formu</h1>
            <p className="text-gray-600">
              Aşağıdaki formu doldurarak burs başvurunuzu yapabilirsiniz. Tüm alanlar zorunludur.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Kişisel Bilgiler */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Kişisel Bilgiler</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="adSoyad" className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    id="adSoyad"
                    name="adSoyad"
                    value={formData.adSoyad}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="telefon" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    id="telefon"
                    name="telefon"
                    value={formData.telefon}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Eğitim Bilgileri */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Eğitim Bilgileri</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="universite" className="block text-sm font-medium text-gray-700 mb-2">
                    Üniversite *
                  </label>
                  <input
                    type="text"
                    id="universite"
                    name="universite"
                    value={formData.universite}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="bolum" className="block text-sm font-medium text-gray-700 mb-2">
                    Bölüm *
                  </label>
                  <input
                    type="text"
                    id="bolum"
                    name="bolum"
                    value={formData.bolum}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="sinif" className="block text-sm font-medium text-gray-700 mb-2">
                    Sınıf *
                  </label>
                  <select
                    id="sinif"
                    name="sinif"
                    value={formData.sinif}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Seçiniz</option>
                    <option value="1">1. Sınıf</option>
                    <option value="2">2. Sınıf</option>
                    <option value="3">3. Sınıf</option>
                    <option value="4">4. Sınıf</option>
                    <option value="5">5. Sınıf</option>
                    <option value="6">6. Sınıf</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="gpa" className="block text-sm font-medium text-gray-700 mb-2">
                    Genel Not Ortalaması (GPA) *
                  </label>
                  <input
                    type="number"
                    id="gpa"
                    name="gpa"
                    value={formData.gpa}
                    onChange={handleChange}
                    min="0"
                    max="4"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Mali Durum */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Mali Durum</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="aileGelir" className="block text-sm font-medium text-gray-700 mb-2">
                    Aile Aylık Geliri (TL) *
                  </label>
                  <select
                    id="aileGelir"
                    name="aileGelir"
                    value={formData.aileGelir}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Seçiniz</option>
                    <option value="0-5000">0 - 5.000 TL</option>
                    <option value="5000-10000">5.000 - 10.000 TL</option>
                    <option value="10000-15000">10.000 - 15.000 TL</option>
                    <option value="15000-20000">15.000 - 20.000 TL</option>
                    <option value="20000+">20.000 TL ve üzeri</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="acilDurum" className="block text-sm font-medium text-gray-700 mb-2">
                    Acil Durum Açıklaması
                  </label>
                  <textarea
                    id="acilDurum"
                    name="acilDurum"
                    value={formData.acilDurum}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ailenizin mali durumu hakkında ek bilgi verebilirsiniz..."
                  />
                </div>
              </div>
            </div>

            {/* Motivasyon */}
            <div className="pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Motivasyon</h2>
              <div>
                <label htmlFor="motivasyon" className="block text-sm font-medium text-gray-700 mb-2">
                  Neden burs almak istiyorsunuz? *
                </label>
                <textarea
                  id="motivasyon"
                  name="motivasyon"
                  value={formData.motivasyon}
                  onChange={handleChange}
                  rows={5}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Burs almak isteme nedenlerinizi ve eğitim hedeflerinizi açıklayınız..."
                />
              </div>
            </div>

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
