import React from "react";
import { getPageContent } from "@/lib/settings/convenience";

// Color gradient mapping (emerald, teal, green, cyan)
const COLOR_GRADIENTS: Record<string, { gradient: string; bg: string; border: string }> = {
  emerald: { gradient: "from-emerald-500 to-teal-600", bg: "from-emerald-600 to-teal-600", border: "border-emerald-100" },
  teal: { gradient: "from-teal-500 to-cyan-600", bg: "from-teal-600 to-cyan-600", border: "border-teal-100" },
  green: { gradient: "from-green-500 to-emerald-600", bg: "from-green-600 to-emerald-600", border: "border-green-100" },
  cyan: { gradient: "from-cyan-500 to-teal-600", bg: "from-cyan-600 to-teal-600", border: "border-cyan-100" },
};

export async function HistorySection() {
  const content = await getPageContent("about");
  
  // All content comes from settings with defaults from defaultContent.ts
  const goalsTitle = content.goalsTitle;
  const goalsSubtitle = content.goalsSubtitle;
  const goalsMainTitle = content.goalsMainTitle;
  const goalsMainDescription = content.goalsMainDescription;
  const goalsActivitiesTitle = content.goalsActivitiesTitle;
  const goalsActivitiesSubtitle = content.goalsActivitiesSubtitle;
  const goalsFooter = content.goalsFooter;
  const goals = content.goals || [];

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {goalsTitle}
          </h2>
          {goalsSubtitle && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {goalsSubtitle}
            </p>
          )}
        </div>
        
        <div className="mb-16">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl blur opacity-20"></div>
            <div className="relative bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-emerald-600 rounded"></div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{goalsMainTitle}</h3>
                <div className="w-16 h-1 bg-emerald-500 rounded-full mx-auto"></div>
              </div>
              {goalsMainDescription && (
                <p className="text-lg text-gray-700 leading-relaxed mb-6 text-center">
                  <strong className="text-emerald-700">Acıpayam Çevresi Eğitimi Destekleme Derneği'nin ana hedefi,</strong> {goalsMainDescription}
                </p>
              )}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100">
                <h4 className="text-xl font-bold text-emerald-900 mb-3 text-center">{goalsActivitiesTitle}</h4>
                {goalsActivitiesSubtitle && (
                  <p className="text-emerald-800 text-center">
                    {goalsActivitiesSubtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 auto-rows-fr">
          {goals.map((goal: any) => {
            const colors = COLOR_GRADIENTS[goal.color] || COLOR_GRADIENTS.emerald;
            return (
              <div key={goal.id} className="group relative flex">
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${colors.bg} rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200`}></div>
                <div className={`relative bg-white p-8 rounded-2xl shadow-lg border ${colors.border} hover:shadow-xl transition-all duration-300 flex flex-col w-full`}>
                  <div className="flex items-start space-x-5 flex-grow">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center shadow-md`}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={goal.icon} />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{goal.title}</h3>
                      <div className={`w-8 h-1 bg-${goal.color}-500 rounded-full mb-4`}></div>
                      <p className="text-gray-700 leading-relaxed flex-grow">
                        {goal.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {goalsFooter && (
          <div className="mt-16 text-center">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl blur opacity-20"></div>
              <div className="relative bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-emerald-600 rounded"></div>
                  </div>
                </div>
                <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
                  <strong className="text-emerald-700">Acıpayam Çevresi Eğitimi Destekleme Derneği,</strong> {goalsFooter}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
