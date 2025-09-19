"use client";

import { useAboutData } from './hooks/useAboutData';
import FeatureCard from './components/FeatureCard';

export default function About() {
  const { content, features } = useAboutData();

  return (
    <div className="bg-white">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-32">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Side - Image */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <img
                src={content.image.src}
                alt={content.image.alt}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="order-1 lg:order-2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              {content.title}
            </h1>
            
            <div className="space-y-6 text-gray-600 leading-relaxed">
              {content.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              {features.map((feature) => (
                <FeatureCard key={feature.id} data={feature} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
