import { ServiceCard as ServiceCardType } from '../types';

interface ServiceCardProps {
  data: ServiceCardType;
  className?: string;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    dot: 'bg-blue-600'
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
    dot: 'bg-green-600'
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    dot: 'bg-purple-600'
  },
  orange: {
    bg: 'bg-orange-100',
    text: 'text-orange-600',
    dot: 'bg-orange-600'
  }
};

export default function ServiceCard({ data, className = '' }: ServiceCardProps) {
  const colors = colorClasses[data.color];

  return (
    <div className={`bg-white p-8 rounded-lg shadow-lg border border-gray-100 ${className}`}>
      <div className="flex items-start space-x-4">
        <div className={`w-16 h-16 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <svg className={`w-8 h-8 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={data.icon} />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">{data.title}</h3>
          <p className="text-gray-600 mb-4">{data.description}</p>
          <ul className="space-y-2 text-sm text-gray-600">
            {data.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <span className={`w-2 h-2 ${colors.dot} rounded-full mr-3`}></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
