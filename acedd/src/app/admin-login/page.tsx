"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { logClientError } from "@/lib/utils/clientLogging";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok && response.status >= 500) {
        setError("Sunucu hatası. Lütfen daha sonra tekrar deneyin.");
        setIsLoading(false);
        return;
      }

      let data;
      try {
        data = await response.json();
      } catch {
        setError("Sunucudan geçersiz yanıt alındı.");
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        setError(data.error || "Giriş başarısız");
        setIsLoading(false);
        return;
      }

      // Redirect to admin panel
      router.push("/admin");
      router.refresh();
    } catch (err) {
      logClientError("[AdminLogin][SUBMIT]", err);
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Paneli Girişi
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ACEDD Yönetim Paneli
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                label="E-posta"
                placeholder="admin@acedd.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error ? "" : undefined}
              />
            </div>
            <div className="mt-4">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                label="Şifre"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error ? "" : undefined}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              Giriş Yap
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
