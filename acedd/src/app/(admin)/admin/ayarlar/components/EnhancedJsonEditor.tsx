"use client";

import React, { useState, useEffect } from "react";
import { Textarea, Button } from "@/components/ui";
import { AlertCircle, CheckCircle, RotateCcw, HelpCircle } from "lucide-react";
import type { FieldSchema } from "@/lib/constants/settingsSchema";
import { validateField } from "@/lib/constants/settingsSchema";

interface EnhancedJsonEditorProps {
  fieldSchema: FieldSchema;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

/**
 * Filter out technical fields (icon, color, id) for user editing
 */
function filterUserFacingFields(obj: any): any {
  if (Array.isArray(obj) && obj.length > 0 && typeof obj[0] === 'string') {
    return obj; // String array - no filtering
  }
  
  if (Array.isArray(obj)) {
    return obj.map((item) => filterUserFacingFields(item));
  }
  
  if (obj && typeof obj === "object") {
    const filtered: any = {};
    const excludedFields = ["id", "icon", "color"];
    
    for (const key in obj) {
      if (!excludedFields.includes(key)) {
        if (obj[key] && typeof obj[key] === "object") {
          filtered[key] = filterUserFacingFields(obj[key]);
        } else {
          filtered[key] = obj[key];
        }
      }
    }
    return filtered;
  }
  
  return obj;
}

/**
 * Merge edited data with original (restore technical fields)
 */
function mergeWithOriginal(original: any, edited: any): any {
  if (Array.isArray(original) && Array.isArray(edited)) {
    // Type check
    const originalFirstItem = original[0];
    const editedFirstItem = edited[0];
    
    if (originalFirstItem && editedFirstItem) {
      const originalType = typeof originalFirstItem;
      const editedType = typeof editedFirstItem;
      
      if (originalType !== editedType) {
        return edited; // Type mismatch - use edited
      }
      
      if (originalType === 'string') {
        return edited; // String array - no merge needed
      }
    }
    
    return edited.map((editedItem, index) => {
      const originalItem = original[index];
      if (!originalItem) return editedItem;
      
      return {
        ...originalItem,
        ...editedItem,
      };
    });
  }
  
  if (original && edited && typeof original === "object" && typeof edited === "object") {
    return {
      ...original,
      ...edited,
    };
  }
  
  return edited || original;
}

/**
 * Enhanced JSON Editor with validation, preview, and reset
 */
export default function EnhancedJsonEditor({ fieldSchema, value, onChange, error }: EnhancedJsonEditorProps) {
  const [jsonString, setJsonString] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [originalValue, setOriginalValue] = useState<any>(null);
  const [showExample, setShowExample] = useState(false);

  // Initialize
  useEffect(() => {
    try {
      setOriginalValue(value);
      const filtered = filterUserFacingFields(value);
      const formatted = JSON.stringify(filtered, null, 2);
      setJsonString(formatted);
      setIsValid(true);
      setParseError(null);
      setValidationErrors([]);
    } catch (err) {
      setJsonString("");
      setIsValid(false);
      setParseError("Geçersiz JSON değeri");
    }
  }, [value]);

  const handleChange = (newValue: string) => {
    setJsonString(newValue);

    try {
      let parsed = JSON.parse(newValue);
      
      // Convert object-with-numeric-keys to array
      if (typeof parsed === 'object' && !Array.isArray(parsed) && parsed !== null) {
        const keys = Object.keys(parsed);
        if (keys.length > 0 && keys.every(key => /^\d+$/.test(key))) {
          parsed = keys
            .map(key => parseInt(key, 10))
            .sort((a, b) => a - b)
            .map(key => parsed[String(key)]);
        }
      }
      
      // Validate structure
      const validation = validateField(fieldSchema, parsed);
      
      if (validation.isValid) {
        setIsValid(true);
        setParseError(null);
        setValidationErrors([]);
        
        // Merge with original to restore technical fields
        const merged = Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string'
          ? parsed  // String array - no merge
          : mergeWithOriginal(originalValue, parsed);
        
        onChange(merged);
      } else {
        setIsValid(false);
        setParseError(null);
        setValidationErrors(validation.errors);
      }
    } catch (err) {
      setIsValid(false);
      setParseError(err instanceof Error ? err.message : "Geçersiz JSON formatı");
      setValidationErrors([]);
    }
  };

  const handleReset = () => {
    if (fieldSchema.defaultValue !== undefined) {
      const filtered = filterUserFacingFields(fieldSchema.defaultValue);
      const formatted = JSON.stringify(filtered, null, 2);
      setJsonString(formatted);
      onChange(fieldSchema.defaultValue);
      setIsValid(true);
      setParseError(null);
      setValidationErrors([]);
    }
  };

  const toggleExample = () => setShowExample(!showExample);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {fieldSchema.label}
          {fieldSchema.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div className="flex items-center space-x-2">
          {isValid ? (
            <div className="flex items-center text-green-600 text-xs">
              <CheckCircle className="w-4 h-4 mr-1" />
              Geçerli
            </div>
          ) : (
            <div className="flex items-center text-red-600 text-xs">
              <AlertCircle className="w-4 h-4 mr-1" />
              Hatalı
            </div>
          )}
        </div>
      </div>

      {/* Helper Text */}
      {fieldSchema.helperText && (
        <p className="text-xs text-gray-600">{fieldSchema.helperText}</p>
      )}

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        {fieldSchema.exampleFormat && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleExample}
            className="text-xs"
          >
            <HelpCircle className="w-3 h-3 mr-1" />
            {showExample ? "Örneği Gizle" : "Örnek Format"}
          </Button>
        )}
        
        {fieldSchema.defaultValue && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Varsayılana Dön
          </Button>
        )}
      </div>

      {/* Example Format */}
      {showExample && fieldSchema.exampleFormat && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-xs font-medium text-blue-900 mb-1">Örnek Format:</p>
          <pre className="text-xs text-blue-800 font-mono whitespace-pre-wrap">
            {fieldSchema.exampleFormat}
          </pre>
        </div>
      )}

      {/* JSON Editor */}
      <Textarea
        value={jsonString}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={fieldSchema.placeholder || "JSON formatında veri girin..."}
        rows={fieldSchema.rows || 12}
        className={`font-mono text-sm ${!isValid ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}`}
      />

      {/* Errors */}
      {parseError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600 font-medium">JSON Parse Hatası:</p>
          <p className="text-xs text-red-600 mt-1">{parseError}</p>
        </div>
      )}

      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600 font-medium">Doğrulama Hataları:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            {validationErrors.map((err, idx) => (
              <li key={idx} className="text-xs text-red-600">{err}</li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

