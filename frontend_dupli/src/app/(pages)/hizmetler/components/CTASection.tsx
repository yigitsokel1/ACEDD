import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { CTA_CONTENT } from "../constants";

export function CTASection() {
  return (
    <section className="py-20 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {CTA_CONTENT.title}
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          {CTA_CONTENT.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="secondary" size="lg" asChild>
            <Link href={CTA_CONTENT.primaryButton.href}>
              {CTA_CONTENT.primaryButton.text}
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
            <Link href={CTA_CONTENT.secondaryButton.href}>
              {CTA_CONTENT.secondaryButton.text}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
