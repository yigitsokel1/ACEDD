# Unified Form Architecture - Best Practices Implementation

## 📐 Mimari Genel Bakış

Bu dokümantasyon, üye başvurusu ve burs başvurusu formları için oluşturulan **tutarlı ve modern mimariyi** açıklar. Best practices ve domain-driven design prensipleri kullanılarak inşa edilmiştir.

---

## 🏗️ Yapı Hiyerarşisi

```
src/
├── lib/
│   └── schemas/
│       └── common.ts              # Shared validation schemas (phone, email, TC, date, etc.)
│
├── modules/
│   ├── membership/
│   │   └── schemas.ts             # Membership-specific schemas
│   │
│   └── scholarship/
│       └── schemas.ts             # Scholarship-specific schemas (uses common.ts)
│
└── app/
    ├── (pages)/
    │   ├── uyelik-basvuru/
    │   │   └── components/
    │   │       └── MembershipForm.tsx
    │   │
    │   └── burs-basvuru/
    │       └── components/
    │           └── ScholarshipForm.tsx
    │
    └── api/
        ├── membership-applications/
        │   └── route.ts            # Uses MembershipApplicationSchema
        │
        └── scholarship-applications/
            └── route.ts             # Uses ScholarshipApplicationSchema
```

---

## 🎯 Temel Prensipler

### 1. **Single Source of Truth (Tek Kaynak)**

- **Schema**: Zod schema hem frontend hem backend'de kullanılır
- **Validation**: Validation kuralları tek yerde tanımlanır
- **Types**: TypeScript type'ları schema'dan otomatik infer edilir

```typescript
// ✅ DO: Schema'dan type çıkar
export type MembershipApplicationInput = z.infer<typeof MembershipApplicationSchema>;

// ❌ DON'T: Manuel type tanımlama
interface MembershipApplicationInput { ... }
```

### 2. **Shared Common Schemas**

Ortak validation'lar `src/lib/schemas/common.ts` altında toplanır:

- `phoneSchema` - Türk telefon numarası
- `emailSchema` - Email validation
- `tcNumberSchema` - TC Kimlik No
- `dateSchema` - Tarih (z.coerce.date)
- `nameSchema` - İsim/Soyisim
- `citySchema` - Şehir/Yer
- `addressSchema` - Adres
- `genderSchema` - Cinsiyet enum
- `bloodTypeSchema` - Kan grubu enum
- `ibanSchema` - IBAN validation
- `positiveFloatSchema` - Pozitif sayı
- `percentageSchema` - Yüzde (0-100)

**Kullanım:**
```typescript
import { phoneSchema, emailSchema, tcNumberSchema } from "@/lib/schemas/common";

export const MembershipApplicationSchema = z.object({
  phone: phoneSchema,      // ✅ Shared schema kullan
  email: emailSchema,      // ✅ Shared schema kullan
  identityNumber: tcNumberSchema,  // ✅ Shared schema kullan
});
```

### 3. **Domain-Specific Schemas**

Her domain kendi schema'sını tanımlar, ancak ortak alanlar için shared schemas kullanır:

```typescript
// src/modules/membership/schemas.ts
import { phoneSchema, emailSchema, nameSchema } from "@/lib/schemas/common";

export const MembershipApplicationSchema = z.object({
  firstName: nameSchema,        // Shared
  lastName: nameSchema,         // Shared
  phone: phoneSchema,           // Shared
  email: emailSchema,           // Shared
  bloodType: bloodTypeSchema,   // Shared
  // ... domain-specific fields
});
```

### 4. **API Validation Pattern**

Tüm API route'ları aynı pattern'i kullanır:

```typescript
// ✅ DO: Zod schema ile validate et
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Zod validation (single source of truth)
    const validatedData = MembershipApplicationSchema.parse(body);
    
    // Business logic...
    const application = await prisma.membershipApplication.create({
      data: validatedData,
    });
    
    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return NextResponse.json(
        { error: "Form validasyonu başarısız oldu", errors: error.errors },
        { status: 400 }
      );
    }
    // Handle other errors...
  }
}
```

### 5. **Frontend Form Pattern**

Tüm form component'leri aynı pattern'i kullanır:

```typescript
// ✅ DO: Schema'dan type çıkar ve kullan
import { MembershipApplicationSchema, MembershipApplicationInput } from "@/modules/membership/schemas";

export function MembershipForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MembershipApplicationInput>({
    resolver: zodResolver(MembershipApplicationSchema),
    // ...
  });
  
  const onSubmit = async (data: MembershipApplicationInput) => {
    // Submit to API...
  };
}
```

---

## 🔒 Güvenlik Best Practices

### 1. **reCAPTCHA Integration**

Tüm public formlar reCAPTCHA kullanır:

```typescript
// Frontend
<Recaptcha
  siteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
  onVerify={setRecaptchaToken}
/>

// Backend
const isRecaptchaValid = await verifyRecaptchaToken(recaptchaToken, secretKey);
if (!isRecaptchaValid) {
  return NextResponse.json({ error: "reCAPTCHA doğrulaması başarısız" }, { status: 403 });
}
```

### 2. **Rate Limiting**

Tüm public API endpoint'leri rate limiting kullanır:

```typescript
const rateLimitResult = checkRateLimit(clientIp);
if (!rateLimitResult.allowed) {
  return NextResponse.json(
    { error: "Çok fazla istek gönderdiniz" },
    { status: 429 }
  );
}
```

### 3. **Secure Logging**

Hassas veriler loglanmaz:

```typescript
// ✅ DO: Sadece metadata logla
logErrorSecurely("[API][MEMBERSHIP][CREATE]", error, {
  ipAddress,
  emailDomain: validatedData.email.split("@")[1], // Sadece domain
});

// ❌ DON'T: Hassas verileri logla
console.log("User data:", validatedData); // ❌
```

---

## 📅 Date Handling

Tutarlı date handling için:

1. **Schema**: `z.coerce.date()` kullan
2. **Input**: HTML `type="date"` input'ları string döner
3. **Normalization**: `normalizeDateInput` helper kullan (gerekirse)
4. **Storage**: Prisma `DateTime` field'ına kaydet

```typescript
// Schema
birthDate: dateSchema,  // z.coerce.date()

// Form
<Input type="date" {...register("birthDate")} />

// API
const validatedData = MembershipApplicationSchema.parse(body);
// validatedData.birthDate is already a Date object
```

---

## 🧪 Testing Strategy

### Schema Unit Tests

Her schema için unit test yaz:

```typescript
// src/modules/membership/__tests__/schemas.test.ts
describe("MembershipApplicationSchema", () => {
  it("should pass with valid data", () => {
    const validData = { /* ... */ };
    const result = MembershipApplicationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
  
  it("should fail with invalid email", () => {
    const invalidData = { email: "invalid-email" };
    const result = MembershipApplicationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
```

### Integration Tests

API route'ları için integration test yaz:

```typescript
// src/app/api/membership-applications/__tests__/route.test.ts
describe("POST /api/membership-applications", () => {
  it("should create application with valid data", async () => {
    const response = await POST(request);
    expect(response.status).toBe(201);
  });
  
  it("should reject invalid data", async () => {
    const invalidRequest = new NextRequest("...", {
      body: JSON.stringify({ email: "invalid" }),
    });
    const response = await POST(invalidRequest);
    expect(response.status).toBe(400);
  });
});
```

---

## 📊 Karşılaştırma: Eski vs Yeni Yapı

| Özellik | Eski Yapı | Yeni Yapı |
|---------|-----------|-----------|
| **Schema Location** | Component içinde | `src/modules/*/schemas.ts` |
| **API Validation** | 200+ satır manuel if-else | Zod schema (20 satır) |
| **Shared Schemas** | Yok (her yerde tekrar) | `src/lib/schemas/common.ts` |
| **Type Safety** | Manuel type tanımlama | Schema'dan otomatik inference |
| **Date Handling** | String + `new Date()` | `z.coerce.date()` |
| **reCAPTCHA** | Yok (üye formu) | Her iki formda var |
| **Test Coverage** | Yok | Schema + API tests |
| **Maintainability** | Düşük (kod tekrarı) | Yüksek (DRY principle) |

---

## 🚀 Kullanım Örnekleri

### Yeni Form Ekleme

1. **Shared schema kullan** (varsa):
```typescript
import { phoneSchema, emailSchema } from "@/lib/schemas/common";
```

2. **Domain schema oluştur**:
```typescript
// src/modules/new-domain/schemas.ts
export const NewFormSchema = z.object({
  phone: phoneSchema,  // Shared
  email: emailSchema,  // Shared
  // ... domain-specific fields
});
```

3. **API route'da kullan**:
```typescript
const validatedData = NewFormSchema.parse(body);
```

4. **Form component'inde kullan**:
```typescript
const { register } = useForm<z.infer<typeof NewFormSchema>>({
  resolver: zodResolver(NewFormSchema),
});
```

---

## ✅ Checklist: Yeni Form Ekleme

- [ ] Shared schema'ları kullan (phone, email, TC, etc.)
- [ ] Domain-specific schema oluştur (`src/modules/*/schemas.ts`)
- [ ] API route'da Zod validation kullan
- [ ] reCAPTCHA ekle (public formlar için)
- [ ] Rate limiting ekle
- [ ] Secure logging kullan
- [ ] Schema unit testleri yaz
- [ ] API integration testleri yaz
- [ ] Date handling tutarlı (z.coerce.date)
- [ ] Type'ları schema'dan çıkar (manuel tanımlama yok)

---

## 📚 Referanslar

- **Zod Documentation**: https://zod.dev
- **React Hook Form**: https://react-hook-form.com
- **Next.js API Routes**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- **Domain-Driven Design**: https://martinfowler.com/bliki/DomainDrivenDesign.html

---

## 🔄 Migration Guide

Mevcut formları yeni yapıya taşımak için:

1. Schema'yı component'ten çıkar → `src/modules/*/schemas.ts`
2. Shared schema'ları kullan → `src/lib/schemas/common.ts`
3. API validation'ı Zod'a taşı → Manuel if-else'leri kaldır
4. reCAPTCHA ekle → Güvenlik
5. Test yaz → Schema + API tests
6. Dokümantasyon güncelle → README, ADR

---

**Son Güncelleme**: 2024-12-XX
**Versiyon**: 1.0.0

