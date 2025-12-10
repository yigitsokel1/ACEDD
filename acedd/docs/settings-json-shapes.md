# Settings JSON Formatları - Admin Panel Kullanım Kılavuzu

**Sprint 12:** JSON alanları için detaylı format dokümantasyonu

Bu dokümantasyon, Admin panelindeki "İçerik" sekmesinde kullanılan JSON alanlarının formatlarını açıklar. 

**⚠️ ÖNEMLİ:** Admin panelinde JSON editor sadece **kullanıcıya gösterilecek metin alanlarını** gösterir. Teknik alanlar (`id`, `icon`, `color` vb.) otomatik olarak sistem tarafından yönetilir ve gizlenir. Bu dokümantasyondaki örnekler, admin panelinde **göreceğiniz ve dolduracağınız** alanları gösterir.

---

## 📋 İçindekiler

1. [Ana Sayfa (Home) JSON Alanları](#ana-sayfa-home-json-alanları)
2. [Hakkımızda (About) JSON Alanları](#hakkımızda-about-json-alanları)
3. [Burs Başvurusu (Scholarship) JSON Alanları](#burs-başvurusu-scholarship-json-alanları)
4. [Bağış Yap (Donation) JSON Alanları](#bağış-yap-donation-json-alanları)
5. [Genel Notlar ve İpuçları](#genel-notlar-ve-ipuçları)

---

## Ana Sayfa (Home) JSON Alanları

### 1. İstatistik Kartları (`stats`)

**Açıklama:** Ana sayfada gösterilen istatistik kartları (sayılar, yüzdeler, vb.)

**Admin Panelinde Göreceğiniz Format (Sadece Metin Alanları):**
```json
[
  {
    "value": "500+",
    "label": "Aktif Üye"
  },
  {
    "value": "150",
    "label": "Bursiyer"
  },
  {
    "value": "50K+",
    "label": "Bağışçı"
  }
]
```

**Alan Açıklamaları (Admin Panelinde Doldurulacak):**
- `value` (string, zorunlu): Gösterilecek sayı/değer (örn: "500+", "150", "50K+")
- `label` (string, zorunlu): Değerin altında gösterilecek etiket

**Teknik Alanlar (Otomatik Yönetilir - Admin Panelinde Görünmez):**
- `id`: Sistem tarafından otomatik oluşturulur
- `icon`: Sistem tarafından otomatik atanır (varsayılan icon kullanılır)
- `color`: Sistem tarafından otomatik atanır (varsayılan renk kullanılır)

**Not:** İlk kayıt sırasında sistem otomatik olarak `id`, `icon` ve `color` değerlerini ekler. Bu değerler sonraki düzenlemelerde korunur.

---

### 2. Misyon Kartları (`missions`)

**Açıklama:** Ana sayfada gösterilen misyon/amaç kartları

**Admin Panelinde Göreceğiniz Format (Sadece Metin Alanları):**
```json
[
  {
    "title": "Eğitim Desteği",
    "description": "Öğrencilere maddi ve manevi destek sağlıyoruz"
  },
  {
    "title": "Toplumsal Farkındalık",
    "description": "Eğitimde fırsat eşitliği konusunda bilinç oluşturuyoruz"
  },
  {
    "title": "Gönüllülük",
    "description": "Gönüllü eğitmenlerle eğitim faaliyetleri düzenliyoruz"
  }
]
```

**Alan Açıklamaları (Admin Panelinde Doldurulacak):**
- `title` (string, zorunlu): Kart başlığı
- `description` (string, zorunlu): Kart açıklaması

**Teknik Alanlar (Otomatik Yönetilir - Admin Panelinde Görünmez):**
- `id`: Sistem tarafından otomatik oluşturulur
- `icon`: Sistem tarafından otomatik atanır
- `color`: Sistem tarafından otomatik atanır

---

### 3. Aktivite Kartları (`activities`)

**Açıklama:** Ana sayfada gösterilen aktivite/faaliyet kartları

**Admin Panelinde Göreceğiniz Format (Sadece Metin Alanları):**
```json
[
  {
    "title": "Eğitim Programları",
    "description": "Düzenli eğitim programları ve workshop'lar"
  },
  {
    "title": "Burs Programı",
    "description": "İhtiyaç sahibi öğrencilere burs desteği"
  }
]
```

**Alan Açıklamaları (Admin Panelinde Doldurulacak):**
- `title` (string, zorunlu): Aktivite başlığı
- `description` (string, zorunlu): Aktivite açıklaması

**Teknik Alanlar (Otomatik Yönetilir - Admin Panelinde Görünmez):**
- `id`: Sistem tarafından otomatik oluşturulur
- `icon`: Sistem tarafından otomatik atanır
- `color`: Sistem tarafından otomatik atanır

---

### 4. Güven Göstergeleri (`trustIndicators`)

**Açıklama:** Ana sayfada gösterilen güven göstergeleri (şeffaflık, güvenilirlik, vb.)

**Admin Panelinde Göreceğiniz Format (Sadece Metin Alanları):**
```json
[
  {
    "label": "Şeffaf Yönetim"
  },
  {
    "label": "Sertifikalı Dernek"
  },
  {
    "label": "Güvenilir Bağış"
  }
]
```

**Alan Açıklamaları (Admin Panelinde Doldurulacak):**
- `label` (string, zorunlu): Gösterge etiketi

**Teknik Alanlar (Otomatik Yönetilir - Admin Panelinde Görünmez):**
- `id`: Sistem tarafından otomatik oluşturulur
- `icon`: Sistem tarafından otomatik atanır

---

## Hakkımızda (About) JSON Alanları

### 1. Değerler (`values`)

**Açıklama:** Hakkımızda sayfasında gösterilen değerler listesi

**Admin Panelinde Göreceğiniz Format:**
```json
[
  {
    "title": "Şeffaflık",
    "description": "Tüm faaliyetlerimizde şeffaflık ilkesini benimseriz"
  },
  {
    "title": "Güvenilirlik",
    "description": "Toplumun güvenini kazanmak için dürüst ve güvenilir olmayı hedefleriz"
  },
  {
    "title": "Eşitlik",
    "description": "Her öğrencinin eşit eğitim fırsatına sahip olmasını destekleriz"
  }
]
```

**Alan Açıklamaları:**
- `title` (string, zorunlu): Değer başlığı
- `description` (string, zorunlu): Değer açıklaması

**Not:** Icon bilgileri otomatik olarak sistem tarafından eklenir (admin panelinde görünmez).

---

### 2. Hedefler ve Faaliyetler (`goals`)

**Açıklama:** Hakkımızda sayfasında gösterilen hedefler ve faaliyetler listesi

**Admin Panelinde Göreceğiniz Format:**
```json
[
  {
    "title": "Eğitim Desteği",
    "description": "Öğrencilere kapsamlı eğitim desteği sağlamak"
  },
  {
    "title": "Toplumsal Farkındalık",
    "description": "Eğitimde fırsat eşitliği konusunda toplumsal bilinç oluşturmak"
  },
  {
    "title": "Gönüllülük",
    "description": "Gönüllü eğitmenlerle eğitim faaliyetleri düzenlemek"
  }
]
```

**Alan Açıklamaları:**
- `title` (string, zorunlu): Hedef/faaliyet başlığı
- `description` (string, zorunlu): Hedef/faaliyet açıklaması

**Not:** Icon bilgileri otomatik olarak sistem tarafından eklenir (admin panelinde görünmez).

---

### 3. Görev Tanımları (`jobDescriptions`)

**Açıklama:** Hakkımızda sayfasında gösterilen organizasyon görev tanımları

**Admin Panelinde Göreceğiniz Format:**
```json
[
  {
    "title": "Genel Kurul",
    "description": "Derneğin en yetkili karar organıdır, tüm üyeleri kapsar."
  },
  {
    "title": "Yönetim Kurulu",
    "description": "Derneği temsil eder ve faaliyetleri yürütür."
  },
  {
    "title": "Denetim Kurulu",
    "description": "Mali ve idari işlemleri kontrol eder. (İç denetim)"
  },
  {
    "title": "Dernek Başkanı",
    "description": "Derneğin yürütmesinden ve temsilinden birinci derecede sorumludur."
  }
]
```

**Alan Açıklamaları:**
- `title` (string, zorunlu): Görev başlığı (icon matching için önemli - constants'taki title'larla eşleşmeli)
- `description` (string, zorunlu): Görev açıklaması

**⚠️ ÖNEMLİ NOT:** 
- `title` değerleri **birebir** `hakkimizda/constants.ts` dosyasındaki `ORGANIZATION_STRUCTURE` array'indeki `title` değerleriyle eşleşmelidir (icon matching için).
- Icon bilgileri otomatik olarak sistem tarafından eşleştirilir (admin panelinde görünmez).
- Title'lar büyük/küçük harf, boşluk ve noktalama işaretleri dahil tam olarak eşleşmelidir.

**Geçerli Title Değerleri (Birebir Eşleşmeli):**
- "Genel Kurul"
- "Yönetim Kurulu"
- "Denetim Kurulu"
- "Dernek Başkanı"
- "Genel Sekreter"
- "Sayman"
- "Burs Komisyonu"
- "Proje Koordinatörü"
- "Üye İlişkileri"
- "Eğitim Koordinatörü"
- "Bursiyer Takip Ekibi"
- "Gönüllü Eğitmenler"

---

### 4. Misyon ve Vizyon (`missionVision`)

**Açıklama:** Hakkımızda sayfasında gösterilen misyon ve vizyon bilgileri

**Admin Panelinde Göreceğiniz Format:**
```json
{
  "mission": {
    "title": "Misyonumuz",
    "description": "Acıpayam ve çevresindeki öğrencilere eğitim desteği sağlayarak onların gelişimine katkıda bulunmak ve eğitimde fırsat eşitliği konusunda toplumsal farkındalık oluşturmak."
  },
  "vision": {
    "title": "Vizyonumuz",
    "description": "Her öğrencinin eşit eğitim fırsatına sahip olduğu, eğitimde fırsat eşitliğinin sağlandığı bir toplum yaratmak."
  }
}
```

**Alan Açıklamaları:**
- `mission` (object, zorunlu): Misyon bilgileri
  - `title` (string, zorunlu): Misyon başlığı
  - `description` (string, zorunlu): Misyon açıklaması
- `vision` (object, zorunlu): Vizyon bilgileri
  - `title` (string, zorunlu): Vizyon başlığı
  - `description` (string, zorunlu): Vizyon açıklaması

**Not:** Icon bilgileri otomatik olarak sistem tarafından eklenir (admin panelinde görünmez).

---

## Burs Başvurusu (Scholarship) JSON Alanları

### 1. Burs Gereksinimleri (`requirements`)

**Açıklama:** Burs başvurusu sayfasında gösterilen gereksinimler listesi (string array)

**Format:**
```json
[
  "Acıpayam ve çevresinde ikamet etmek",
  "Lise veya üniversite öğrencisi olmak",
  "Not ortalaması 2.5 ve üzeri olmak",
  "Maddi ihtiyaç durumu belgesi sunmak",
  "Aile gelir durumu belgesi sunmak",
  "Kimlik belgesi fotokopisi",
  "Öğrenci belgesi",
  "Son dönem not dökümü"
]
```

**Alan Açıklamaları:**
- Her öğe bir string (metin) olmalıdır
- Boş string'ler otomatik olarak filtrelenir
- Sıralama önemlidir (liste sırasıyla gösterilir)

**Not:** Bu bir string array'dir, object array değildir. Her öğe sadece metin olmalıdır.

---

### 2. Başvuru Adımları (`applicationSteps`)

**Açıklama:** Burs başvurusu sayfasında gösterilen başvuru adımları

**Admin Panelinde Göreceğiniz Format:**
```json
[
  {
    "step": 1,
    "title": "Başvuru Formunu Doldurun",
    "description": "Tüm gerekli bilgileri eksiksiz doldurun"
  },
  {
    "step": 2,
    "title": "Belgelerinizi Hazırlayın",
    "description": "Gerekli belgeleri toplayın ve hazırlayın"
  },
  {
    "step": 3,
    "title": "Başvurunuzu Gönderin",
    "description": "Formu kontrol edip gönderin"
  },
  {
    "step": 4,
    "title": "Değerlendirme Süreci",
    "description": "Başvurunuz değerlendirilecek ve size bilgi verilecek"
  }
]
```

**Alan Açıklamaları:**
- `step` (number, zorunlu): Adım numarası (1, 2, 3, ...) - **Sayısal olmalı, string değil**
- `title` (string, zorunlu): Adım başlığı
- `description` (string, zorunlu): Adım açıklaması

**Not:** Adımlar `step` değerine göre sıralanır. `step` değeri sayısal olmalıdır (string değil).

---

## Bağış Yap (Donation) JSON Alanları

### 1. Banka Hesapları (`bankAccounts`)

**Açıklama:** Bağış yap sayfasında gösterilen banka hesap bilgileri

**Admin Panelinde Göreceğiniz Format (Tüm Alanlar Görünür):**
```json
[
  {
    "currency": "TÜRK LİRASI",
    "bank": "Ziraat Bankası",
    "accountName": "ACIPAYAM VE ÇEVRESİ EĞİTİMİ DESTEKLEME DERNEĞİ",
    "iban": "TR 53 0001 0000 8994 7314 5650 01"
  },
  {
    "currency": "USD",
    "bank": "Ziraat Bankası",
    "accountName": "ACIPAYAM VE ÇEVRESİ EĞİTİMİ DESTEKLEME DERNEĞİ",
    "iban": "TR 53 0001 0000 8994 7314 5650 02"
  },
  {
    "currency": "EURO",
    "bank": "Ziraat Bankası",
    "accountName": "ACIPAYAM VE ÇEVRESİ EĞİTİMİ DESTEKLEME DERNEĞİ",
    "iban": "TR 53 0001 0000 8994 7314 5650 03"
  }
]
```

**Alan Açıklamaları:**
- `currency` (string, zorunlu): Para birimi (örn: "TÜRK LİRASI", "USD", "EURO")
- `bank` (string, zorunlu): Banka adı
- `accountName` (string, zorunlu): Hesap sahibi adı
- `iban` (string, zorunlu): IBAN numarası (format: "TR XX XXXX XXXX XXXX XXXX XXXX XX")

**Not:** IBAN formatı doğrulanmaz, ancak standart IBAN formatında olması önerilir. Bu alan için tüm bilgiler admin tarafından girilir (teknik alan yok).

---

## Genel Notlar ve İpuçları

### ⚠️ ÖNEMLİ: Admin Panelinde Görünen Alanlar

**Admin panelindeki JSON editor sadece kullanıcıya gösterilecek metin alanlarını gösterir:**

- ✅ **Gösterilen Alanlar:** `title`, `description`, `label`, `value`, `step`, `name`, `currency`, `bank`, `accountName`, `iban`
- ❌ **Gizlenen Teknik Alanlar:** `id`, `icon`, `color`, `href`, `parent`, `level`, `isDashed`

**Sistem Nasıl Çalışır:**
1. Admin panelinde sadece metin alanlarını görürsünüz
2. Kaydetme sırasında sistem otomatik olarak teknik alanları (`id`, `icon`, `color`) ekler veya mevcut değerlerini korur
3. İlk kayıt: Sistem otomatik olarak `id`, `icon`, `color` değerlerini oluşturur
4. Sonraki düzenlemeler: Mevcut teknik alanlar korunur, sadece metin alanları güncellenir

### ✅ Doğru Format Kullanımı

1. **Array Formatı:** Tüm JSON alanları array veya object formatında olmalıdır
   - ✅ Doğru: `[{...}, {...}]`
   - ❌ Yanlış: `{"0": {...}, "1": {...}}` (object-like array - sistem otomatik düzeltir)

2. **String Array:** `requirements` gibi alanlar sadece string array olmalıdır
   - ✅ Doğru: `["Metin 1", "Metin 2"]`
   - ❌ Yanlış: `[{title: "Metin 1"}]`

3. **Object Array:** `stats`, `missions`, `applicationSteps` gibi alanlar object array olmalıdır
   - ✅ Doğru: `[{title: "...", description: "..."}, {...}]` (admin panelinde görünen format)
   - ❌ Yanlış: `["string1", "string2"]`

4. **Zorunlu Alanlar:** Her object'teki zorunlu alanlar mutlaka doldurulmalıdır
   - Boş string'ler otomatik olarak filtrelenir
   - Eksik alanlar içeren item'ler gösterilmez

### ⚠️ Yaygın Hatalar

1. **Object-like Array:** JSON editor bazen `{"0": {...}, "1": {...}}` formatında kaydeder
   - Sistem otomatik olarak düzeltir, ancak doğru format kullanılması önerilir

2. **Teknik Alanları Ekleme:** Admin panelinde `id`, `icon`, `color` gibi teknik alanları eklemeye çalışmayın
   - Bu alanlar otomatik olarak yönetilir
   - Manuel ekleme durumunda sistem bunları görmezden gelir veya üzerine yazar

3. **Eksik Zorunlu Alanlar:** Object'lerde zorunlu alanlar eksikse item filtrelenir
   - Örnek: `stats` array'inde `value` veya `label` eksikse o item gösterilmez
   - Örnek: `missions` array'inde `title` veya `description` eksikse o item gösterilmez

4. **Yanlış Veri Tipi:** `step` değeri number olmalı, string değil
   - ✅ Doğru: `"step": 1`
   - ❌ Yanlış: `"step": "1"`

5. **Görev Tanımlarında Title Eşleşmesi:** `jobDescriptions` için `title` değerleri constants'taki title'larla birebir eşleşmeli
   - ✅ Doğru: `"title": "Genel Kurul"` (constants'taki ile aynı)
   - ❌ Yanlış: `"title": "genel kurul"` (büyük/küçük harf farkı)
   - ❌ Yanlış: `"title": "Genel Kurul "` (boşluk farkı)

### 🔍 Validation Kuralları

Sistem otomatik olarak şu kontrolleri yapar:

1. **Array Kontrolü:** Array olmayan değerler boş array'e dönüştürülür
2. **Null/Undefined Filtreleme:** Null veya undefined item'ler filtrelenir
3. **Boş String Filtreleme:** Boş string'ler (trim sonrası) filtrelenir
4. **Shape Kontrolü:** Her object'in zorunlu alanları kontrol edilir
5. **Type Kontrolü:** Veri tipleri kontrol edilir (string, number, vb.)

### 📝 Örnek Kullanım Senaryoları

#### Senaryo 1: Yeni İstatistik Kartı Ekleme

```json
// Admin panelinde göreceğiniz format (sadece metin alanları)
[
  {
    "value": "500+",
    "label": "Aktif Üye"
  },
  {
    "value": "100",  // YENİ KART
    "label": "Tamamlanan Proje"
  }
]
```

**Not:** Sistem otomatik olarak yeni karta `id`, `icon` ve `color` değerlerini ekler.

#### Senaryo 2: Burs Gereksinimlerini Güncelleme

```json
// requirements array'ini güncelleme
[
  "Acıpayam ve çevresinde ikamet etmek",
  "Lise veya üniversite öğrencisi olmak",
  "Not ortalaması 2.5 ve üzeri olmak",
  "YENİ GEREKSİNİM: Referans mektubu sunmak"  // YENİ EKLEME
]
```

#### Senaryo 3: Görev Tanımlarını Düzenleme

```json
// jobDescriptions array'ini düzenleme
[
  {
    "title": "Genel Kurul",  // ÖNEMLİ: constants'taki title ile eşleşmeli
    "description": "Güncellenmiş açıklama metni"
  },
  {
    "title": "Yönetim Kurulu",
    "description": "Yeni açıklama metni"
  }
]
```

### 🆘 Sorun Giderme

**Problem:** JSON alanı kaydedildi ama sayfada görünmüyor

**Çözüm:**
1. JSON formatını kontrol edin (geçerli JSON olmalı)
2. Zorunlu alanların doldurulduğundan emin olun
3. Boş string'lerin olmadığından emin olun
4. Array formatında olduğundan emin olun (object-like array değil)

**Problem:** Icon gösterilmiyor

**Çözüm:**
1. Icon adının Lucide library'de mevcut olduğundan emin olun
2. Icon adının doğru yazıldığından emin olun (büyük/küçük harf duyarlı)
3. Geçerli icon listesi: https://lucide.dev/icons/

**Problem:** Görev tanımlarında icon gösterilmiyor

**Çözüm:**
1. `title` değerinin `hakkimizda/constants.ts` dosyasındaki `ORGANIZATION_STRUCTURE` array'indeki title'larla tam eşleştiğinden emin olun
2. Title'lar birebir aynı olmalıdır (büyük/küçük harf, boşluk, noktalama işaretleri)

---

## 📚 Ek Kaynaklar

- **Lucide Icons:** https://lucide.dev/icons/
- **JSON Validator:** https://jsonlint.com/
- **Sprint 11 Dokümantasyonu:** `docs/sprint-11-completion.md`
- **Settings Helper Fonksiyonları:** `src/lib/settings/convenience.ts`

---

**Son Güncelleme:** Sprint 12 - 08.12.2025
