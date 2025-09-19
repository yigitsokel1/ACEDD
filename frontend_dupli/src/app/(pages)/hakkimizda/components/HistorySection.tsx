import React from "react";
import { HISTORY_TIMELINE } from "../constants";

export function HistorySection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tarihçemiz
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Derneğimizin kuruluşundan bugüne kadar olan yolculuğu
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {HISTORY_TIMELINE.map((item, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.year} - {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
