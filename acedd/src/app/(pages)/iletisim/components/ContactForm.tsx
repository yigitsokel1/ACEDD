"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Textarea } from "@/components/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { logClientError } from "@/lib/utils/clientLogging";
import { CONTACT_FORM_FIELDS } from "../constants";

const contactFormSchema = z.object({
  name: z.string().min(2, "Ad soyad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Konu en az 5 karakter olmalıdır"),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalıdır"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/contact-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // Parse error response
        let errorMessage = "Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.";

        try {
          const errorData = await response.json();
          // API returns { error: "...", message: "..." }
          // Prefer message over error as it contains the actual error details
          if (errorData.message && errorData.message !== "Unknown error") {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // If JSON parsing fails, use default message
          if (response.status === 400) {
            errorMessage = "Lütfen tüm zorunlu alanları doldurun.";
          } else if (response.status >= 500) {
            errorMessage = "Şu an bir sorun oluştu, lütfen daha sonra tekrar deneyin.";
          }
        }

        setSubmitError(errorMessage);
        return;
      }

      // Success - form submitted
      setIsSubmitted(true);
      reset();
    } catch (error) {
      logClientError("[ContactForm][SUBMIT]", error);
      setSubmitError("Şu an bir sorun oluştu, lütfen daha sonra tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Mesajınız Başarıyla Gönderildi!
          </h3>
          <p className="text-gray-600 mb-4">
            En kısa sürede size dönüş yapacağız.
          </p>
          <Button onClick={() => setIsSubmitted(false)}>
            Yeni Mesaj Gönder
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Bize Mesaj Gönderin</CardTitle>
        <CardDescription className="text-center">
          Sorularınızı, önerilerinizi veya destek taleplerinizi bu form aracılığıyla iletebilirsiniz.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              <p className="text-sm font-medium">{submitError}</p>
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              {...register("name")}
              label={CONTACT_FORM_FIELDS.name.label}
              placeholder={CONTACT_FORM_FIELDS.name.placeholder}
              error={errors.name?.message}
              required={CONTACT_FORM_FIELDS.name.required}
            />
            <Input
              {...register("email")}
              type="email"
              label={CONTACT_FORM_FIELDS.email.label}
              placeholder={CONTACT_FORM_FIELDS.email.placeholder}
              error={errors.email?.message}
              required={CONTACT_FORM_FIELDS.email.required}
            />
          </div>
          
          <Input
            {...register("phone")}
            type="tel"
            label={CONTACT_FORM_FIELDS.phone.label}
            placeholder={CONTACT_FORM_FIELDS.phone.placeholder}
            error={errors.phone?.message}
            required={CONTACT_FORM_FIELDS.phone.required}
          />
          
          <Input
            {...register("subject")}
            label={CONTACT_FORM_FIELDS.subject.label}
            placeholder={CONTACT_FORM_FIELDS.subject.placeholder}
            error={errors.subject?.message}
            required={CONTACT_FORM_FIELDS.subject.required}
          />
          
          <Textarea
            {...register("message")}
            label={CONTACT_FORM_FIELDS.message.label}
            placeholder={CONTACT_FORM_FIELDS.message.placeholder}
            error={errors.message?.message}
            required={CONTACT_FORM_FIELDS.message.required}
            rows={6}
          />
          
          <Button
            type="submit"
            className="w-full"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Gönderiliyor..." : "Mesajı Gönder"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
