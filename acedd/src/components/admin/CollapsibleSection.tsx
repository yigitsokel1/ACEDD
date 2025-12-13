"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

/**
 * CollapsibleSection Component
 * 
 * Sprint 16 - Block F: Reusable collapsible section for admin detail pages
 * 
 * Provides a collapsible UI section with title and content slot.
 * Used for organizing large detail pages into logical groups.
 */
interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
  className = "",
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-gray-200 rounded-lg bg-white ${className}`}>
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors rounded-t-lg"
        aria-expanded={isOpen}
        aria-label={`${title} bölümünü ${isOpen ? "kapat" : "aç"}`}
      >
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>

      {/* Content */}
      {isOpen && (
        <div className="p-4 pt-0 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );
}

