import React from "react";
import { getPageContent } from "@/lib/settings/convenience";
import MissionCard from "./MissionCard";

export async function MissionSection() {
  const content = await getPageContent("home");
  
  // All content comes from settings with defaults from defaultContent.ts
  const missionTitle = content.missionTitle;
  const missionDescription = content.missionDescription;
  const missionFooter = content.missionFooter;
  const missions = content.missions || [];

  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {missionTitle}
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {missionDescription}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {missions.map((mission: any) => (
            <MissionCard key={mission.id} data={mission} />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {missionFooter}
          </p>
        </div>
      </div>
    </div>
  );
}

