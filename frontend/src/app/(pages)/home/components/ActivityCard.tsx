import { ActivityCard as ActivityCardType } from '../types';

interface ActivityCardProps {
  data: ActivityCardType;
  className?: string;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    hover: 'hover:bg-blue-100',
    icon: 'bg-blue-500'
  },
  amber: {
    bg: 'bg-amber-50',
    hover: 'hover:bg-amber-100',
    icon: 'bg-amber-500'
  },
  emerald: {
    bg: 'bg-emerald-50',
    hover: 'hover:bg-emerald-100',
    icon: 'bg-emerald-500'
  }
};

export default function ActivityCard({ data, className = '' }: ActivityCardProps) {
  const colors = colorClasses[data.color];

  return (
    <div className={`flex items-center space-x-4 p-4 ${colors.bg} rounded-2xl ${colors.hover} transition-colors duration-300 ${className}`}>
      <div className={`w-12 h-12 ${colors.icon} rounded-2xl flex items-center justify-center`}>
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={data.icon} />
        </svg>
      </div>
      <div>
        <h4 className="font-semibold text-gray-900">{data.title}</h4>
        <p className="text-sm text-gray-600">{data.description}</p>
      </div>
    </div>
  );
}
