import Link from "next/link";

export default function Hakkimizda() {
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
              <Link href="/hakkimizda" className="text-indigo-600 font-medium">Hakkımızda</Link>
              <Link href="/burs-basvuru" className="text-gray-700 hover:text-indigo-600 font-medium">Burs Başvuru</Link>
              <Link href="/iletisim" className="text-gray-700 hover:text-indigo-600 font-medium">İletişim</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Hakkımızda
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Eğitim Burs Derneği olarak, öğrencilere maddi destek sağlayarak eğitimde fırsat eşitliği yaratmayı hedefliyoruz.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Misyonumuz</h2>
            <p className="text-gray-600">
              Eğitimde fırsat eşitliği sağlayarak, maddi imkansızlıklar nedeniyle eğitimlerini sürdürmekte zorlanan öğrencilere 
              destek olmak ve onların akademik başarılarını artırmalarına yardımcı olmak.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vizyonumuz</h2>
            <p className="text-gray-600">
              Türkiye'de her öğrencinin eğitim hakkından eşit şekilde yararlanabildiği, 
              eğitimde fırsat eşitliğinin sağlandığı bir toplum yaratmak.
            </p>
          </div>
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Hikayemiz</h2>
          <div className="prose max-w-none text-gray-600">
            <p className="text-lg mb-6">
              Eğitim Burs Derneği, 2009 yılında bir grup eğitim gönüllüsü tarafından kurulmuştur. 
              Kuruluş amacımız, maddi imkansızlıklar nedeniyle eğitimlerini sürdürmekte zorlanan 
              öğrencilere destek olmak ve onların akademik başarılarını artırmalarına yardımcı olmaktır.
            </p>
            <p className="text-lg mb-6">
              Bugüne kadar 500'den fazla öğrenciye burs desteği sağladık ve toplamda 2 milyon TL'nin 
              üzerinde maddi destek verdik. Bursiyerlerimizin %95'i eğitimlerini başarıyla tamamlamış 
              ve kariyerlerinde önemli adımlar atmışlardır.
            </p>
            <p className="text-lg">
              Derneğimiz, sadece maddi destek sağlamakla kalmayıp, öğrencilerimize mentorluk hizmeti 
              de sunarak onların akademik ve kariyer gelişimlerine katkıda bulunmaktadır.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Değerlerimiz</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Şeffaflık</h3>
              <p className="text-gray-600">
                Tüm faaliyetlerimizi şeffaf bir şekilde yürütür, bağışçılarımıza hesap veririz.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Güvenilirlik</h3>
              <p className="text-gray-600">
                Öğrencilerimizin ve bağışçılarımızın güvenini kazanmak için çalışırız.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Dayanışma</h3>
              <p className="text-gray-600">
                Toplumsal dayanışma ruhuyla hareket eder, birlikte güçlü oluruz.
              </p>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Yönetim Kurulu</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Dr. Ahmet Yılmaz</h3>
              <p className="text-indigo-600 font-medium mb-2">Başkan</p>
              <p className="text-gray-600 text-sm">
                Eğitim alanında 20 yıllık deneyime sahip, İstanbul Üniversitesi öğretim üyesi.
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Prof. Dr. Ayşe Demir</h3>
              <p className="text-indigo-600 font-medium mb-2">Başkan Yardımcısı</p>
              <p className="text-gray-600 text-sm">
                Sosyoloji profesörü, eğitim sosyolojisi alanında uzman.
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mehmet Kaya</h3>
              <p className="text-indigo-600 font-medium mb-2">Genel Sekreter</p>
              <p className="text-gray-600 text-sm">
                İş dünyasından gelen deneyimiyle derneğin yönetiminde aktif rol alıyor.
              </p>
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
