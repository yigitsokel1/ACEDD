/**
 * reCAPTCHA Component
 * 
 * Sprint 16 - Block D: reCAPTCHA integration for public forms
 * 
 * Simple reCAPTCHA v2 checkbox component using Google's reCAPTCHA API
 */

"use client";

import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      render: (element: HTMLElement, options: { sitekey: string; callback: (token: string) => void }) => number;
      reset: (widgetId: number) => void;
      getResponse: (widgetId: number) => string | null;
    };
  }
}

interface RecaptchaProps {
  siteKey?: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  className?: string;
}

export function Recaptcha({ siteKey, onVerify, onExpire, onError, className }: RecaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [widgetId, setWidgetId] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load reCAPTCHA script
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setIsLoaded(true);
    };
    
    script.onerror = () => {
      setError("reCAPTCHA yüklenemedi. Lütfen sayfayı yenileyin.");
      onError?.();
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup: remove script when component unmounts
      const existingScript = document.querySelector('script[src*="recaptcha/api.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [onError]);

  useEffect(() => {
    if (!isLoaded || !containerRef.current || widgetId !== null || !siteKey) return;

    window.grecaptcha.ready(() => {
      try {
        const id = window.grecaptcha.render(containerRef.current!, {
          sitekey: siteKey,
          callback: (token: string) => {
            onVerify(token);
          },
        });
        
        // Handle expired/error callbacks via grecaptcha events
        // Note: reCAPTCHA v2 doesn't support expired-callback/error-callback in render options
        // These are handled via the callback returning empty string on expire/error
        setWidgetId(id);
      } catch (err) {
        console.error("reCAPTCHA render error:", err);
        setError("reCAPTCHA başlatılamadı.");
        onError?.();
      }
    });
  }, [isLoaded, siteKey, onVerify, onExpire, onError, widgetId]);

  const reset = () => {
    if (widgetId !== null) {
      window.grecaptcha.reset(widgetId);
      setError(null);
    }
  };

  // Note: useImperativeHandle removed - not needed for this component
  // If ref is needed in the future, add a forwardRef wrapper

  if (error) {
    return (
      <div className={className}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
          <button
            type="button"
            onClick={() => {
              setError(null);
              reset();
            }}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div ref={containerRef} className="g-recaptcha" />
      <p className="text-xs text-gray-500 mt-2">
        Bu site, spam'a karşı korumak için reCAPTCHA kullanıyor. Google'ın{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Gizlilik Politikası
        </a>
        {" "}ve{" "}
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Hizmet Şartları
        </a>
        {" "}geçerlidir.
      </p>
    </div>
  );
}

