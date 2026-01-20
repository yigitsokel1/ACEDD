# Admin Kullanıcı Oluşturma

İlk veya yeni admin oluşturmanın iki yolu vardır. **Önerilen:** `npm run create-admin` (CLI).

---

## 1. CLI: `create-admin` script (Önerilen)

**Konum:** `scripts/create-admin.ts`  
**Çalıştırma:** `npm run create-admin` veya `npx tsx scripts/create-admin.ts`

### Kullanım

```bash
npm run create-admin <email> <password> <name> [role]
```

### Örnekler

```bash
# İlk admin (SUPER_ADMIN, varsayılan rol)
npm run create-admin admin@acedd.org "güçlü-şifre-123" "Admin Adı"

# ADMIN rolü ile
npm run create-admin editor@acedd.org "güçlü-şifre" "Editör" ADMIN

# npx ile doğrudan
npx tsx scripts/create-admin.ts admin@acedd.org "şifre" "Admin" SUPER_ADMIN
```

### Parametreler

| Parametre | Zorunlu | Açıklama |
|-----------|---------|----------|
| `email`   | Evet    | Geçerli email (`@` ve `.` içermeli) |
| `password`| Evet    | En az 6 karakter |
| `name`    | Evet    | Görünen ad |
| `role`    | Hayır   | `SUPER_ADMIN` (varsayılan) veya `ADMIN` |

### Davranış

- **Sadece yeni kullanıcı oluşturur.** Aynı email ile kayıt varsa `Error: Admin user with email ... already exists` ile çıkar; şifre veya diğer alanları **güncellemez**.
- `.env` yüklenir (`dotenv/config`); `DATABASE_URL` ve DB erişimi gerekir.
- Şifre `bcrypt` ile 10 round hash’lenir, `isActive: true` atanır.

---

## 2. API: `POST /api/admin/create-initial`

**Konum:** `src/app/api/admin/create-initial/route.ts`

### Açma

Varsayılan: **kapalı**. Açmak için:

```env
ALLOW_CREATE_INITIAL=true
```

`env.example`’da açıklama: Production’da açmak önerilmez; ilk kurulum sonrası kapat.

### İstek

```http
POST /api/admin/create-initial
Content-Type: application/json

{
  "email": "admin@acedd.org",
  "password": "güçlü-şifre",
  "name": "Admin Adı",
  "role": "SUPER_ADMIN"
}
```

`role` opsiyonel; yoksa `SUPER_ADMIN`.

### Davranış

- `ALLOW_CREATE_INITIAL !== "true"` ise **403:** *"Bu endpoint şu anda devre dışı. Lütfen script kullanın: npm run create-admin"*
- Email/şifre/isim/rol validasyonu (CLI ile aynı kurallar).
- **Sadece yeni kullanıcı oluşturur.** Email mevcutsa **409** döner; güncelleme yapmaz.

---

## Şifre sıfırlama

`create-admin` ve `create-initial` **mevcut kullanıcının şifresini güncellemez**. Şifre sıfırı için:

- **Runbook:** [Admin Password Reset → Manual Password Reset (Database)](./runbook.md#manual-password-reset-database): bcrypt hash üretip `AdminUser.passwordHash` güncelleme.
- Prisma Studio veya SQL ile `AdminUser` tablosunda `passwordHash` alanını elle değiştirme.

---

## Özet

| Yöntem                | Ne zaman kullanılır        | Güncelleme (şifre/ad) |
|-----------------------|----------------------------|------------------------|
| `npm run create-admin`| Her zaman (önerilen)       | Hayır, sadece yeni     |
| `POST /api/admin/create-initial` | İlk kurulum, `ALLOW_CREATE_INITIAL=true` | Hayır, sadece yeni |
| Manuel DB / Prisma Studio | Şifre sıfırlama       | Evet                   |
