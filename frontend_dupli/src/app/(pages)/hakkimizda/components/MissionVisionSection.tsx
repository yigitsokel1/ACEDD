import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { MISSION_VISION } from "../constants";

export function MissionVisionSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          <Card>
            <CardHeader>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <MISSION_VISION.mission.icon className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">{MISSION_VISION.mission.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                {MISSION_VISION.mission.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <MISSION_VISION.vision.icon className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl">{MISSION_VISION.vision.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                {MISSION_VISION.vision.description}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
