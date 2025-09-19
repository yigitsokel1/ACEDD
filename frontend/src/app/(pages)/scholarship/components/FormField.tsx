import { FormField as FormFieldType } from '../types';

interface FormFieldProps {
  field: FormFieldType;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  className?: string;
}

export default function FormField({ field, value, onChange, className = '' }: FormFieldProps) {
  const baseInputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500";

  const renderInput = () => {
    switch (field.type) {
      case 'select':
        return (
          <select
            id={field.id}
            name={field.name}
            value={value}
            onChange={onChange}
            required={field.required}
            className={baseInputClasses}
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            id={field.id}
            name={field.name}
            value={value}
            onChange={onChange}
            required={field.required}
            rows={field.rows || 3}
            placeholder={field.placeholder}
            className={baseInputClasses}
          />
        );

      default:
        return (
          <input
            type={field.type}
            id={field.id}
            name={field.name}
            value={value}
            onChange={onChange}
            required={field.required}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
            className={baseInputClasses}
          />
        );
    }
  };

  return (
    <div className={className}>
      <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-2">
        {field.label} {field.required && '*'}
      </label>
      {renderInput()}
    </div>
  );
}
