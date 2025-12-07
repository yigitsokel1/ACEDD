# Session Secret Setup Guide

## Overview

The `SESSION_SECRET` is a critical security component used to sign admin session cookies with HMAC-SHA256. This prevents session tampering and ensures that only valid, server-generated sessions are accepted.

## Quick Setup

### 1. Generate a Session Secret

Run the provided script to generate a secure random secret:

```bash
npm run generate-session-secret
```

This will output a 64-character hexadecimal string like:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

### 2. Add to Environment Variables

Copy the generated secret and add it to your `.env` file:

```env
SESSION_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2"
```

### 3. Verify Setup

After setting the secret, restart your development server:

```bash
npm run dev
```

Try logging into the admin panel. If the secret is correctly configured, sessions will work properly.

## Manual Generation (Alternative)

If you prefer to generate the secret manually, you can use Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or using OpenSSL (if available):

```bash
openssl rand -hex 32
```

## Production Setup

### Plesk Environment Variables

1. Log into your Plesk control panel
2. Navigate to your domain → **Environment Variables**
3. Add a new variable:
   - **Name:** `SESSION_SECRET`
   - **Value:** (paste your generated secret)
4. Save and restart your application

### Security Best Practices

1. **Use Different Secrets for Each Environment**
   - Development: One secret for local development
   - Production: A different, stronger secret for production
   - Never reuse secrets between environments

2. **Secret Strength**
   - Minimum 32 bytes (64 hex characters)
   - Use cryptographically secure random generation
   - Never use predictable values (dates, names, etc.)

3. **Secret Storage**
   - ✅ Store in environment variables (`.env` for local, Plesk env vars for production)
   - ✅ Never commit to git (`.env` should be in `.gitignore`)
   - ✅ Never log or expose in error messages
   - ❌ Don't hardcode in source files
   - ❌ Don't share via insecure channels

4. **Secret Rotation**
   - If a secret is compromised, generate a new one immediately
   - Changing the secret will invalidate all existing sessions
   - Users will need to log in again after secret rotation

## Troubleshooting

### "Invalid session" errors after setting secret

- Ensure the secret is correctly set in your `.env` file
- Restart your development server after changing the secret
- Clear browser cookies and try logging in again

### Sessions not persisting

- Check that `SESSION_SECRET` is set in your environment
- Verify the secret is the same across all server instances (if using load balancing)
- Check browser console for cookie-related errors

### Production session issues

- Verify the secret is set in Plesk environment variables
- Ensure the secret matches between all application instances
- Check that cookies are being set with `Secure` flag in production (HTTPS required)

## Technical Details

### How It Works

1. **Session Creation:**
   - Session data is JSON stringified
   - Payload is base64 encoded
   - HMAC-SHA256 signature is generated using `SESSION_SECRET`
   - Cookie format: `base64(payload).hex(hmac)`

2. **Session Verification:**
   - Cookie is split into payload and signature
   - New signature is generated from payload using `SESSION_SECRET`
   - Signatures are compared using timing-safe comparison
   - If signatures match, payload is decoded and session is validated

### Security Features

- **HMAC-SHA256:** Industry-standard cryptographic signing
- **Timing-Safe Comparison:** Prevents timing attacks
- **HttpOnly Cookies:** Prevents JavaScript access
- **Secure Flag (Production):** Only sent over HTTPS
- **SameSite=Lax:** CSRF protection

## Related Files

- `src/lib/auth/adminSession.ts` - Session management implementation
- `src/lib/auth/adminAuth.ts` - API route authentication helpers
- `src/middleware.ts` - Middleware session validation
- `scripts/generate-session-secret.js` - Secret generation script

