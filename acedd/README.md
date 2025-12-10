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

8. Start the development server:
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

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Project Rules](./.cursor/rules/nextjs-rules.mdc) - Development guidelines and conventions
- [Sprint 2 Completion Report](./docs/sprint-2-completion.md) - Events & Datasets migration details
- [Sprint 3 Completion Report](./docs/sprint-3-completion.md) - Members, Applications & BoardMembers migration details
