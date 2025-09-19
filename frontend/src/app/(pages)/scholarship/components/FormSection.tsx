import { FormSection as FormSectionType, ScholarshipFormData } from '../types';
import FormField from './FormField';

interface FormSectionProps {
  section: FormSectionType;
  formData: ScholarshipFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  className?: string;
}

export default function FormSection({ section, formData, onChange, className = '' }: FormSectionProps) {
  return (
    <div className={`border-b border-gray-200 pb-6 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {section.fields.map((field) => (
          <FormField
            key={field.id}
            field={field}
            value={formData[field.name as keyof ScholarshipFormData]}
            onChange={onChange}
            className={field.type === 'textarea' ? 'md:col-span-2' : ''}
          />
        ))}
      </div>
    </div>
  );
}
