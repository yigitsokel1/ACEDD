"use client";

import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui";
import { AlertCircle, CheckCircle } from "lucide-react";

interface JsonEditorProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
  helperText?: string;
  error?: string;
}

/**
 * Filter out technical fields and keep only user-facing text fields
 */
function filterUserFacingFields(obj: any): any {
  // For string arrays, return as-is (no filtering needed)
  if (Array.isArray(obj) && obj.length > 0 && typeof obj[0] === 'string') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map((item) => filterUserFacingFields(item));
  }
  
  if (obj && typeof obj === "object") {
    const filtered: any = {};
    // Keep only text/display fields, exclude technical fields
    const allowedFields = ["title", "description", "label", "value", "name", "position", "step", "text", "subtitle"];
    const excludedFields = ["id", "icon", "color", "href", "parent", "level", "isDashed"];
    
    for (const key in obj) {
      if (excludedFields.includes(key)) {
        continue; // Skip technical fields
      }
      if (allowedFields.includes(key) || !excludedFields.includes(key)) {
        // If it's a nested object/array, recursively filter
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
 * Restore technical fields from original value
 */
function mergeWithOriginal(original: any, edited: any): any {
  if (Array.isArray(original) && Array.isArray(edited)) {
    return edited.map((editedItem, index) => {
      const originalItem = original[index];
      if (!originalItem) return editedItem;
      
      // Merge: keep edited text fields, restore technical fields from original
      return {
        ...originalItem, // Start with original (has all fields)
        ...editedItem,   // Override with edited fields
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
 * JSON Editor Component
 * 
 * Allows editing JSON arrays/objects with validation
 * Shows only user-facing text fields, hides technical fields (icon, color, id, etc.)
 */
export default function JsonEditor({ label, value, onChange, helperText, error }: JsonEditorProps) {
  const [jsonString, setJsonString] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [parseError, setParseError] = useState<string | null>(null);
  const [originalValue, setOriginalValue] = useState<any>(null);

  // Initialize JSON string from value (filtered for display)
  useEffect(() => {
    try {
      // Store original for merging
      setOriginalValue(value);
      
      // Show only user-facing fields
      const filtered = filterUserFacingFields(value);
      const formatted = JSON.stringify(filtered, null, 2);
      setJsonString(formatted);
      setIsValid(true);
      setParseError(null);
    } catch (err) {
      setJsonString("");
      setIsValid(false);
      setParseError("Invalid JSON value");
    }
  }, [value]);

  const handleChange = (newValue: string) => {
    setJsonString(newValue);

    // Try to parse JSON
    try {
      let parsed = JSON.parse(newValue);
      setIsValid(true);
      setParseError(null);
      
      // Convert object format to array if needed (e.g., {"0": {...}, "1": {...}} -> [{...}, {...}])
      if (typeof parsed === 'object' && !Array.isArray(parsed) && parsed !== null) {
        const keys = Object.keys(parsed);
        // If all keys are numeric strings, convert to array
        if (keys.length > 0 && keys.every(key => /^\d+$/.test(key))) {
          parsed = keys
            .map(key => parseInt(key, 10))
            .sort((a, b) => a - b)
            .map(key => parsed[String(key)]);
        }
      }
      
      // For string arrays (like requirements), don't merge - use parsed value directly
      // For object arrays (like stats, missions), merge to preserve technical fields
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
        // String array - use as is (no merging needed)
        onChange(parsed);
      } else if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
        // Object array - merge to preserve technical fields
        const merged = mergeWithOriginal(originalValue, parsed);
        onChange(merged);
      } else if (typeof parsed === 'object' && !Array.isArray(parsed)) {
        // Object - merge to preserve technical fields
        const merged = mergeWithOriginal(originalValue, parsed);
        onChange(merged);
      } else {
        // Primitive or empty array - use as is
        onChange(parsed);
      }
    } catch (err) {
      setIsValid(false);
      setParseError(err instanceof Error ? err.message : "Invalid JSON");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {isValid ? (
          <div className="flex items-center text-green-600 text-xs">
            <CheckCircle className="w-4 h-4 mr-1" />
            Geçerli JSON
          </div>
        ) : (
          <div className="flex items-center text-red-600 text-xs">
            <AlertCircle className="w-4 h-4 mr-1" />
            Geçersiz JSON
          </div>
        )}
      </div>

      <Textarea
        value={jsonString}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="JSON formatında veri girin..."
        rows={12}
        className={`font-mono text-sm ${!isValid ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}`}
      />

      {parseError && (
        <p className="text-sm text-red-600 mt-1">{parseError}</p>
      )}

      {helperText && !parseError && (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
}

