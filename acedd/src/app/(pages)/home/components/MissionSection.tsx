import React from "react";
import { getPageContent } from "@/lib/settings/convenience";
import MissionCard from "./MissionCard";

export async function MissionSection() {
  const content = await getPageContent("home");
  
  // Get mission data from settings with minimal fallbacks
  const missionTitle = content.missionTitle || "AMACIMIZ";
  const missionDescription = content.missionDescription || "Acıpayam ve çevresindeki öğrencilere eğitim desteği sağlayarak onların gelişimine katkıda bulunmak ve eğitimde fırsat eşitliği konusunda toplumsal farkındalık oluşturmak.";
  const missionFooter = content.missionFooter || "Dernek, hayırseverlerin ve eğitim gönüllülerinin destekleriyle bu faaliyetlerini sürdürerek Acıpayam ve çevresindeki gençlerin daha iyi bir eğitim almalarına ve geleceğe umutla bakmalarına yardımcı olmayı hedeflemektedir.";
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

