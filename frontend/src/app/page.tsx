import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">Eğitim Burs Derneği</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium">
                Ana Sayfa
              </Link>
              <Link href="/hakkimizda" className="text-gray-700 hover:text-indigo-600 font-medium">
                Hakkımızda
              </Link>
              <Link href="/burs-basvuru" className="text-gray-700 hover:text-indigo-600 font-medium">
                Burs Başvuru
              </Link>
              <Link href="/iletisim" className="text-gray-700 hover:text-indigo-600 font-medium">
                İletişim
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Eğitimde Fırsat Eşitliği
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Öğrencilere maddi destek sağlayarak eğitim hayatlarında fırsat eşitliği yaratıyoruz. 
            Burs başvurunuzu yapın, geleceğinizi şekillendirin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/burs-basvuru"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Burs Başvurusu Yap
            </Link>
            <Link
              href="/hakkimizda"
              className="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              Daha Fazla Bilgi
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Neden Bizi Tercih Etmelisiniz?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Maddi Destek</h4>
              <p className="text-gray-600">
                Eğitim masraflarınızı karşılamak için düzenli burs desteği sağlıyoruz.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Kolay Başvuru</h4>
              <p className="text-gray-600">
                Online başvuru sistemi ile hızlı ve kolay bir şekilde başvurunuzu yapabilirsiniz.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Mentorluk</h4>
              <p className="text-gray-600">
                Sadece maddi değil, akademik ve kariyer rehberliği de sunuyoruz.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-indigo-600 rounded-lg p-8 text-white">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-indigo-200">Bursiyer</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">₺2M+</div>
              <div className="text-indigo-200">Dağıtılan Burs</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">15+</div>
              <div className="text-indigo-200">Yıllık Deneyim</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-indigo-200">Başarı Oranı</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Eğitim Burs Derneği</h4>
              <p className="text-gray-400">
                Öğrencilere maddi destek sağlayarak eğitimde fırsat eşitliği yaratıyoruz.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Hızlı Linkler</h4>
              <ul className="space-y-2">
                <li><Link href="/hakkimizda" className="text-gray-400 hover:text-white">Hakkımızda</Link></li>
                <li><Link href="/burs-basvuru" className="text-gray-400 hover:text-white">Burs Başvuru</Link></li>
                <li><Link href="/iletisim" className="text-gray-400 hover:text-white">İletişim</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">İletişim</h4>
              <div className="text-gray-400 space-y-2">
                <p>info@bursdernegi.org</p>
                <p>+90 212 555 0123</p>
                <p>İstanbul, Türkiye</p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Sosyal Medya</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Eğitim Burs Derneği. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
