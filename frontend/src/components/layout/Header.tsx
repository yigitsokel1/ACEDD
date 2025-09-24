"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS, SITE_CONFIG } from "@/lib/constants";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isJoinDropdownOpen, setIsJoinDropdownOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleJoinDropdown = () => setIsJoinDropdownOpen(!isJoinDropdownOpen);

  // Dropdown dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsJoinDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-xl text-gray-900">
              {SITE_CONFIG.shortName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {NAVIGATION_ITEMS.map((item, index) => (
              <React.Fragment key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-blue-600",
                    pathname === item.href
                      ? "text-blue-600"
                      : "text-gray-700"
                  )}
                >
                  {item.name}
                </Link>
                
                {/* Bize Katıl Dropdown - Burs Başvurusu ile İletişim arasında */}
                {item.name === "Burs Başvurusu" && (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={toggleJoinDropdown}
                      className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <span>Bize Katıl</span>
                      <ChevronDown 
                        size={16} 
                        className={cn(
                          "transition-transform duration-200",
                          isJoinDropdownOpen ? "rotate-180" : ""
                        )}
                      />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isJoinDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <Link
                          href="/bagis-yap"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setIsJoinDropdownOpen(false)}
                        >
                          Bağış Yap
                        </Link>
                        <Link
                          href="/uyelik-basvuru"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setIsJoinDropdownOpen(false)}
                        >
                          Üyelik Başvurusu
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 text-base font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Bize Katıl Section */}
              <div className="pt-2 border-t border-gray-200">
                <div className="px-3 py-2 text-base font-medium text-gray-700">
                  Bize Katıl
                </div>
                <Link
                  href="/bagis-yap"
                  className="block px-6 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Bağış Yap
                </Link>
                <Link
                  href="/uyelik-basvuru"
                  className="block px-6 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Üyelik Başvurusu
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
