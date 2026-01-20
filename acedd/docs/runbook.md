# ACEDD - Deployment & Operations Runbook

**Sprint 13:** Production deployment ve operasyon rehberi

Bu doküman, ACEDD projesinin local'de çalıştırılması, production'a deploy edilmesi ve operasyonel işlemler için adım adım rehberdir.

**Amaç:** 6 ay sonra bile repo'yu açtığında "deploy adımlarını" hatırlamak zorunda kalmaman.

---

## 📋 İçindekiler

1. [Ortamlar](#ortamlar)
2. [Local'de Çalıştırma](#localde-çalıştırma)
3. [Production'a Deploy](#productiona-deploy)
4. [Database Schema Güncellemeleri](#database-schema-güncellemeleri)
5. [Backup & Recovery](#backup--recovery)
6. [Troubleshooting](#troubleshooting)

---

## Ortamlar

### 1. Local (Development)

**Amaç:** Geliştirme, test, debugging

**Özellikler:**
- Local MariaDB veya Plesk'teki dev DB'ye bağlanır
- Hot reload ile geliştirme (`npm run dev`)
- Test suite çalıştırılabilir
- Prisma Studio ile DB görselleştirme

**Domain:** `http://localhost:3000`

### 2. Production (Vercel)

**Amaç:** Canlı sistem, kullanıcıların eriştiği ortam

**Özellikler:**
- Production MariaDB veritabanı (Vercel dışında, ayrı hosting'de - Plesk veya başka bir servis)
- Vercel otomatik build ve deploy (`npm run build` otomatik çalışır)
- Environment variables Vercel dashboard'da yapılandırılmış
- SSL/HTTPS otomatik (Vercel tarafından sağlanır)
- Git entegrasyonu ile otomatik deploy

**Domain:** `https://acedd.org` (veya belirlenen production domain - Vercel'de yapılandırılmış)

**Not:** Admin panel public site ile aynı domain'de (`/admin` route'u).

---

## Local'de Çalıştırma

### İlk Kurulum

1. **Repository'yi klonla:**
   ```bash
   git clone <repository-url>
   cd acedd
   ```

2. **Dependencies'leri yükle:**
   ```bash
   npm install
   ```

3. **Environment variables'ı ayarla:**
   ```bash
   cp env.example .env
   ```

4. **`.env` dosyasını düzenle:**
   ```env
   # REQUIRED - Database connection (MariaDB)
   DATABASE_URL="mysql://user:password@localhost:3306/acedd_dev"
   
   # REQUIRED - Session secret (generate with: npm run generate-session-secret)
   SESSION_SECRET="<generated-secret-here>"
   
   # OPTIONAL - Base URL (development: leave empty or use http://localhost:3000)
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

   **Environment Variables Açıklamaları:**
   - `DATABASE_URL`: MariaDB connection string (format: `mysql://user:password@host:port/database`)
   - `SESSION_SECRET`: Admin session güvenliği için uzun random string (generate: `npm run generate-session-secret`)
   - `NEXT_PUBLIC_BASE_URL`: Internal API calls için base URL (development'ta opsiyonel, fallback: `http://localhost:3000`)

5. **Database'i hazırla:**
   ```bash
   # Prisma Client'ı generate et
   npx prisma generate
   
   # Schema'yı database'e uygula (migration dosyası üretilmez - şu anki strateji)
   npx prisma db push
   
   # (Opsiyonel) Database'i görselleştir
   npx prisma studio
   ```

6. **İlk admin kullanıcısını oluştur:**
   ```bash
   npm run create-admin admin@acedd.org "secure-password-123" "Admin User" SUPER_ADMIN
   ```
   Detay ve alternatif (API): [docs/admin-creation.md](./admin-creation.md)

7. **Development server'ı başlat:**
   ```bash
   npm run dev
   ```

8. **Tarayıcıda aç:**
   - Public site: [http://localhost:3000](http://localhost:3000)
   - Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

### Günlük Geliştirme

**Kod değişiklikleri:**
- Hot reload otomatik çalışır (`npm run dev` çalışırken)
- Tarayıcı otomatik yenilenir

**Database schema değişiklikleri:**
```bash
# 1. prisma/schema.prisma dosyasını düzenle
# 2. Schema'yı database'e uygula
npx prisma db push

# 3. (Opsiyonel) Değişiklikleri kontrol et
npx prisma studio
```

**Yeni admin kullanıcısı ekle:**
```bash
npm run create-admin <email> <password> <name> [role]
```
(Bkz. [docs/admin-creation.md](./admin-creation.md))

**Test çalıştır:**
```bash
npm test
```

---

## Production'a Deploy

### Deployment Senaryosu

**Not:** Bu bölüm Vercel deployment senaryosuna göre yazılmıştır.

**Deployment Yöntemi:**
- **Git ile Otomatik Deployment (Vercel):** Git repository'ye push yapıldığında Vercel otomatik deploy eder
- **Vercel CLI (Opsiyonel):** Manuel deploy için `vercel` komutu kullanılabilir

**Build Stratejisi:**
- Vercel otomatik olarak `npm run build` çalıştırır
- Build sonrası Next.js production server otomatik başlatılır
- Local'de build yapmaya gerek yok (Vercel otomatik yapar)

### Ön Hazırlık

1. **Local'de test et:**
   ```bash
   # Build'i test et
   npm run build
   
   # Build'in çalıştığını doğrula
   npm run start
   ```

2. **Vercel projesini hazırla:**
   - Vercel dashboard'da yeni proje oluştur (veya mevcut projeyi kullan)
   - Git repository'yi bağla (GitHub, GitLab, Bitbucket)
   - Framework Preset: Next.js (otomatik algılanır)

3. **Environment variables'ı hazırla:**
   - Vercel Dashboard → Project → Settings → Environment Variables
   - Aşağıdaki değişkenleri ekle:
     - `DATABASE_URL`: Production MariaDB connection string (Vercel dışında, ayrı hosting'de)
     - `SESSION_SECRET`: Production için farklı secret (generate: `npm run generate-session-secret`)
     - `NEXT_PUBLIC_BASE_URL`: **MUTLAKA** production domain (örn: `https://acedd.org`)
     - `NODE_ENV`: `production` (Vercel otomatik set eder, ama manuel de eklenebilir)

### Deployment Adımları

#### Senaryo 1: Git ile Otomatik Deployment (Önerilen)

**Vercel Git Entegrasyonu:**

1. **Vercel'de proje oluştur ve Git repository'yi bağla:**
   - Vercel Dashboard → Add New Project
   - Git repository'yi seç (GitHub, GitLab, Bitbucket)
   - Framework Preset: Next.js (otomatik algılanır)
   - Root Directory: `acedd` (eğer repo root'u değilse)
   - Build Command: `npm run build` (Vercel otomatik algılar, genelde değiştirmeye gerek yok)
   - Output Directory: `.next` (Vercel otomatik algılar)

2. **Environment variables'ı yapılandır:**
   - Vercel Dashboard → Project → Settings → Environment Variables
   - Production environment için değişkenleri ekle:
     ```env
     DATABASE_URL=mysql://user:password@host:port/db_name
     SESSION_SECRET=<production-secret-here>
     NEXT_PUBLIC_BASE_URL=https://acedd.org
     NODE_ENV=production
     ```
   - **Önemli:** Her değişken için "Environment" seçeneğini kontrol et (Production, Preview, Development)

3. **Local'de değişiklikleri commit ve push et:**
   ```bash
   git add .
   git commit -m "feat: production deployment"
   git push origin main
   ```

4. **Vercel otomatik deploy eder:**
   - Vercel Git webhook'u tetiklenir
   - Vercel otomatik olarak `git pull` yapar
   - `npm install` çalıştırır
   - `npm run build` çalıştırır
   - Production server'ı başlatır
   - Deployment URL'i gösterir

5. **Deployment'ı kontrol et:**
   - Vercel Dashboard → Deployments → Son deployment'ı kontrol et
   - Build log'larını incele
   - Production URL'i test et

#### Senaryo 2: Vercel CLI ile Manuel Deployment (Opsiyonel)

**Git kullanmadan manuel deploy:**

1. **Vercel CLI'yi yükle:**
   ```bash
   npm install -g vercel
   ```

2. **Vercel'e login ol:**
   ```bash
   vercel login
   ```

3. **Projeyi link et (ilk sefer):**
   ```bash
   cd acedd
   vercel link
   # Proje adını seç veya yeni proje oluştur
   ```

4. **Deploy et:**
   ```bash
   vercel --prod
   ```

**Not:** Vercel CLI ile deploy ederken environment variables Vercel dashboard'da yapılandırılmış olmalı.

### Vercel Build Ayarları

**Vercel otomatik olarak şunları yapar:**
- `npm install` (dependencies yükleme)
- `npm run build` (Next.js build)
- Production server başlatma

**Build Command (genelde değiştirmeye gerek yok):**
```bash
npm run build
```

**Vercel Settings → Build & Development Settings:**
- Build Command: `npm run build` (otomatik algılanır)
- Output Directory: `.next` (otomatik algılanır)
- Install Command: `npm install` (otomatik algılanır)
- Node.js Version: `18.x` veya `20.x` (Vercel otomatik algılar)

### Environment Variables (Production)

**Vercel dashboard'da yapılandırılacak environment variables:**

1. **Vercel Dashboard → Project → Settings → Environment Variables:**
   ```env
   DATABASE_URL=mysql://user:password@host:port/db_name
   SESSION_SECRET=<production-secret-here>
   NEXT_PUBLIC_BASE_URL=https://acedd.org
   NODE_ENV=production
   ```

2. **Önemli Notlar:**
   - `DATABASE_URL`: Production MariaDB connection string (Vercel dışında, ayrı hosting'de - Plesk veya başka bir servis)
   - `SESSION_SECRET`: Development'tan **farklı** bir secret kullan (generate: `npm run generate-session-secret`)
   - `NEXT_PUBLIC_BASE_URL`: **MUTLAKA** production domain (boş bırakma!) - Vercel deployment URL'i veya custom domain
   - `NODE_ENV`: Vercel otomatik set eder (`production`), ama manuel de eklenebilir
   - **Environment seçimi:** Her değişken için Production, Preview, Development seçeneklerinden uygun olanı seç

3. **Environment Variables Ekleme:**
   - Vercel Dashboard → Project → Settings → Environment Variables → Add New
   - Key: `DATABASE_URL`
   - Value: MariaDB connection string
   - Environment: Production (veya All)
   - Save

**Not:** Environment variables değiştirildikten sonra yeni deployment gerekir (Vercel otomatik redeploy edebilir veya manuel redeploy gerekebilir).

### Deployment Sonrası Kontroller

1. **Build'in başarılı olduğunu kontrol et:**
   - Vercel Dashboard → Deployments → Son deployment'ı aç
   - Build log'larını kontrol et
   - Hata varsa düzelt ve tekrar push et (otomatik redeploy)

2. **Application'ın çalıştığını kontrol et:**
   - Vercel deployment URL'ini aç (örn: `https://acedd-xyz.vercel.app`)
   - Public site çalışıyor mu?
   - Admin panel çalışıyor mu? (`/admin`)

3. **Custom domain'i kontrol et (varsa):**
   - Vercel Dashboard → Project → Settings → Domains
   - Custom domain yapılandırılmış mı? (örn: `https://acedd.org`)
   - DNS kayıtları doğru mu?

4. **Database bağlantısını kontrol et:**
   - Admin panel'e login ol
   - Dashboard'u kontrol et (veri çekiliyor mu?)

5. **Environment variables'ı kontrol et:**
   - Admin panel çalışıyorsa → Environment variables doğru
   - API calls çalışıyorsa → `NEXT_PUBLIC_BASE_URL` doğru

---

## Database Schema Güncellemeleri

### Şu Anki Strateji (Production Öncesi)

**Tek DB Stratejisi:** Şu an tek DB kullanılıyor (geliştirme ve ilk yayın için).

**⚠️ ÖNEMLİ: Local ve Production DB Aynı mı?**

**Cevap:** Şu anki durumda (production öncesi) local ve production aynı DB'yi kullanabilir veya farklı DB'ler kullanılabilir. Her iki durumda da workflow aynıdır:

- **Aynı DB kullanılıyorsa:** Local'de yapılan schema değişiklikleri production'u da etkiler (dikkatli ol!)
- **Farklı DB kullanılıyorsa:** Local'de test et, sonra production'da aynı komutu çalıştır

**Schema değişikliği workflow:**

1. **Local'de schema'yı düzenle:**
   ```bash
   # prisma/schema.prisma dosyasını düzenle
   ```

2. **Prisma Client'ı generate et:**
   ```bash
   npx prisma generate
   ```

3. **Local DB'de schema'yı test et:**
   ```bash
   # Local .env'deki DATABASE_URL ile test et
   npx prisma db push
   ```
   
   **Not:** `prisma db push` migration dosyası üretmez, direkt DB'ye uygular. Shadow DB gerektirmez.

4. **Değişiklikleri test et:**
   ```bash
   npx prisma studio
   # veya test route: /api/debug/prisma-test
   ```

5. **Production'a deploy et:**
   - Kod değişikliklerini Git'e push et (Vercel otomatik deploy eder)
   - Schema değişikliği varsa, Vercel deployment sonrası Prisma migration çalıştırılmalı
   - **⚠️ ÖNEMLİ:** Vercel'de Prisma migration çalıştırmak için:
     - **Seçenek 1 (Önerilen):** Vercel Build Command'a ekle:
       ```bash
       npx prisma generate && npm run build
       ```
       Vercel Settings → Build & Development Settings → Build Command
     - **Seçenek 2:** Vercel Post-Deploy Hook kullan (Vercel Pro gerekebilir)
     - **Seçenek 3:** Manuel olarak database hosting'de (Plesk terminal/SSH) çalıştır:
       ```bash
       # Database hosting'de (MariaDB'nin bulunduğu sunucuda):
       # DATABASE_URL environment variable'ı ile:
       npx prisma generate
       npx prisma db push
       ```
   
   **Not:** Production'da `DATABASE_URL` environment variable'ı production DB'yi gösterir (Vercel dashboard'da yapılandırılmış). Database Vercel dışında olduğu için, Prisma migration'ları database hosting'de çalıştırılmalı veya Vercel build sırasında çalıştırılmalı.

### ⚠️ ÖNEMLİ: Production'da Schema Güncellemesi

**Riskler:**
- Schema değişiklikleri production DB'yi direkt etkiler
- Veri kaybı riski (kolon silme, tip değişikliği, vb.)
- Rollback zor (migration dosyası yok)
- Production'da `npx prisma db push` direkt çalışır (önceden test edilmiş olmalı)

**Güvenli Schema Güncellemesi Checklist:**

- [ ] Local'de schema değişikliğini test et (`npx prisma db push`)
- [ ] Local'de değişiklikleri doğrula (`npx prisma studio` veya test route)
- [ ] Production DB'den **backup al** (Plesk → Databases → Backup) - **MUTLAKA!**
- [ ] Schema değişikliğinin veri kaybına neden olmayacağından emin ol
- [ ] Kod değişikliklerini production'a deploy et
- [ ] Production'da Prisma migration çalıştır:
  - Vercel build command'a `npx prisma generate` eklenmiş mi? (veya)
  - Database hosting'de (Plesk terminal/SSH) manuel çalıştırıldı mı?
- [ ] Production'da değişiklikleri doğrula (`npx prisma studio` veya admin panel)

**Soru: Production'da `npx prisma db push` nasıl çalıştırılır?**

**Cevap:** Vercel deployment'ında Prisma migration çalıştırmak için iki seçenek var:

1. **Vercel Build Command'a ekle (Önerilen):**
   - Vercel Settings → Build & Development Settings → Build Command
   - Değiştir: `npx prisma generate && npm run build`
   - Bu şekilde her deployment'ta Prisma Client generate edilir ve schema uygulanır

2. **Manuel olarak database hosting'de çalıştır:**
   - Database Vercel dışında olduğu için (Plesk veya başka hosting)
   - Database hosting'in terminal/SSH'ına bağlan
   - `DATABASE_URL` environment variable'ı ile:
     ```bash
     npx prisma generate
     npx prisma db push
     ```

**Önemli:**
- Önce local'de test edilmiş olmalı
- Production DB backup alınmış olmalı
- Schema değişikliği veri kaybına neden olmayacak şekilde olmalı

**Örnek Güvenli Değişiklikler:**
- ✅ Yeni tablo ekleme
- ✅ Yeni kolon ekleme (nullable)
- ✅ Index ekleme

**Örnek Riskli Değişiklikler:**
- ⚠️ Kolon silme (veri kaybı)
- ⚠️ Kolon tipi değiştirme (veri dönüşümü gerekebilir)
- ⚠️ NOT NULL constraint ekleme (mevcut NULL değerler varsa hata)

### İlk Prod Release Sonrası Strateji

**Not:** İlk prod release'ten sonra migration dosyaları düzenine geçilecek.

**Gelecek Workflow (Prod Release Sonrası):**
1. Dev DB'de migration dosyalarını oluştur: `npx prisma migrate dev --name descriptive_name`
2. Migration dosyalarını commit et
3. Production'a deploy et
4. Production'da: `npx prisma migrate deploy` çalıştır

**Şu an için:** `prisma db push` kullanılıyor (migration dosyası yok).

---

## Backup & Recovery

### Database Backup

**Not:** Database Vercel dışında olduğu için (Plesk veya başka hosting), backup işlemi database hosting'de yapılır.

#### Plesk Panel Üzerinden (Database Plesk'te ise)

1. **Plesk → Databases → [Database Adı] → Backup:**
   - "Back Up" butonuna tıkla
   - Backup dosyası Plesk'te saklanır
   - İndirilebilir veya geri yüklenebilir

2. **Otomatik Backup (Plesk Backup Manager):**
   - Plesk → Tools & Settings → Backup Manager
   - Otomatik backup schedule ayarla
   - Database backup'ları dahil et

#### Manuel Backup (Terminal/SSH)

```bash
# Plesk terminal veya SSH üzerinden:
mysqldump -u [user] -p [database_name] > backup_$(date +%Y%m%d_%H%M%S).sql

# Örnek:
mysqldump -u acedd_user -p acedd_db > backup_20241208_120000.sql
```

### Database Recovery

#### Plesk Panel Üzerinden

1. **Plesk → Databases → [Database Adı] → Backup:**
   - Geri yüklemek istediğin backup'ı seç
   - "Restore" butonuna tıkla
   - Onayla

#### Manuel Recovery (Terminal/SSH)

```bash
# Plesk terminal veya SSH üzerinden:
mysql -u [user] -p [database_name] < backup_20241208_120000.sql

# Örnek:
mysql -u acedd_user -p acedd_db < backup_20241208_120000.sql
```

### Code Recovery (Vercel)

**Vercel'de deployment geri alma:**

1. **Vercel Dashboard → Deployments:**
   - Geri almak istediğin deployment'ı bul
   - "..." menüsüne tıkla → "Promote to Production"
   - Bu deployment production'a geri alınır

2. **Git ile geri alma (local'de):**
   ```bash
   # Local'de belirli bir commit'e geri dön
   git reset --hard <commit-hash>
   git push origin main --force
   # Vercel otomatik olarak yeni deployment yapar
   ```

3. **Git tag kullanımı (önerilen):**

```bash
# Local'de production release için tag oluştur:
git tag -a v1.0.0 -m "Production release v1.0.0"
git push origin v1.0.0

# Vercel'de belirli tag'e geri dön:
# Vercel Dashboard → Deployments → Tag'i seç → Promote to Production
# veya local'de:
git checkout v1.0.0
git push origin v1.0.0 --force
```

### Full System Recovery Senaryosu

**Tüm sistemin geri yüklenmesi gerekiyorsa:**

1. **Database'i geri yükle:**
   - Database hosting'de (Plesk veya başka servis) → Backup → Restore

2. **Kodu geri yükle:**
   - Vercel Dashboard → Deployments → Eski deployment'ı Promote to Production
   - veya Git ile geri dön ve push et (Vercel otomatik deploy eder)

3. **Environment variables'ı kontrol et:**
   - Vercel Dashboard → Project → Settings → Environment Variables
   - Tüm değişkenler doğru mu?

4. **Redeploy:**
   - Vercel otomatik olarak yeni deployment yapar
   - veya manuel redeploy: Vercel Dashboard → Deployments → Redeploy

---

## Logging & Hata Yönetimi

### Log Format Standardı

**Log Prefix Formatı:** `[ERROR][API][MODULE][ACTION]`

**Örnekler:**
- `[ERROR][API][MEMBERSHIP][GET]` - Üyelik başvuruları listeleme hatası
- `[ERROR][API][SCHOLARSHIP][CREATE]` - Burs başvurusu oluşturma hatası
- `[ERROR][API][CONTACT][GET]` - İletişim mesajları listeleme hatası
- `[ERROR][API][SETTINGS][PUT]` - Ayar güncelleme hatası
- `[ERROR][API][DASHBOARD][GET]` - Dashboard verileri yükleme hatası

**Log Arama:**
```bash
# Vercel log'larında belirli bir modülü aramak için:
# Vercel Dashboard → Logs → Filter: "[ERROR][API][SCHOLARSHIP]"

# veya terminal'de (Vercel CLI):
vercel logs --follow | grep "\[ERROR\]\[API\]\[SCHOLARSHIP\]"
```

### Vercel Log Okuma

**Hata durumunda öncelikle Vercel Dashboard'dan log'lara bakılmalı:**

1. **Vercel Dashboard → Project → Logs:**
   - Real-time log stream görüntülenir
   - Filter ile log'lar filtrelenebilir (örn: `[ERROR][API]`)
   - Deployment bazlı log görüntüleme

2. **Vercel CLI ile log okuma:**
   ```bash
   # Real-time log stream
   vercel logs --follow
   
   # Belirli deployment'ın log'ları
   vercel logs <deployment-url>
   
   # Filter ile arama
   vercel logs --follow | grep "\[ERROR\]"
   ```

3. **Log Kategorileri:**
   - **Build Logs:** Deployment sırasında build hataları
   - **Runtime Logs:** Application çalışırken oluşan hatalar
   - **Function Logs:** API route'larından gelen log'lar

**Önemli Notlar:**
- Vercel log'ları otomatik olarak saklanır (retention period'a göre)
- Production log'ları ayrı tutulur (preview deployment'larından ayrı)
- Log'lar gerçek zamanlı olarak görüntülenebilir

### User-Facing Error Mesajları

**Prensip:** Kullanıcıya teknik detaylar gösterilmez, sadece anlaşılır Türkçe mesajlar verilir.

**Örnekler:**
- ✅ **Doğru:** `{ error: "Başvuru kaydedilirken bir hata oluştu", message: "Lütfen bilgilerinizi kontrol edip tekrar deneyin" }`
- ❌ **Yanlış:** `{ error: "Failed to create application", message: "PrismaClientValidationError: ...", details: "..." }`

**Stack trace ve teknik detaylar:**
- Sadece log'larda görünür (`console.error`)
- Response body'ye asla sızmasın
- Development mode'da bile production response formatı kullanılır (güvenlik için)

---

## Admin Password Reset

### Create-Admin Script — Sadece Yeni Kullanıcı

`create-admin` script'i **sadece yeni** admin oluşturur. Aynı email zaten varsa hata verir; şifre veya ad güncellemez. Şifre sıfırlama için aşağıdaki **Manuel (Database)** yöntemini kullanın.

Admin oluşturma özeti: [docs/admin-creation.md](./admin-creation.md)

### Manual Password Reset (Database)

If you need to manually reset a password in the database:

1. **Generate a password hash:**
   ```bash
   # Using Node.js (in project directory):
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('new-password', 10).then(hash => console.log(hash));"
   ```

2. **Update the database:**
   ```sql
   -- Connect to database via Prisma Studio or SQL client:
   -- Prisma Studio:
   npx prisma studio
   
   -- Or SQL:
   UPDATE AdminUser 
   SET passwordHash = '<generated-hash-here>' 
   WHERE email = 'admin@acedd.org';
   ```

3. **Verify:**
   - Log in to admin panel with new password
   - Old password should no longer work

**Security Note:** Always use strong passwords and rotate them periodically. The password hash is stored in the database using bcrypt with 10 rounds.

## Dataset Cleanup & File Lifecycle

### Automatic Cleanup

The file lifecycle service (`src/modules/files/fileService.ts`) automatically cleans up files when entities are deleted or updated:

**Automatic Cleanup Scenarios:**
- ✅ Event deletion → All associated images removed
- ✅ Member CV update → Old CV file removed
- ✅ Member deletion → CV file removed
- ✅ Favicon/Logo update → Old file removed

**Cleanup is Non-Critical:**
- Errors during cleanup are logged but don't block operations
- If cleanup fails, files remain in Dataset table (manual cleanup may be needed)

### Manual Cleanup (If Needed)

**Identify Orphaned Files:**

1. **Using Prisma Studio:**
   ```bash
   npx prisma studio
   ```
   - Navigate to `Dataset` table
   - Filter by `source` field to find files by type
   - Check `eventId` field - if event is deleted but file still exists, it's orphaned

2. **Using SQL Query:**
   ```sql
   -- Find orphaned event images (events deleted but files remain)
   SELECT d.* FROM Dataset d
   WHERE d.source = 'event-upload'
   AND d.eventId IS NOT NULL
   AND NOT EXISTS (
     SELECT 1 FROM Event e WHERE e.id = d.eventId
   );
   
   -- Find member CVs for deleted members
   SELECT d.* FROM Dataset d
   WHERE d.source = 'member-cv'
   AND NOT EXISTS (
     SELECT 1 FROM Member m WHERE m.cvDatasetId = d.id
   );
   ```

**Delete Orphaned Files:**

1. **Using Prisma Studio:**
   - Find orphaned records
   - Delete them manually (carefully!)

2. **Using SQL (careful!):**
   ```sql
   -- Delete orphaned event images
   DELETE FROM Dataset 
   WHERE source = 'event-upload'
   AND eventId IS NOT NULL
   AND NOT EXISTS (
     SELECT 1 FROM Event e WHERE e.id = Dataset.eventId
   );
   ```

**Best Practice:** Always use the file lifecycle service functions in code. Manual cleanup should only be used for orphaned files from before the cleanup service was implemented.

### File Lifecycle Service Functions

For developers modifying file operations:

- `linkFileToEntity()` - Link a dataset file to an entity
- `unlinkAndDeleteFilesForEntity()` - Delete all files for an entity
- `deleteEventFiles()` - Delete files for an event (convenience)
- `replaceSingleFile()` - Replace old file with new
- `replaceMemberCV()` - Replace member CV (specialized)
- `replaceFaviconOrLogo()` - Replace favicon/logo

See `src/modules/files/fileService.ts` for implementation details.

## Logging Policy

### Log Format Standard

**Log Prefix Format:** `[LEVEL][MODULE][ACTION]`

**Levels:**
- `[ERROR]` - Critical errors that require attention
- `[WARNING]` - Non-critical issues (e.g., cleanup failures)
- `[INFO]` - Important information (e.g., member creation)
- `[DEBUG]` - Debug information (development only)

**Module Examples:**
- `[ERROR][API][MEMBERSHIP][GET]` - Membership API GET error
- `[ERROR][API][SCHOLARSHIP][CREATE]` - Scholarship API CREATE error
- `[WARNING][fileService][linkFileToEntity]` - File service warning
- `[INFO][API][MEMBERSHIP][APPROVE]` - Member creation info

### Secure Logging

**Never log sensitive data:**
- ❌ Passwords or password hashes
- ❌ TC Kimlik numbers
- ❌ Full email addresses (use domain only: `emailDomain: 'example.com'`)
- ❌ Full session data

**Safe to log:**
- ✅ Entity IDs (e.g., `memberId`, `applicationId`)
- ✅ Error types and codes
- ✅ User actions (without sensitive details)
- ✅ Timestamps and operation status

**Example:**
```typescript
// ❌ BAD
console.error("Error:", { email: user.email, password: user.password, tcId: user.tcId });

// ✅ GOOD
logErrorSecurely("[API][MEMBERSHIP][CREATE]", error, { 
  ipAddress: clientIp, 
  emailDomain: user.email.split('@')[1],
  errorCount: errors.length 
});
```

### Vercel Log Access

**Dashboard:**
- Vercel Dashboard → Project → Logs
- Real-time log stream
- Filter by text (e.g., `[ERROR][API]`)
- Deployment-specific logs

**CLI:**
```bash
# Real-time logs
vercel logs --follow

# Filter logs
vercel logs --follow | grep "\[ERROR\]\[API\]\[SCHOLARSHIP\]"

# Specific deployment
vercel logs <deployment-url>
```

## reCAPTCHA Key Management

### Getting reCAPTCHA Keys

1. **Register at Google reCAPTCHA Admin:**
   - Visit: https://www.google.com/recaptcha/admin
   - Click "Create" to register a new site
   - Choose reCAPTCHA v2 (Checkbox)
   - Add your domains:
     - Development: `localhost` (or leave empty for testing)
     - Production: Your production domain (e.g., `acedd.org`)

2. **Get Keys:**
   - **Site Key (Public):** Used in frontend forms (`NEXT_PUBLIC_RECAPTCHA_SITE_KEY`)
   - **Secret Key:** Used in backend verification (`RECAPTCHA_SECRET_KEY`)
   - Keep secret key secure (never commit to git)

### Environment Setup

**Development (.env):**
```env
# Optional - Leave empty to skip reCAPTCHA verification (development mode)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=""
RECAPTCHA_SECRET_KEY=""
```

**Production (Vercel Environment Variables):**
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - Your site key
   - `RECAPTCHA_SECRET_KEY` - Your secret key
3. Select "Production" environment
4. Save and redeploy

### Testing reCAPTCHA

**Google Test Keys (Development):**
- Site Key: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
- Secret Key: `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`
- These always pass verification (for testing only)

**Production:**
- Use your own keys from Google reCAPTCHA Admin
- Test on production domain before going live

### Troubleshooting

**reCAPTCHA not showing:**
- Check `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set
- Check browser console for errors
- Verify domain is registered in Google reCAPTCHA Admin

**Verification failing:**
- Check `RECAPTCHA_SECRET_KEY` is set correctly
- Check Vercel logs for reCAPTCHA verification errors
- Verify secret key matches site key in Google reCAPTCHA Admin
- Check domain matches registered domain

## Troubleshooting

### Build Hataları

**Problem:** `npm run build` başarısız oluyor

**Çözüm:**
1. Node.js version'ı kontrol et (Next.js 15 için 18.x veya 20.x gerekli)
2. Dependencies'leri temizle ve yeniden yükle:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```
3. TypeScript/ESLint hatalarını kontrol et:
   ```bash
   npm run lint
   ```

### Database Bağlantı Hataları

**Problem:** `DATABASE_URL` hatalı veya database erişilemiyor

**Çözüm (Supabase/Postgres):**
1. Supabase Dashboard → Project Settings → Database → Connection string
2. `DATABASE_URL` formatı: `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true` (Transaction mode, Vercel için)
3. Firewall/network erişimini kontrol et

### MaxClientsInSessionMode / Operation has timed out (Supabase + Vercel)

**Problem:** Vercel loglarında `MaxClientsInSessionMode: max clients reached` veya `Operation has timed out`, `Settings fetch timeout`, `/api/events` 500.

**Sebep:** `DATABASE_URL` **Session** pooler (port 5432) kullanıyor. Serverless’ta her istek/instance ayrı connection tutar; Supabase Session `pool_size` sınırı (free tier ~15–20) hemen dolar.

**Çözüm:**
1. **Vercel’de `DATABASE_URL`’i Transaction pooler’a geçir:**
   - Supabase → Database → Connection pooling → **Transaction** mode → URI
   - Host: `aws-0-[REGION].pooler.supabase.com`, **port: 6543**
   - Sonuna `?pgbouncer=true` ekle (Prisma prepared statement’ları kapatır; Transaction modda zorunlu).
   - Örnek: `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true`
2. Vercel → Project → Settings → Environment Variables → `DATABASE_URL`’i güncelle (Production + Preview) → Redeploy

Aynı `DATABASE_URL`’i local/build’de de kullanabilirsin. Bkz. [env.example](../env.example), [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler).

### Application Başlamıyor

**Problem:** Vercel deployment başarısız oluyor veya application çalışmıyor

**Çözüm:**
1. Vercel Dashboard → Deployments → Son deployment → Build Logs → Error log'larını kontrol et
2. Environment variables'ı kontrol et (özellikle `DATABASE_URL`, `SESSION_SECRET`)
   - Vercel Dashboard → Project → Settings → Environment Variables
3. Build command'ı kontrol et (Vercel Settings → Build & Development Settings)
4. Node.js version'ı kontrol et (Vercel otomatik algılar, ama manuel de ayarlanabilir)
5. Database bağlantısını kontrol et (database Vercel dışında olduğu için network erişimi gerekli)

### Admin Panel Çalışmıyor

**Problem:** Admin panel'e login olamıyorum veya API calls başarısız

**Çözüm:**
1. `SESSION_SECRET` doğru mu? (Production'da farklı secret kullan)
2. `NEXT_PUBLIC_BASE_URL` set edilmiş mi? (Production'da zorunlu)
3. Cookie'ler çalışıyor mu? (HTTPS, secure flag, vb.)
4. Browser console'da hata var mı?

### Schema Update Hataları

**Problem:** `npx prisma db push` başarısız oluyor

**Çözüm:**
1. Database backup'ı aldın mı? (ÖNCE BACKUP AL!)
2. Schema syntax'ını kontrol et (`prisma/schema.prisma`)
3. Database kullanıcısının ALTER TABLE yetkisi var mı?
4. Mevcut verilerle uyumsuzluk var mı? (ör. NOT NULL constraint, tip uyumsuzluğu)

---

## Önemli Notlar

### Production Checklist (Her Deployment'ta)

- [ ] Local'de build test edildi (`npm run build`)
- [ ] Environment variables production için yapılandırıldı
- [ ] `NEXT_PUBLIC_BASE_URL` production domain'e set edildi
- [ ] `SESSION_SECRET` production için farklı secret kullanıldı
- [ ] Database backup alındı (schema değişikliği varsa)
- [ ] Deployment sonrası test edildi (public site + admin panel)

### Güvenlik Notları

- ✅ `.env` dosyası asla commit edilmez (`.gitignore`'da)
- ✅ Production `SESSION_SECRET` development'tan farklı olmalı
- ✅ Production `DATABASE_URL` repository'de saklanmaz (Plesk panelinde)
- ✅ Admin panel HTTPS üzerinden erişilebilir olmalı

### Performans Notları

- Production build optimize edilmiş olmalı (`npm run build`)
- Static assets CDN'de serve edilebilir (gelecek optimizasyon)
- Database connection pooling aktif (Prisma otomatik yönetir)

---

**Son Güncelleme:** Sprint 13 - 08.12.2025

**İletişim:** Sorular için development team ile iletişime geçin.
