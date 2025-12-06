import React from "react";
import { MEMBERSHIP_CONTENT } from "../constants";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 pt-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {MEMBERSHIP_CONTENT.hero.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {MEMBERSHIP_CONTENT.hero.description}
          </p>
        </div>
      </div>
    </section>
  );
}

