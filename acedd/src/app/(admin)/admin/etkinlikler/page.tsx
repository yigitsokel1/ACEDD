"use client";

import React, { useState } from "react";
import { Plus, Calendar, MapPin, Save } from "lucide-react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Textarea } from "@/components/ui";
import { FileUpload } from "@/components/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { type Event } from "@/app/(pages)/etkinlikler/constants";
import { useEvents } from "@/contexts/EventsContext";
import { logClientError } from "@/lib/utils/clientLogging";

export default function EventsAdminPage() {
  const { events, addEvent, updateEvent, deleteEvent, loading, error } = useEvents();
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortDescription: "",
    date: "",
    location: "",
    images: [] as string[], // Dataset ID'leri (mevcut görseller)
    featuredImage: "", // Dataset ID (mevcut görsel)
    isFeatured: false,
  });

  // Yeni seçilmiş görseller (henüz database'e kaydedilmemiş)
  const [previewFiles, setPreviewFiles] = useState<{
    featured?: { id: string; preview: string; file: File };
    images?: { id: string; preview: string; file: File }[];
  }>({});

  // Preview dosyalarını database'e kaydet
  const uploadPreviewFiles = async (files: { id: string; preview: string; file: File }[]): Promise<string[]> => {
    const datasetIds: string[] = [];
    
    for (const fileData of files) {
      const formData = new FormData();
      formData.append('file', fileData.file);
      
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          let errorMessage = 'Dosya yüklenirken bir hata oluştu.';
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch {
            errorMessage = `${errorMessage} (${response.status}: ${response.statusText})`;
          }
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        if (data.datasetIds && Array.isArray(data.datasetIds) && data.datasetIds.length > 0) {
          datasetIds.push(data.datasetIds[0]);
        }
      } catch (error) {
        logClientError("[EventsAdminPage][UPLOAD_PREVIEW]", error);
        throw error;
      }
    }
    
    return datasetIds;
  };

  const handleInputChange = (field: string, value: string | number | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Metin editörü fonksiyonları
  const insertText = (before: string, after: string) => {
    const textarea = document.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = formData.description.substring(start, end);
      const newText = formData.description.substring(0, start) + before + selectedText + after + formData.description.substring(end);
      
      handleInputChange("description", newText);
      
      // Cursor pozisyonunu ayarla
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, end + before.length);
      }, 0);
    }
  };

  // Basit markdown renderer - Sprint 14.4: EventDetail ile tutarlı CSS class'ları
  const renderMarkdown = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        // Başlıklar - Sprint 14.4: H1/H2/H3 EventDetail ile aynı stil
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-bold mt-8 mb-4 text-gray-900">{line.substring(4)}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold mt-10 mb-6 text-gray-900">{line.substring(3)}</h2>;
        }
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold mt-12 mb-8 text-gray-900">{line.substring(2)}</h1>;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim() || !formData.description.trim() || !formData.shortDescription.trim() || !formData.date || !formData.location.trim()) {
      alert("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    try {
      // Önce preview dosyalarını database'e kaydet
      let finalImages = [...formData.images];
      let finalFeaturedImage = formData.featuredImage;

      // Preview görsellerini kaydet
      if (previewFiles.images && previewFiles.images.length > 0) {
        const uploadedIds = await uploadPreviewFiles(previewFiles.images);
        finalImages = [...finalImages, ...uploadedIds];
      }

      // Preview featured image'i kaydet
      if (previewFiles.featured) {
        const uploadedIds = await uploadPreviewFiles([previewFiles.featured]);
        if (uploadedIds.length > 0) {
          finalFeaturedImage = uploadedIds[0];
        }
      }

      // Convert date to ISO string format
      const dateISO = new Date(formData.date).toISOString();
      
      // Prepare event data for API
      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        shortDescription: formData.shortDescription.trim(),
        date: dateISO, // ISO 8601 string
        location: formData.location.trim(),
        images: finalImages,
        featuredImage: finalFeaturedImage && finalFeaturedImage.trim() ? finalFeaturedImage.trim() : null, // Convert empty string to null
        isFeatured: formData.isFeatured,
      };

      if (editingEvent) {
        await updateEvent(editingEvent.id, eventData);
        setEditingEvent(null);
      } else {
        await addEvent(eventData);
      }
      
      // Formu sıfırla
      setFormData({
        title: "",
        description: "",
        shortDescription: "",
        date: "",
        location: "",
        images: [],
        featuredImage: "",
        isFeatured: false,
      });
      setPreviewFiles({});
      setIsAddingEvent(false);
    } catch (error) {
      logClientError("[EventsAdminPage][SAVE]", error);
      alert(error instanceof Error ? error.message : 'Etkinlik kaydedilirken bir hata oluştu.');
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    
    // Convert ISO date string to date input format (YYYY-MM-DD)
    const dateInput = event.date ? new Date(event.date).toISOString().split('T')[0] : "";
    
    setFormData({
      title: event.title,
      description: event.description,
      shortDescription: event.shortDescription,
      date: dateInput,
      location: event.location,
      images: event.images || [],
      featuredImage: event.featuredImage || "", // Convert null to empty string for form
      isFeatured: event.isFeatured,
    });
    setIsAddingEvent(true);
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm("Bu etkinliği silmek istediğinize emin misiniz?")) {
      return;
    }
    
    try {
      await deleteEvent(eventId);
    } catch (error) {
      logClientError("[EventsAdminPage][DELETE]", error);
      alert(error instanceof Error ? error.message : 'Etkinlik silinirken bir hata oluştu.');
    }
  };

  const handleCancel = () => {
    setIsAddingEvent(false);
    setEditingEvent(null);
    setFormData({
      title: "",
      description: "",
      shortDescription: "",
      date: "",
      location: "",
      images: [],
      featuredImage: "",
      isFeatured: false,
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Etkinlik Yönetimi</h1>
          <p className="text-gray-600">Etkinlikleri ekleyin, düzenleyin ve yönetin</p>
          {error && (
            <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              Hata: {error}
            </div>
          )}
        </div>
        <Button
          onClick={() => setIsAddingEvent(true)}
          className="flex items-center space-x-2"
          disabled={loading}
        >
          <Plus className="w-4 h-4" />
          <span>{loading ? 'Yükleniyor...' : 'Yeni Etkinlik'}</span>
        </Button>
      </div>

      {/* Etkinlik Ekleme/Düzenleme Formu */}
      {isAddingEvent && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {editingEvent ? "Etkinlik Düzenle" : "Yeni Etkinlik Ekle"}
            </CardTitle>
            <CardDescription>
              Etkinlik bilgilerini doldurun ve kaydedin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Temel Bilgiler */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Etkinlik Başlığı"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
                <Input
                  label="Kısa Açıklama"
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                  required
                />
              </div>

              {/* Gelişmiş Metin Editörü */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Detaylı Açıklama (Makale Formatında)
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  {/* Toolbar */}
                  <div className="bg-gray-50 border-b border-gray-200 p-3 flex items-center space-x-2 flex-wrap gap-2">
                    <button
                      type="button"
                      className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                      onClick={() => insertText('**', '**')}
                    >
                      <strong>B</strong>
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                      onClick={() => insertText('*', '*')}
                    >
                      <em>I</em>
                    </button>
                    {/* Sprint 14.4: H1/H2 heading butonları eklendi */}
                    <button
                      type="button"
                      className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                      onClick={() => insertText('# ', '\n')}
                      title="H1 Başlık"
                    >
                      H1
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                      onClick={() => insertText('## ', '\n')}
                      title="H2 Başlık"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                      onClick={() => insertText('### ', '\n')}
                      title="H3 Başlık"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                      onClick={() => insertText('---\n', '')}
                    >
                      HR
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                      onClick={() => insertText('- ', '')}
                    >
                      List
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                      onClick={() => insertText('> ', '')}
                    >
                      Quote
                    </button>
                  </div>
                  
                  {/* Textarea */}
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={12}
                    className="border-0 resize-none focus:ring-0"
                    placeholder="Makale içeriğinizi buraya yazın...&#10;&#10;Örnek:&#10;### Başlık&#10;Bu bir **kalın** ve *italik* metin örneğidir.&#10;&#10;- Liste öğesi 1&#10;- Liste öğesi 2&#10;&#10;> Bu bir alıntı örneğidir.&#10;&#10;---&#10;&#10;Yeni bölüm başlıyor..."
                    required
                  />
                </div>
                
                {/* Preview */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Önizleme:</h4>
                  <div className="border border-gray-200 rounded-lg p-4 bg-white max-h-64 overflow-y-auto">
                    {/* Sprint 14.4: EventDetail ile aynı container styling */}
                    <div className="prose prose-lg max-w-none">
                      {renderMarkdown(formData.description)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tarih ve Konum */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Tarih"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  required
                />
                <Input
                  label="Konum"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  required
                />
              </div>


              {/* Görseller */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Görsel Yükleme</h3>
                  
                  {/* Öne Çıkan Görsel */}
                  <FileUpload
                    label="Öne Çıkan Görsel"
                    value={formData.featuredImage ? [formData.featuredImage] : []}
                    onChange={(urls) => handleInputChange("featuredImage", urls[0] || "")}
                    onFileSelect={(files) => {
                      if (files.length > 0) {
                        setPreviewFiles(prev => ({ ...prev, featured: files[0] }));
                      } else {
                        setPreviewFiles(prev => {
                          const newFiles = { ...prev };
                          delete newFiles.featured;
                          return newFiles;
                        });
                      }
                    }}
                    multiple={false}
                    maxFiles={1}
                    previewMode={true}
                    className="mb-6"
                  />
                  
                  {/* Etkinlik Görselleri */}
                  <FileUpload
                    label="Etkinlik Görselleri"
                    value={formData.images}
                    onChange={(urls) => handleInputChange("images", urls)}
                    onFileSelect={(files) => {
                      setPreviewFiles(prev => ({ ...prev, images: files }));
                    }}
                    multiple={true}
                    maxFiles={10}
                    previewMode={true}
                    className="mb-6"
                  />
                </div>
                
              </div>


              {/* Öne Çıkan Etkinlik */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => handleInputChange("isFeatured", e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                  Öne Çıkan Etkinlik
                </label>
              </div>


              {/* Form Butonları */}
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  İptal
                </Button>
                <Button type="submit" className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>{editingEvent ? "Güncelle" : "Kaydet"}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Etkinlik Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{event.shortDescription}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(event)}
                  >
                    Düzenle
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(event.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Sil
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{(() => {
                    const date = new Date(event.date);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}.${month}.${year}`;
                  })()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {events.length === 0 && !isAddingEvent && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz etkinlik yok</h3>
          <p className="text-gray-600 mb-4">İlk etkinliğinizi eklemek için yukarıdaki butona tıklayın.</p>
        </div>
      )}
    </div>
  );
}