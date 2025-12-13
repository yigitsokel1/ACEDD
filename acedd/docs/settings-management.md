# Settings Management System

## 📋 Genel Bakış

ACEDD projesi için merkezi ayarlar yönetim sistemi. Tüm sayfa içerikleri, site bilgileri, iletişim bilgileri ve SEO ayarları bu sistem üzerinden yönetilir.

---

## 🏗️ Sistem Mimarisi

### **3 Katmanlı Yapı:**

```
┌─────────────────────────────────────────┐
│  1. Admin Panel (UI)                    │
│     - Ayarları görüntüle ve düzenle     │
│     - Validation ve preview             │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  2. Database (Settings Table)           │
│     - Prisma Setting modeli             │
│     - key-value storage                 │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  3. Fallback (defaultContent.ts)        │
│     - Hardcoded default değerler        │
│     - Database boşsa kullanılır         │
└─────────────────────────────────────────┘
```

### **Veri Akışı:**

```typescript
getPageContent("home") 
  → Database Settings 
  → defaultContent.ts (fallback) 
  → Type-based fallback ([], {}, "", etc.)
```

---

## 🌱 Default Settings Seed

### **Kullanım:**

```bash
# Sadece eksik ayarları ekle (mevcut ayarları korur)
npm run seed:settings

# TÜM ayarları sıfırla ve default'lara dön (DİKKAT!)
npm run seed:settings:force

# Belirli sayfaları seed et
npm run seed:settings -- --pages=home,about --verbose

# Detaylı log ile seed et
npm run seed:settings -- --verbose
```

### **Seçenekler:**

| Flag | Açıklama |
|------|----------|
| `--force` | Mevcut ayarları override et (DİKKAT: Tüm değişiklikler kaybolur!) |
| `--verbose` veya `-v` | Detaylı log göster |
| `--pages=page1,page2` | Sadece belirtilen sayfaları seed et |

### **Örnekler:**

```bash
# İlk kurulumda tüm default ayarları yükle
npm run seed:settings

# Production'a geçmeden önce tüm ayarları default'a resetle
npm run seed:settings:force

# Sadece home ve about sayfalarını güncelle
npm run seed:settings -- --pages=home,about --verbose
```

---

## 🎨 Admin Panel Kullanımı

### **Tab'lar:**

1. **Genel Site Bilgileri** (`site`)
   - Site adı, açıklama
   - Logo, footer metinleri

2. **İletişim Bilgileri** (`contact`)
   - E-posta, telefon, adres
   - Çalışma saatleri

3. **Sosyal Medya** (`social`)
   - Facebook, Twitter, Instagram, LinkedIn, YouTube

4. **İçerik** (`content`)
   - Tüm sayfa içerikleri (hero, CTA, kartlar)
   - JSON formatında düzenleme

5. **SEO** (`seo`)
   - Meta başlık ve açıklama
   - Anahtar kelimeler

### **JSON Field'ları Düzenleme:**

#### **1. Örnek Format Göster**
- "Örnek Format" butonuna tıkla
- Copy-paste yap

#### **2. Varsayılana Dön**
- "Varsayılana Dön" butonuna tıkla
- defaultContent.ts'deki değer yüklenir

#### **3. Önizleme**
- "Önizleme" butonuna tıkla
- icon, color, id gibi technical field'ları göster

#### **4. Validation**
- Real-time validation
- Hatalı JSON: Parse hatası gösterilir
- Eksik field: Doğrulama hatası gösterilir

---

## 📝 Content Field Format Guide

### **Stats (İstatistikler)**
```json
[
  { "value": "500+", "label": "Bursiyer" },
  { "value": "2M+", "label": "Dağıtılan Burs" }
]
```
*Not: icon, color, id otomatik generate edilir*

### **Missions/Activities (Misyon/Aktiviteler)**
```json
[
  {
    "title": "Burs Vermek",
    "description": "Maddi imkanları kısıtlı öğrencilere burs sağlamak"
  }
]
```

### **Trust Indicators (Güven Göstergeleri)**
```json
[
  { "label": "Güvenilir" },
  { "label": "Hızlı" }
]
```

### **Values/Goals (Değerler/Hedefler)**
```json
[
  {
    "title": "Eğitime Erişim",
    "description": "..."
  }
]
```

### **Mission Vision**
```json
{
  "mission": {
    "title": "Misyonumuz",
    "description": "..."
  },
  "vision": {
    "title": "Vizyonumuz",
    "description": "..."
  }
}
```

### **Application Steps (Başvuru Adımları)**
```json
[
  {
    "step": 1,
    "title": "Form Doldurma",
    "description": "Başvuru formunu eksiksiz doldurun"
  }
]
```

### **Requirements (Gereksinimler)**
```json
[
  "Acıpayam ve çevresinde ikamet etmek",
  "Lise veya üniversite öğrencisi olmak"
]
```

### **Bank Accounts (Banka Hesapları)**
```json
[
  {
    "currency": "TÜRK LİRASI",
    "bank": "Ziraat Bankası",
    "accountName": "...",
    "iban": "TR..."
  }
]
```

### **Contact Info Items**
```json
[
  {
    "title": "Adres",
    "description": "Dernek merkezimiz Acıpayam'da bulunmaktadır"
  }
]
```

---

## 🔧 Technical Details

### **Auto-Generated Fields:**

Aşağıdaki field'lar **otomatik generate edilir**, JSON'da belirtmenize gerek YOK:

- `id` - Unique identifier (örn: "stat-0", "mission-1")
- `icon` - SVG path (keyword'e göre otomatik seçilir)
- `color` - Renk adı (keyword'e göre otomatik seçilir)

### **Keyword-Based Icon Assignment:**

| Keyword | Icon |
|---------|------|
| Burs, Destek, Yardım | ❤️ Heart |
| Bursiyer, Öğrenci | 👥 Users |
| Deneyim, Yıl | 📅 Calendar |
| Başarı, Oran | ⭐ Star |
| Eğitim, Öğren | 📚 Book |
| Sosyal, Etkinlik | 🎉 Party |
| Güvenilir | 🛡️ Shield |
| Hızlı | ⚡ Zap |
| Şeffaf | 👁️ Eye |

### **Color Schemes:**

**Stats:**
- blue, amber, emerald, rose (döngüsel)

**Missions/Activities:**
- indigo, purple, blue, emerald (döngüsel)

**Values:**
- indigo (sabit - tüm kartlar aynı renk)

**Goals:**
- emerald (sabit - tüm kartlar aynı renk)

**Job Descriptions:**
- Hiyerarşik renk (title'a göre)

**Application Steps:**
- blue, green, purple, emerald (döngüsel)

---

## 🚀 Deployment Workflow

### **Development:**
```bash
# 1. Geliştirme yap
npm run dev

# 2. Admin panel'den içerik düzenle
# http://localhost:3000/admin/ayarlar

# 3. Test et
npm run test
```

### **Production:**
```bash
# 1. Database migration
npx prisma migrate deploy

# 2. Default settings yükle
npm run seed:settings

# 3. Build
npm run build

# 4. Start
npm start
```

### **Reset to Defaults (Acil Durum):**
```bash
# TÜM ayarları default'a sıfırla
npm run seed:settings:force
```

---

## ⚠️ Önemli Notlar

1. **Yedek Alın**: `seed:settings:force` kullanmadan önce database backup alın
2. **Test Edin**: Production'da değişiklik yapmadan önce staging'de test edin
3. **JSON Format**: Admin panel'de JSON yapıştırırken format doğru olmalı
4. **Technical Fields**: icon, color, id girmeyin - otomatik generate edilir

---

## 🆘 Sorun Giderme

### **Problem: JSON parse hatası alıyorum**
```
Çözüm: 
- JSON syntax'ını kontrol edin (virgül, tırnak işaretleri)
- "Örnek Format" butonuna tıklayıp formatı inceleyin
- Online JSON validator kullanın (jsonlint.com)
```

### **Problem: Ayarlar sayfaya yansımıyor**
```
Çözüm:
- Önce "Kaydet" butonuna tıkladığınızdan emin olun
- Browser cache'i temizleyin (Ctrl+Shift+R)
- Developer Console'da hata var mı kontrol edin
- Database'de ayarın kaydedildiğini doğrulayın
```

### **Problem: Array format object'e dönüşüyor**
```
Çözüm:
- Bu bug artık düzeltildi (mergeWithOriginal fonksiyonu)
- Eğer hala oluyorsa: seed:settings:force ile resetleyin
```

### **Problem: Technical field'lar kayboldu**
```
Çözüm:
- Normal - admin panel'de icon/color/id gösterilmez
- "Önizleme" butonuna tıklayın - tüm field'ları görebilirsiniz
- Kaydettiğinizde otomatik restore edilir
```

---

## 📚 Geliştirici Notları

### **Yeni Field Eklemek:**

1. `settingsSchema.ts`'ye field tanımı ekle:
```typescript
{
  key: "newField",
  label: "Yeni Alan",
  type: "string",
  inputType: "input",
  required: false,
  helperText: "...",
  defaultValue: "..."
}
```

2. `defaultContent.ts`'ye default değer ekle:
```typescript
home: {
  newField: "default value",
  // ...
}
```

3. Admin panel otomatik olarak yeni field'ı gösterir

### **Yeni Page Eklemek:**

1. `PageIdentifier` type'ına page ekle
2. `PAGE_SCHEMAS`'ye page schema tanımı ekle
3. `DEFAULT_PAGE_CONTENT`'e default content ekle
4. `ContentTab.tsx`'de PAGES array'ine ekle

---

## 🎯 Best Practices

1. ✅ **Her zaman örnek format kullan** - Copy-paste daha güvenli
2. ✅ **Önizleme yap** - Kaydetmeden önce kontrol et
3. ✅ **Küçük değişiklikler** - Büyük değişiklikleri parçalara böl
4. ✅ **Test et** - Değişikliği yaptıktan sonra sayfayı kontrol et
5. ✅ **Yedek al** - Büyük değişikliklerden önce database backup

---

## 📞 Destek

Sorun yaşarsanız:
1. Bu dökümanı kontrol edin
2. Developer Console'da hata loglarını inceleyin
3. `seed:settings:force` ile sistemi resetleyin (son çare)

---

**Son Güncelleme:** 2025-12-11
**Versiyon:** 2.0 (Enhanced Schema System)

