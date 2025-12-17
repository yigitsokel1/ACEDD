import React from "react";
import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  // Privacy page is not in PageIdentifier type, so we use fallback
  return {
    title: "Gizlilik Politikası",
    description: "Acıpayam ve Çevresi Eğitimi Destekleme Derneği gizlilik politikası",
  };
}

export default async function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Gizlilik Politikası
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
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Genel Bilgiler</h2>
                <p className="leading-relaxed">
                  Acıpayam ve Çevresi Eğitimi Destekleme Derneği (ACEDD) olarak, kişisel verilerinizin korunmasına 
                  büyük önem vermekteyiz. Bu gizlilik politikası, web sitemiz aracılığıyla topladığımız kişisel 
                  bilgilerin nasıl kullanıldığını ve korunduğunu açıklamaktadır.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Toplanan Bilgiler</h2>
                <p className="leading-relaxed mb-3">
                  Web sitemiz aracılığıyla aşağıdaki bilgileri toplayabiliriz:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Üyelik başvurularında: Ad, soyad, TC kimlik numarası, doğum tarihi, iletişim bilgileri</li>
                  <li>Burs başvurularında: Eğitim bilgileri, aile bilgileri, mali durum bilgileri</li>
                  <li>İletişim formunda: Ad, e-posta, telefon, mesaj içeriği</li>
                  <li>Teknik bilgiler: IP adresi, tarayıcı türü, ziyaret edilen sayfalar</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Bilgilerin Kullanımı</h2>
                <p className="leading-relaxed mb-3">
                  Toplanan kişisel bilgiler aşağıdaki amaçlarla kullanılmaktadır:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Üyelik ve burs başvurularının değerlendirilmesi</li>
                  <li>İletişim taleplerinize yanıt verilmesi</li>
                  <li>Dernek faaliyetlerinin yürütülmesi</li>
                  <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                  <li>Web sitesi kullanım istatistiklerinin analiz edilmesi</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Bilgilerin Korunması</h2>
                <p className="leading-relaxed">
                  Kişisel verileriniz, teknik ve idari güvenlik önlemleri ile korunmaktadır. Verileriniz 
                  yalnızca yetkili personel tarafından erişilebilir ve yasal süre boyunca saklanmaktadır.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Çerezler (Cookies)</h2>
                <p className="leading-relaxed">
                  Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır. Çerezler, 
                  tarayıcı ayarlarınızdan kontrol edilebilir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Üçüncü Taraf Hizmetler</h2>
                <p className="leading-relaxed">
                  Formlarımızda spam önleme amacıyla Google reCAPTCHA hizmeti kullanılmaktadır. 
                  reCAPTCHA kullanımı Google&apos;ın Gizlilik Politikası ve Hizmet Şartları&apos;na tabidir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Haklarınız</h2>
                <p className="leading-relaxed mb-3">
                  KVKK kapsamında aşağıdaki haklara sahipsiniz:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                  <li>İşlenen kişisel verileriniz hakkında bilgi talep etme</li>
                  <li>Kişisel verilerinizin düzeltilmesini isteme</li>
                  <li>Kişisel verilerinizin silinmesini isteme</li>
                  <li>İşlenen verilerinizin muhafazasını talep etme</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. İletişim</h2>
                <p className="leading-relaxed">
                  Gizlilik politikamız hakkında sorularınız için bizimle{" "}
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
