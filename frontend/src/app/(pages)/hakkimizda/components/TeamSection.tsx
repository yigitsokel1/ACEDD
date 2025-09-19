import React from "react";
import { Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { TEAM_MEMBERS } from "../constants";

export function TeamSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Yönetim Kurulu
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Derneğimizi yöneten deneyimli ve kararlı ekip
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {TEAM_MEMBERS.map((member, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-gray-400" />
                </div>
                <CardTitle className="text-xl">{member.name}</CardTitle>
                <CardDescription className="text-blue-600 font-medium">
                  {member.position}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
