# 📁 Modüler Klasör Yapısı

## 🎯 **Önerilen Yapı**

```
src/
├── app/                          # Next.js App Router
│   ├── (pages)/                  # Sayfa grupları
│   │   ├── home/                 # Ana sayfa
│   │   │   ├── components/       # Sayfaya özel component'ler
│   │   │   ├── hooks/           # Sayfaya özel hook'lar
│   │   │   ├── types/           # Sayfaya özel tipler
│   │   │   ├── constants/       # Sayfaya özel sabitler
│   │   │   └── page.tsx         # Ana sayfa
│   │   ├── about/               # Hakkımızda
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── types/
│   │   │   ├── constants/
│   │   │   └── page.tsx
│   │   ├── services/            # Hizmetlerimiz
│   │   ├── board/               # Yönetim Kurulu
│   │   ├── contact/             # İletişim
│   │   └── scholarship/         # Burs Başvuru
│   ├── globals.css
│   └── layout.tsx
├── components/                   # Paylaşılan component'ler
│   ├── ui/                      # Temel UI component'leri
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Icon/
│   │   └── index.ts
│   ├── layout/                  # Layout component'leri
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── index.ts
│   └── common/                  # Ortak component'ler
│       ├── StatCard/
│       ├── MissionCard/
│       └── index.ts
├── lib/                         # Yardımcı kütüphaneler
│   ├── utils/                   # Yardımcı fonksiyonlar
│   ├── constants/               # Global sabitler
│   ├── types/                   # Global tipler
│   └── hooks/                   # Global hook'lar
└── styles/                      # Stil dosyaları
    ├── globals.css
    └── components.css
```

## 🎯 **Avantajlar**

### **1. Feature-Based Organization**
- Her sayfa kendi modülüne sahip
- Bağımsız geliştirme ve test
- Kolay bakım ve güncelleme

### **2. Shared Components**
- UI component'leri merkezi
- Kod tekrarını önler
- Tutarlı tasarım sistemi

### **3. Clear Separation**
- Sayfa-specific vs Global
- Kolay bulma ve yönetim
- Ölçeklenebilir yapı

## 🚀 **Uygulama Planı**

1. ✅ Mevcut yapıyı analiz et
2. 🔄 Klasör yapısını yeniden organize et
3. 🔄 Component'leri modülerleştir
4. 🔄 Her sayfa için özel yapılar oluştur
5. 🔄 Global utilities ve types organize et
