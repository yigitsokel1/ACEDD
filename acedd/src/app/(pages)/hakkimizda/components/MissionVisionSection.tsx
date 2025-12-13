import React from "react";
import { getPageContent } from "@/lib/settings/convenience";

// Color gradient mapping
const COLOR_GRADIENTS: Record<string, { gradient: string; bg: string; border: string }> = {
  blue: { gradient: "from-blue-500 to-blue-700", bg: "from-blue-600 to-cyan-600", border: "border-blue-100" },
  indigo: { gradient: "from-indigo-500 to-indigo-700", bg: "from-indigo-600 to-purple-600", border: "border-indigo-100" },
  purple: { gradient: "from-purple-500 to-purple-700", bg: "from-purple-600 to-indigo-600", border: "border-purple-100" },
};

export async function MissionVisionSection() {
  const content = await getPageContent("about");
  
  // All content comes from settings with defaults from defaultContent.ts
  const missionVisionTitle = content.missionVisionTitle;
  const missionVisionSubtitle = content.missionVisionSubtitle;
  
  // Get mission/vision from settings (includes icon, color, id)
  const missionVision = content.missionVision || { 
    mission: { id: "mission-1", icon: "", color: "blue", title: "", description: "" }, 
    vision: { id: "vision-1", icon: "", color: "indigo", title: "", description: "" } 
  };
  const mission = missionVision.mission;
  const vision = missionVision.vision;

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {missionVisionTitle}
          </h2>
          {missionVisionSubtitle && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {missionVisionSubtitle}
            </p>
          )}
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Mission */}
          <div className="group relative">
            <div className={`absolute -inset-1 bg-gradient-to-r ${COLOR_GRADIENTS[(mission as any)?.color || 'blue']?.gradient || COLOR_GRADIENTS.blue.gradient} rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200`}></div>
            <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-14 h-14 bg-gradient-to-br ${COLOR_GRADIENTS[(mission as any)?.color || 'blue']?.gradient || COLOR_GRADIENTS.blue.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                  {(mission as any)?.icon && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={(mission as any).icon}
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{mission.title}</h3>
                  <div className={`w-12 h-1 bg-${(mission as any)?.color || 'blue'}-500 rounded-full mt-2`}></div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                {mission.description}
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="group relative">
            <div className={`absolute -inset-1 bg-gradient-to-r ${COLOR_GRADIENTS[(vision as any)?.color || 'indigo']?.gradient || COLOR_GRADIENTS.indigo.gradient} rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200`}></div>
            <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-14 h-14 bg-gradient-to-br ${COLOR_GRADIENTS[(vision as any)?.color || 'indigo']?.gradient || COLOR_GRADIENTS.indigo.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                  {(vision as any)?.icon && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={(vision as any).icon}
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{vision.title}</h3>
                  <div className={`w-12 h-1 bg-${(vision as any)?.color || 'indigo'}-500 rounded-full mt-2`}></div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                {vision.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
