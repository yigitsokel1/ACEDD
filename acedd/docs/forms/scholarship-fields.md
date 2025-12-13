# Burs Başvurusu Formu - Alan Envanteri

**Sprint:** 16 - Block 0  
**Tarih:** 11.12.2025  
**Durum:** Referans Dokümantasyon

Bu dokümantasyon, burs başvurusu formundaki tüm alanların tek kaynak gerçeği (single source of truth) olarak kullanılacaktır. Sprint 16 boyunca tüm geliştirmeler bu dokümantasyona göre yapılacaktır.

---

## Statik Alanlar (Static Fields)

### Genel Bilgi (General Information)

| Alan Adı | Form Field Name | Tip | Zorunlu | Min Length | Max Length | Validasyon Kuralları | Notlar |
|----------|----------------|-----|---------|------------|------------|---------------------|--------|
| İsim | `name` | `string` | ✅ Evet | 2 | - | Türkçe karakter desteği | Ad |
| Soyisim | `surname` | `string` | ✅ Evet | 2 | - | Türkçe karakter desteği | Soyad |
| Telefon numarası | `phone` | `string` | ✅ Evet | 10 | 15 | Türk telefon formatı (örn: 05551234567) | Ana telefon |
| Alternatif İletişim numarası | `alternativePhone` | `string` | ❌ Hayır | 10 | 15 | Türk telefon formatı | Opsiyonel ikinci telefon |
| E-posta | `email` | `string` | ✅ Evet | 5 | 255 | Email formatı, domain validation | Unique constraint |
| Doğum Tarihi | `birthDate` | `date` | ✅ Evet | - | - | Geçerli tarih, geçmiş tarih | ISO 8601 format |
| Cinsiyet | `gender` | `enum` | ✅ Evet | - | - | "Erkek" veya "Kadın" | Select dropdown |
| Doğum yeri | `birthPlace` | `string` | ✅ Evet | 2 | 100 | Şehir/İl adı | Türkçe karakter |
| Memleket | `hometown` | `string` | ✅ Evet | 2 | 100 | Şehir/İl adı | Türkçe karakter |
| TC Kimlik No | `tcNumber` | `string` | ✅ Evet | 11 | 11 | TC Kimlik algoritması (checksum) | Unique, numeric only |
| Kimlik veriliş tarihi | `idIssueDate` | `date` | ✅ Evet | - | - | Geçerli tarih, geçmiş tarih | ISO 8601 format |
| Verildiği yer | `idIssuePlace` | `string` | ✅ Evet | 2 | 100 | İl/İlçe adı | Türkçe karakter |
| Medeni hâl | `maritalStatus` | `enum` | ✅ Evet | - | - | "Bekar", "Evli", "Boşanmış", "Dul" | Select dropdown |

### Banka Bilgileri (Bank Information)

| Alan Adı | Form Field Name | Tip | Zorunlu | Min Length | Max Length | Validasyon Kuralları | Notlar |
|----------|----------------|-----|---------|------------|------------|---------------------|--------|
| Banka hesabınız (banka adı) | `bankAccount` | `string` | ✅ Evet | 2 | 100 | Banka adı | Türkçe karakter |
| IBAN NO | `ibanNumber` | `string` | ✅ Evet | 26 | 34 | IBAN formatı (TR ile başlamalı) | Türkiye IBAN formatı |

### Üniversite Bilgileri (University Information)

| Alan Adı | Form Field Name | Tip | Zorunlu | Min Length | Max Length | Validasyon Kuralları | Notlar |
|----------|----------------|-----|---------|------------|------------|---------------------|--------|
| Üniversiteniz | `university` | `string` | ✅ Evet | 2 | 200 | Üniversite adı | Türkçe karakter |
| Fakülte / Bölüm | `faculty` | `string` | ✅ Evet | 2 | 200 | Fakülte/Bölüm adı | Türkçe karakter |
| Bölüm (opsiyonel) | `department` | `string` | ❌ Hayır | 2 | 200 | Bölüm adı | Alt bölüm, opsiyonel |
| Hangi sınıf | `grade` | `string` | ✅ Evet | 1 | 10 | Sınıf bilgisi (örn: "1", "2", "3", "4", "Hazırlık") | Select veya input |
| Türkiye sıralamanız | `turkeyRanking` | `number` | ❌ Hayır | 1 | 9999999 | Pozitif integer | Opsiyonel, sadece sayısal |

### Sağlık ve Engellilik (Health & Disability)

| Alan Adı | Form Field Name | Tip | Zorunlu | Min Length | Max Length | Validasyon Kuralları | Notlar |
|----------|----------------|-----|---------|------------|------------|---------------------|--------|
| Fiziksel engeliniz var mı? | `physicalDisability` | `enum` | ✅ Evet | - | - | "Evet" veya "Hayır" | Select dropdown |
| Sağlık sorununuz var mı? | `healthProblem` | `enum` | ✅ Evet | - | - | "Evet" veya "Hayır" | Select dropdown |

### Aile Bilgileri (Family Information)

| Alan Adı | Form Field Name | Tip | Zorunlu | Min/Max | Validasyon Kuralları | Notlar |
|----------|----------------|-----|---------|---------|---------------------|--------|
| Ailenizin aylık toplam geliri | `familyMonthlyIncome` | `number` | ✅ Evet | Min: 0 | Pozitif sayı (Float) | TL cinsinden, decimal destekli |
| Ailenizin aylık toplam zorunlu gideri | `familyMonthlyExpenses` | `number` | ✅ Evet | Min: 0 | Pozitif sayı (Float) | TL cinsinden, decimal destekli |
| Burs veya kredi geliriniz var mı? | `scholarshipIncome` | `enum` | ✅ Evet | - | - | "Evet" veya "Hayır" | Select dropdown |

### Adres Bilgileri (Address Information)

| Alan Adı | Form Field Name | Tip | Zorunlu | Min Length | Max Length | Validasyon Kuralları | Notlar |
|----------|----------------|-----|---------|------------|------------|---------------------|--------|
| Daimî ikamet adresiniz | `permanentAddress` | `text` | ✅ Evet | 10 | 1000 | Tam adres bilgisi | Textarea, çok satırlı |
| Mevcut konaklama | `currentAccommodation` | `text` | ✅ Evet | 2 | 500 | Konaklama durumu açıklaması | Textarea, çok satırlı |

### Ek Bilgiler (Additional Information)

| Alan Adı | Form Field Name | Tip | Zorunlu | Min Length | Max Length | Validasyon Kuralları | Notlar |
|----------|----------------|-----|---------|------------|------------|---------------------|--------|
| Kendini tanıt | `selfIntroduction` | `text` | ✅ Evet | 20 | 2000 | Kişisel tanıtım metni | Textarea, zorunlu |
| İlgi alanları | `interests` | `text` | ❌ Hayır | - | 1000 | İlgi alanları açıklaması | Textarea, opsiyonel |

---

## Dinamik Alanlar (Dynamic Fields)

### A) Yaşamakta olan akrabalar (Relatives)

**Koleksiyon:** `relatives` (Array)  
**Min Kayıt:** 1  
**Max Kayıt:** 50 (önerilen limit)

Her akraba kaydı için alanlar:

| Alan Adı | Form Field Name | Tip | Zorunlu | Min Length | Max Length | Validasyon Kuralları | Notlar |
|----------|----------------|-----|---------|------------|------------|---------------------|--------|
| Akrabalık derecesi | `kinship` | `enum` | ✅ Evet | - | - | "Anne", "Baba", "Kardeş", "Eş", "Çocuk", vb. | Select dropdown |
| İsim | `name` | `string` | ✅ Evet | 2 | 100 | Türkçe karakter desteği | Ad |
| Soyisim | `surname` | `string` | ✅ Evet | 2 | 100 | Türkçe karakter desteği | Soyad |
| Doğum Tarihi | `birthDate` | `date` | ✅ Evet | - | - | Geçerli tarih, geçmiş tarih | ISO 8601 format |
| Öğrenim durumu | `education` | `string` | ✅ Evet | 1 | 100 | Eğitim seviyesi | Select veya input |
| Meslek | `occupation` | `string` | ✅ Evet | 1 | 100 | Meslek adı | Türkçe karakter |
| İş | `job` | `string` | ✅ Evet | 1 | 200 | İş yeri/bölüm bilgisi | Türkçe karakter |
| Sağlık Sigortası | `healthInsurance` | `enum` | ✅ Evet | - | - | "Var", "Yok", "SGK", "Özel", vb. | Select dropdown |
| Sağlık engeli | `healthDisability` | `enum` | ✅ Evet | - | - | "Evet" veya "Hayır" | Select dropdown |
| Gelir | `income` | `number` | ✅ Evet | Min: 0 | - | Pozitif sayı (Float) | TL cinsinden, decimal destekli |
| Telefon | `phone` | `string` | ✅ Evet | 10 | 15 | Türk telefon formatı | Türkçe format |
| Eklemek istedikleriniz | `additionalNotes` | `text` | ❌ Hayır | - | 500 | Ek notlar | Textarea, opsiyonel |

**CRUD İşlemleri (Sadece Public Form):**
- ✅ Ekleme (Add)
- ✅ Düzenleme (Edit)
- ✅ Silme (Delete)
- ❌ Admin panelinde read-only

### B) Girmiş olduğunuz okullar (Education History)

**Koleksiyon:** `educationHistory` (Array)  
**Min Kayıt:** 1  
**Max Kayıt:** 50 (önerilen limit)

Her okul kaydı için alanlar:

| Alan Adı | Form Field Name | Tip | Zorunlu | Min Length | Max Length | Validasyon Kuralları | Notlar |
|----------|----------------|-----|---------|------------|------------|---------------------|--------|
| Gittiğiniz Okul | `schoolName` | `string` | ✅ Evet | 2 | 200 | Okul adı | Türkçe karakter |
| Başlama | `startDate` | `date` | ✅ Evet | - | - | Geçerli tarih | ISO 8601 format, bitiş tarihinden önce olmalı |
| Bitiş | `endDate` | `date` | ✅ Evet | - | - | Geçerli tarih | ISO 8601 format, başlangıç tarihinden sonra olmalı |
| Mezuniyet | `graduation` | `enum` | ✅ Evet | - | - | "Evet" veya "Hayır" | Select dropdown |
| Bölüm | `department` | `string` | ✅ Evet | 1 | 200 | Bölüm/alan bilgisi | Türkçe karakter |
| Yüzde | `percentage` | `number` | ✅ Evet | 0 | 100 | 0-100 arası sayı | Mezuniyet notu/başarı yüzdesi |

**CRUD İşlemleri (Sadece Public Form):**
- ✅ Ekleme (Add)
- ✅ Düzenleme (Edit)
- ✅ Silme (Delete)
- ❌ Admin panelinde read-only

### C) Referanslar (References)

**Koleksiyon:** `references` (Array)  
**Min Kayıt:** 1  
**Max Kayıt:** 20 (önerilen limit)

Her referans kaydı için alanlar:

| Alan Adı | Form Field Name | Tip | Zorunlu | Min Length | Max Length | Validasyon Kuralları | Notlar |
|----------|----------------|-----|---------|------------|------------|---------------------|--------|
| İlişki | `relationship` | `string` | ✅ Evet | 1 | 100 | İlişki derecesi (örn: "Hoca", "İş Arkadaşı", "Akraba") | Türkçe karakter |
| İsim | `fullName` | `string` | ✅ Evet | 2 | 200 | Ad Soyad (birleşik) | Türkçe karakter |
| ACEDD üyesi mi? | `isAcddMember` | `boolean` | ✅ Evet | - | - | "Evet" veya "Hayır" | Select dropdown, boolean mapping |
| İş | `job` | `string` | ✅ Evet | 1 | 200 | İş/Meslek bilgisi | Türkçe karakter |
| Adres | `address` | `text` | ✅ Evet | 10 | 500 | Tam adres bilgisi | Textarea, çok satırlı |
| Telefon | `phone` | `string` | ✅ Evet | 10 | 15 | Türk telefon formatı | Türkçe format |

**CRUD İşlemleri (Sadece Public Form):**
- ✅ Ekleme (Add)
- ✅ Düzenleme (Edit)
- ✅ Silme (Delete)
- ❌ Admin panelinde read-only

---

## Field Mapping & Naming Conventions

### Database Field Names (Prisma)

**Sprint 16 - Block A:** Relational tables kullanılıyor (JSON field'lar yerine)

- Form'da `name` + `surname` → DB'de `firstName` + `lastName` (ayrı field'lar)
- Form'da `tcNumber` → DB'de `nationalId`
- Form'da `bankAccount` → DB'de `bankName`
- Form'da `ibanNumber` → DB'de `iban`
- Form'da `grade` → DB'de `classYear`
- Form'da `turkeyRanking` → DB'de `turkiyeRanking` (Int?, nullable)
- Form'da `physicalDisability` → DB'de `hasPhysicalDisability`
- Form'da `healthProblem` → DB'de `hasHealthIssue`
- Form'da `familyMonthlyExpenses` → DB'de `familyMonthlyMandatoryExpenses`
- Form'da `scholarshipIncome` → DB'de `hasScholarshipOrLoan`
- Form'da `selfIntroduction` → DB'de `aboutYourself`
- Form'da `alternativePhone` → DB'de `referenceContactPhone`

**Dinamik Alanlar (Relational Tables):**
- `relatives` → `Relative` table (1-N relationship)
  - Form: `kinship` → DB: `degree`
  - Form: `name` + `surname` → DB: `firstName` + `lastName`
  - Form: `education` → DB: `educationStatus`
  - Form: `job` → DB: `workplace`
  - Form: `additionalNotes` → DB: `notes`
- `educationHistory` → `EducationHistory` table (1-N relationship)
  - Form: `graduation` ("Evet"/"Hayır") → DB: `isGraduated` (boolean)
  - Form: `percentage` → DB: `gradePercent`
- `references` → `Reference` table (1-N relationship)
  - Form: `fullName` → DB: `firstName` + `lastName` (split)
  - Form: `isAcddMember` ("Evet"/"Hayır") → DB: `isAceddMember` (boolean)

### TypeScript Interface Mapping

```typescript
// Form submission
CreateScholarshipApplicationRequest {
  name: string;
  surname: string;
  // ...
  relatives: ScholarshipRelative[];
  educationHistory: ScholarshipEducationHistory[];
  references: ScholarshipReference[];
}

// Database model
ScholarshipApplication {
  fullName: string; // name + surname birleştirilmiş
  // ...
  relatives: Json?; // ScholarshipRelative[] array olarak
  educationHistory: Json?; // ScholarshipEducationHistory[] array olarak
  references: Json?; // ScholarshipReference[] array olarak
}
```

---

## Validation Rules Summary

### String Fields
- Minimum length: 2 karakter (genel kural)
- Özel durumlar:
  - `tcNumber`: 11 karakter (sabit)
  - `ibanNumber`: 26-34 karakter
  - `phone`: 10-15 karakter
  - `selfIntroduction`: 20 karakter minimum

### Number Fields
- `familyMonthlyIncome`, `familyMonthlyExpenses`, `income`: Float, min: 0
- `turkeyRanking`: Int, min: 1, nullable
- `percentage`: Number, 0-100 arası

### Date Fields
- Format: ISO 8601 (YYYY-MM-DD)
- Validation: Geçerli tarih, geçmiş tarih kontrolü
- `endDate` > `startDate` (education history için)

### Enum Fields
- `gender`: ["Erkek", "Kadın"]
- `maritalStatus`: ["Bekar", "Evli", "Boşanmış", "Dul"]
- `physicalDisability`, `healthProblem`, `scholarshipIncome`: ["Evet", "Hayır"]
- `graduation`: ["Evet", "Hayır"]
- `isAcddMember`: ["Evet", "Hayır"] (boolean mapping)

---

## Special Notes

1. **FullName Handling:**
   - Form'da `name` ve `surname` ayrı alanlar
   - Database'de `fullName` olarak birleştirilmiş saklanır
   - Display'de her zaman birleşik gösterilir

2. **Dynamic Fields Relational Storage (Sprint 16 - Block A):**
   - Dinamik alanlar (relatives, educationHistory, references) relational tablolarda saklanır
   - Prisma'da `Relative`, `EducationHistory`, `Reference` modelleri kullanılır
   - 1-N relationship: `ScholarshipApplication` → `Relative`, `EducationHistory`, `Reference`
   - `ON DELETE CASCADE` ile başvuru silindiğinde ilişkili kayıtlar da silinir

3. **Optional Fields:**
   - `alternativePhone`: Opsiyonel
   - `department`: Opsiyonel (alt bölüm)
   - `turkeyRanking`: Opsiyonel (nullable)
   - `interests`: Opsiyonel
   - `additionalNotes` (relative): Opsiyonel

4. **Minimum Array Requirements:**
   - `relatives`: En az 1 kayıt zorunlu
   - `educationHistory`: En az 1 kayıt zorunlu
   - `references`: En az 1 kayıt zorunlu

5. **CRUD Restrictions:**
   - Dinamik alanlarda CRUD sadece public form'da yapılabilir
   - Admin panelinde sadece read-only görüntüleme

---

## Related Documents

- Prisma Schema: `prisma/schema.prisma` (ScholarshipApplication, Relative, EducationHistory, Reference models)
- Zod Schemas: `src/modules/scholarship/schemas.ts` (Single source of truth for validation)
- TypeScript Types: `src/lib/types/scholarship.ts`
- Form Constants: `src/app/(pages)/burs-basvuru/constants.ts`
- Form Component: `src/app/(pages)/burs-basvuru/components/ScholarshipForm.tsx`
- API Routes: `src/app/api/scholarship-applications/route.ts` (POST), `src/app/api/scholarship-applications/[id]/route.ts` (GET, PUT, DELETE)
- Admin Detail Page: `src/app/(admin)/admin/burs-basvurulari/[id]/page.tsx` (V2 read-only)

---

**Son Güncelleme:** 11.12.2025  
**Sprint 16 - Block A, B, C, D, E, F Tamamlandı**

