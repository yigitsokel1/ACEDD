import { TrustIndicator as TrustIndicatorType } from '../types';

interface TrustIndicatorProps {
  data: TrustIndicatorType;
  className?: string;
}

export default function TrustIndicator({ data, className = '' }: TrustIndicatorProps) {
  return (
    <div className={`text-center ${className}`}>
      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={data.icon} />
        </svg>
      </div>
      <div className="text-white/80 text-sm font-medium">{data.label}</div>
    </div>
  );
}
