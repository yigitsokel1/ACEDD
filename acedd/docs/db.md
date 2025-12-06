# Veritabanı Topolojisi ve Ortam Stratejisi

Bu dokümantasyon, ACEDD projesinde kullanılan veritabanı ortamları ve migration stratejisini açıklar.

## Ortamlar

### 1. Şu Anki Durum (Sprint 0 - Prod Release Öncesi)

**Durum:** Şu an tek bir veritabanı kullanılıyor. Bu DB hem geliştirme hem de ilk yayın için kullanılıyor.

**Veritabanı:**
- `DATABASE_URL` → Tek veritabanı (Plesk veya local MariaDB)
- **Not:** Şu an bu DB geliştirme ve ilk yayın için kullanılıyor. Prod release'ten sonra bu DB prod sayılacak ve ayrı dev DB açılacak.

**Schema Değişikliği Workflow (Şu An):**
- ✅ `prisma db push` → Schema değişikliklerini direkt DB'ye uygular
  - Tablo/kolonlar bu DB'de güncellenir
  - Shadow DB'ye ihtiyaç duymaz
  - Migration dosyası üretilmez (şimdilik sorun değil)
- ✅ `prisma studio` → Tabloları görsel olarak kontrol etmek için

**Kurulum:**
1. Veritabanı hazırla (Plesk'te veya local MariaDB)
2. `.env` dosyasında sadece `DATABASE_URL` tanımla
3. Schema'yı düzenle (`prisma/schema.prisma`)
4. Schema'yı DB'ye uygula: `npx prisma db push`
5. Bağlantıyı doğrula: `npx prisma studio` veya test route'u çağır

### 2. Prod Release Sonrası

**Durum:** Prod release öncesi/sonrası bir noktada, şu anki DB prod sayılacak ve ayrı dev DB açılacak.

**Geçiş Adımları:**
1. Şu an kullandığınız DB'yi prod ilan edin
2. Bu DB'den bir kopya/dump alın
3. Yeni bir dev DB oluşturun (kopyadan veya dump'tan)
4. Dev DB üzerinde:
   - Gerekirse `npx prisma db pull` ile mevcut schema'yı senkronlayın
   - Sonra `npx prisma migrate dev` + shadow düzenine geçin

**Production Veritabanı:**
- `DATABASE_URL` → Production MariaDB veritabanı (Plesk panelinde tanımlı)
- `SHADOW_DATABASE_URL` → **Kullanılmaz** (production'da shadow DB gerekmez)

**Migration Komutları:**
- ❌ `prisma migrate dev` → **ASLA kullanılmaz** (shadow DB gerektirir)
- ✅ `prisma migrate deploy` → Önceden oluşturulmuş migration dosyalarını uygular
- ❌ `prisma db push` → **Kullanılmaz** (migration geçmişi oluşturmaz)

**Deployment Workflow (Prod Release Sonrası):**
1. Dev DB'de migration dosyalarını oluştur: `npx prisma migrate dev --name descriptive_name`
2. Migration dosyalarını commit et
3. Plesk'e kod deploy et
4. Plesk'te (prod DB'de): `npx prisma migrate deploy` çalıştır

**Not:** Şu an (Sprint 0) bu workflow henüz aktif değil. Prod release'ten sonra devreye girecek.

## Environment Variables

### DATABASE_URL

**Açıklama:** Aktif veritabanı bağlantı string'i. Ortama göre dev veya prod DB'yi gösterir.

**Format:**
```
mysql://[user]:[password]@[host]:[port]/[database]
```

**Örnekler:**
- Local: `mysql://root:password@localhost:3306/acedd_dev`
- Production: Plesk panelinde tanımlı (repo'ya girmez)

### SHADOW_DATABASE_URL

**Açıklama:** (Opsiyonel) Shadow database bağlantı string'i. Genellikle tanımlamaya gerek yok.

**Strateji:**
- `.env` dosyasında `SHADOW_DATABASE_URL` tanımlamaya gerek yok
- Prisma, `prisma migrate dev` çalıştırıldığında otomatik shadow DB oluşturmaya çalışır
- Eğer DB kullanıcısının `CREATE DATABASE` yetkisi varsa, Prisma otomatik oluşturur
- Yetki yoksa ve hata alırsanız, o zaman manuel shadow DB oluşturup bu değişkende tanımlayın

**Format (sadece gerekirse):**
```
mysql://[user]:[password]@[host]:[port]/[shadow_database]
```

**Örnek (sadece gerekirse):**
```
SHADOW_DATABASE_URL="mysql://root:password@localhost:3306/acedd_shadow"
```

## Migration Stratejisi Özeti

### Schema Değişikliği Workflow (Şu Anki Durum - Prod Release Öncesi)

**Tek DB Stratejisi:** Şu an tek DB kullanılıyor (geliştirme ve ilk yayın için).

```bash
# 1. Schema değişikliği yap (prisma/schema.prisma)
# 2. Schema'yı DB'ye uygula (migration dosyası üretilmez)
npx prisma db push

# ✅ Tablo/kolonlar bu DB'de güncellenir
# ✅ Shadow DB'ye ihtiyaç duymaz
# ❌ Migration dosyası üretilmez (şimdilik sorun değil)

# 3. Test için tabloları kontrol et
npx prisma studio
# veya test route'u çağır: /api/debug/prisma-test
```

**Not:** Prod release'ten sonra `prisma migrate dev` + migration dosyaları düzenine geçilecek.

### Production Deployment Workflow (Plesk)

**Ne zaman çalıştırılır:**
- Her deployment'tan önce (eğer yeni migration'lar varsa)
- İlk kurulumda (production DB'ye ilk kez migration uygulanırken)
- Schema değişiklikleri yapıldığında

**Adımlar:**

1. **Local'de migration'ları oluştur ve test et:**
   ```bash
   # Schema değişikliği yap (prisma/schema.prisma)
   npx prisma migrate dev --name descriptive_name
   
   # Local DB'de test et
   npx prisma migrate status
   ```

2. **Migration dosyalarını commit et:**
   ```bash
   git add prisma/migrations/
   git commit -m "feat: add new migration"
   git push
   ```

3. **Plesk'e deploy et:**
   - Kod değişikliklerini Plesk'e deploy et (Git, FTP, veya Plesk Git extension)

4. **Plesk'te migration'ları uygula:**
   ```bash
   # Plesk terminal veya SSH üzerinden:
   cd /path/to/your/project
   npx prisma migrate deploy
   ```

**`prisma migrate deploy` ne yapar:**
- Migration geçmişini kontrol eder (`_prisma_migrations` tablosu)
- Henüz uygulanmamış migration'ları sırayla uygular
- Shadow DB gerektirmez (sadece mevcut migration dosyalarını uygular)
- Hata durumunda rollback yapmaz (manuel müdahale gerekebilir)

**Önemli Notlar:**
- ⚠️ **ASLA** `prisma migrate dev` kullanma (production'da migration dosyası oluşturur)
- ⚠️ **ASLA** `prisma db push` kullanma (migration geçmişi oluşturmaz)
- ✅ Her zaman `prisma migrate deploy` kullan
- ✅ Migration'ları commit etmeden production'a deploy etme
- ✅ Production'da migration çalıştırmadan önce backup al

## Önemli Kurallar

1. **Production'da asla `prisma migrate dev` çalıştırma**
   - Shadow DB gerektirir
   - DB kullanıcısının yetkisi olmayabilir
   - Migration dosyası oluşturur (production'da istenmez)

2. **Production'da asla `prisma db push` kullanma**
   - Migration geçmişi oluşturmaz
   - Sadece erken prototip aşamasında kullanılabilir

3. **Migration dosyalarını her zaman commit et**
   - `prisma/migrations/` klasörü versiyon kontrolünde olmalı
   - Production'da bu dosyalar kullanılır

4. **Production DATABASE_URL repo'ya girmez**
   - Sadece Plesk panelinde tanımlı
   - `.env` dosyası `.gitignore`'da

## Sorun Giderme

### Shadow DB oluşturulamıyor

**Sorun:** `prisma migrate dev` shadow DB oluşturamıyor (P3014 hatası).

**Hata mesajı:**
```
Error: P3014
Prisma Migrate could not create the shadow database.
User was denied access on the database `prisma_migrate_shadow_db_...`
```

**Neden:** Plesk'te database kullanıcısının `CREATE DATABASE` yetkisi yok.

**Çözüm: Manuel Shadow Database Oluşturma (Plesk)**

1. **Plesk panelinde shadow database oluştur:**
   - Plesk → Databases → "+ Add Database"
   - Database name: `acedd_shadow` (veya istediğiniz isim)
   - Database user: Mevcut kullanıcıyı kullanabilir veya yeni kullanıcı oluşturabilirsiniz

2. **Database connection bilgilerini al:**
   - Plesk → Databases → Oluşturduğunuz `acedd_shadow` database'ine tıklayın
   - "Connection info" veya "Access info" bölümünden:
     - Host: Genellikle `localhost` veya Plesk sunucu adresi
     - Port: Genellikle `3306`
     - Database name: `acedd_shadow`
     - Username: Database kullanıcı adı (aynı kullanıcıyı kullanabilirsiniz)
     - Password: Database kullanıcı şifresi

3. **`.env` dosyasına `SHADOW_DATABASE_URL` ekle:**
   ```env
   DATABASE_URL="mysql://user:password@host:port/db_name"
   SHADOW_DATABASE_URL="mysql://user:password@host:port/acedd_shadow"
   ```
   
   **Örnek:**
   ```env
   DATABASE_URL="mysql://acipayam_user:password123@localhost:3306/acedd_main"
   SHADOW_DATABASE_URL="mysql://acipayam_user:password123@localhost:3306/acedd_shadow"
   ```

4. **Migration'ı tekrar çalıştır:**
   ```bash
   npx prisma migrate dev --name init
   ```

**Not:** Shadow database sadece migration sırasında kullanılır, normal uygulama çalışırken kullanılmaz.

### Migration deploy hatası

**Sorun:** Production'da `prisma migrate deploy` başarısız.

**Kontrol listesi:**
- [ ] Migration dosyaları commit edilmiş mi?
- [ ] `DATABASE_URL` doğru mu?
- [ ] DB kullanıcısının migration tablolarına yazma yetkisi var mı?
- [ ] Önceki migration'lar başarıyla uygulanmış mı?

## Migration Status

**Prisma-tabanlı domainler (MongoDB'den tamamen taşındı):**
- ✅ **Announcements (Duyurular)** - Fully migrated to Prisma + MariaDB
- ✅ **Events (Etkinlikler)** - Fully migrated to Prisma + MariaDB
- ✅ **Datasets (Görsel/Dosya Yönetimi)** - Fully migrated to Prisma + MariaDB

**MongoDB'de kalan domainler (migration planlanıyor):**
- ⏳ Members, MembershipApplications, BoardMembers, ScholarshipApplications

**Not:** Events, Announcements ve Datasets artık MongoDB kullanmıyor. Tüm CRUD işlemleri Prisma üzerinden yapılıyor.

**Dataset Model Özellikleri:**
- Base64 data URL formatında görsel saklama (MEDIUMTEXT: 16MB limit)
- Etkinlik görselleri için özel upload endpoint (`/api/upload`)
- Görsel önizleme özelliği (preview mode) - görseller form submit edilmeden önce database'e kaydedilmez

## İlgili Dokümantasyon

- [Prisma Migrate Guide](https://www.prisma.io/docs/guides/migrate)
- [Prisma Shadow Database](https://www.prisma.io/docs/guides/migrate/shadow-database)
- [Project Rules - Prisma Migration Strategy](../.cursor/rules/nextjs-rules.mdc#421-prisma-migration-strategy-plesk--shadow-db)

