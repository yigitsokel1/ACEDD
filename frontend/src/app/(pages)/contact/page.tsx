"use client";

import { useContactData } from './hooks/useContactData';
import ContactInfoCard from './components/ContactInfoCard';
import ContactForm from './components/ContactForm';

export default function Contact() {
  const { content, contactInfo } = useContactData();

  return (
    <div className="bg-white">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-32">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {content.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {content.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Side - Contact Info and Form */}
          <div className="space-y-8">
            {/* Contact Info Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {contactInfo.map((info) => (
                <ContactInfoCard key={info.id} data={info} />
              ))}
            </div>

            {/* Contact Form */}
            <ContactForm />
          </div>

          {/* Right Side - Map */}
          <div>
            <div className="bg-gray-200 rounded-lg shadow-lg h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-lg font-medium">Harita</p>
                <p className="text-sm">Acıpayam, Denizli</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
