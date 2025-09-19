import { StatCard as StatCardType } from '../types';

interface StatCardProps {
  data: StatCardType;
  className?: string;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    border: 'border-blue-100'
  },
  amber: {
    bg: 'bg-amber-100',
    text: 'text-amber-600',
    border: 'border-amber-100'
  },
  emerald: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-600',
    border: 'border-emerald-100'
  },
  rose: {
    bg: 'bg-rose-100',
    text: 'text-rose-600',
    border: 'border-rose-100'
  }
};

export default function StatCard({ data, className = '' }: StatCardProps) {
  const colors = colorClasses[data.color];

  return (
    <div className={`text-center p-6 bg-white/70 rounded-2xl border ${colors.border} shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
      <div className={`w-14 h-14 ${colors.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
        <svg className={`w-7 h-7 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={data.icon} />
        </svg>
      </div>
      <div className={`text-3xl font-bold ${colors.text} mb-2`}>
        {data.value}
      </div>
      <div className="text-gray-600 text-sm font-medium">
        {data.label}
      </div>
    </div>
  );
}
