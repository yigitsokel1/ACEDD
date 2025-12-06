"use client";

import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { Image as ImageIcon, Plus, X, UploadCloud, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  label: string;
  value?: string[]; // Artık dataset ID'leri
  onChange: (datasetIds: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
}

export function FileUpload({ 
  label, 
  value = [], 
  onChange, 
  multiple = false, 
  maxFiles = 1, 
  className 
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<{[key: string]: string | null}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        console.error('Failed to fetch image:', response.status, response.statusText);
        // Hata durumunda placeholder göster
        setImageUrls(prev => ({ ...prev, [datasetId]: null }));
      }
    } catch (error) {
      console.error('Error fetching image:', error);
      // Hata durumunda placeholder göster
      setImageUrls(prev => ({ ...prev, [datasetId]: null }));
    }
    return null;
  };

  // Component mount olduğunda mevcut dataset ID'lerini çek
  React.useEffect(() => {
    value.forEach(datasetId => {
      if (datasetId && !imageUrls[datasetId]) {
        fetchImageUrl(datasetId);
      }
    });
  }, [value]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (!multiple && files.length > 1) {
      setUploadError("Sadece bir dosya yükleyebilirsiniz.");
      return;
    }
    
    if (multiple && files.length + value.length > maxFiles) {
      setUploadError(`En fazla ${maxFiles} dosya yükleyebilirsiniz.`);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Dosya yüklenirken bir hata oluştu.');
      }

      const data = await response.json();
      const newDatasetIds = multiple ? [...value, ...data.datasetIds] : data.datasetIds;
      onChange(newDatasetIds);
    } catch (error: unknown) {
      console.error('Upload error:', error);
      setUploadError((error as Error)?.message || 'Dosya yüklenirken bir hata oluştu.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear the input
      }
    }
  };

  const handleRemoveImage = (datasetIdToRemove: string) => {
    onChange(value.filter(id => id !== datasetIdToRemove));
    // Image URL cache'den de kaldır
    setImageUrls(prev => {
      const newUrls = { ...prev };
      delete newUrls[datasetIdToRemove];
      return newUrls;
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {/* Mevcut Görseller */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {value.map((datasetId, index) => {
            const imageUrl = imageUrls[datasetId];
            return (
              <div key={datasetId} className="relative w-full h-32 rounded-lg overflow-hidden group">
                {imageUrl ? (
                  <Image 
                    src={imageUrl} 
                    alt={`Yüklenen görsel ${index + 1}`} 
                    fill 
                    className="object-cover" 
                  />
                ) : imageUrls[datasetId] === null ? (
                  <div className="w-full h-full bg-red-100 flex items-center justify-center">
                    <div className="text-center text-red-600">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 text-red-400" />
                      <p className="text-xs">Yüklenemedi</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <div className="text-center text-gray-600">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-xs">Yükleniyor...</p>
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(datasetId)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Görseli kaldır"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Yükleme Alanı */}
      {(multiple || value.length === 0) && (
        <div
          className={cn(
            "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg text-gray-600",
            isUploading ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          )}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple={multiple}
            accept="image/*"
            className="hidden"
            disabled={isUploading}
          />
          <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
          <p className="text-sm font-medium mb-2">
            {multiple ? "Görselleri buraya sürükleyin veya seçin" : "Görseli buraya sürükleyin veya seçin"}
          </p>
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            variant="outline"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Yükleniyor...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                {multiple ? "Görsel Seç" : "Görsel Seç"}
              </>
            )}
          </Button>
          {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
          {maxFiles && multiple && (
            <p className="text-xs text-gray-500 mt-2">
              En fazla {maxFiles} dosya yükleyebilirsiniz.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
