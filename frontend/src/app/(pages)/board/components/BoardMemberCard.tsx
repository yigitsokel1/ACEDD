import { BoardMember as BoardMemberType } from '../types';

interface BoardMemberCardProps {
  data: BoardMemberType;
  className?: string;
}

export default function BoardMemberCard({ data, className = '' }: BoardMemberCardProps) {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-lg border border-gray-100 ${className}`}>
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-xl font-bold text-gray-600">{data.initials}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900">{data.name}</h3>
        <p className="text-blue-600 font-medium">{data.position}</p>
      </div>
      <p className="text-gray-600 text-sm mb-4">{data.description}</p>
      <div className="space-y-2 text-sm">
        <div className="flex items-center text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {data.email}
        </div>
        <div className="flex items-center text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          {data.phone}
        </div>
      </div>
    </div>
  );
}
