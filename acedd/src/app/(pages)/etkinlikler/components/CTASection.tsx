import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { getPageContent } from "@/lib/settings/convenience";
import { CTA_BUTTON_HREFS } from "../constants";

export async function CTASection() {
  const content = await getPageContent("events");
  
  // All content comes from settings with defaults from defaultContent.ts
  const ctaTitle = content.ctaTitle;
  const ctaSubtitle = content.ctaSubtitle;
  const ctaPrimaryButtonText = content.ctaPrimaryButtonText;
  const ctaSecondaryButtonText = content.ctaSecondaryButtonText;
  
  // Use href from constants (technical data - routing configuration, not managed in settings)
  const primaryButtonHref = CTA_BUTTON_HREFS.primary;
  const secondaryButtonHref = CTA_BUTTON_HREFS.secondary;

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {ctaTitle}
          </h2>
          {ctaSubtitle && (
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {ctaSubtitle}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={primaryButtonHref}>
              <Button size="lg" className="w-full sm:w-auto">
                {ctaPrimaryButtonText}
              </Button>
            </Link>
            <Link href={secondaryButtonHref}>
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-transparent hover:text-blue-700">
                {ctaSecondaryButtonText}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}