import { FeatureCard as FeatureCardType } from '../types';

interface FeatureCardProps {
  data: FeatureCardType;
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
  red: {
    bg: 'bg-red-100',
    text: 'text-red-600'
  }
};

export default function FeatureCard({ data, className = '' }: FeatureCardProps) {
  const colors = colorClasses[data.color];

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md border border-gray-100 ${className}`}>
      <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-4`}>
        <svg className={`w-6 h-6 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={data.icon} />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{data.title}</h3>
      <p className="text-gray-600 text-sm">{data.description}</p>
    </div>
  );
}
