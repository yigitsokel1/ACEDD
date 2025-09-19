"use client";

import { useBoardData } from './hooks/useBoardData';
import BoardMemberCard from './components/BoardMemberCard';

export default function Board() {
  const { content, members } = useBoardData();

  return (
    <div className="bg-white">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-32">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Side - Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              {content.title}
            </h1>
            
            <p className="text-gray-600 leading-relaxed mb-8">
              {content.description}
            </p>

            {/* Image */}
            <div className="relative">
              <img
                src={content.image.src}
                alt={content.image.alt}
                className="w-full h-80 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Right Side - Board Members */}
          <div>
            <div className="grid md:grid-cols-2 gap-6">
              {members.map((member) => (
                <BoardMemberCard key={member.id} data={member} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
