import React from "react";
import Link from "next/link";
import { getPageContent } from "@/lib/settings/convenience";
import { ROUTES } from "@/lib/constants";
import StatCard from "./StatCard";
import ActivityCard from "./ActivityCard";

export async function HeroSection() {
  const content = await getPageContent("home");
  
  // All content comes from settings with defaults from defaultContent.ts
  const heroTitle = content.heroTitle;
  const heroDescription = content.intro;
  const primaryButtonText = content.primaryButtonText;
  const secondaryButtonText = content.secondaryButtonText;
  const stats = content.stats || [];
  const activities = content.activities || [];
  const visualCardTitle = content.visualCardTitle;
  const visualCardDescription = content.visualCardDescription;

  return (
    <main className="relative pt-16">
      {/* Background with Gradient */}
      <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full -translate-y-48 translate-x-48 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-100 rounded-full translate-y-40 -translate-x-40 opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-100 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-10"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {heroTitle}
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                  {heroDescription}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={ROUTES.SCHOLARSHIP}
                  className="group inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {primaryButtonText}
                </Link>
                
                <Link
                  href={ROUTES.ABOUT}
                  className="group inline-flex items-center justify-center px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {secondaryButtonText}
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 pt-8">
                {stats.map((stat: any) => (
                  <StatCard key={stat.id} data={stat} />
                ))}
              </div>
            </div>
            
            {/* Right Content - Visual Card */}
            <div className="relative">
              {/* Main Visual Card */}
              <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{visualCardTitle}</h3>
                  <p className="text-gray-600">{visualCardDescription}</p>
                </div>
                
                <div className="space-y-6">
                  {activities.map((activity: any) => (
                    <ActivityCard key={activity.id} data={activity} />
                  ))}
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-blue-200 rounded-full opacity-30 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-amber-200 rounded-full opacity-30 animate-pulse animation-delay-2000"></div>
              <div className="absolute top-1/2 -right-8 w-12 h-12 bg-emerald-200 rounded-full opacity-40 animate-pulse animation-delay-4000"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
