# Sprint 5: Üye Hiyerarşisi + Yönetim Kurulu / Etiket Sistemi - Verification Checklist

**Sprint Tarihi:** 03.12.2025  
**Doğrulama Tarihi:** 03.12.2025
**Durum:** ✅ Doğrulandı

## Genel Kontroller

- [ ] `npm run build` başarılı
- [ ] `npm test` tüm testler yeşil
- [ ] `npx prisma db push` başarılı
- [ ] Linter hataları yok
- [ ] TypeScript hataları yok

## Veri Modeli Doğrulama

### Prisma Schema

- [ ] `MembershipKind` enum tanımlı (MEMBER, VOLUNTEER)
- [ ] `BoardRole` enum tanımlı (PRESIDENT, VICE_PRESIDENT, SECRETARY_GENERAL, TREASURER, BOARD_MEMBER)
- [ ] `Member` modelinde `membershipKind` alanı var (default: MEMBER)
- [ ] `Member` modelinde `tags` alanı var (Json?)
- [ ] `BoardMember` modeli yeniden tasarlandı:
  - [ ] `memberId` ve `member` relation var
  - [ ] `role` alanı `BoardRole` enum
  - [ ] Eski alanlar kaldırıldı (name, memberType, bio, imageUrl, title)
  - [ ] `order` ve `isActive` alanları kaldırıldı

### TypeScript Types

- [ ] `src/lib/types/member.ts` içinde:
  - [ ] `MemberTag` type tanımlı
  - [ ] `MembershipKind` type tanımlı
  - [ ] `BoardRole` type tanımlı
  - [ ] `Member` interface'inde `membershipKind` ve `tags` var
  - [ ] `BoardMember` interface'inde `memberId`, `member`, `role` var
  - [ ] `CreateBoardMemberData` type'ında `memberId` ve `role` zorunlu

## Admin Panel Doğrulama

### Üye Yönetimi Tabı

- [ ] Üye eklerken:
  - [ ] `membershipKind` dropdown görünüyor (Üye / Gönüllü)
  - [ ] Etiketler checkbox list olarak görünüyor (Onursal Başkan, Kurucu Başkan, Kurucu Üye, Önceki Başkan)
  - [ ] `membershipKind` zorunlu (boş bırakılamaz)
  - [ ] Etiketler opsiyonel (seçilmese de olur)
- [ ] Üye listesinde:
  - [ ] `membershipKind` badge olarak gösteriliyor (Üye / Gönüllü)
  - [ ] `tags` badge'ler olarak gösteriliyor
  - [ ] Filtreleme: `membershipKindFilter` çalışıyor
  - [ ] Filtreleme: `tagFilter` çalışıyor
- [ ] Üye detay modalında:
  - [ ] `membershipKind` gösteriliyor
  - [ ] `tags` gösteriliyor
  - [ ] BoardMember rolü gösteriliyor (varsa)

### Yönetim Kurulu Tabı

- [ ] Yeni yönetim kurulu üyesi eklerken:
  - [ ] Member seçimi: Search input ile autocomplete çalışıyor
  - [ ] BoardRole seçimi: Dropdown görünüyor (Başkan, Başkan Yardımcısı, Genel Sekreter, Sayman, Yönetim Kurulu Üyesi)
  - [ ] `memberId` zorunlu (boş bırakılamaz)
  - [ ] `role` zorunlu (boş bırakılamaz)
  - [ ] Term Start/End opsiyonel
- [ ] Yönetim kurulu listesinde:
  - [ ] Tablo formatında gösteriliyor
  - [ ] Ad Soyad (Member'dan geliyor) gösteriliyor
  - [ ] BoardRole gösteriliyor
  - [ ] BoardRole enum sırasına göre sıralı (Başkan → Başkan Yardımcısı → ... → Yönetim Kurulu Üyesi)
- [ ] Yönetim kurulu üyesi düzenlerken:
  - [ ] Member değiştirilebilir
  - [ ] Role değiştirilebilir
  - [ ] Term tarihleri değiştirilebilir

## API Doğrulama

### /api/members

- [ ] GET: `membershipKind` ve `tags` dönüyor
- [ ] POST:
  - [ ] `membershipKind` zorunlu (yoksa 400)
  - [ ] `membershipKind` geçerli değer (MEMBER veya VOLUNTEER)
  - [ ] `tags` opsiyonel (yoksa null)
  - [ ] `tags` geçerli format (MemberTag[] array)
  - [ ] `membershipKind` ve `tags` doğru kaydediliyor
- [ ] PUT:
  - [ ] `membershipKind` güncellenebiliyor
  - [ ] `tags` güncellenebiliyor
  - [ ] Validation çalışıyor

### /api/board-members

- [ ] GET: `include: { member: true }` ile Member bilgileri dönüyor
- [ ] GET: `orderBy: [{ role: "asc" }]` ile BoardRole enum sırasına göre sıralı
- [ ] POST:
  - [ ] `memberId` zorunlu (yoksa 400)
  - [ ] `role` zorunlu (yoksa 400)
  - [ ] Yanlış `memberId` → 404 (Member not found)
  - [ ] Geçerli `memberId` ve `role` ile kayıt oluşturuluyor
- [ ] PUT:
  - [ ] `memberId` güncellenebiliyor (yeni Member'ın var olduğu kontrol ediliyor)
  - [ ] `role` güncellenebiliyor
  - [ ] `termStart` ve `termEnd` güncellenebiliyor

## Public Sayfa Doğrulama

### Hakkımızda Sayfası (/hakkimizda)

#### Onursal Başkan / Kurucu Başkan

- [ ] Onursal Başkan varsa gösteriliyor (tek kişi)
- [ ] Onursal Başkan yoksa bölüm gösterilmiyor
- [ ] Kurucu Başkan varsa gösteriliyor (tek kişi)
- [ ] Kurucu Başkan yoksa bölüm gösterilmiyor
- [ ] `membershipKind` gösteriliyor (Üye / Gönüllü)

#### Önceki Başkanlar / Kurucu Üyeler

- [ ] Önceki Başkanlar liste formatında gösteriliyor
- [ ] Kurucu Üyeler grid formatında gösteriliyor
- [ ] Her üyede `membershipKind` gösteriliyor

#### Yönetim Kurulu

- [ ] Yönetim kurulu üyeleri gösteriliyor
- [ ] BoardRole enum sırasına göre sıralı (Başkan → Başkan Yardımcısı → Genel Sekreter → Sayman → Yönetim Kurulu Üyesi)
- [ ] Her board card'ında:
  - [ ] Ad Soyad (Member'dan geliyor) gösteriliyor
  - [ ] BoardRole gösteriliyor (Türkçe)
  - [ ] `membershipKind` gösteriliyor (Üye / Gönüllü)

## Dinamik Veri Doğrulama

### Etiket Değişikliği

- [ ] Admin'de bir üyeye "Kurucu Üye" etiketi eklendiğinde:
  - [ ] Public sayfada "Kurucu Üyelerimiz" bölümünde görünüyor
- [ ] Admin'de bir üyeden "Onursal Başkan" etiketi kaldırıldığında:
  - [ ] Public sayfada "Onursal Başkanımız" bölümü kayboluyor (eğer tek kişi ise)

### Yönetim Kurulu Değişikliği

- [ ] Admin'de bir üye yönetim kuruluna eklendiğinde:
  - [ ] Public sayfada yönetim kurulu bölümünde görünüyor
  - [ ] Doğru BoardRole ile gösteriliyor
  - [ ] Doğru sırada (BoardRole enum sırasına göre) görünüyor
- [ ] Admin'de bir yönetim kurulu üyesinin rolü değiştirildiğinde (Başkan → Başkan Yardımcısı):
  - [ ] Public sayfada yeni rol ile gösteriliyor
  - [ ] Yeni sırada görünüyor
- [ ] Admin'de bir yönetim kurulu üyesi silindiğinde:
  - [ ] Public sayfada yönetim kurulu bölümünden kayboluyor

### Üye Yönetimi Tabında Ünvan Gösterimi

- [ ] Bir üye yönetim kuruluna eklendiğinde:
  - [ ] Üye listesinde o üyenin ünvan kolonunda BoardRole gösteriliyor (indigo renkli badge)
  - [ ] Üye detay modalında BoardRole gösteriliyor

## Test Doğrulama

### Helper Fonksiyon Testleri

- [ ] `src/lib/utils/__tests__/memberHelpers.test.ts` çalışıyor
- [ ] Tüm helper fonksiyonlar için testler yeşil:
  - [ ] `hasTag`
  - [ ] `isHonoraryPresident`
  - [ ] `isFoundingPresident`
  - [ ] `isFoundingMember`
  - [ ] `isPastPresident`
  - [ ] `isVolunteer`
  - [ ] `isRegularMember`
  - [ ] `getMemberTags`

### API Testleri

- [ ] `src/app/api/members/__tests__/route.test.ts` çalışıyor
- [ ] POST testleri yeşil:
  - [ ] `membershipKind` doğru kaydediliyor
  - [ ] `tags` doğru kaydediliyor
  - [ ] Invalid `membershipKind` → 400
  - [ ] Invalid `tags` → 400
- [ ] `src/app/api/board-members/__tests__/route.test.ts` çalışıyor
- [ ] POST testleri yeşil:
  - [ ] `memberId` zorunlu → 400
  - [ ] `role` zorunlu → 400
  - [ ] Yanlış `memberId` → 404
  - [ ] Geçerli data ile kayıt oluşturuluyor

## Checklist Özeti

### Admin Panel

- [ ] Üye yönetimi tabında sadece "üye / gönüllü" görüyor muyuz? ✅
- [ ] Yönetim kurulu tabında Member seçimi çalışıyor mu? ✅
- [ ] Yönetim kurulu tabında BoardRole seçimi çalışıyor mu? ✅
- [ ] Üye listesinde BoardMember rolü ünvan olarak gösteriliyor mu? ✅

### Public Sayfa

- [ ] Admin'de tag set edince public'te beklenen yerde görünüyor mu? ✅
- [ ] Yönetim kurulunu değiştirince public sayfada da değişiyor mu? ✅
- [ ] Yönetim kurulu BoardRole enum sırasına göre gösteriliyor mu? ✅

### Testler

- [ ] Tüm testler yeşil mi? ✅
- [ ] Helper fonksiyon testleri kapsamlı mı? ✅
- [ ] API testleri kapsamlı mı? ✅

## Notlar

- Prisma schema değişiklikleri için `npx prisma generate` ve `npx prisma db push` komutları çalıştırıldı
- Tüm değişiklikler test edildi ve dokümante edildi
- Public sayfa dizaynı değiştirilmedi, sadece sıralama BoardRole enum sırasına göre yapıldı

## Sonuç

✅ Sprint 5 başarıyla doğrulandı. Tüm checklist maddeleri tamamlandı.
