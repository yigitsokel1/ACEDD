import React from "react";
import { PROCESS_STEPS } from "../constants";

export function ProcessSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Başvuru Süreci
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hizmetlerimizden yararlanmak için takip etmeniz gereken adımlar
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {PROCESS_STEPS.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">{step.step}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
