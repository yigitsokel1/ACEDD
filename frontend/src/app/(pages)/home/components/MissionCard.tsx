import { MissionCard as MissionCardType } from '../types';

interface MissionCardProps {
  data: MissionCardType;
  className?: string;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-100',
    icon: 'from-blue-500 to-blue-600',
    decorative: 'bg-blue-100'
  },
  amber: {
    bg: 'bg-amber-100',
    icon: 'from-amber-500 to-amber-600',
    decorative: 'bg-amber-100'
  },
  emerald: {
    bg: 'bg-emerald-100',
    icon: 'from-emerald-500 to-emerald-600',
    decorative: 'bg-emerald-100'
  },
  rose: {
    bg: 'bg-rose-100',
    icon: 'from-rose-500 to-rose-600',
    decorative: 'bg-rose-100'
  }
};

export default function MissionCard({ data, className = '' }: MissionCardProps) {
  const colors = colorClasses[data.color];

  return (
    <div className={`group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 overflow-hidden ${className}`}>
      <div className={`absolute top-0 right-0 w-20 h-20 ${colors.decorative} rounded-full -translate-y-10 translate-x-10 opacity-20`}></div>
      <div className="relative z-10">
        <div className={`w-16 h-16 bg-gradient-to-br ${colors.icon} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={data.icon} />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">{data.title}</h3>
        <p className="text-gray-600 leading-relaxed text-sm">
          {data.description}
        </p>
      </div>
    </div>
  );
}
