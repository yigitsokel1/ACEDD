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

export const DONATION_CONTENT = {
  hero: {
    title: "Bağış Yap",
    description: "Acıpayam ve Çevresi Eğitim Destekleme Derneği'ne doğrudan Banka Havale ve EFT ile dilediğiniz tutarda bağışta bulunabilirsiniz."
  },
  introduction: "Aşağıda yer alan; USD, EURO, TL hesaplarımıza havale/EFT ile bağışta bulunabilirsiniz.",
  thankYou: {
    title: "Bağışınız İçin Teşekkürler",
    description: "Bağışınız, Acıpayam ve çevresindeki öğrencilerin eğitimlerini desteklemek için kullanılacaktır. Her bağışınız, bir öğrencinin geleceğini aydınlatmaya yardımcı olur."
  },
  contact: {
    email: "Acedd@acipayam.org",
    message: "Bağış konusunda sorularınız için bizimle iletişime geçebilirsiniz."
  }
};

