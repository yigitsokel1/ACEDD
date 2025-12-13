import { Users, Shield, Crown, UserCheck, History, User, FileText } from "lucide-react";
import { prisma } from "@/lib/db";
import { getPageContent } from "@/lib/settings/convenience";
import {
  parseTags,
  groupByTag,
  sortBoardMembersByRole,
  getBoardMemberFullName,
  getBoardRoleLabel,
} from "@/lib/utils/memberHelpers";
import type { BoardMember, Member } from "@/lib/types/member";
import { logErrorSecurely } from "@/lib/utils/secureLogging";

// Sprint 5: Fetch board members (BoardMember modelinden, Member ile ilişkili)
// Sprint 6: isActive ve order alanları Prisma modelinde yok, TS tipinde de yok (tutarlılık sağlandı)
// Sprint 14: Yönetim kurulunda sadece aktif üyeler olabilir
async function fetchBoardMembers(): Promise<BoardMember[]> {
  try {
    const boardMembers = await prisma.boardMember.findMany({
      where: {
        member: {
          status: "ACTIVE", // Sprint 14: Sadece aktif üyeler yönetim kurulunda olabilir
        },
      },
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
        cvDatasetId: (bm.member as any).cvDatasetId || undefined, // Sprint 17: CV Dataset ID
        // Diğer Member alanları gerekirse buraya eklenebilir
      } as any,
      role: bm.role as any,
      termStart: bm.termStart?.toISOString(),
      termEnd: bm.termEnd?.toISOString(),
      createdAt: bm.createdAt.toISOString(),
      updatedAt: bm.updatedAt.toISOString(),
    }));
  } catch (error) {
    logErrorSecurely("[TeamSection][FETCH_BOARD_MEMBERS]", error);
    return [];
  }
}

export async function TeamSection() {
  // Get content from settings
  const content = await getPageContent("about");
  
  // Sprint 5: Fetch members by tags (Member modelinden)
  // Sprint 14: Etiketler için tüm üyeler (aktif + pasif) çekiliyor
  // Onursal Başkan, Kurucu Üye, Kurucu Başkan ve Önceki Başkan etiketleri pasif üyeler için de görünmeli
  // Not: Board members sadece aktif üyelerden oluşur (fetchBoardMembers içinde filtreleniyor)
  const [allMembersRaw, boardMembers] = await Promise.all([
    prisma.member.findMany({
      // Sprint 14: Status filtresi kaldırıldı - etiketler için tüm üyeler gerekli
      orderBy: {
        membershipDate: "asc",
      },
    }),
    fetchBoardMembers(),
  ]);

  // Sprint 6: Prisma sonuçlarını TypeScript Member tipine dönüştür
  // Sprint 14: Tüm üyeler (aktif + pasif) etiketler için kullanılıyor
  const allMembers: Member[] = allMembersRaw.map(m => ({
    id: m.id,
    firstName: m.firstName,
    lastName: m.lastName,
    gender: m.gender as 'erkek' | 'kadın',
    email: m.email,
    phone: m.phone || "", // Prisma'dan null gelebilir, string'e çevir
    birthDate: m.birthDate.toISOString(),
    // Sprint 15: academicLevel, maritalStatus, hometown, nationality alanları kaldırıldı
    placeOfBirth: m.placeOfBirth,
    currentAddress: m.currentAddress,
    tcId: m.tcId || undefined,
    lastValidDate: m.lastValidDate?.toISOString(),
    titles: m.titles ? (Array.isArray(m.titles) ? m.titles : JSON.parse(m.titles)) : [],
    status: (m.status === "ACTIVE" ? "active" : "inactive") as 'active' | 'inactive',
    membershipDate: m.membershipDate.toISOString(),
    membershipKind: m.membershipKind as any,
    tags: parseTags(m.tags),
    cvDatasetId: (m as any).cvDatasetId || undefined, // Sprint 17: CV Dataset ID
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
  })) as Member[];

  // Sprint 6: Tags'e göre filtreleme - helper fonksiyonları kullan
  // Sprint 14: Etiketler için tüm üyeler (aktif + pasif) kullanılıyor
  // Onursal Başkan, Kurucu Üye, Kurucu Başkan ve Önceki Başkan etiketleri pasif üyeler için de görünmeli
  const honoraryPresidents = groupByTag(allMembers, "HONORARY_PRESIDENT");
  const foundingPresidents = groupByTag(allMembers, "FOUNDING_PRESIDENT");
  const foundingMembers = groupByTag(allMembers, "FOUNDING_MEMBER");
  const formerPresidents = groupByTag(allMembers, "PAST_PRESIDENT");
  
  // Sprint 6: Board members'ı helper fonksiyonla sırala
  const sortedBoardMembers = sortBoardMembersByRole(boardMembers);
  
  // Get hierarchical level based on job title (matching HTML structure)
  // Unused - keeping for potential future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getJobLevel = (_title: string): number => 0;

  // Color palette for job description cards (based on color field from settings)
  const getCardColor = (color: string) => {
    const colorMap: Record<string, { gradient: string; bg: string; border: string }> = {
      purple: { gradient: "from-purple-500 to-purple-600", bg: "from-purple-50 to-purple-100", border: "border-purple-200" },
      blue: { gradient: "from-blue-500 to-blue-600", bg: "from-blue-50 to-blue-100", border: "border-blue-200" },
      green: { gradient: "from-green-500 to-green-600", bg: "from-green-50 to-green-100", border: "border-green-200" },
      orange: { gradient: "from-orange-500 to-orange-600", bg: "from-orange-50 to-orange-100", border: "border-orange-200" },
      indigo: { gradient: "from-indigo-500 to-indigo-600", bg: "from-indigo-50 to-indigo-100", border: "border-indigo-200" },
      pink: { gradient: "from-pink-500 to-pink-600", bg: "from-pink-50 to-pink-100", border: "border-pink-200" },
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Görev Tanımları Kartları */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            {content.jobDescriptionsTitle}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(content.jobDescriptions && Array.isArray(content.jobDescriptions) && content.jobDescriptions.length > 0 
              ? content.jobDescriptions 
              : [] // No fallback - content must be set via Admin UI
            ).map((job: any, index: number) => {
              const cardColor = getCardColor(job.color || 'blue');
              
              return (
                <div key={job.id || index} className={`group relative bg-gradient-to-br ${cardColor.bg} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border ${cardColor.border} overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-opacity-20 rounded-full -translate-y-8 translate-x-8"></div>
                  <div className="relative z-10">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${cardColor.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                        {job.icon && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d={job.icon}
                            />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{job.title}</h4>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {job.description}
                    </p>
                  </div>
                </div>
              );
            })}
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
                    <div key={member.id} className="flex items-center justify-between text-gray-700 font-medium">
                      <span>{member.firstName} {member.lastName}</span>
                      {member.cvDatasetId && (
                        <a
                          href={`/api/download/cv/${member.cvDatasetId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                          title="CV İndir"
                        >
                          <FileText className="w-4 h-4" />
                          <span>CV</span>
                        </a>
                      )}
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
                    <div key={member.id} className="flex items-center justify-between text-gray-700 font-medium">
                      <span>{member.firstName} {member.lastName}</span>
                      {member.cvDatasetId && (
                        <a
                          href={`/api/download/cv/${member.cvDatasetId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                          title="CV İndir"
                        >
                          <FileText className="w-4 h-4" />
                          <span>CV</span>
                        </a>
                      )}
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
                <div className="space-y-2">
                  {foundingMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between text-gray-700 font-medium">
                      <span>{member.firstName} {member.lastName}</span>
                      {member.cvDatasetId && (
                        <a
                          href={`/api/download/cv/${member.cvDatasetId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                          title="CV İndir"
                        >
                          <FileText className="w-4 h-4" />
                          <span>CV</span>
                        </a>
                      )}
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
                    <div key={member.id} className="flex items-center justify-between text-gray-700 font-medium">
                      <span>{member.firstName} {member.lastName}</span>
                      {member.cvDatasetId && (
                        <a
                          href={`/api/download/cv/${member.cvDatasetId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                          title="CV İndir"
                        >
                          <FileText className="w-4 h-4" />
                          <span>CV</span>
                        </a>
                      )}
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
                <h4 className="text-2xl font-bold text-gray-900">Yönetim Kurulu</h4>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedBoardMembers.length > 0 ? (
                  // Sprint 6: Helper fonksiyonlarla sıralanmış board members
                  sortedBoardMembers.map((boardMember) => {
                    const fullName = getBoardMemberFullName(boardMember);
                    const roleLabel = getBoardRoleLabel(boardMember.role);
                    
                    return (
                      <div key={boardMember.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{fullName}</div>
                              <div className="text-sm text-gray-600">{roleLabel}</div>
                            </div>
                          </div>
                          {boardMember.member.cvDatasetId && (
                            <a
                              href={`/api/download/cv/${boardMember.member.cvDatasetId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                              title="CV İndir"
                            >
                              <FileText className="w-4 h-4" />
                              <span className="hidden sm:inline">CV</span>
                            </a>
                          )}
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
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {content.organizationStructureTitle}
            </h3>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {content.organizationStructureDescription}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
