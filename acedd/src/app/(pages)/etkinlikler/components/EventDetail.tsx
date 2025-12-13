"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Camera, ArrowLeft, ChevronLeft, ChevronRight, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui";
import { useEvents } from "@/contexts/EventsContext";
import { logClientError } from "@/lib/utils/clientLogging";

interface EventDetailProps {
  eventId: string;
}

export function EventDetail({ eventId }: EventDetailProps) {
  const { getEventById } = useEvents();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState<{[key: string]: string}>({});
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  
  const event = getEventById(eventId);

  // Veri setinden görsel URL'ini çek
  const fetchImageUrl = async (datasetId: string) => {
    if (imageUrls[datasetId]) return imageUrls[datasetId];
    
    try {
      const response = await fetch(`/api/datasets/image/${datasetId}`);
      if (response.ok) {
        const data = await response.json();
        setImageUrls(prev => ({ ...prev, [datasetId]: data.fileUrl }));
        return data.fileUrl;
      }
    } catch (error) {
      logClientError("[EventDetail][FETCH_IMAGE]", error, { datasetId });
    }
    return null;
  };

  // Etkinlik yüklendiğinde görselleri çek
  useEffect(() => {
    if (event) {
      if (event.featuredImage && !imageUrls[event.featuredImage]) {
        fetchImageUrl(event.featuredImage);
      }
      if (event.images) {
        event.images.forEach(imageId => {
          if (imageId && !imageUrls[imageId]) {
            fetchImageUrl(imageId);
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center p-8 max-w-md mx-auto">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Calendar className="w-12 h-12 text-blue-500" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Etkinlik Bulunamadı</h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Aradığınız etkinlik mevcut değil veya kaldırılmış olabilir.
          </p>
          <Link href="/etkinlikler">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <ArrowLeft className="w-5 h-5 mr-3" />
              Etkinliklere Dön
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const allImages = event.featuredImage ? [event.featuredImage, ...(event.images || [])] : (event.images || []);

  // Markdown renderer
  const renderMarkdown = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        // Başlıklar
        // Sprint 14.7: H1/H2 render CSS ayarları - layout bozulmasını önle, responsive ayarlar
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-bold mt-8 mb-4 text-gray-900">{line.substring(4)}</h3>;
        }
        if (line.startsWith('## ')) {
          // Sprint 14.7: H2 için tutarlı spacing ve responsive ayarlar
          return <h2 key={index} className="text-2xl md:text-3xl font-bold mt-8 md:mt-10 mb-4 md:mb-6 text-gray-900 leading-tight">{line.substring(3)}</h2>;
        }
        if (line.startsWith('# ')) {
          // Sprint 14.7: H1 için layout bozulmasını önleyen responsive ayarlar
          return <h1 key={index} className="text-2xl md:text-3xl lg:text-4xl font-bold mt-6 md:mt-8 lg:mt-10 mb-4 md:mb-6 lg:mb-8 text-gray-900 leading-tight break-words">{line.substring(2)}</h1>;
        }
        
        // Yatay çizgi
        if (line.trim() === '---') {
          return <hr key={index} className="my-8 border-gray-300" />;
        }
        
        // Alıntı
        if (line.startsWith('> ')) {
          return <blockquote key={index} className="border-l-4 border-blue-500 pl-6 italic text-gray-700 my-6 bg-blue-50 py-4 rounded-r-lg">{line.substring(2)}</blockquote>;
        }
        
        // Liste
        if (line.startsWith('- ')) {
          return <li key={index} className="ml-6 mb-2 text-gray-700">{line.substring(2)}</li>;
        }
        
        // Boş satır
        if (line.trim() === '') {
          return <br key={index} />;
        }
        
        // Normal paragraf (kalın ve italik formatlaması)
        const formattedLine = line
          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em class="italic text-gray-600">$1</em>');
        
        return <p key={index} className="mb-4 text-lg text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
      });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/etkinlikler">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Etkinliklere Dön
              </Button>
            </Link>
            
            <div className="flex items-center space-x-2">
              {event.isFeatured && (
                <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 rounded-full text-sm font-semibold">
                  ⭐ Öne Çıkan
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Event Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            {event.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            {event.shortDescription}
          </p>

          {/* Event Meta */}
          <div className="flex flex-wrap justify-center gap-6 text-lg">
            <div className="flex items-center space-x-3 bg-gray-50 rounded-2xl px-8 py-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <span className="font-semibold text-gray-900">{formatDate(event.date)}</span>
            </div>
            
            <div className="flex items-center space-x-3 bg-gray-50 rounded-2xl px-8 py-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <span className="font-semibold text-gray-900">{event.location}</span>
            </div>

            <div className="flex items-center space-x-3 bg-gray-50 rounded-2xl px-8 py-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-purple-600" />
              </div>
              <span className="font-semibold text-gray-900">{allImages.length} Fotoğraf</span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            {renderMarkdown(event.description)}
          </div>
        </article>

        {/* Photo Gallery */}
        {allImages.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Fotoğraf Galerisi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allImages.map((imageId, index) => {
                const imageUrl = imageUrls[imageId];
                return (
                  <div
                    key={imageId}
                    className={`relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-300 ${
                      index === selectedImageIndex ? 'ring-4 ring-blue-500' : ''
                    }`}
                    onClick={() => {
                      setSelectedImageIndex(index);
                      setIsImageModalOpen(true);
                    }}
                  >
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={`${event.title} - Fotoğraf ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <Camera className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">Yükleniyor...</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                          <ExternalLink className="w-6 h-6 text-gray-700" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-full">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 w-12 h-12 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full flex items-center justify-center shadow-lg z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            {allImages.length > 0 && imageUrls[allImages[selectedImageIndex]] && (
              <Image
                src={imageUrls[allImages[selectedImageIndex]]}
                alt={event.title}
                width={1200}
                height={800}
                className="rounded-2xl shadow-2xl max-h-[80vh] object-contain"
              />
            )}
            
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full flex items-center justify-center shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev + 1) % allImages.length)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full flex items-center justify-center shadow-lg"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Modal Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium">
              {selectedImageIndex + 1} / {allImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}