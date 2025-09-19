import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

interface SuccessMessageProps {
  onNewApplication: () => void;
  className?: string;
}

export default function SuccessMessage({ onNewApplication, className = '' }: SuccessMessageProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-8 text-center ${className}`}>
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Başvurunuz Alındı!</h1>
      <p className="text-gray-600 mb-6">
        Burs başvurunuz başarıyla gönderildi. Değerlendirme süreci 2-3 hafta sürmektedir. 
        Sonuçlar e-posta adresinize gönderilecektir.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href={ROUTES.HOME}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Ana Sayfaya Dön
        </Link>
        <button
          onClick={onNewApplication}
          className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
        >
          Yeni Başvuru Yap
        </button>
      </div>
    </div>
  );
}
