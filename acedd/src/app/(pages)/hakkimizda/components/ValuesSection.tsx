import React from "react";
import { getPageContent } from "@/lib/settings/convenience";

// Color gradient mapping (indigo, purple, blue, emerald)
const COLOR_GRADIENTS: Record<string, { gradient: string; bg: string; border: string }> = {
  indigo: { gradient: "from-indigo-500 to-indigo-700", bg: "from-indigo-600 to-purple-600", border: "border-indigo-100" },
  purple: { gradient: "from-purple-500 to-purple-700", bg: "from-purple-600 to-indigo-600", border: "border-purple-100" },
  blue: { gradient: "from-blue-500 to-blue-700", bg: "from-blue-600 to-cyan-600", border: "border-blue-100" },
  emerald: { gradient: "from-emerald-500 to-emerald-700", bg: "from-emerald-600 to-teal-600", border: "border-emerald-100" },
};

export async function ValuesSection() {
  const content = await getPageContent("about");
  
  // All content comes from settings with defaults from defaultContent.ts
  const valuesTitle = content.valuesTitle;
  const valuesSubtitle = content.valuesSubtitle;
  const valuesFooter = content.valuesFooter;
  const values = content.values || [];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {valuesTitle}
          </h2>
          {valuesSubtitle && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {valuesSubtitle}
            </p>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 auto-rows-fr">
          {values.map((value: any) => {
            const colors = COLOR_GRADIENTS[value.color] || COLOR_GRADIENTS.indigo;
            return (
              <div key={value.id} className="group relative flex">
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${colors.bg} rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200`}></div>
                <div className={`relative bg-white p-8 rounded-2xl shadow-lg border ${colors.border} hover:shadow-xl transition-all duration-300 flex flex-col w-full`}>
                  <div className="flex items-start space-x-5 flex-grow">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center shadow-md`}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={value.icon} />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}:</h3>
                      <div className={`w-8 h-1 bg-${value.color}-500 rounded-full mb-4`}></div>
                      <p className="text-gray-700 leading-relaxed flex-grow">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {valuesFooter && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-2xl border border-indigo-100">
              <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
                <strong className="text-indigo-900">Dernek,</strong> {valuesFooter}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
