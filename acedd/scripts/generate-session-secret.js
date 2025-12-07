/**
 * Generate a secure random session secret for HMAC-SHA256 signing
 * 
 * Usage:
 *   node scripts/generate-session-secret.js
 * 
 * This will output a secure random 64-character hex string suitable for use
 * as SESSION_SECRET in your .env file.
 */

const crypto = require("crypto");

// Generate a secure random 32-byte (256-bit) secret
// Convert to hex for easy storage (64 hex characters)
const secret = crypto.randomBytes(32).toString("hex");

console.log("\n✅ Session Secret Generated:");
console.log("=" .repeat(64));
console.log(secret);
console.log("=" .repeat(64));
console.log("\n📝 Add this to your .env file:");
console.log(`SESSION_SECRET="${secret}"`);
console.log("\n⚠️  IMPORTANT:");
console.log("   - Keep this secret secure and never commit it to git");
console.log("   - Use different secrets for development and production");
console.log("   - If you change the secret, all existing sessions will be invalidated");
console.log("\n");

