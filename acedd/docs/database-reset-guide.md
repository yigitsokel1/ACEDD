# Settings Tablosu Silme ve Yeniden Yükleme Rehberi

## ⚠️ ÖNEMLI: ÖNCELİKLE KONTROL EDİN!

### **Durum 1: Eğer Admin Panelden HİÇ Değişiklik Yapılmadıysa**

✅ **GÜVENLİ - Hiçbir şey kaybedilmez**

```bash
# 1. Settings tablosunu kontrol et (Prisma Studio)
npx prisma studio

# 2. Setting tablosuna bak:
#    - Eğer tabloda VERİ YOKSA → Güvenle seed çalıştırabilirsin
#    - Eğer tabloda VERİ VARSA → Adım 3'e geç

# 3. Settings tablosunu sil
# Prisma Studio'da:
# - Setting tablosunu aç
# - Tüm kayıtları seç (Ctrl+A)
# - Sil (Delete)

# 4. Seed script çalıştır
npm run seed:settings

# 5. Sonuç: defaultContent.ts'deki tüm default'lar yüklenir ✅
```

**Neden güvenli:**
- Tüm default içerikler `defaultContent.ts`'de mevcut
- Seed script bu dosyadan okuyup DB'ye yazıyor
- Hiçbir özel customization kaybolmaz (çünkü zaten yok)

---

### **Durum 2: Eğer Admin Panelden Değişiklikler Yapıldıysa**

❌ **TEHLİKELİ - Özelleştirmeler kaybolur!**

**Risk:**
- Admin panelden yapılan tüm değişiklikler **SİLİNİR**
- Örnek: Hero başlıklar, JSON içerikler, statlar, vs.
- Sadece `defaultContent.ts`'deki default'lar kalır

**Güvenli Yöntem - ÖNCE YEDEK AL:**

```bash
# 1. Mevcut settings'leri export et (yedek)
npm run export:settings

# Bu komut çalışmazsa manuel yedek:
# - Prisma Studio'da Setting tablosunu aç
# - Export to JSON yap (eğer varsa)
# - VEYA screenshot al
# - VEYA manuel kopyala/kaydet

# 2. Settings tablosunu sil
# (Prisma Studio'dan veya SQL ile)

# 3. Seed script çalıştır
npm run seed:settings

# 4. Kaybolan özelleştirmeleri admin panelden tekrar yap
# VEYA
# 4b. Export ettiğin JSON'u import et (eğer import script varsa)
```

---

## 🎯 HIZLI KARAR AKIŞI

```
┌─────────────────────────────────────────┐
│ Admin panelden değişiklik yaptın mı?    │
└─────────────────────────────────────────┘
           │
           ├─ HAYIR → ✅ GÜVENLİ
           │          Direkt sil + seed
           │
           └─ EVET  → ⚠️  TEHLİKELİ
                      1. Önce yedek al
                      2. Sonra sil + seed
                      3. Customization'ları tekrar yap
```

---

## 📊 NELERİ KAYBEDERSIN / KAYBETMEZSIN

### ✅ **KAYBETMEZSIN** (defaultContent.ts'de var):

```typescript
// Tüm sayfa içerikleri:
- home: heroTitle, stats, missions, activities, trustIndicators
- about: values, goals, jobDescriptions, missionVision
- scholarship: requirements, applicationSteps
- membership: heroTitle, intro, additionalInfo
- contact: heroTitle, intro, contactInfoItems
- events: heroTitle, intro, CTA
- donation: bankAccounts, thankYou

// Toplam: ~60+ field, 12 JSON field
```

### ❌ **KAYBEDERSİN** (eğer admin panelden değiştirilmişse):

```typescript
// Örnek senaryolar:
- "Burs Başvurusu Yap" → "Hemen Başvur" değiştirdiysen
- Stats'taki "500+ Bursiyer" → "600+ Bursiyer" değiştirdiysen
- Bank account'lara yeni hesap eklediysen
- Job descriptions'a yeni pozisyon eklediysen
- Custom icon/color değişiklikleri (ama bunlar zaten normalization'da override olur)
```

---

## 🛡️ EN GÜVENLİ YÖNTEM (ÖNERİLEN)

### **Adım 1: Şu Anda Ne Var Kontrol Et**

```bash
# Prisma Studio aç
npx prisma studio

# Setting tablosuna git
# Kayıt sayısına bak:
# - 0 kayıt → Güvenle seed çalıştır
# - 50+ kayıt → Admin panelden değiştirilmiş, yedek al!
```

### **Adım 2a: Eğer 0 Kayıt (Boş DB)**

```bash
# Direkt seed çalıştır
npm run seed:settings

# ✅ Hiçbir şey kaybedilmez
```

### **Adım 2b: Eğer Kayıt Var (Dolu DB)**

```bash
# 1. YEDEK AL (Prisma Studio'dan)
#    - Setting tablosu → Export → JSON

# 2. Tabloyu temizle
#    - Prisma Studio'da tüm kayıtları sil

# 3. Seed çalıştır
npm run seed:settings

# 4. Admin panelden custom değişiklikleri tekrar yap
#    VEYA yedek JSON'u import et (script yoksa manuel)
```

---

## 💡 BONUS: Export/Import Script (Gelecekte Eklenebilir)

### **Export Script (Yedek Al):**

```bash
# Tüm settings'leri JSON'a export et
npm run export:settings > settings-backup-$(date +%Y%m%d).json

# Sonuç: settings-backup-20251211.json
```

### **Import Script (Yedek Geri Yükle):**

```bash
# JSON'dan settings'leri geri yükle
npm run import:settings settings-backup-20251211.json
```

**Not:** Bu scriptler şu anda YOK, ama gerekirse eklenebilir.

---

## ❓ SORU: Hangi Durumdasın?

### **Kontrol Soruları:**

1. ✅ **Admin panele hiç girmedim / sadece baktım**
   → GÜVENLİ: Direkt sil + seed

2. ⚠️  **Admin panele girdim ama "Kaydet" butonuna basmadım**
   → GÜVENLİ: Direkt sil + seed

3. ❌ **Admin panelden içerik değiştirdim ve "Kaydet" bastım**
   → TEHLİKELİ: Önce yedek al!

---

## 🚨 ÖZET

| Durum | Risk | Aksiyon |
|-------|------|---------|
| **DB boş (0 kayıt)** | ✅ Yok | Direkt seed çalıştır |
| **DB dolu, ama default content'le aynı** | ✅ Yok | Direkt seed çalıştır |
| **DB dolu, custom değişiklikler var** | ❌ Var | ÖNCE YEDEK AL! |

---

**ÖNERİ:** Prisma Studio ile Setting tablosunu aç, kayıt sayısına bak, sonra karar ver! 🔍

