import React from "react";
import { VALUES } from "../constants";

export function ValuesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Temel İlkelerimiz
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Bu misyonu gerçekleştirmek üzere dernek, aşağıdaki temel ilkeler doğrultusunda hareket eder:
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 auto-rows-fr">
          {VALUES.map((value, index) => (
            <div key={index} className="group relative flex">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col w-full">
                <div className="flex items-start space-x-5 flex-grow">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center shadow-md">
                      <value.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}:</h3>
                    <div className="w-8 h-1 bg-indigo-500 rounded-full mb-4"></div>
                    <p className="text-gray-700 leading-relaxed flex-grow">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-2xl border border-indigo-100">
            <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              <strong className="text-indigo-900">Dernek,</strong> bu misyonu doğrultusunda, gençlerin aydınlık bir geleceğe sahip olmaları için köprü vazifesi görmeyi ve bölgenin eğitim kalitesini artırmayı hedeflemektedir.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
