import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind CSS sınıflarını birleştirmek için utility fonksiyonu
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Tarih formatlama
export function formatDate(date: Date | string, locale: string = "tr-TR"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Tarih ve saat formatlama
export function formatDateTime(date: Date | string, locale: string = "tr-TR"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Telefon numarası formatlama
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `+90 ${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
  }
  return phone;
}

// Email doğrulama
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Telefon numarası doğrulama
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

// String'i kısaltma
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// Slug oluşturma
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Sayfa başlığı oluşturma
export function createPageTitle(title: string, siteName?: string): string {
  return siteName ? `${title} | ${siteName}` : title;
}

// Sayı formatlama
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("tr-TR").format(num);
}

// Para formatlama
export function formatCurrency(amount: number, currency: string = "TRY"): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

// Rastgele ID oluşturma
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Dosya boyutu formatlama
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// URL'den query parametrelerini çıkarma
export function getQueryParams(url: string): Record<string, string> {
  const params = new URLSearchParams(url.split("?")[1] || "");
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

// Debounce fonksiyonu
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle fonksiyonu
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
