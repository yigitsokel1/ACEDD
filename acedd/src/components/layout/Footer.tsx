import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, Linkedin, Youtube, Github } from "lucide-react";
import { SITE_CONFIG, CONTACT_INFO } from "@/lib/constants";
import { getSiteName, getSiteDescription, getSocialLinks, getContactInfo, getFooterText } from "@/lib/settings";

export async function Footer() {
  const currentYear = new Date().getFullYear();

  // Fetch settings from database
  const [siteName, siteDescription, socialLinks, contactInfo, footerText] = await Promise.all([
    getSiteName(),
    getSiteDescription(),
    getSocialLinks(),
    getContactInfo(),
    getFooterText(),
  ]);

  // Use settings if available, otherwise fallback to constants
  const displayName = siteName || SITE_CONFIG.shortName;
  const displayDescription = siteDescription || SITE_CONFIG.description;
  const displayAddress = contactInfo.address || CONTACT_INFO.address;
  const displayPhone = contactInfo.phone || CONTACT_INFO.phone;
  const displayEmail = contactInfo.email || CONTACT_INFO.email;

  // Social media icons mapping
  const socialIcons = {
    instagram: Instagram,
    twitter: Twitter,
    facebook: Facebook,
    linkedin: Linkedin,
    youtube: Youtube,
    github: Github,
  };

  // Build social links array
  const socialLinksArray = [
    { key: "instagram", url: socialLinks.instagram, name: "Instagram" },
    { key: "twitter", url: socialLinks.twitter, name: "Twitter" },
    { key: "facebook", url: socialLinks.facebook, name: "Facebook" },
    { key: "linkedin", url: socialLinks.linkedin, name: "LinkedIn" },
    { key: "youtube", url: socialLinks.youtube, name: "YouTube" },
    { key: "github", url: socialLinks.github, name: "GitHub" },
  ].filter((link) => link.url); // Only include links that exist

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo ve Sosyal Medya */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-xl">{displayName}</span>
            </div>
            {displayDescription && (
            <p className="text-gray-300 text-sm leading-relaxed">
                {displayDescription}
            </p>
            )}
            {/* Sosyal Medya Linkleri */}
            {socialLinksArray.length > 0 && (
              <div className="flex space-x-4 pt-2">
                {socialLinksArray.map((link) => {
                  const Icon = socialIcons[link.key as keyof typeof socialIcons];
                  return (
                    <a
                      key={link.key}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label={link.name}
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Hızlı Linkler */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/hakkimizda" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/etkinlikler" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Etkinlikler
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-gray-300 hover:text-white transition-colors text-sm">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Bize Katıl */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Bize Katıl</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/bagis-yap" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Bağış Yap
                </Link>
              </li>
              <li>
                <Link href="/uyelik-basvuru" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Üyelik Başvurusu
                </Link>
              </li>
              <li>
                <Link href="/burs-basvuru" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Burs Başvurusu
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim Bilgileri */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">İletişim</h3>
            <div className="space-y-3">
              {displayAddress && (
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{displayAddress}</span>
              </div>
              )}
              {displayPhone && (
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-blue-400 flex-shrink-0" />
                <a
                    href={`tel:${displayPhone}`}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                    {displayPhone}
                </a>
              </div>
              )}
              {displayEmail && (
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-blue-400 flex-shrink-0" />
                <a
                    href={`mailto:${displayEmail}`}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                    {displayEmail}
                </a>
              </div>
              )}
            </div>
          </div>
        </div>

        {/* Alt Çizgi */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              {footerText || `© ${currentYear} ${displayName}. Tüm hakları saklıdır.`}
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
