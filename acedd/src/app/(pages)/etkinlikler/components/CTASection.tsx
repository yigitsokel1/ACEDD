import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { CTA_CONTENT } from "../constants";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {CTA_CONTENT.title}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {CTA_CONTENT.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={CTA_CONTENT.primaryButton.href}>
              <Button size="lg" className="w-full sm:w-auto">
                {CTA_CONTENT.primaryButton.text}
              </Button>
            </Link>
            <Link href={CTA_CONTENT.secondaryButton.href}>
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-transparent hover:text-blue-700">
                {CTA_CONTENT.secondaryButton.text}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}