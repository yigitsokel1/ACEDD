# Sprint 10: Settings (Ayarlar) Modülü - Completion Report

**Sprint Tarihi:** 08.12.2025  
**Durum:** ✅ Tamamlandı  
**Doğrulama:** ✅ Beklenen Durum Sağlandı (bkz. `docs/sprint-10-verification.md`)

## Hedefler

Sprint 10'un ana hedefi site ayarlarını yönetmek için kapsamlı bir Settings modülü oluşturmaktı. Bu modül, site adı, logo, favicon, iletişim bilgileri, sosyal medya linkleri gibi tüm site genelindeki ayarları merkezi bir yerden yönetmeyi sağlıyor.

**Ana Hedefler:**
- Settings Prisma modeli oluşturuldu
- RESTful API endpoint'leri (`GET /api/settings`, `PUT /api/settings`)
- Admin UI sayfası (`/admin/ayarlar`) tabbed interface ile
- Public sayfalara entegrasyon (Header, Footer, layout metadata)
- Helper/service katmanı ile temiz mimari
- Kapsamlı test coverage (API + Helper)

## Tamamlanan Görevler

### ✅ Blok 10.1 — Prisma Modeli: SettingsStore

**Amaç:** Site ayarlarını saklamak için esnek bir key-value store modeli oluşturmak.

#### 10.1.1. Prisma Model Oluşturuldu

- [x] `prisma/schema.prisma` içinde `Setting` modeli eklendi
  - **Model Yapısı:**
    ```prisma
    model Setting {
      id        String   @id @default(uuid())
      key       String   @unique // Dot notation: site.name, contact.email, etc.
      value     Json?    // Flexible value storage (string, number, boolean, object, array)
      updatedAt DateTime @updatedAt
      updatedBy String?  // AdminUser ID
      
      @@index([key])
      @@index([updatedAt])
    }
    ```

**Özellikler:**
- **Key-Value Pattern:** Dot notation ile hiyerarşik key yapısı (`site.name`, `contact.email`, `social.instagram`)
- **Flexible Value Storage:** JSON tipi ile string, number, boolean, object, array değerleri saklanabilir
- **Audit Trail:** `updatedAt` ve `updatedBy` ile değişiklik takibi
- **Indexes:** `key` ve `updatedAt` üzerinde index'ler performans için

**Başarı kriteri:**
- ✅ Prisma model oluşturuldu
- ✅ Schema migration uygulandı (`prisma db push`)
- ✅ Model doğru yapılandırıldı

### ✅ Blok 10.2 — Node Tarafı (API): /api/settings

**Amaç:** Settings için RESTful API endpoint'leri oluşturmak.

#### 10.2.1. GET /api/settings

- [x] `src/app/api/settings/route.ts` oluşturuldu
  - **Endpoint:** `GET /api/settings`
  - **Query Parameters:**
    - `prefix?: string` - Key prefix filtresi (örn: `?prefix=site` → `site.*` ayarları)
  - **Auth:** `requireRole(request, ["SUPER_ADMIN"])`
  - **Response:** `Setting[]` (array of settings)
  - **Features:**
    - Prefix filtering: `prefix=site` → `site.name`, `site.description`, etc.
    - Alphabetical ordering by key
    - ISO 8601 date formatting

**Response Format:**
```json
[
  {
    "id": "uuid",
    "key": "site.name",
    "value": "ACEDD",
    "updatedAt": "2024-01-15T10:00:00.000Z",
    "updatedBy": "admin-user-id"
  },
  {
    "id": "uuid",
    "key": "site.description",
    "value": "Araştırma, Çevre ve Doğa Derneği",
    "updatedAt": "2024-01-15T10:00:00.000Z",
    "updatedBy": "admin-user-id"
  }
]
```

#### 10.2.2. PUT /api/settings

- [x] `PUT /api/settings` endpoint'i eklendi
  - **Body:** `UpsertSettingRequest`
    ```json
    {
      "key": "site.name",
      "value": "ACEDD"
    }
    ```
  - **Auth:** `requireRole(request, ["SUPER_ADMIN"])`
  - **Response:** `Setting` (upserted setting)
  - **Features:**
    - **Upsert Operation:** Create if not exists, update if exists
    - **Validation:**
      - Key required and non-empty
      - Value required (can be null)
      - Key must use dot notation (e.g., `site.name`)
    - **Auto-set `updatedBy`:** Session'dan admin user ID alınıyor

**Başarı kriteri:**
- ✅ GET endpoint çalışıyor
- ✅ PUT endpoint çalışıyor
- ✅ Prefix filtering çalışıyor
- ✅ Upsert operation çalışıyor
- ✅ RBAC doğru uygulanıyor (SUPER_ADMIN only)
- ✅ Validation doğru çalışıyor

### ✅ Blok 10.3 — Admin UI: Ayarlar Ana Sayfası

**Amaç:** Admin panelinde ayarları yönetmek için kullanıcı dostu bir UI oluşturmak.

#### 10.3.1. Settings Page Oluşturuldu

- [x] `src/app/(admin)/admin/ayarlar/page.tsx` oluşturuldu
  - **Route:** `/admin/ayarlar`
  - **Features:**
    - Tabbed interface (3 tab)
    - Client component (interactive tabs)
    - Responsive design

#### 10.3.2. Tab Components

**1. SiteInfoTab (Genel Site Bilgileri)**
- [x] `src/app/(admin)/admin/ayarlar/components/SiteInfoTab.tsx` oluşturuldu
  - **Fields:**
    - Site Adı (`site.name`)
    - Kısa Açıklama (`site.description`) - SEO metadata + footer'da gösterilir
    - Logo (`site.logoUrl`) - File upload with preview mode
    - Favicon (`site.faviconUrl`) - File upload with preview mode
    - Footer Metni (`footer.text`)
  - **Features:**
    - Preview mode: Logo/favicon değişiklikleri "Kaydet" butonuna basılmadan önce önizlenir
    - File upload: `FileUpload` component ile dosya yükleme
    - Bulk save: Tüm ayarlar tek "Kaydet" butonu ile kaydedilir
    - Form validation: Required fields ve error handling

**2. ContactInfoTab (İletişim Bilgileri)**
- [x] `src/app/(admin)/admin/ayarlar/components/ContactInfoTab.tsx` oluşturuldu
  - **Fields:**
    - E-posta (`contact.email`)
    - Telefon (`contact.phone`)
    - Adres (`contact.address`)
  - **Features:**
    - Bulk save: Tüm ayarlar tek "Kaydet" butonu ile kaydedilir
    - Form validation: Email format validation

**3. SocialMediaTab (Sosyal Medya)**
- [x] `src/app/(admin)/admin/ayarlar/components/SocialMediaTab.tsx` oluşturuldu
  - **Fields:**
    - Instagram (`social.instagram`)
    - Twitter (`social.twitter`)
    - Facebook (`social.facebook`)
    - LinkedIn (`social.linkedin`)
    - YouTube (`social.youtube`)
  - **Features:**
    - Bulk save: Tüm ayarlar tek "Kaydet" butonu ile kaydedilir
    - URL validation: Social media URL format validation

**Başarı kriteri:**
- ✅ Admin sayfası açılıyor (`/admin/ayarlar`)
- ✅ 3 tab düzgün çalışıyor
- ✅ Formlar doğru şekilde dolduruluyor (GET /api/settings)
- ✅ Ayarlar kaydediliyor (PUT /api/settings)
- ✅ Preview mode logo/favicon için çalışıyor
- ✅ File upload çalışıyor

### ✅ Blok 10.4 — Public Sayfalara Entegrasyon

**Amaç:** Ayarları public sayfalarda kullanmak (Header, Footer, metadata).

#### 10.4.1. Header Entegrasyonu

- [x] `src/components/layout/Header.tsx` güncellendi
  - **Değişiklikler:**
    - `logoUrl?: string | null` prop eklendi
    - Logo gösterimi: `<img>` tag ile `logoUrl` kullanılıyor
    - Fallback: Logo yüklenemezse default "A" div gösteriliyor

#### 10.4.2. Footer Entegrasyonu

- [x] `src/components/layout/Footer.tsx` güncellendi
  - **Değişiklikler:**
    - `siteDescription` fetch ediliyor (`getSiteDescription()`)
    - Site adının altında açıklama gösteriliyor
    - Sosyal medya linkleri: `getSocialLinks()` ile fetch ediliyor
    - Footer text: `getFooterText()` ile fetch ediliyor

#### 10.4.3. Layout Metadata Entegrasyonu

- [x] `src/app/layout.tsx` güncellendi
  - **Değişiklikler:**
    - `generateMetadata()` fonksiyonu güncellendi
    - Site name: `getSiteName()` ile fetch ediliyor
    - Site description: `getSiteDescription()` ile fetch ediliyor
    - Favicon: `getFaviconUrlWithTimestamp()` ile fetch ediliyor
    - Cache busting: Favicon için timestamp query parameter (`?t=${timestamp}`)

#### 10.4.4. ConditionalLayout Entegrasyonu

- [x] `src/components/layout/ConditionalLayout.tsx` güncellendi
  - **Değişiklikler:**
    - `getSiteName()` ve `getLogoUrl()` ile settings fetch ediliyor
    - `logoUrl` prop olarak `Header` component'ine geçiliyor

#### 10.4.5. Dynamic Favicon API Route

- [x] `src/app/api/favicon/route.ts` oluşturuldu
  - **Endpoint:** `GET /api/favicon`
  - **Features:**
    - Favicon'u `site.faviconUrl` setting'inden alıyor
    - Data URL'leri Base64'ten decode edip image response olarak döndürüyor
    - External URL'leri redirect ediyor
    - **Cache Busting:**
      - ETag header: `updatedAt` timestamp kullanılıyor
      - Cache-Control: `max-age=0, must-revalidate`
      - If-None-Match: 304 Not Modified support

**Başarı kriteri:**
- ✅ Header'da logo gösteriliyor
- ✅ Footer'da site açıklaması gösteriliyor
- ✅ Footer'da sosyal medya linkleri gösteriliyor
- ✅ Footer'da footer text gösteriliyor
- ✅ Page metadata'da site name ve description gösteriliyor
- ✅ Favicon dinamik olarak gösteriliyor
- ✅ Favicon cache busting çalışıyor

### ✅ Blok 10.5 — Helper & Service Katmanı

**Amaç:** Settings için helper/service fonksiyonları oluşturmak.

#### 10.5.1. Core Helper Functions

- [x] `src/lib/settings/getSetting.ts` oluşturuldu
  - **Functions:**
    - `getSetting(key: string): Promise<SettingValue>` - Tek bir setting getir
    - `getSettings(prefix: string): Promise<SettingsMap>` - Prefix'e göre settings getir
    - `getAllSettings(): Promise<SettingsMap>` - Tüm settings getir
    - `getSettingValue<T>(settings: SettingsMap, key: string, fallback: T): T` - Type-safe value extraction with fallback

**Type Definitions:**
```typescript
export type SettingValue = string | number | boolean | object | null | undefined;
export type SettingsMap = Record<string, SettingValue>;
```

#### 10.5.2. Convenience Functions

- [x] `src/lib/settings/convenience.ts` oluşturuldu
  - **Functions:**
    - `getSiteName(): Promise<string>` - Site adı (fallback: `SITE_CONFIG.shortName`)
    - `getSiteDescription(): Promise<string>` - Site açıklaması (fallback: `SITE_CONFIG.description`)
    - `getSocialLinks(): Promise<SocialLinks>` - Sosyal medya linkleri
    - `getContactInfo(): Promise<ContactInfo>` - İletişim bilgileri
    - `getFooterText(): Promise<string>` - Footer metni
    - `getLogoUrl(): Promise<string | null>` - Logo URL
    - `getFaviconUrl(): Promise<string | null>` - Favicon URL
    - `getFaviconUrlWithTimestamp(): Promise<{ url: string | null; timestamp: number | null }>` - Favicon URL + timestamp (cache busting için)

#### 10.5.3. Barrel Export

- [x] `src/lib/settings/index.ts` oluşturuldu
  - **Exports:**
    - Core functions: `getSetting`, `getSettings`, `getAllSettings`, `getSettingValue`
    - Types: `SettingValue`, `SettingsMap`
    - Convenience functions: `getSiteName`, `getSiteDescription`, `getSocialLinks`, `getContactInfo`, `getFooterText`, `getLogoUrl`, `getFaviconUrl`, `getFaviconUrlWithTimestamp`

**Başarı kriteri:**
- ✅ Helper functions oluşturuldu
- ✅ Convenience functions oluşturuldu
- ✅ Type safety sağlandı
- ✅ Fallback mekanizması çalışıyor
- ✅ Barrel export düzgün çalışıyor

### ✅ Blok 10.6 — Testler

**Amaç:** Settings API ve helper fonksiyonları için kapsamlı test coverage.

#### 10.6.1. API Testleri

- [x] `src/app/api/settings/__tests__/route.test.ts` oluşturuldu
  - **Test Senaryoları:**
    1. **GET /api/settings:**
       - Role-based access control: UNAUTHORIZED → 401, FORBIDDEN → 403, SUPER_ADMIN → 200
       - Prefix filtering: `?prefix=site` → sadece `site.*` settings
       - Response shape: Doğru format ve ISO date strings
       - Empty result: Prefix match yoksa boş array
    2. **PUT /api/settings:**
       - Role-based access control: UNAUTHORIZED → 401, FORBIDDEN → 403, SUPER_ADMIN → 200
       - Validation: Key required, value required, dot notation required
       - Upsert operation: Create new setting, update existing setting
       - Auto-set `updatedBy`: Session'dan admin user ID alınıyor
    3. **Error handling:**
       - Database errors → 500
       - Prisma unique constraint errors → 400

**Test Coverage:**
- ✅ 8+ test case (RBAC, prefix filtering, upsert, validation, error handling)
- ✅ Tüm kritik senaryolar kapsanıyor

#### 10.6.2. Helper Testleri

- [x] `src/lib/settings/__tests__/getSetting.test.ts` oluşturuldu
  - **Test Senaryoları:**
    1. **getSetting():**
       - Setting exists → value döndür
       - Setting not exists → null döndür
    2. **getSettings():**
       - Prefix filtering: `getSettings("site")` → `site.*` settings
       - Empty result: Prefix match yoksa boş object
    3. **getSettingValue():**
       - Value exists → value döndür
       - Value not exists → fallback döndür
       - Type safety: String fallback → string return, number fallback → number return
       - Null handling: `fallback === null` durumunda value döndür (null değil)
    4. **getAllSettings():**
       - All settings returned

**Test Coverage:**
- ✅ 10+ test case (getSetting, getSettings, getSettingValue, getAllSettings)
- ✅ Tüm kritik senaryolar kapsanıyor

**Başarı kriteri:**
- ✅ API testleri hazır ve çalışıyor
- ✅ Helper testleri hazır ve çalışıyor
- ✅ Tüm kritik senaryolar kapsanıyor

## Yeni/Oluşturulan Dosyalar

### Prisma Schema
- `prisma/schema.prisma` - `Setting` modeli eklendi

### API Layer
- `src/app/api/settings/route.ts` - Settings API endpoint (GET + PUT)
- `src/app/api/settings/__tests__/route.test.ts` - API testleri
- `src/app/api/favicon/route.ts` - Dynamic favicon API route

### Helper/Service Layer
- `src/lib/settings/getSetting.ts` - Core helper functions
- `src/lib/settings/convenience.ts` - Convenience functions
- `src/lib/settings/index.ts` - Barrel export
- `src/lib/settings/__tests__/getSetting.test.ts` - Helper testleri

### Type Definitions
- `src/lib/types/setting.ts` - Setting domain types

### Admin UI
- `src/app/(admin)/admin/ayarlar/page.tsx` - Settings page (tabbed interface)
- `src/app/(admin)/admin/ayarlar/components/SiteInfoTab.tsx` - Site info tab
- `src/app/(admin)/admin/ayarlar/components/ContactInfoTab.tsx` - Contact info tab
- `src/app/(admin)/admin/ayarlar/components/SocialMediaTab.tsx` - Social media tab
- `src/app/(admin)/admin/ayarlar/components/index.ts` - Component exports

### Public UI (Updated)
- `src/components/layout/Header.tsx` - Logo entegrasyonu
- `src/components/layout/Footer.tsx` - Site description, social links, footer text entegrasyonu
- `src/components/layout/ConditionalLayout.tsx` - Site name ve logo fetch
- `src/app/layout.tsx` - Metadata entegrasyonu (site name, description, favicon)

## Teknik Detaylar

### Key-Value Store Pattern

**Dot Notation:**
- `site.name` - Site adı
- `site.description` - Site açıklaması
- `site.logoUrl` - Logo URL
- `site.faviconUrl` - Favicon URL
- `contact.email` - E-posta
- `contact.phone` - Telefon
- `contact.address` - Adres
- `social.instagram` - Instagram URL
- `social.twitter` - Twitter URL
- `social.facebook` - Facebook URL
- `social.linkedin` - LinkedIn URL
- `social.youtube` - YouTube URL
- `footer.text` - Footer metni

**Avantajlar:**
1. **Flexibility:** Yeni ayarlar eklemek kolay (sadece key-value ekle)
2. **Organization:** Dot notation ile hiyerarşik yapı
3. **Type Safety:** TypeScript ile type-safe helper functions
4. **Scalability:** JSON value ile herhangi bir veri tipi saklanabilir

### Preview Mode (Logo/Favicon)

**Workflow:**
1. User file seçer → `FileUpload` component `onFileSelect` callback çağırır
2. Preview state'e eklenir → `previewFiles` state'ine `{ id, preview, file }` eklenir
3. Form data güncellenir → `formData.logoUrl`/`faviconUrl` preview URL ile güncellenir
4. UI'da önizleme gösterilir → `<img>` tag ile preview gösterilir
5. "Kaydet" butonuna basılır → Preview file'lar `/api/upload` ile yüklenir
6. Dataset ID'den fileUrl alınır → `/api/datasets/image/[id]` ile Base64 data URL alınır
7. Settings'e kaydedilir → `PUT /api/settings` ile `site.logoUrl`/`site.faviconUrl` güncellenir

**Avantajlar:**
- User değişiklikleri görebilir (preview)
- Sadece "Kaydet" butonuna basıldığında database'e kaydedilir
- Blob URL'ler database'e kaydedilmez (sadece preview için)

### Cache Busting (Favicon)

**Problem:** Browser favicon'u agresif şekilde cache'liyor, yeni favicon gösterilmiyor.

**Çözüm:**
1. **ETag Header:** `updatedAt` timestamp'i ETag olarak kullanılıyor
2. **Cache-Control:** `max-age=0, must-revalidate` ile cache devre dışı
3. **Query Parameter:** Layout metadata'da `?t=${timestamp}` ile cache busting
4. **If-None-Match:** 304 Not Modified support

**Implementation:**
- `getFaviconUrlWithTimestamp()`: Favicon URL + `updatedAt` timestamp döndürür
- `layout.tsx`: Metadata'da `?t=${timestamp}` query parameter ekler
- `api/favicon/route.ts`: ETag header ve Cache-Control headers set eder

### Error Handling

**API Level:**
- Auth errors: 401 (UNAUTHORIZED), 403 (FORBIDDEN)
- Validation errors: 400 (Bad Request)
- Database errors: 500 (Internal Server Error)

**UI Level:**
- Form validation: Field-level error messages
- General errors: Top-level error banner
- Loading states: Spinner ve disabled buttons
- Graceful fallback: Settings yoksa default değerler kullanılıyor

### Type Safety

**Type Definitions:**
- `SettingValue`: `string | number | boolean | object | null | undefined`
- `SettingsMap`: `Record<string, SettingValue>`
- `Setting`: Prisma model interface
- `UpsertSettingRequest`: API request interface

**Type-Safe Helpers:**
- `getSettingValue<T>(settings, key, fallback: T): T` - Generic type parameter ile type safety
- Convenience functions: Explicit return types

## Sonuç

Sprint 10 başarıyla tamamlandı. Settings modülü artık site genelindeki tüm ayarları merkezi bir yerden yönetmeyi sağlıyor. Admin panelinden ayarlar kolayca değiştirilebiliyor ve bu değişiklikler public sayfalara otomatik olarak yansıyor. Kapsamlı test coverage ve type safety ile kod kalitesi yüksek seviyede tutuldu.
