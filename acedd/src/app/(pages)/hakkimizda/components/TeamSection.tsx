import { Users, Users2, HandHeart, Shield, Crown, UserCheck, History, User } from "lucide-react";
import { ORGANIZATION_STRUCTURE, ORGANIZATION_MEMBERS } from "../constants";
import { prisma } from "@/lib/db";
import {
  parseTags,
  groupByTag,
  sortBoardMembersByRole,
  getBoardMemberFullName,
  getBoardRoleLabel,
} from "@/lib/utils/memberHelpers";
import type { BoardMember, Member } from "@/lib/types/member";

// Sprint 5: Fetch board members (BoardMember modelinden, Member ile ilişkili)
// Sprint 6: isActive ve order alanları Prisma modelinde yok, TS tipinde de yok (tutarlılık sağlandı)
async function fetchBoardMembers(): Promise<BoardMember[]> {
  try {
    const boardMembers = await prisma.boardMember.findMany({
      include: {
        member: true, // Sprint 5: Member bilgilerini de getir
      },
      orderBy: [
        { role: "asc" }, // Sprint 5: BoardRole enum sırasına göre sıralama
        { member: { firstName: "asc" } }, // Sonra alfabetik (ad)
        { member: { lastName: "asc" } }, // Sonra alfabetik (soyad)
      ],
    });
    
    // Sprint 6: Format Prisma results to BoardMember type
    return boardMembers.map((bm) => ({
      id: bm.id,
      memberId: bm.memberId,
      member: {
        id: bm.member.id,
        firstName: bm.member.firstName,
        lastName: bm.member.lastName,
        email: bm.member.email,
        phone: bm.member.phone || undefined,
        tags: parseTags(bm.member.tags),
        // Diğer Member alanları gerekirse buraya eklenebilir
      } as any,
      role: bm.role as any,
      termStart: bm.termStart?.toISOString(),
      termEnd: bm.termEnd?.toISOString(),
      createdAt: bm.createdAt.toISOString(),
      updatedAt: bm.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching board members:", error);
    return [];
  }
}

export async function TeamSection() {
  // Sprint 5: Fetch members by tags (Member modelinden)
  // Not: MariaDB'de JSON array contains için Prisma'nın doğru syntax'ını kullanmalıyız
  // Alternatif: Raw query veya tüm aktif üyeleri çekip filtreleme
  const [allActiveMembersRaw, boardMembers] = await Promise.all([
    prisma.member.findMany({
      where: { 
        status: "ACTIVE",
      },
      orderBy: {
        membershipDate: "asc",
      },
    }),
    fetchBoardMembers(),
  ]);

  // Sprint 6: Prisma sonuçlarını TypeScript Member tipine dönüştür
  const allActiveMembers: Member[] = allActiveMembersRaw.map(m => ({
    id: m.id,
    firstName: m.firstName,
    lastName: m.lastName,
    gender: m.gender as 'erkek' | 'kadın',
    email: m.email,
    phone: m.phone || "", // Prisma'dan null gelebilir, string'e çevir
    birthDate: m.birthDate.toISOString(),
    academicLevel: m.academicLevel as any,
    maritalStatus: m.maritalStatus as any,
    hometown: m.hometown,
    placeOfBirth: m.placeOfBirth,
    nationality: m.nationality,
    currentAddress: m.currentAddress,
    tcId: m.tcId || undefined,
    lastValidDate: m.lastValidDate?.toISOString(),
    titles: m.titles ? (Array.isArray(m.titles) ? m.titles : JSON.parse(m.titles)) : [],
    status: (m.status === "ACTIVE" ? "active" : "inactive") as 'active' | 'inactive',
    membershipDate: m.membershipDate.toISOString(),
    membershipKind: m.membershipKind as any,
    tags: parseTags(m.tags),
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
  })) as Member[];

  // Sprint 6: Tags'e göre filtreleme - helper fonksiyonları kullan
  const honoraryPresidents = groupByTag(allActiveMembers, "HONORARY_PRESIDENT");
  const foundingPresidents = groupByTag(allActiveMembers, "FOUNDING_PRESIDENT");
  const foundingMembers = groupByTag(allActiveMembers, "FOUNDING_MEMBER");
  const formerPresidents = groupByTag(allActiveMembers, "PAST_PRESIDENT");
  
  // Sprint 6: Board members'ı helper fonksiyonla sırala
  const sortedBoardMembers = sortBoardMembersByRole(boardMembers);
  
  // Debug: Log member counts
  if (process.env.NODE_ENV === "development") {
    console.log("[TeamSection] Fetched members:", {
      honoraryPresidents: honoraryPresidents.length,
      foundingPresidents: foundingPresidents.length,
      foundingMembers: foundingMembers.length,
      formerPresidents: formerPresidents.length,
      boardMembers: sortedBoardMembers.length,
    });
  }
  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return "from-purple-500 to-purple-600";
      case 2: return "from-blue-500 to-blue-600";
      case 3: return "from-green-500 to-green-600";
      case 4: return "from-orange-500 to-orange-600";
      case 5: return "from-indigo-500 to-indigo-600";
      case 6: return "from-pink-500 to-pink-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getLevelBgColor = (level: number) => {
    switch (level) {
      case 1: return "from-purple-50 to-purple-100";
      case 2: return "from-blue-50 to-blue-100";
      case 3: return "from-green-50 to-green-100";
      case 4: return "from-orange-50 to-orange-100";
      case 5: return "from-indigo-50 to-indigo-100";
      case 6: return "from-pink-50 to-pink-100";
      default: return "from-gray-50 to-gray-100";
    }
  };

  const getLevelBorderColor = (level: number) => {
    switch (level) {
      case 1: return "border-purple-200";
      case 2: return "border-blue-200";
      case 3: return "border-green-200";
      case 4: return "border-orange-200";
      case 5: return "border-indigo-200";
      case 6: return "border-pink-200";
      default: return "border-gray-200";
    }
  };

  // Organizasyon yapısını hiyerarşiye göre grupla
  const level1 = ORGANIZATION_STRUCTURE.filter(unit => unit.level === 1);
  const level2 = ORGANIZATION_STRUCTURE.filter(unit => unit.level === 2);
  const level3 = ORGANIZATION_STRUCTURE.filter(unit => unit.level === 3);
  const level4 = ORGANIZATION_STRUCTURE.filter(unit => unit.level === 4);
  const level5 = ORGANIZATION_STRUCTURE.filter(unit => unit.level === 5);
  const level6 = ORGANIZATION_STRUCTURE.filter(unit => unit.level === 6);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Dernek Organizasyonu
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Organizasyonumuz ve Görevleri
          </p>
        </div>
        
        {/* Organizasyon Şeması - Minimal Layout */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 relative overflow-x-auto">
          <div className="min-w-[1000px]">
            {/* Level 1 - Genel Kurul */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className={`w-40 h-12 bg-gradient-to-br ${getLevelColor(1)} rounded-lg flex items-center justify-center shadow-md`}>
                  <h3 className="text-white font-bold text-base">GENEL KURUL</h3>
                </div>
              </div>
            </div>

            {/* Bağlantı Çizgisi Level 1 -> Level 2 */}
            <div className="flex justify-center mb-4 relative">
              <div className="w-1 h-4 bg-gray-600"></div>
              {/* Yatay çizgi */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-600"></div>
            </div>

            {/* Level 2 - Yönetim ve Denetim Kurulları */}
            <div className="flex justify-center gap-16 mb-4 relative">
              {level2.map((unit, index) => (
                <div key={index} className="relative">
                  {/* Dikey bağlantı çizgisi */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-gray-600"></div>
                  <div className={`w-40 h-12 bg-gradient-to-br ${getLevelColor(unit.level)} rounded-lg flex items-center justify-center shadow-md`}>
                    <h3 className="text-white font-bold text-base">{unit.title}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Bağlantı Çizgisi Level 2 -> Level 3 (Sadece Yönetim Kurulu'ndan) */}
            <div className="flex justify-center relative">
              {/* Yönetim Kurulu'nun altından çubuk - sol taraftaki */}
              <div className="w-1 h-4 bg-gray-600 -ml-55"></div>
            </div>

            {/* Level 3 - Dernek Başkanı */}
            <div className="flex justify-center mb-6">
              {level3.map((unit, index) => (
                <div key={index} className="relative -ml-55">
                  <div className={`w-40 h-12 bg-gradient-to-br ${getLevelColor(unit.level)} rounded-lg flex items-center justify-center shadow-md`}>
                    <h3 className="text-white font-bold text-base">{unit.title}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Bağlantı Çizgisi Level 3 -> Level 4 */}
            <div className="flex justify-center mb-4 relative">
              {/* Yatay çizgi */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-200 h-1 bg-gray-600"></div>
            </div>

            {/* Level 4 - Departmanlar */}
            <div className="grid grid-cols-4 gap-4 mb-4 relative">
              {level4.map((unit, index) => (
                <div key={index} className="relative">
                  {/* Dikey bağlantı çizgisi */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-gray-600"></div>
                  <div className={`w-40 h-12 bg-gradient-to-br ${getLevelColor(unit.level)} rounded-lg flex items-center justify-center shadow-md mx-auto`}>
                    <h3 className="text-white font-bold text-base text-center">{unit.title}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Bağlantı Çizgisi Level 4 -> Level 5 (Burs Komisyonu'ndan) */}
            <div className="flex justify-center mb-3 relative">
              {/* Burs Komisyonu'nun altından dikey çizgi */}
              <div className="w-1 h-4 bg-gray-600 ml-75"></div>
              {/* Yatay çizgi */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-600 ml-38"></div>
            </div>

            {/* Level 5 - Alt Departmanlar */}
            <div className="grid grid-cols-4 gap-4 mb-6 relative">
              {/* Genel Sekreter'den Üye İlişkileri */}
              <div className="relative">
                {/* Parent'tan çubuk - Genel Sekreter'in altından */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-gray-600"></div>
                <div className={`w-40 h-12 bg-gradient-to-br ${getLevelColor(5)} rounded-lg flex items-center justify-center shadow-md mx-auto`}>
                  <h3 className="text-white font-bold text-base text-center">Üye İlişkileri</h3>
                </div>
              </div>

              {/* Boş alan - 2. sütun (Sayman'ın alt birimi yok) */}
              <div></div>

              {/* Burs Komisyonu'ndan Eğitim Koordinatörü */}
              <div className="relative -ml-50">
                {/* Parent'tan çubuk - Burs Komisyonu'nun altından */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-gray-600"></div>
                <div className={`w-40 h-12 bg-gradient-to-br ${getLevelColor(5)} rounded-lg flex items-center justify-center shadow-md mx-auto`}>
                  <h3 className="text-white font-bold text-base text-center">Eğitim Koordinatörü</h3>
                </div>
              </div>

              {/* Burs Komisyonu'ndan Bursiyer Takip Ekibi */}
              <div className="relative -ml-90">
                {/* Parent'tan çubuk - Burs Komisyonu'nun altından */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-gray-600"></div>
                <div className={`w-40 h-12 bg-gradient-to-br ${getLevelColor(5)} rounded-lg flex items-center justify-center shadow-md mx-auto`}>
                  <h3 className="text-white font-bold text-base text-center">Bursiyer Takip Ekibi</h3>
                </div>
              </div>
            </div>

            {/* Bağlantı Çizgisi Level 5 -> Level 6 (Sadece Eğitim Koordinatörü'nden) */}
            <div className="flex justify-center mb-0 relative">
              {/* Eğitim Koordinatörü'nün altından çubuk - 3. sütundan */}
              <div className="w-1 h-4 bg-gray-600 ml-25"></div>
            </div>

            {/* Level 6 - Gönüllü Eğitmenler */}
            <div className="flex justify-center">
              <div className="relative ml-25">
                <div className={`w-40 h-12 bg-gradient-to-br ${getLevelColor(6)} rounded-lg flex items-center justify-center shadow-md`}>
                  <h3 className="text-white font-bold text-base">Gönüllü Eğitmenler</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Görev Tanımları Kartları */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">Görev Tanımları</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ORGANIZATION_STRUCTURE.map((unit, index) => (
              <div key={index} className={`group relative bg-gradient-to-br ${getLevelBgColor(unit.level)} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border ${getLevelBorderColor(unit.level)} overflow-hidden`}>
                <div className="absolute top-0 right-0 w-16 h-16 bg-opacity-20 rounded-full -translate-y-8 translate-x-8"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getLevelColor(unit.level)} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      <unit.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{unit.title}</h4>
                      <p className="text-sm text-gray-600">Seviye {unit.level}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {unit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Üye Listesi */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">Dernek Üyelerimiz</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Onursal Başkan */}
            {honoraryPresidents.length > 0 && (
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-2xl border border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">ONURSAL BAŞKANIMIZ</h4>
                </div>
                <div className="space-y-2">
                  {honoraryPresidents.map((member) => (
                    <div key={member.id} className="text-gray-700 font-medium">
                      {member.firstName} {member.lastName}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Kurucu Başkan */}
            {foundingPresidents.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">KURUCU BAŞKANIMIZ</h4>
                </div>
                <div className="space-y-2">
                  {foundingPresidents.map((member) => (
                    <div key={member.id} className="text-gray-700 font-medium">
                      {member.firstName} {member.lastName}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Kurucu Üyeler */}
            {foundingMembers.length > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">KURUCU ÜYELERİMİZ</h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {foundingMembers.map((member) => (
                    <div key={member.id} className="text-gray-700 font-medium text-sm">
                      {member.firstName} {member.lastName}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Önceki Başkanlar */}
            {formerPresidents.length > 0 && (
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-2xl border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                    <History className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">ÖNCEKİ BAŞKANLARIMIZ</h4>
                </div>
                <div className="space-y-2">
                  {formerPresidents.map((member) => (
                    <div key={member.id} className="text-gray-700 font-medium">
                      {member.firstName} {member.lastName}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Eğer hiç üye yoksa boş durum mesajı */}
          {honoraryPresidents.length === 0 && 
           foundingPresidents.length === 0 && 
           foundingMembers.length === 0 && 
           formerPresidents.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">Henüz üye eklenmemiş</p>
                <p className="text-sm mt-2">Üyeler admin panelden eklenebilir.</p>
              </div>
            </div>
          )}

          {/* Yönetim Kurulu */}
          <div className="mt-8">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl border border-indigo-200 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900">{ORGANIZATION_MEMBERS.boardOfDirectors.title}</h4>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedBoardMembers.length > 0 ? (
                  // Sprint 6: Helper fonksiyonlarla sıralanmış board members
                  sortedBoardMembers.map((boardMember) => {
                    const fullName = getBoardMemberFullName(boardMember);
                    const roleLabel = getBoardRoleLabel(boardMember.role);
                    
                    return (
                      <div key={boardMember.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{fullName}</div>
                            <div className="text-sm text-gray-600">{roleLabel}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  // Show empty state if no board members in database
                  <div className="col-span-full text-center py-8">
                    <div className="text-gray-500">
                      <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium">Henüz yönetim kurulu üyesi eklenmemiş</p>
                      <p className="text-sm mt-2">Yönetim kurulu üyeleri admin panelden eklenebilir.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Organizasyon Yapımız</h3>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Derneğimiz, hiyerarşik bir yapıda organize edilmiş olup, her birim kendi sorumluluk alanında 
              etkin bir şekilde çalışmaktadır. Bu yapı sayesinde eğitim destek faaliyetlerimizi 
              daha verimli ve koordineli bir şekilde yürütmekteyiz.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
