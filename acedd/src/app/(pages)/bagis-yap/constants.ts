export interface BankAccount {
  currency: string;
  bank: string;
  accountName: string;
  iban: string;
}

export const BANK_ACCOUNTS: BankAccount[] = [
  {
    currency: "TÜRK LİRASI",
    bank: "Ziraat Bankası",
    accountName: "ACIPAYAM VE ÇEVRESİ EĞİTİMİ DESTEKLEME DERNEĞİ",
    iban: "TR 53 0001 0000 8994 7314 5650 01"
  },
  {
    currency: "USD",
    bank: "Ziraat Bankası",
    accountName: "ACIPAYAM VE ÇEVRESİ EĞİTİMİ DESTEKLEME DERNEĞİ",
    iban: "TR 53 0001 0000 8994 7314 5650 02"
  },
  {
    currency: "EURO",
    bank: "Ziraat Bankası", 
    accountName: "ACIPAYAM VE ÇEVRESİ EĞİTİMİ DESTEKLEME DERNEĞİ",
    iban: "TR 53 0001 0000 8994 7314 5650 03"
  }
];

/**
 * Sprint 11: DONATION_CONTENT moved to settings
 * Content is now managed via Admin UI (content.donation.*)
 * 
 * BANK_ACCOUNTS remains here as fallback (technical data - account information)
 * Note: Bank accounts can also be managed via settings (content.donation.bankAccounts)
 */

