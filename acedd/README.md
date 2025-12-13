# ACEDD NGO – Website & Admin Panel

ACEDD (Araştırma, Çevre ve Doğa Derneği) web sitesi ve yönetim paneli.

**Tech Stack:**
- Next.js 15 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS v4
- Prisma + MariaDB
- MongoDB (legacy, migration in progress)

**Migration Status:**
- ✅ **Announcements (Duyurular)** - Fully migrated to Prisma
- ✅ **Events (Etkinlikler)** - Fully migrated to Prisma
- ✅ **Datasets (Görsel/Dosya Yönetimi)** - Fully migrated to Prisma
- ✅ **Members (Üyeler)** - Fully migrated to Prisma
- ✅ **MembershipApplications (Üyelik Başvuruları)** - Fully migrated to Prisma
- ✅ **BoardMembers (Yönetim Kurulu)** - Fully migrated to Prisma
- ⏳ Other domains - Still using MongoDB (migration planned)

## Getting Started

### Prerequisites

- Node.js 20+
- MariaDB (local development için)
- npm, yarn, pnpm veya bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd acedd
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
```

Edit `.env` and configure required variables:
```env
# REQUIRED - Database connection (MariaDB)
DATABASE_URL="mysql://user:password@localhost:3306/acedd_dev"

# REQUIRED - Session secret (generate with: npm run generate-session-secret)
SESSION_SECRET="<generated-secret-here>"

# OPTIONAL - Base URL (development: leave empty or use http://localhost:3000)
# Production: MUST be set to your production domain (e.g., https://acedd.org)
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

**Required Environment Variables:**
- `DATABASE_URL`: MariaDB connection string (format: `mysql://user:password@host:port/database`)
- `SESSION_SECRET`: Long random string for session security (generate with `npm run generate-session-secret`)

**Optional Environment Variables:**
- `NEXT_PUBLIC_BASE_URL`: Base URL for internal API calls
  - Development: Leave empty or use `http://localhost:3000` (fallback)
  - Production: **MUST be set** to production domain (e.g., `https://acedd.org`)
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`: reCAPTCHA site key for public forms (Sprint 16+)
  - Get from: https://www.google.com/recaptcha/admin
  - If not set, reCAPTCHA verification is skipped (development mode)
- `RECAPTCHA_SECRET_KEY`: reCAPTCHA secret key for backend verification (Sprint 16+)
  - Get from: https://www.google.com/recaptcha/admin
  - If not set, reCAPTCHA verification is skipped (development mode)
- `NODE_ENV`: Automatically set by Next.js (usually not needed)
- `SHADOW_DATABASE_URL`: Only if CREATE DATABASE permission not available (see `env.example`)

See `env.example` for complete documentation of all environment variables.

4. Set up the database:
```bash
# Generate Prisma Client
npx prisma generate

# Apply schema to database (no migration files for now)
npx prisma db push

# Verify connection (optional)
npx prisma studio
```

5. Create your first admin user:
```bash
# Install tsx if not already installed
npm install --save-dev tsx

# Create admin user
npm run create-admin <email> <password> <name> [role]

# Example:
npm run create-admin admin@acedd.org "secure-password-123" "Admin User" SUPER_ADMIN

# Or use npx tsx directly:
npx tsx scripts/create-admin.ts admin@acedd.org "secure-password-123" "Admin User" SUPER_ADMIN
```

**Note:** Role is optional and defaults to `SUPER_ADMIN`. Use `ADMIN` for regular admin users.

6. Generate and set session secret (Sprint 6: Required for secure session management):
```bash
# Generate a secure random session secret
npm run generate-session-secret

# Copy the output and add it to your .env file:
# SESSION_SECRET="<generated-secret-here>"
```

**Important:**
- The session secret is used to sign admin session cookies (HMAC-SHA256)
- Use different secrets for development and production
- Never commit the secret to git (it should be in `.env`, which is in `.gitignore`)
- If you change the secret, all existing admin sessions will be invalidated

7. (Optional) Configure base URL for internal API calls:
```env
# Development: Leave empty or use http://localhost:3000 (fallback)
# Production: MUST be set to production domain
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

**Note:** This is used for Server Component API calls (e.g., admin dashboard). In production, this **must** be set to your production domain.

7. (Optional) Configure reCAPTCHA (Sprint 16+):
   ```env
   # Public forms (membership, scholarship) use reCAPTCHA for spam prevention
   # If not configured, reCAPTCHA verification is skipped (development mode)
   # Get keys from: https://www.google.com/recaptcha/admin
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your-site-key-here"
   RECAPTCHA_SECRET_KEY="your-secret-key-here"
   ```

   **Note:** For development, you can use Google's test keys or leave empty. For production, use your own reCAPTCHA keys from Google reCAPTCHA Admin.

8. (Optional) Seed default settings:
   ```bash
   # Seed default settings (homepage content, donation accounts, etc.)
   npm run seed:settings
   
   # Force overwrite existing settings (use with caution)
   npm run seed:settings:force
   ```

   **Note:** This populates the `Setting` table with default content from `src/lib/constants/defaultContent.ts`. Use `--force` flag to overwrite existing settings.

9. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment & Operations

For complete deployment and operations guide, see [docs/runbook.md](./docs/runbook.md).

The runbook includes:
- Local development setup
- Production deployment (Plesk)
- Database schema updates
- Backup & recovery procedures
- Troubleshooting guide

## Database Setup

### Local Development

For detailed database setup instructions, see [docs/db.md](./docs/db.md).

**Quick setup:**
1. Ensure MariaDB is running (local veya Plesk)
2. Create a database (Plesk panelinden veya SQL ile):
   ```sql
   CREATE DATABASE acedd_dev;
   ```
3. Configure `DATABASE_URL` in `.env`:
   ```env
   DATABASE_URL="mysql://user:password@host:port/db_name"
   ```
   
   **Not:** Şu an bu DB geliştirme ve ilk yayın için kullanılıyor. İlk prod release'ten sonra bu DB prod sayılacak ve ayrı dev DB açılacak.
   
   **Note:** Shadow database gerekmez. `prisma db push` shadow DB kullanmaz.

4. Generate Prisma Client and apply schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
   
   **Note:** `prisma db push` applies schema directly to database (no migration files until prod release).

### Production (Plesk)

**⚠️ Critical:** Never use `prisma migrate dev` in production!

**Production migration workflow:**
1. Local'de migration dosyalarını oluştur ve test et
2. Migration dosyalarını commit et
3. Plesk'e kod deploy et
4. Plesk terminal/SSH üzerinden:
   ```bash
   cd /path/to/your/project
   npx prisma migrate deploy
   ```

**Important notes:**
- Production `DATABASE_URL` is configured in Plesk panel (not in repository)
- Always use `prisma migrate deploy` in production (never `prisma migrate dev`)
- `prisma migrate deploy` does not require shadow database
- Migration files must be committed before production deployment

See [docs/db.md](./docs/db.md) for complete migration strategy and environment details.

## Project Structure

```
acedd/
├── prisma/
│   └── schema.prisma          # Prisma schema (source of truth)
├── src/
│   ├── app/
│   │   ├── (pages)/           # Public pages
│   │   ├── (admin)/           # Admin panel
│   │   └── api/               # API routes
│   ├── components/            # Shared UI components
│   ├── contexts/              # React contexts
│   └── lib/                   # Utilities, types, DB client
└── docs/
    └── db.md                  # Database documentation
```

## Development Environment

### Available Scripts

- `npm install` - Install project dependencies
- `npm run dev` - Start development server with Turbopack (http://localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests with Vitest (watch mode)
- `npm test -- --run` - Run tests once and exit
- `npm run create-admin` - Create a new admin user (see usage above)

### Database Schema Changes (Şu Anki Durum - Prod Release Öncesi)

**Durum:** Tek DB kullanılıyor (geliştirme ve ilk yayın için). Prod release'ten sonra ayrı dev/prod DB'ler olacak.

When you need to modify the database schema:

1. **Update `prisma/schema.prisma`** with your changes (add models, fields, indexes, etc.)
2. **Apply schema to database:**
   ```bash
   npx prisma db push
   ```
   This command will:
   - ✅ Update tables/columns in the database
   - ✅ Regenerate Prisma Client automatically
   - ✅ No shadow DB needed
   - ❌ No migration files created (acceptable until prod release)

3. **Verify changes:**
   ```bash
   # Visual database browser
   npx prisma studio
   
   # Or test via API route
   # GET /api/debug/prisma-test
   ```

**Prod Release Sonrası:**
- Dev DB'de `prisma migrate dev` + migration dosyaları kullanılacak
- Prod DB'de `prisma migrate deploy` kullanılacak
- `prisma db push` artık kullanılmayacak

**Important:** Always update `schema.prisma` first, then apply with `prisma db push`.

### Testing

The project uses **Vitest** for testing. Test files are located in `src/**/__tests__/` or `src/**/*.test.ts`.

- Run all tests: `npm test`
- Run tests once: `npm test -- --run`
- Watch mode (default): `npm test`

See test examples in `src/lib/utils/__tests__/isAnnouncementActive.test.ts`.

## Scholarship Application Form

**Sprint 16:** Complete scholarship application form with dynamic fields (relatives, education history, references).

### Features

- **Public Form:** Multi-step form with all required fields
  - Static fields: Personal info, university info, bank info, health/disability, family info, address
  - Dynamic fields: Relatives (min 1, max 50), Education History (min 1, max 50), References (min 1, max 20)
  - reCAPTCHA integration for spam prevention
  - Form validation with Zod schemas (Turkish error messages)

- **Admin Panel:**
  - List view: Filter by status, search by name/email
  - Detail view (V2): Read-only display with collapsible sections
    - Genel Bilgi (General Information)
    - Aile & Akrabalar (Family & Relatives)
    - Okul Geçmişi (Education History)
    - Referanslar (References)
    - Finansal Bilgiler (Financial Information)
    - Sağlık ve Engellilik (Health & Disability)
    - Ek Bilgiler (Additional Information)
  - Status management: Approve, Reject, Under Review, Delete
  - Review notes support

### Technical Details

- **Database:** Relational tables (Prisma)
  - `ScholarshipApplication` (main table)
  - `Relative` (1-N relationship)
  - `EducationHistory` (1-N relationship)
  - `Reference` (1-N relationship)

- **Validation:** Zod schemas (`src/modules/scholarship/schemas.ts`)
  - Single source of truth for form validation
  - Used in both frontend (React Hook Form) and backend (API validation)
  - Turkish error messages

- **Form Components:**
  - `FieldArray` - Reusable dynamic field array component
  - `Recaptcha` - reCAPTCHA integration component
  - Date and numeric normalization helpers

- **API Routes:**
  - `POST /api/scholarship-applications` - Public form submission (with reCAPTCHA)
  - `GET /api/scholarship-applications` - Admin list (requires auth)
  - `GET /api/scholarship-applications/[id]` - Admin detail (requires auth)
  - `PUT /api/scholarship-applications/[id]` - Status update (requires auth)
  - `DELETE /api/scholarship-applications/[id]` - Delete (requires auth)

### Documentation

- **Field Inventory:** [docs/forms/scholarship-fields.md](./docs/forms/scholarship-fields.md) - Complete field documentation
- **Form Route:** `/burs-basvurusu` (public)
- **Admin Route:** `/admin/burs-basvurulari` (admin only)

## File Upload & Dataset Cleanup

**Sprint 17:** Centralized file lifecycle management to prevent orphaned files.

### Overview

All file uploads (images, PDFs) are stored in the `Dataset` table as Base64 data URLs. The file lifecycle service ensures that files are properly cleaned up when their associated entities are deleted or updated.

### Storage Policy

**Database Storage:**
- All files are stored as Base64 data URLs in the `Dataset.fileUrl` field (MEDIUMTEXT, 16MB limit)
- No external file storage (e.g., S3, cloud storage) - all files are in the database
- This approach simplifies deployment and backup (single database backup includes all files)

**File Size Limits:**
- Images: 5MB max per file
- PDFs: 10MB max per file (e.g., member CVs)
- Enforced in `/api/upload` endpoint

**Automatic Cleanup:**
- When an event is deleted → all associated images are removed from Dataset
- When a member CV is updated → old CV file is removed from Dataset
- When favicon/logo is updated → old file is removed from Dataset
- Cleanup is non-critical (errors are logged but don't block operations)

### Architecture

1. **Upload Flow:**
   ```
   Upload → /api/upload → Dataset.create() → Returns datasetId
   ```

2. **Entity Linking:**
   - Files can be linked to entities (Event, Member, Settings)
   - Linking is done via `fileLifecycleService.linkFileToEntity()`
   - Dataset `source` field indicates entity type (e.g., "event-upload", "member-cv", "favicon")

3. **Cleanup Flow:**
   ```
   Entity Delete/Update → fileLifecycleService → Dataset.delete() → File removed
   ```

### File Service (`src/modules/files/fileService.ts`)

**Functions:**
- `linkFileToEntity()` - Link a dataset file to an entity
- `unlinkAndDeleteFilesForEntity()` - Delete all files for an entity
- `deleteEventFiles()` - Delete files for an event (convenience function)
- `replaceSingleFile()` - Replace old file with new (e.g., CV update, favicon change)
- `replaceMemberCV()` - Replace member CV (specialized function)
- `replaceFaviconOrLogo()` - Replace favicon/logo (source-based cleanup)

**Entity Types:**
- `EVENT` - Event images
- `MEMBER_CV` - Member CV PDFs
- `FAVICON` - Site favicon
- `LOGO` - Site logo

### Integration Points

**Event Deletion:**
- When an event is deleted, `DELETE /api/events/[id]` calls `deleteEventFiles()`
- All event-related images are automatically removed from Dataset table

**Member CV Update:**
- When a member CV is updated, old CV is deleted before new one is linked
- Integration in `PUT /api/members/[id]`

**Favicon/Logo Update:**
- When favicon/logo is updated via settings, old file is cleaned up
- Integration in `PUT /api/settings`

### File Storage

- **Format:** Base64 data URLs (`data:image/png;base64,...` or `data:application/pdf;base64,...`)
- **Size Limits:**
  - Images: 5MB max
  - PDFs: 10MB max
- **Database Field:** `fileUrl` (MEDIUMTEXT, 16MB limit)

### Testing

File lifecycle service is tested in:
- `src/modules/files/__tests__/fileService.test.ts` - Unit tests
- `src/app/api/events/[id]/__tests__/route.test.ts` - Event delete integration test

### Dataset Management

**Manual Cleanup (if needed):**
- Orphaned dataset records can be identified by checking `source` and `eventId` fields
- Use Prisma Studio to inspect and delete orphaned records:
  ```bash
  npx prisma studio
  ```
- Or write a cleanup script (future enhancement)

**Best Practices:**
- Always use the file lifecycle service (`src/modules/files/fileService.ts`) for file operations
- Never delete Dataset records directly (use service functions)
- Test file cleanup when modifying entity deletion logic

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Project Rules](./.cursor/rules/nextjs-rules.mdc) - Development guidelines and conventions
- [Sprint 2 Completion Report](./docs/sprint-2-completion.md) - Events & Datasets migration details
- [Sprint 3 Completion Report](./docs/sprint-3-completion.md) - Members, Applications & BoardMembers migration details
