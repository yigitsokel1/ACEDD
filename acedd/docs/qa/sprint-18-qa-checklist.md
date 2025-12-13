# Sprint 18 - Block A: Tam Sistem QA Checklist

**Sprint:** 18  
**Block:** A - Tam Sistem QA (Public + Admin)  
**Tarih:** 2025-01-XX

## A1) Public UX / Functional QA

### 1. Ana Sayfa

#### Hero Section
- [ ] Hero başlığı görüntüleniyor (`getPageContent("home").heroTitle`)
- [ ] Hero açıklaması görüntüleniyor (`getPageContent("home").intro`)
- [ ] Primary button görüntüleniyor ve doğru route'a yönlendiriyor
- [ ] Secondary button görüntüleniyor ve doğru route'a yönlendiriyor

#### Fallback & DB Override Testleri
- [ ] Settings'te `content.home.heroTitle` yoksa → `defaultContent.ts` fallback çalışıyor
- [ ] Settings'te `content.home.heroTitle` varsa → DB değeri gösteriliyor (override çalışıyor)
- [ ] `getPageContent("home")` fonksiyonu doğru çalışıyor (unit test mevcut ✅)

#### Vizyon-Misyon
- [ ] Vizyon bölümü görüntüleniyor
- [ ] Misyon bölümü görüntüleniyor
- [ ] İçerik `getPageContent` veya `defaultContent`'ten geliyor

#### Etkinlik Listesi
- [ ] Son etkinlikler görüntüleniyor
- [ ] Etkinlik kartlarında görseller doğru render ediliyor
- [ ] "Tüm Etkinlikler" linki `/etkinlikler` sayfasına yönlendiriyor

#### Duyurular
- [ ] Son duyurular görüntüleniyor
- [ ] Aktif duyurular doğru tarih aralığında gösteriliyor
- [ ] "Tüm Duyurular" linki çalışıyor

#### Linkler & Navigation
- [ ] Tüm internal linkler doğru sayfalara yönlendiriyor
- [ ] External linkler yeni tab'da açılıyor

---

### 2. Hakkımızda

#### Yönetim Kurulu Listesi
- [ ] Onur Başkanları listesi görüntüleniyor
- [ ] Kurucu Başkanlar listesi görüntüleniyor
- [ ] Kurucu Üyeler listesi görüntüleniyor
- [ ] Eski Başkanlar listesi görüntüleniyor
- [ ] Mevcut Yönetim Kurulu üyeleri görüntüleniyor

#### Üyeler Listesi
- [ ] Üye kartları doğru kategorilere göre gruplandırılmış
- [ ] Üye bilgileri (isim, email, telefon) doğru görüntüleniyor

#### CV Linkleri
- [ ] CV'si olan üyelerde "CV" linki görüntüleniyor
- [ ] CV linkine tıklandığında `/api/download/cv/:datasetId` çağrılıyor
- [ ] PDF dosyası indiriliyor
- [ ] CV'si olmayan üyelerde link görünmüyor
- [ ] CV download endpoint test edildi (unit test mevcut olmalı ⚠️)

---

### 3. Üyelik Başvurusu

#### Form Validasyonu
- [ ] Tüm zorunlu alanlar Zod validasyonu ile kontrol ediliyor
- [ ] TC Kimlik No validasyonu çalışıyor (11 hane, checksum)
- [ ] Telefon validasyonu çalışıyor (Türk formatı: 05551234567)
- [ ] E-posta validasyonu çalışıyor (email formatı)
- [ ] Hatalı TC/telefon/e-posta girişinde uygun hata mesajları gösteriliyor

#### reCAPTCHA
- [ ] reCAPTCHA widget görüntüleniyor
- [ ] reCAPTCHA doğrulaması yapılmadan form submit edilemiyor
- [ ] Başarılı reCAPTCHA doğrulaması sonrası form submit edilebiliyor

#### Form Submit
- [ ] Form başarıyla submit ediliyor
- [ ] Success ekranı gösteriliyor
- [ ] Success mesajı doğru içeriğe sahip
- [ ] Form submit sonrası form reset ediliyor

---

### 4. Burs Başvurusu (V2) — En Kritik Kısım

#### Statik Alanlar
- [ ] Kişisel Bilgiler bölümü doğru çalışıyor
- [ ] Üniversite Bilgileri bölümü doğru çalıyor
- [ ] Banka Bilgileri bölümü doğru çalıyor
- [ ] Sağlık/Engellilik bölümü doğru çalıyor
- [ ] Aile Bilgileri bölümü doğru çalıyor
- [ ] Adres Bilgileri bölümü doğru çalıyor

#### Dinamik Listeler

**Akrabalar (Relatives)**
- [ ] "Akraba Ekle" butonu çalışıyor
- [ ] Yeni akraba ekleniyor
- [ ] Akraba düzenlenebiliyor
- [ ] Akraba silinebiliyor
- [ ] Minimum 1 akraba zorunluluğu çalışıyor
- [ ] Maksimum 50 akraba limiti çalışıyor
- [ ] Akraba formu validasyonu çalışıyor (isim, doğum tarihi, gelir, vb.)

**Okullar (Education History)**
- [ ] "Okul Ekle" butonu çalışıyor
- [ ] Yeni okul ekleniyor
- [ ] Okul düzenlenebiliyor
- [ ] Okul silinebiliyor
- [ ] Minimum 1 okul zorunluluğu çalışıyor
- [ ] Maksimum 50 okul limiti çalışıyor
- [ ] Bitiş tarihi başlama tarihinden önce olamıyor (Zod validation)
- [ ] Yüzde (0-100) validasyonu çalışıyor

**Referanslar (References)**
- [ ] "Referans Ekle" butonu çalışıyor
- [ ] Yeni referans ekleniyor
- [ ] Referans düzenlenebiliyor
- [ ] Referans silinebiliyor
- [ ] Minimum 1 referans zorunluluğu çalışıyor
- [ ] Maksimum 20 referans limiti çalışıyor
- [ ] Ad soyad split işlemi doğru çalışıyor

#### Numeric Input Kontrolleri
- [ ] Türkiye sıralaması (`turkeyRanking`) numeric input, min=1, step=1
- [ ] Aylık gelir (`familyMonthlyIncome`) numeric input, min=0, step=1
- [ ] Aylık giderler (`familyMonthlyExpenses`) numeric input, min=0, step=1
- [ ] Akraba geliri (`relatives[].income`) numeric input, min=0, step=1
- [ ] Yüzde (`educationHistory[].percentage`) numeric input, min=0, max=100, step=0.01

#### Tarih Alanları
- [ ] Tarih alanları HTML5 date input kullanıyor
- [ ] Tarih normalize ediliyor (UTC start of day)
- [ ] Geçersiz tarih girişinde hata mesajı gösteriliyor

#### Zod Hataları
- [ ] Tüm alanlar için Zod hata mesajları Türkçe
- [ ] Hata mesajları kullanıcı dostu
- [ ] Field-level hata mesajları doğru alanlarda gösteriliyor

#### reCAPTCHA
- [ ] reCAPTCHA widget görüntüleniyor
- [ ] Form submit edilmeden önce reCAPTCHA doğrulanıyor
- [ ] reCAPTCHA doğrulaması başarısız olursa form submit edilemiyor

#### Form Submit
- [ ] Form başarıyla submit ediliyor
- [ ] Dinamik listeler doğru şekilde serialize ediliyor
- [ ] Success ekranı gösteriliyor

---

### 5. Etkinlikler (Public)

#### Etkinlik Grid
- [ ] Etkinlik listesi grid layout'ta görüntüleniyor
- [ ] Etkinlik kartlarında başlık, tarih, konum görüntüleniyor
- [ ] Featured image doğru render ediliyor
- [ ] Etkinlik görselleri Base64 formatında doğru gösteriliyor

#### Etkinlik Detail Page
- [ ] Etkinlik detay sayfası açılıyor (`/etkinlikler/[id]`)
- [ ] Tüm etkinlik bilgileri görüntüleniyor
- [ ] Etkinlik görselleri gallery olarak görüntüleniyor
- [ ] Görseller zoom/lightbox ile görüntülenebiliyor

---

### 6. Bağış Yap

#### Bağış Hesapları
- [ ] Bağış hesapları görüntüleniyor
- [ ] Default content (`defaultContent.ts`) fallback çalışıyor
- [ ] Settings'te `donation.bankAccounts` override edilince UI'da değişiklik görünüyor
- [ ] Banka adı, IBAN, para birimi doğru görüntüleniyor
- [ ] IBAN kopyalama butonu çalışıyor

---

## A2) Admin Panel QA

### 1. Dashboard + Overview

#### Kullanıcı Rolleri
- [ ] SUPER_ADMIN rolü ile giriş yapılabiliyor
- [ ] ADMIN rolü ile giriş yapılabiliyor
- [ ] SUPER_ADMIN tüm menülere erişebiliyor
- [ ] ADMIN sadece izin verilen menülere erişebiliyor
- [ ] Yetkisiz kullanıcı admin paneline erişemiyor

#### Dashboard İstatistikleri
- [ ] Toplam başvuru sayısı doğru görüntüleniyor
- [ ] Bekleyen başvurular sayısı doğru görüntüleniyor
- [ ] Son başvurular listesi görüntüleniyor
- [ ] Yaklaşan etkinlikler listesi görüntüleniyor

---

### 2. Üyeler Yönetimi

#### CRUD İşlemleri
- [ ] Üye listesi görüntüleniyor
- [ ] Yeni üye eklenebiliyor
- [ ] Üye düzenlenebiliyor
- [ ] Üye silinebiliyor
- [ ] Üye arama çalışıyor
- [ ] Üye filtreleme çalışıyor

#### CV Upload
- [ ] CV upload alanı görüntüleniyor
- [ ] PDF dosyası yüklenebiliyor (max 10MB)
- [ ] CV yüklendikten sonra `cvDatasetId` doğru şekilde store ediliyor
- [ ] CV değiştirildiğinde eski dosya dataset'ten siliniyor (fileService.replaceMemberCV)
- [ ] Üye detay modalında CV linki görüntüleniyor
- [ ] CV linkine tıklandığında PDF indiriliyor (`/api/download/cv/:datasetId`)

---

### 3. Burs Başvuruları Yönetimi

#### Gelişmiş Detail Ekran (Sprint 16)
- [ ] Detail sayfası açılıyor (`/admin/burs-basvurulari/[id]`)
- [ ] Tüm bilgiler collapsible section'larda görüntüleniyor:
  - [ ] Genel Bilgi
  - [ ] Aile & Akrabalar
  - [ ] Okul Geçmişi
  - [ ] Referanslar
  - [ ] Finansal Bilgiler
  - [ ] Sağlık ve Engellilik
  - [ ] Ek Bilgiler

#### Dinamik Alan Collapsible'ları
- [ ] Collapsible section'lar açılıp kapanabiliyor
- [ ] Her collapsible içinde doğru veriler görüntüleniyor
- [ ] Akrabalar listesi doğru formatlanmış
- [ ] Okul geçmişi listesi doğru formatlanmış
- [ ] Referanslar listesi doğru formatlanmış

#### Tablo Filtreleri / Performans
- [ ] Status filtreleri çalışıyor (PENDING, APPROVED, REJECTED, UNDER_REVIEW)
- [ ] Arama çalışıyor (isim, e-posta)
- [ ] Tablo performansı kabul edilebilir (100+ kayıt için <2s)

#### "Çok Sütunlu Tablo Şişmesi" Çözümü
- [ ] Tablo sadece temel sütunları gösteriyor (isim, e-posta, durum, tarih)
- [ ] Detaylar detail sayfasında görüntüleniyor
- [ ] Tablo responsive ve okunabilir

#### Başvuru Log'ları, Notlar
- [ ] Review notes görüntüleniyor
- [ ] Reviewed by bilgisi görüntüleniyor
- [ ] Reviewed at tarihi görüntüleniyor
- [ ] Status update geçmişi görüntüleniyor

---

### 4. Etkinlik Yönetimi

#### Görsel Ekleme
- [ ] Görsel ekleme alanı görüntüleniyor
- [ ] Preview mode çalışıyor (database'e kaydetmeden önce önizleme)
- [ ] Görsel yüklendikten sonra Dataset'e kaydediliyor
- [ ] Featured image seçilebiliyor

#### Görsel Silme
- [ ] Görsel silinebiliyor
- [ ] Silinen görsel Dataset'ten kaldırılıyor

#### Etkinlik Silme + Dataset Cleanup
- [ ] Etkinlik silinebiliyor
- [ ] Etkinlik silindiğinde ilgili görseller Dataset'ten temizleniyor (fileService.deleteEventFiles)
- [ ] Orphan dataset kayıtları kalmıyor

---

### 5. Ayarlar Paneli

#### Favicon/Logo Yükleme
- [ ] Favicon yüklenebiliyor
- [ ] Logo yüklenebiliyor
- [ ] Yüklenen dosyalar Dataset'e kaydediliyor

#### Favicon/Logo Değiştirme
- [ ] Favicon değiştirildiğinde eski dosya Dataset'ten siliniyor (fileService.replaceFaviconOrLogo)
- [ ] Logo değiştirildiğinde eski dosya Dataset'ten siliniyor
- [ ] Orphan dataset kayıtları kalmıyor

#### Site Info ve Public Metin Override'ları
- [ ] Site bilgileri düzenlenebiliyor
- [ ] Public metinler (content.home.*, content.scholarship.*, vb.) override edilebiliyor
- [ ] Override edilen değerler public sayfalarda görüntüleniyor
- [ ] Fallback mekanizması çalışıyor (settings yoksa defaultContent)

---

### 6. Dataset Yönetimi (Backend Test)

#### Orphan Dataset Kontrolü
- [ ] Event silindiğinde ilgili dataset'ler siliniyor
- [ ] Member CV değiştirildiğinde eski dataset siliniyor
- [ ] Favicon/logo değiştirildiğinde eski dataset siliniyor
- [ ] Orphan dataset kayıtları tespit edilebiliyor (test tool ile)

#### Link/Unlink Doğru Çalışıyor mu?
- [ ] `linkFileToEntity` doğru çalışıyor (unit test mevcut ✅)
- [ ] `unlinkAndDeleteFilesForEntity` doğru çalışıyor (unit test mevcut ✅)
- [ ] `replaceSingleFile` doğru çalışıyor (unit test mevcut ✅)

---

## Test Araçları

### Otomatik Testler
- [ ] `npm test` - Tüm unit testler geçiyor
- [ ] `npm test -- --coverage` - Coverage ≥80% (critical modules ≥90%)

### Manuel Test Senaryoları
- [ ] Her sayfa manuel olarak test edildi
- [ ] Her form manuel olarak test edildi
- [ ] Her API endpoint manuel olarak test edildi (Postman/curl)

### Browser Compatibility
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Responsive Design
- [ ] Mobile (320px - 768px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (1024px+)

---

## Notlar

- ✅ = Unit test mevcut
- ⚠️ = Unit test eklenmeli
- [ ] = Manuel test gerekli

## İlgili Dokümantasyon

- [Sprint 17 Completion](./../sprint-17-completion.md) - CV upload & dataset cleanup
- [Sprint 16 Completion](./../sprint-16-completion.md) - Burs başvurusu V2
- [File Lifecycle ADR](./../adr/001-file-lifecycle-and-dataset-cleanup.md)

