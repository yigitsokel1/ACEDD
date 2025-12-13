"use client";

import React, { useState, useEffect, useRef } from "react";
import { Megaphone, Pin, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Announcement } from "@/lib/types/announcement";
import { isAnnouncementActive } from "@/lib/utils/isAnnouncementActive";
import { getAnnouncementCategoryLabel } from "@/lib/types/announcement";

interface AnnouncementStripProps {
  announcements: Announcement[];
}

// Duyuru Modal Component
function AnnouncementModal({ 
  announcement, 
  onClose 
}: { 
  announcement: Announcement; 
  onClose: () => void; 
}) {
  if (!announcement) return null;

  // Modal'de her türlü içerik gösteriliyor: özet varsa hem özet hem içerik, yoksa sadece içerik
  const summaryText = announcement.summary?.trim();
  const hasSummary = !!summaryText;

  return (
    <div 
      className="fixed inset-0 bg-gray-900/75 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border-2 border-orange-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b-2 border-orange-100 px-6 py-4 rounded-t-2xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                {announcement.isPinned && (
                  <Pin className="w-5 h-5 text-orange-500 flex-shrink-0" />
                )}
                <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-semibold rounded-full">
                  {getAnnouncementCategoryLabel(announcement.category)}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {announcement.title}
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                {(() => {
                  const date = new Date(announcement.createdAt);
                  const day = String(date.getDate()).padStart(2, '0');
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const year = date.getFullYear();
                  return `${day}.${month}.${year}`;
                })()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
              aria-label="Kapat"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="px-8 py-8">
          <div className="prose prose-lg max-w-none">
            {hasSummary && summaryText && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Özet</h3>
                <div className="text-lg md:text-xl text-gray-700 leading-relaxed bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                  {summaryText}
                </div>
              </div>
            )}
            <div>
              {hasSummary && <h3 className="text-xl font-semibold text-gray-900 mb-3">İçerik</h3>}
              <div className="text-lg md:text-xl text-gray-700 leading-relaxed whitespace-pre-wrap">
                {announcement.content.trim()}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-orange-50 border-t-2 border-orange-100 px-6 py-4 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}

export function AnnouncementStrip({ announcements }: AnnouncementStripProps) {
  // Sprint 14.4: Slider state ve ref
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter active announcements and sort by pinned first, then by date
  const activeAnnouncements = announcements
    .filter((announcement) => isAnnouncementActive(announcement))
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 5); // Show max 5 announcements

  // Sprint 14.4: Auto-scroll - Otomatik kayma (5 saniyede bir)
  useEffect(() => {
    if (activeAnnouncements.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAnnouncements.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeAnnouncements.length]);

  // Sprint 14.4: Scroll to current index when button/dot is clicked
  // Sprint 14.11: Mobile UX - gap ve padding hesaba katılarak scroll pozisyonu
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || activeAnnouncements.length <= 1) return;

    // Mobile'da gap (1rem = 16px) ve padding (1rem = 16px) hesaba katılmalı
    const isMobile = window.innerWidth < 768; // md breakpoint
    const gap = isMobile ? 16 : 0; // gap-4 = 1rem = 16px (mobile only)
    const padding = isMobile ? 16 : 0; // px-4 = 1rem = 16px (mobile only)
    const cardWidth = isMobile 
      ? container.offsetWidth - (padding * 2) // Mobile: container width - padding
      : container.offsetWidth; // Desktop: container width = card width (w-full)
    
    const scrollLeft = currentIndex * (cardWidth + gap) + padding;
    
    container.scrollTo({
      left: scrollLeft,
      behavior: 'smooth',
    });
  }, [currentIndex, activeAnnouncements.length]);

  // Sprint 14.4: Update currentIndex based on scroll position (user manual scroll)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || activeAnnouncements.length <= 1) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      // Debounce scroll events
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Sprint 14.11: Mobile UX - gap ve padding hesaba katılarak scroll pozisyonu
        const isMobile = window.innerWidth < 768; // md breakpoint
        const gap = isMobile ? 16 : 0; // gap-4 = 1rem = 16px (mobile only)
        const padding = isMobile ? 16 : 0; // px-4 = 1rem = 16px (mobile only)
        const cardWidth = isMobile 
          ? container.offsetWidth - (padding * 2) // Mobile: container width - padding
          : container.offsetWidth; // Desktop: container width = card width (w-full)
        
        const scrollLeft = container.scrollLeft;
        const adjustedScrollLeft = scrollLeft - padding;
        const newIndex = Math.round(adjustedScrollLeft / (cardWidth + gap));
        
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < activeAnnouncements.length) {
          setCurrentIndex(newIndex);
        }
      }, 150);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [activeAnnouncements.length, currentIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeAnnouncements.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeAnnouncements.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleCardClick = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
  };

  if (activeAnnouncements.length === 0) {
    return (
      <div className="bg-orange-50 border-y border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-gray-500">
            Şu an güncel duyuru bulunmuyor.
            {announcements.length > 0 && (
              <span className="block mt-1 text-xs">
                (Toplam {announcements.length} duyuru var, ancak hiçbiri aktif değil)
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Sprint 14.11: Mobile UX - CTA section taşmasını önlemek için margin-bottom */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-y border-orange-200 mb-8 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Megaphone className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">Güncel Duyurular</h2>
            </div>
            {/* Sprint 14.4: Navigation controls */}
            {activeAnnouncements.length > 1 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevious}
                  className="p-2 rounded-lg bg-white/80 hover:bg-white border border-orange-200 transition-colors"
                  aria-label="Önceki duyuru"
                >
                  <ChevronLeft className="w-5 h-5 text-orange-600" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-lg bg-white/80 hover:bg-white border border-orange-200 transition-colors"
                  aria-label="Sonraki duyuru"
                >
                  <ChevronRight className="w-5 h-5 text-orange-600" />
                </button>
              </div>
            )}
          </div>

          {/* Sprint 14.4: Slider container - Her kaymada 1 duyuru, büyük kartlar, eşit yükseklik */}
          {/* Sprint 14.11: Mobile UX düzeltmeleri - snap alignment, kart boyutu, CTA taşma */}
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 gap-4 px-4 md:px-0"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none'
              }}
            >
              {activeAnnouncements.map((announcement) => {
                // Kartlarda: özet varsa özet göster, yoksa içerik göster
                const displayText = announcement.summary?.trim() || announcement.content.trim();
                // İçeriği kısalt (çok uzunsa)
                const truncatedText = displayText.length > 300 
                  ? displayText.substring(0, 300) + '...' 
                  : displayText;

                return (
                  <div
                    key={announcement.id}
                    className="flex-shrink-0 w-[calc(100%-2rem)] md:w-full snap-start snap-align-start"
                  >
                    <div 
                      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 md:p-8 lg:p-10 border-2 border-orange-100 hover:border-orange-300 h-[280px] md:h-[320px] flex flex-col cursor-pointer"
                      onClick={() => handleCardClick(announcement)}
                    >
                      {/* Header */}
                      <div className="flex items-start space-x-3 md:space-x-4 mb-4 md:mb-6">
                        {announcement.isPinned && (
                          <Pin className="w-5 h-5 md:w-6 md:h-6 text-orange-500 flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight line-clamp-2">
                            {announcement.title}
                          </h3>
                        </div>
                      </div>

                      {/* Content - Özet yoksa içerik gösteriliyor, eşit yükseklik için flex-1 */}
                      <div className="flex-1 mb-4 md:mb-6 overflow-hidden">
                        <p className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed line-clamp-4 md:line-clamp-5">
                          {truncatedText}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 md:pt-6 border-t-2 border-orange-50 flex-shrink-0">
                        <span className="text-xs md:text-sm lg:text-base text-gray-600 font-medium">
                          {(() => {
                            const date = new Date(announcement.createdAt);
                            const day = String(date.getDate()).padStart(2, '0');
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const year = date.getFullYear();
                            return `${day}.${month}.${year}`;
                          })()}
                        </span>
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-orange-500 flex-shrink-0" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sprint 14.4: Dot indicators */}
          {activeAnnouncements.length > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-4">
              {activeAnnouncements.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                    ? "w-8 bg-orange-600"
                    : "w-2 bg-orange-300 hover:bg-orange-400"
                  }`}
                  aria-label={`Duyuru ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedAnnouncement && (
        <AnnouncementModal
          announcement={selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
        />
      )}
    </>
  );
}
