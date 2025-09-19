"use client";

import { useServicesData } from './hooks/useServicesData';
import ServiceCard from './components/ServiceCard';

export default function Services() {
  const { content, services } = useServicesData();

  return (
    <div className="bg-white">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-32">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {content.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            {content.description}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} data={service} />
          ))}
        </div>
      </main>
    </div>
  );
}
