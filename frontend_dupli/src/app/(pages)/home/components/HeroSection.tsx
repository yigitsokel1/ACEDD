import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { HERO_CONTENT } from "../constants";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {HERO_CONTENT.title.split(',')[0]},
            <span className="text-blue-600"> {HERO_CONTENT.title.split(',')[1]}</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {HERO_CONTENT.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href={HERO_CONTENT.primaryButton.href}>
                {HERO_CONTENT.primaryButton.text}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href={HERO_CONTENT.secondaryButton.href}>
                {HERO_CONTENT.secondaryButton.text}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
