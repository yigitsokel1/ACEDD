import { ContactInfo as ContactInfoType } from '../types';

interface ContactInfoCardProps {
  data: ContactInfoType;
  className?: string;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600'
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600'
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600'
  },
  orange: {
    bg: 'bg-orange-100',
    text: 'text-orange-600'
  }
};

export default function ContactInfoCard({ data, className = '' }: ContactInfoCardProps) {
  const colors = colorClasses[data.color];

  return (
    <div className={`bg-white p-6 rounded-lg shadow-lg border border-gray-100 ${className}`}>
      <div className="flex items-center space-x-4 mb-4">
        <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
          <svg className={`w-6 h-6 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={data.icon} />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{data.title}</h3>
      </div>
      <p className="text-gray-600 text-sm whitespace-pre-line">{data.content}</p>
    </div>
  );
}
