"use client";

import React from "react";
import Link from "next/link";
import { useHomeData } from "../hooks/useHomeData";
import TrustIndicator from "./TrustIndicator";
import { ROUTES } from "@/lib/constants";

export function CTASection() {
  const { trustIndicators } = useHomeData();

  return (
    <div className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-white/5 rounded-full animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/4 w-40 h-40 bg-white/5 rounded-full animate-pulse animation-delay-4000"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-white/10 rounded-full animate-pulse animation-delay-2000"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Hayırseverlerin ve Eğitim Gönüllülerinin Desteğiyle
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
            Acıpayam ve çevresindeki gençlerin daha iyi bir eğitim almalarına ve geleceğe umutla bakmalarına yardımcı olmayı hedefliyoruz. 
            Siz de bu hayırlı işe katkıda bulunun.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href={ROUTES.SCHOLARSHIP}
              className="group inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Burs Başvurusu Yap
            </Link>
            <Link
              href="/bagis-yap"
              className="group inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Destek Ol
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {trustIndicators.map((indicator) => (
              <TrustIndicator key={indicator.id} data={indicator} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
