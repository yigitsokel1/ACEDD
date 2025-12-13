"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui";
import { useEvents } from "@/contexts/EventsContext";
import { logClientError } from "@/lib/utils/clientLogging";

export function EventsGrid() {
  const { events } = useEvents();
  const [imageUrls, setImageUrls] = useState<{[key: string]: string}>({});
  const [currentImageIndex, setCurrentImageIndex] = useState<{[key: string]: number}>({});

  // Veri setinden görsel URL'ini çek
  const fetchImageUrl = async (datasetId: string) => {
    if (imageUrls[datasetId]) return imageUrls[datasetId];
    
    try {
      const response = await fetch(`/api/datasets/image/${datasetId}`);
      if (response.ok) {
        const data = await response.json();
        setImageUrls(prev => ({ ...prev, [datasetId]: data.fileUrl }));
        return data.fileUrl;
      } else {
        logClientError("[EventsGrid][FETCH_IMAGE]", new Error(`Failed to fetch image: ${response.status} ${response.statusText}`), { datasetId, status: response.status });
      }
    } catch (error) {
      logClientError("[EventsGrid][FETCH_IMAGE]", error, { datasetId });
    }
    return null;
  };

  // Etkinlikler yüklendiğinde görselleri çek
  useEffect(() => {
    events.forEach(event => {
      // Featured image'ı yükle
      if (event.featuredImage && !imageUrls[event.featuredImage]) {
        fetchImageUrl(event.featuredImage);
      }
      // Tüm etkinlik fotoğraflarını yükle
      if (event.images && event.images.length > 0) {
        event.images.forEach(imageId => {
          if (!imageUrls[imageId]) {
            fetchImageUrl(imageId);
          }
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Fotoğraf kaydırma fonksiyonları
  const nextImage = (eventId: string, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [eventId]: ((prev[eventId] || 0) + 1) % totalImages
    }));
  };

  const prevImage = (eventId: string, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [eventId]: ((prev[eventId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  const goToImage = (eventId: string, index: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [eventId]: index
    }));
  };

  return (
    <section id="events" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Etkinlik Timeline - Alternatif Tasarım */}
        <div className="space-y-20">
          {events.map((event, index) => (
            <div key={event.id} className={`group relative flex flex-col lg:flex-row ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-16 hover:scale-105 transition-all duration-500`}>
              {/* Görsel Bölümü - Kaydırılabilir */}
              <div className="flex-1 relative">
                <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl group">
                  {/* Fotoğraf Carousel */}
                  <div className="relative w-full h-full overflow-hidden">
                    {(() => {
                      const allImages = event.featuredImage ? [event.featuredImage, ...(event.images || [])] : (event.images || []);
                      return allImages.length > 0;
                    })() ? (
                      <div className="relative w-full h-full">
                        {/* Mevcut Görsel */}
                        {(() => {
                          const currentIndex = currentImageIndex[event.id] || 0;
                          // Önce featured image'ı kontrol et, sonra images array'ini kullan
                          const allImages = event.featuredImage ? [event.featuredImage, ...(event.images || [])] : (event.images || []);
                          const currentImageId = allImages[currentIndex];
                          const imageUrl = currentImageId ? imageUrls[currentImageId] : null;
                          
                          if (imageUrl) {
                            return (
                              <Image
                                src={imageUrl}
                                alt={`${event.title} - Fotoğraf ${currentIndex + 1}`}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                            );
                          } else {
                            return (
                              <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                  <Calendar className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                                  <p className="text-xl font-medium">Yükleniyor...</p>
                                </div>
                              </div>
                            );
                          }
                        })()}
                        
                        {/* Kaydırma Okları */}
                        {(() => {
                          const allImages = event.featuredImage ? [event.featuredImage, ...(event.images || [])] : (event.images || []);
                          return allImages && allImages.length > 1 && (
                            <>
                              {/* Sol Ok */}
                              <button
                                onClick={() => prevImage(event.id, allImages.length)}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
                              >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                              
                              {/* Sağ Ok */}
                              <button
                                onClick={() => nextImage(event.id, allImages.length)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
                              >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </>
                          );
                        })()}
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <Calendar className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                          <p className="text-xl font-medium">Görsel Yok</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  
                  {/* Badges */}
                  <div className="absolute top-6 right-6 flex justify-end">
                    <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full text-sm font-semibold shadow-lg">
                      📸 {(() => {
                        const allImages = event.featuredImage ? [event.featuredImage, ...(event.images || [])] : (event.images || []);
                        return allImages.length;
                      })()}
                    </span>
                  </div>

                  {/* Kaydırma İndikatörleri */}
                  {(() => {
                    const allImages = event.featuredImage ? [event.featuredImage, ...(event.images || [])] : (event.images || []);
                    return allImages && allImages.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {allImages.slice(0, 5).map((_, dotIndex) => {
                          const currentIndex = currentImageIndex[event.id] || 0;
                          return (
                            <button
                              key={dotIndex}
                              onClick={() => goToImage(event.id, dotIndex)}
                              className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-125 ${
                                dotIndex === currentIndex ? 'bg-white' : 'bg-white/50'
                              }`}
                            />
                          );
                        })}
                        {allImages.length > 5 && (
                          <div className="w-2 h-2 rounded-full bg-white/30 flex items-center justify-center">
                            <span className="text-xs text-white">+{allImages.length - 5}</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                </div>
                
                {/* Dekoratif Element */}
                <div className={`absolute -top-4 ${index % 2 === 0 ? '-right-4' : '-left-4'} w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-lg`}></div>
              </div>

              {/* İçerik Bölümü - Tıklanabilir */}
              <Link href={`/etkinlikler/${event.id}`} className="flex-1 space-y-6 cursor-pointer hover:bg-gray-50 rounded-2xl p-6 transition-all duration-300 group-hover:bg-gray-50/50">
                {/* Tarih ve Öne Çıkan Badge */}
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-lg font-bold shadow-lg">
                    <Calendar className="w-6 h-6 mr-3" />
                    {formatDate(event.date)}
                  </div>
                  {event.isFeatured && (
                    <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 rounded-full text-lg font-bold shadow-lg">
                      <span className="mr-2">⭐</span>
                      Öne Çıkan
                    </div>
                  )}
                </div>

                {/* Başlık ve Açıklama */}
                <div className="space-y-4">
                  <h3 className="text-4xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {event.title}
                  </h3>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    {event.shortDescription}
                  </p>
                </div>

                {/* Konum Bilgisi */}
                <div className="flex items-center space-x-4 text-lg text-gray-700 bg-gray-50 rounded-2xl p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Etkinlik Konumu</p>
                    <p className="font-semibold text-lg">{event.location}</p>
                  </div>
                </div>

                {/* Detay Butonu */}
                <div className="pt-4">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105 text-lg">
                    <ExternalLink className="w-6 h-6 mr-3" />
                    Etkinlik Detayları
                  </Button>
                </div>
              </Link>

              {/* Timeline Çizgisi */}
              {index < events.length - 1 && (
                <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-2 h-32 bg-gradient-to-b from-blue-400 via-indigo-400 to-blue-300 rounded-full shadow-lg"></div>
              )}
            </div>
          ))}
        </div>

        {/* Sonuç Bulunamadı */}
        {events.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Etkinlik Bulunamadı
            </h3>
            <p className="text-gray-600">
              Seçtiğiniz kriterlere uygun etkinlik bulunmamaktadır.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}