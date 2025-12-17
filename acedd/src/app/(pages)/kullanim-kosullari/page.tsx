import React from "react";
import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  // Terms page is not in PageIdentifier type, so we use fallback
  return {
    title: "Kullanım Koşulları",
    description: "Acıpayam ve Çevresi Eğitimi Destekleme Derneği web sitesi kullanım koşulları",
  };
}

export default async function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Kullanım Koşulları
            </CardTitle>
            <CardDescription>
              Son güncelleme: {new Date().toLocaleDateString('tr-TR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Genel Hükümler</h2>
                <p className="leading-relaxed">
                  Bu kullanım koşulları, Acıpayam ve Çevresi Eğitimi Destekleme Derneği (ACEDD) web sitesinin 
                  kullanımına ilişkin kuralları belirlemektedir. Siteyi kullanarak bu koşulları kabul etmiş 
                  sayılırsınız.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Site Kullanımı</h2>
                <p className="leading-relaxed mb-3">
                  Web sitemizi kullanırken aşağıdaki kurallara uymanız gerekmektedir:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Site içeriğini yasalara aykırı amaçlarla kullanmamak</li>
                  <li>Başkalarının haklarını ihlal edecek şekilde siteyi kullanmamak</li>
                  <li>Zararlı yazılım, virüs veya kötü amaçlı kod yüklememek</li>
                  <li>Site güvenliğini tehlikeye atacak eylemlerde bulunmamak</li>
                  <li>Sahte veya yanıltıcı bilgi vermemek</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Başvuru Formları</h2>
                <p className="leading-relaxed mb-3">
                  Üyelik ve burs başvuru formlarını doldururken:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Doğru ve güncel bilgiler vermeniz gerekmektedir</li>
                  <li>Yanlış bilgi vermeniz durumunda başvurunuz geçersiz sayılabilir</li>
                  <li>Başvurular değerlendirme sürecine tabidir</li>
                  <li>Başvuru sonuçları dernek yönetimi tarafından belirlenir</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Fikri Mülkiyet</h2>
                <p className="leading-relaxed">
                  Web sitesindeki tüm içerik, logo, tasarım ve materyaller ACEDD&apos;ye aittir ve telif 
                  hakkı ile korunmaktadır. İzinsiz kullanım yasal işlemlere tabi tutulabilir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Sorumluluk Reddi</h2>
                <p className="leading-relaxed">
                  Web sitesi içeriği &quot;olduğu gibi&quot; sunulmaktadır. ACEDD, site içeriğinin doğruluğu, 
                  güncelliği veya eksiksizliği konusunda garanti vermemektedir. Site kullanımından kaynaklanan 
                  herhangi bir zarardan sorumlu tutulamaz.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Bağlantılar</h2>
                <p className="leading-relaxed">
                  Web sitemizde üçüncü taraf web sitelerine bağlantılar bulunabilir. Bu bağlantılar yalnızca 
                  bilgilendirme amaçlıdır ve ACEDD bu sitelerin içeriğinden sorumlu değildir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Değişiklikler</h2>
                <p className="leading-relaxed">
                  ACEDD, bu kullanım koşullarını herhangi bir zamanda değiştirme hakkını saklı tutar. 
                  Değişiklikler web sitesinde yayınlandığı tarihten itibaren geçerlidir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Uygulanacak Hukuk</h2>
                <p className="leading-relaxed">
                  Bu kullanım koşulları Türkiye Cumhuriyeti yasalarına tabidir. Herhangi bir uyuşmazlık 
                  durumunda Denizli mahkemeleri yetkilidir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. İletişim</h2>
                <p className="leading-relaxed">
                  Kullanım koşulları hakkında sorularınız için bizimle{" "}
                  <a href="/iletisim" className="text-blue-600 hover:underline">
                    iletişim
                  </a>{" "}
                  sayfasından iletişime geçebilirsiniz.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
