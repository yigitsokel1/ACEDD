"use client";

import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { Image as ImageIcon, Plus, X, UploadCloud, Loader2, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { logClientError } from '@/lib/utils/clientLogging';

interface FileUploadProps {
  label: string;
  value?: string[]; // Dataset ID'leri (mevcut görseller için)
  onChange: (datasetIds: string[]) => void;
  onFileSelect?: (files: { id: string; preview: string; file: File }[]) => void; // Yeni seçilmiş görseller için (preview için)
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
  previewMode?: boolean; // true ise sadece preview, database'e kaydetme
  accept?: string; // Sprint 17: File accept attribute (e.g., "application/pdf", "image/*")
}

export function FileUpload({ 
  label, 
  value = [], 
  onChange, 
  onFileSelect,
  multiple = false, 
  maxFiles = 1, 
  className,
  previewMode = false, // Preview mode: sadece önizle, database'e kaydetme
  accept = "image/*", // Sprint 17: Default image/*, PDF için "application/pdf"
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<{[key: string]: string | null}>({});
  const [fileNames, setFileNames] = useState<{[key: string]: string | null}>({}); // Sprint 17: PDF dosya adları için
  const [previewFiles, setPreviewFiles] = useState<{[key: string]: { preview: string; file: File }}>({}); // Yeni seçilmiş görseller için preview (Base64 data URL + File objesi)
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Veri setinden görsel URL'ini ve dosya bilgilerini çek
  const fetchImageUrl = async (datasetId: string) => {
    if (imageUrls[datasetId] && fileNames[datasetId]) return imageUrls[datasetId];
    
    try {
      const response = await fetch(`/api/datasets/image/${datasetId}`);
      if (response.ok) {
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          logClientError("[FileUpload][FETCH_IMAGE]", new Error("Invalid response type from image API"), { contentType, datasetId });
          setImageUrls(prev => ({ ...prev, [datasetId]: null }));
          setFileNames(prev => ({ ...prev, [datasetId]: null }));
          return null;
        }
        
        const data = await response.json();
        if (data.fileUrl) {
          // Validate Base64 data URL format
          const fileUrl = data.fileUrl;
          const isImage = fileUrl.startsWith('data:image/');
          const isPdf = fileUrl.startsWith('data:application/pdf');
          
          if (isImage || isPdf || fileUrl.startsWith('data:')) {
            setImageUrls(prev => ({ ...prev, [datasetId]: fileUrl }));
            // Sprint 17: PDF için dosya adını da kaydet
            if (data.fileName) {
              setFileNames(prev => ({ ...prev, [datasetId]: data.fileName }));
            }
            return fileUrl;
          } else {
            logClientError("[FileUpload][FETCH_IMAGE]", new Error("Invalid fileUrl format (not a data URL)"), { datasetId, fileUrlPreview: fileUrl.substring(0, 100) });
            setImageUrls(prev => ({ ...prev, [datasetId]: null }));
            setFileNames(prev => ({ ...prev, [datasetId]: null }));
          }
        } else {
          logClientError("[FileUpload][FETCH_IMAGE]", new Error("Invalid response format from image API"), { datasetId, responseData: data });
          setImageUrls(prev => ({ ...prev, [datasetId]: null }));
          setFileNames(prev => ({ ...prev, [datasetId]: null }));
        }
      } else {
        logClientError("[FileUpload][FETCH_IMAGE]", new Error(`Failed to fetch image: ${response.status} ${response.statusText}`), { datasetId, status: response.status });
        // Hata durumunda placeholder göster
        setImageUrls(prev => ({ ...prev, [datasetId]: null }));
        setFileNames(prev => ({ ...prev, [datasetId]: null }));
      }
    } catch (error) {
      logClientError("[FileUpload][FETCH_IMAGE]", error, { datasetId });
      // Hata durumunda placeholder göster
      setImageUrls(prev => ({ ...prev, [datasetId]: null }));
      setFileNames(prev => ({ ...prev, [datasetId]: null }));
    }
    return null;
  };

  // Component mount olduğunda mevcut dataset ID'lerini çek
  React.useEffect(() => {
    value.forEach(datasetId => {
      if (datasetId && datasetId.trim() && !imageUrls[datasetId]) {
        fetchImageUrl(datasetId);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (!multiple && files.length > 1) {
      setUploadError("Sadece bir dosya yükleyebilirsiniz.");
      return;
    }
    
    const totalFiles = previewMode ? files.length : (files.length + value.length);
    if (multiple && totalFiles > maxFiles) {
      setUploadError(`En fazla ${maxFiles} dosya yükleyebilirsiniz.`);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    // Preview mode: Sadece Base64'e çevir, database'e kaydetme
    if (previewMode && onFileSelect) {
      try {
        // Tüm dosyaları paralel olarak işle
        const filePromises = Array.from(files).map(async (file, index) => {
          // Dosya türünü kontrol et
          if (!file.type.startsWith('image/')) {
            throw new Error('Sadece görsel dosyaları yükleyebilirsiniz.');
          }

          // Dosya boyutunu kontrol et (5MB limit)
          if (file.size > 5 * 1024 * 1024) {
            throw new Error('Dosya boyutu 5MB\'dan küçük olmalıdır.');
          }

          // FileReader ile Base64'e çevir (browser uyumlu)
          return new Promise<{ id: string; preview: string; file: File }>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const dataUrl = reader.result as string;
              const tempId = `preview-${Date.now()}-${index}`;
              resolve({ id: tempId, preview: dataUrl, file });
            };
            reader.onerror = () => reject(new Error('Dosya okunurken bir hata oluştu.'));
            reader.readAsDataURL(file);
          });
        });

        const results = await Promise.all(filePromises);
        
        // Preview dosyalarını state'e ekle
        results.forEach(({ id, preview, file }) => {
          setPreviewFiles(prev => ({ ...prev, [id]: { preview, file } }));
        });
        
        // Callback'e gönder
        onFileSelect(results);
        setUploadError(null);
      } catch (error) {
        logClientError("[FileUpload][PROCESS_PREVIEW]", error);
        setUploadError(error instanceof Error ? error.message : 'Dosyalar işlenirken bir hata oluştu.');
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
      return;
    }

    // Normal mode: Database'e kaydet
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
        // Try to parse error response as JSON
        let errorMessage = 'Dosya yüklenirken bir hata oluştu.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          // If response is not JSON (e.g., HTML error page), use status text
          errorMessage = `${errorMessage} (${response.status}: ${response.statusText})`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (!data.datasetIds || !Array.isArray(data.datasetIds)) {
        throw new Error('Invalid response format from server');
      }
      
      const newDatasetIds = multiple ? [...value, ...data.datasetIds] : data.datasetIds;
      onChange(newDatasetIds);
    } catch (error: unknown) {
      logClientError("[FileUpload][UPLOAD]", error);
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
    // Image URL ve dosya adı cache'den de kaldır
    setImageUrls(prev => {
      const newUrls = { ...prev };
      delete newUrls[datasetIdToRemove];
      return newUrls;
    });
    setFileNames(prev => {
      const newNames = { ...prev };
      delete newNames[datasetIdToRemove];
      return newNames;
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {/* Mevcut Dosyalar (Database'den) */}
      {value.length > 0 && (
        <div className={accept === "application/pdf" ? "space-y-2" : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"}>
          {value.map((datasetId, index) => {
            const imageUrl = imageUrls[datasetId];
            const fileName = fileNames[datasetId];
            const isPdf = accept === "application/pdf" || (imageUrl && imageUrl.startsWith('data:application/pdf'));
            
            // Sprint 17: PDF için dosya adı göster, görsel için preview göster
            if (isPdf) {
              return (
                <div key={datasetId} className="relative flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg group">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {fileName || `CV ${index + 1}`}
                    </p>
                    <p className="text-xs text-gray-500">PDF dosyası</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(datasetId)}
                    className="flex-shrink-0 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Dosyayı kaldır"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            }
            
            // Görsel dosyalar için mevcut preview
            return (
              <div key={datasetId} className="relative w-full h-32 rounded-lg overflow-hidden group">
                {imageUrl ? (
                  // Base64 data URL'ler için normal img tag kullan (Next.js Image desteklemiyor)
                  <img 
                    src={imageUrl} 
                    alt={`Yüklenen görsel ${index + 1}`} 
                    className="w-full h-full object-cover"
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

      {/* Preview Görselleri (Henüz database'e kaydedilmemiş) */}
      {previewMode && Object.keys(previewFiles).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Object.entries(previewFiles).map(([tempId, fileData], index) => (
            <div key={tempId} className="relative w-full h-32 rounded-lg overflow-hidden group">
              <img 
                src={fileData.preview} 
                alt={`Önizleme görsel ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setPreviewFiles(prev => {
                    const newFiles = { ...prev };
                    delete newFiles[tempId];
                    return newFiles;
                  });
                  // Callback'i güncelle (kaldırılan dosyayı çıkar)
                  if (onFileSelect) {
                    // State güncellenmeden önce mevcut dosyaları al
                    const currentFiles = Object.entries(previewFiles)
                      .filter(([id]) => id !== tempId)
                      .map(([id, data]) => ({ id, preview: data.preview, file: data.file }));
                    onFileSelect(currentFiles);
                  }
                }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Önizlemeyi kaldır"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
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
            accept={accept}
            className="hidden"
            disabled={isUploading}
          />
          <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
          <p className="text-sm font-medium mb-2">
            {multiple ? "Dosyaları buraya sürükleyin veya seçin" : accept === "application/pdf" ? "PDF dosyasını buraya sürükleyin veya seçin" : "Görseli buraya sürükleyin veya seçin"}
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
