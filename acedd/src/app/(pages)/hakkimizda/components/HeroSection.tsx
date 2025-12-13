import React from "react";
import { getPageContent } from "@/lib/settings/convenience";

export async function HeroSection() {
  const content = await getPageContent("about");
  
  // All content comes from settings with defaults from defaultContent.ts
  const heroTitle = content.heroTitle;
  const intro = content.intro;

  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 pt-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {heroTitle}
          </h1>
          {intro && intro.trim() && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {intro}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
