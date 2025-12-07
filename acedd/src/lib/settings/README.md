# Settings Module

Sprint 10: Settings helper functions and service layer.

## Core Functions

### `getSetting(key: string)`

Get a single setting by key.

```typescript
import { getSetting } from "@/lib/settings";

const siteName = await getSetting("site.name"); // "ACEDD" or null
```

### `getSettings(prefix: string)`

Get all settings matching a prefix.

```typescript
import { getSettings } from "@/lib/settings";

const settings = await getSettings("site");
// Returns: { "site.name": "ACEDD", "site.description": "...", ... }
```

### `getSettingValue<T>(settings, key, fallback)`

Type-safe value extraction with fallback.

```typescript
import { getSettings, getSettingValue } from "@/lib/settings";

const settings = await getSettings("site");
const siteName = getSettingValue(settings, "site.name", "ACEDD");
// Always returns a string (either from settings or fallback)
```

## Convenience Functions

### `getSiteName()`

Get site name with fallback to constant.

```typescript
import { getSiteName } from "@/lib/settings";

const siteName = await getSiteName(); // "ACEDD" or from settings
```

### `getSiteDescription()`

Get site description with fallback.

### `getSocialLinks()`

Get social media links.

### `getContactInfo()`

Get contact information.

### `getFooterText()`

Get footer text.

## Usage Examples

### Public Pages

```typescript
// Server Component
import { getSettings, getSettingValue } from "@/lib/settings";
import { SITE_CONFIG } from "@/lib/constants";

export default async function MyPage() {
  const settings = await getSettings("site");
  const siteName = getSettingValue(settings, "site.name", SITE_CONFIG.shortName);
  
  return <div>{siteName}</div>;
}
```

### Multiple Prefixes

```typescript
import { getSettings, getSettingValue } from "@/lib/settings";

export default async function MyPage() {
  const [siteSettings, socialSettings] = await Promise.all([
    getSettings("site"),
    getSettings("social"),
  ]);
  
  const siteName = getSettingValue(siteSettings, "site.name", "ACEDD");
  const instagram = getSettingValue(socialSettings, "social.instagram", undefined);
  
  return <div>{siteName} - {instagram}</div>;
}
```

## Type Safety

All functions are type-safe:

```typescript
// TypeScript knows the return type
const siteName: string = getSettingValue(settings, "site.name", "ACEDD");

// Type mismatch will be caught
const siteName: number = getSettingValue(settings, "site.name", "ACEDD"); // Error!
```

