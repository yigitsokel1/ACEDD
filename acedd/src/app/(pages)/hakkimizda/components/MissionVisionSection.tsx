import React from "react";
import { getPageContent } from "@/lib/settings/convenience";
import { MISSION_VISION_ICONS } from "../constants";
import { Target, Award } from "lucide-react";

export async function MissionVisionSection() {
  const content = await getPageContent("about");
  
  // Get content from settings with minimal fallbacks
  const missionVisionTitle = content.missionVisionTitle || "Misyonumuz & Vizyonumuz";
  const missionVisionSubtitle = content.missionVisionSubtitle || "Derneğimizin temel ilkeleri ve hedefleri doğrultusunda hareket ediyoruz";
  
  // Get mission/vision from settings (fallback to empty structure)
  const missionVision = content.missionVision || { mission: { title: "", description: "" }, vision: { title: "", description: "" } };
  const mission = missionVision.mission || { title: "", description: "" };
  const vision = missionVision.vision || { title: "", description: "" };
  
  // Use icon from constants (icons are React components, can't be stored in settings)
  const MissionIcon = MISSION_VISION_ICONS.mission || Target;
  const VisionIcon = MISSION_VISION_ICONS.vision || Award;

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
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <MissionIcon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{mission.title}</h3>
                  <div className="w-12 h-1 bg-blue-500 rounded-full mt-2"></div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                {mission.description}
              </p>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <VisionIcon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{vision.title}</h3>
                  <div className="w-12 h-1 bg-emerald-500 rounded-full mt-2"></div>
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
