/**
 * Validation helper functions
 * Sprint 15.1: TC Kimlik, email, phone validation
 */

/**
 * Validates Turkish TC Identity Number (11 digits, checksum validation)
 * @param tcNumber - TC kimlik numarası (string)
 * @returns true if valid, false otherwise
 */
export function validateTCNumber(tcNumber: string): boolean {
  if (!tcNumber || typeof tcNumber !== "string") {
    return false;
  }

  // Remove any whitespace
  const cleaned = tcNumber.trim().replace(/\s/g, "");

  // Must be exactly 11 digits
  if (!/^\d{11}$/.test(cleaned)) {
    return false;
  }

  // First digit cannot be 0
  if (cleaned[0] === "0") {
    return false;
  }

  // Calculate checksum
  const digits = cleaned.split("").map(Number);

  // 10th digit check: (sum of odd positions * 7 - sum of even positions) mod 10 should equal 10th digit
  // Web kaynaklarına göre: 1., 3., 5., 7., 9. hanelerin toplamının 7 katından, 2., 4., 6., 8. hanelerin toplamı çıkarılır
  // Elde edilen sonucun 10'a bölümünden kalan, 10. haneyi verir
  // Odd positions (1st, 3rd, 5th, 7th, 9th): indices 0, 2, 4, 6, 8
  // Even positions (2nd, 4th, 6th, 8th): indices 1, 3, 5, 7
  let sumOdd = 0;
  let sumEven = 0;
  for (let i = 0; i < 9; i++) {
    if (i % 2 === 0) {
      sumOdd += digits[i];
    } else {
      sumEven += digits[i];
    }
  }
  // Calculate 10th digit: (sumOdd * 7 - sumEven) mod 10
  // JavaScript'te negatif mod sonuçlarını doğru handle etmek için
  const calculation = sumOdd * 7 - sumEven;
  let checkDigit10 = calculation % 10;
  // Mod 10 işlemi negatif sonuç verebilir, bu durumda 10 ekleyerek düzeltiyoruz
  if (checkDigit10 < 0) {
    checkDigit10 += 10;
  }
  if (checkDigit10 !== digits[9]) {
    return false;
  }

  // 11th digit check: (sum of first 10 digits) mod 10 should equal 11th digit
  const sumFirst10 = digits.slice(0, 10).reduce((sum, digit) => sum + digit, 0);
  const checkDigit11 = sumFirst10 % 10;
  if (checkDigit11 !== digits[10]) {
    return false;
  }

  return true;
}

/**
 * Validates Turkish phone number
 * @param phone - Telefon numarası (string)
 * @returns true if valid, false otherwise
 */
export function validatePhoneNumber(phone: string): boolean {
  if (!phone || typeof phone !== "string") {
    return false;
  }

  // Remove whitespace, dashes, parentheses
  const cleaned = phone.trim().replace(/[\s\-\(\)]/g, "");

  // Turkish phone format: +90XXXXXXXXXX or 0XXXXXXXXXX or 5XXXXXXXXX (10 digits after country code or 0)
  // Accept: +905551234567, 05551234567, 5551234567
  const turkishPhoneRegex = /^(\+90|0)?5\d{9}$/;
  return turkishPhoneRegex.test(cleaned);
}

/**
 * Validates email address
 * @param email - Email adresi (string)
 * @returns true if valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== "string") {
    return false;
  }

  // Basic email regex (RFC 5322 simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates full name (at least 2 words, each at least 2 characters)
 * @param fullName - Tam ad (string)
 * @returns true if valid, false otherwise
 */
export function validateFullName(fullName: string): boolean {
  if (!fullName || typeof fullName !== "string") {
    return false;
  }

  const trimmed = fullName.trim();
  const words = trimmed.split(/\s+/).filter(word => word.length > 0);

  // Must have at least 2 words
  if (words.length < 2) {
    return false;
  }

  // Each word must be at least 2 characters
  return words.every(word => word.length >= 2);
}

