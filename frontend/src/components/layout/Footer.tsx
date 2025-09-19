import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { SITE_CONFIG, SOCIAL_LINKS, CONTACT_INFO } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo ve Açıklama */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-xl">{SITE_CONFIG.shortName}</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {SITE_CONFIG.description}
            </p>
            <div className="flex space-x-4">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Hızlı Linkler */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/hakkimizda" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/hizmetler" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Hizmetlerimiz
                </Link>
              </li>
              <li>
                <Link href="/burs-basvuru" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Burs Başvurusu
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-gray-300 hover:text-white transition-colors text-sm">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Hizmetler */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hizmetlerimiz</h3>
            <ul className="space-y-2">
              <li className="text-gray-300 text-sm">Eğitim Bursları</li>
              <li className="text-gray-300 text-sm">Kitap Yardımları</li>
              <li className="text-gray-300 text-sm">Kırtasiye Desteği</li>
              <li className="text-gray-300 text-sm">Mentorluk Programı</li>
              <li className="text-gray-300 text-sm">Sosyal Etkinlikler</li>
            </ul>
          </div>

          {/* İletişim Bilgileri */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">İletişim</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{CONTACT_INFO.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-blue-400 flex-shrink-0" />
                <a
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  {CONTACT_INFO.phone}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-blue-400 flex-shrink-0" />
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  {CONTACT_INFO.email}
                </a>
              </div>
            </div>
            <div className="text-gray-300 text-sm">
              <p>{CONTACT_INFO.workingHours}</p>
            </div>
          </div>
        </div>

        {/* Alt Çizgi */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} {SITE_CONFIG.name}. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/gizlilik-politikasi" className="text-gray-400 hover:text-white transition-colors">
                Gizlilik Politikası
              </Link>
              <Link href="/kullanim-kosullari" className="text-gray-400 hover:text-white transition-colors">
                Kullanım Koşulları
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
