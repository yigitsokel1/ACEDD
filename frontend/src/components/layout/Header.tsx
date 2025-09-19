"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/constants";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src="/logo.svg" 
                alt="Acıpayam ve Çevresi Eğitimi Destekleme Derneği Logo" 
                className="w-12 h-12"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Acıpayam ve Çevresi Eğitimi Destekleme Derneği
              </h1>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link 
              href={ROUTES.HOME} 
              className={`font-medium transition-colors duration-200 relative group ${
                pathname === ROUTES.HOME 
                  ? "text-blue-600" 
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Ana Sayfa
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all duration-200 ${
                pathname === ROUTES.HOME ? "w-full" : "w-0 group-hover:w-full"
              }`}></span>
            </Link>
            
            <Link 
              href={ROUTES.ABOUT} 
              className={`font-medium transition-colors duration-200 relative group ${
                pathname === ROUTES.ABOUT 
                  ? "text-blue-600" 
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Hakkımızda
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all duration-200 ${
                pathname === ROUTES.ABOUT ? "w-full" : "w-0 group-hover:w-full"
              }`}></span>
            </Link>
            
            <Link 
              href={ROUTES.SERVICES} 
              className={`font-medium transition-colors duration-200 relative group ${
                pathname === ROUTES.SERVICES 
                  ? "text-blue-600" 
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Hizmetlerimiz
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all duration-200 ${
                pathname === ROUTES.SERVICES ? "w-full" : "w-0 group-hover:w-full"
              }`}></span>
            </Link>
            
            <Link 
              href={ROUTES.BOARD} 
              className={`font-medium transition-colors duration-200 relative group ${
                pathname === ROUTES.BOARD 
                  ? "text-blue-600" 
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Yönetim Kurulu
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all duration-200 ${
                pathname === ROUTES.BOARD ? "w-full" : "w-0 group-hover:w-full"
              }`}></span>
            </Link>
            
            <Link 
              href={ROUTES.CONTACT} 
              className={`font-medium transition-colors duration-200 relative group ${
                pathname === ROUTES.CONTACT 
                  ? "text-blue-600" 
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              İletişim
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all duration-200 ${
                pathname === ROUTES.CONTACT ? "w-full" : "w-0 group-hover:w-full"
              }`}></span>
            </Link>
          </nav>
          
          <div className="md:hidden">
            <button className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
