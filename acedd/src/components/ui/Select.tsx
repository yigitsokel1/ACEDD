"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: string[] | SelectOption[] | readonly SelectOption[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, placeholder, id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    const isOptionObject = (option: string | SelectOption): option is SelectOption => {
      return typeof option === 'object' && option !== null && 'value' in option && 'label' in option;
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          className={cn(
            "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          ref={ref}
          id={selectId}
          {...props}
        >
          {/* Sprint 14.7: Placeholder option sadece value boşsa veya value options array'inde yoksa göster */}
          {/* Sprint 14.7: Eğer options array'inde zaten "all" value'su varsa (Tümü seçeneği), placeholder gösterme */}
          {(() => {
            // Options array'inde "all" value'su var mı kontrol et (çift Tümü önleme)
            const hasAllOption = options.some(opt => {
              if (isOptionObject(opt)) {
                return opt.value === "all" || opt.value === "";
              }
              return opt === "all" || opt === "";
            });
            
            // Eğer options array'inde "all" value'su varsa, placeholder gösterme
            if (hasAllOption) {
              return null;
            }
            
            // Eğer value varsa, options array'inde olup olmadığını kontrol et
            if (props.value && props.value !== "") {
              const valueExists = options.some(opt => {
                if (isOptionObject(opt)) {
                  return opt.value === props.value;
                }
                return opt === props.value;
              });
              // Value options array'inde varsa placeholder gösterme
              if (valueExists) {
                return null;
              }
            }
            // Value yoksa veya options array'inde yoksa placeholder göster
            return <option value="">{placeholder || "Seçiniz"}</option>;
          })()}
          {options.map((option, index) => {
            if (isOptionObject(option)) {
              return (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              );
            } else {
              return (
                <option key={index} value={option}>
                  {option}
                </option>
              );
            }
          })}
        </select>
        {/* Fixed height for error message to prevent layout shift */}
        {/* Using h-6 (24px) to accommodate text-sm line-height + margin */}
        <div className="h-6 mt-1">
          {error && (
            <p className="text-sm text-red-600 leading-tight">{error}</p>
          )}
          {helperText && !error && (
            <p className="text-sm text-gray-500 leading-tight">{helperText}</p>
          )}
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
