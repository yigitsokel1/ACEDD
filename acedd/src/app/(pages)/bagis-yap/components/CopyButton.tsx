"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui";
import { Copy, CheckCircle } from "lucide-react";

interface CopyButtonProps {
  text: string;
  fieldId: string;
}

export function CopyButton({ text, fieldId }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <Button
      onClick={copyToClipboard}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
    >
      {copied ? (
        <CheckCircle className="w-5 h-5" />
      ) : (
        <Copy className="w-5 h-5" />
      )}
    </Button>
  );
}

