"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Textarea } from "@/components/ui";
import { Select } from "@/components/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { FileText, CheckCircle, X, FileCheck } from "lucide-react";
import { MEMBERSHIP_FORM_FIELDS } from "../constants";
import { Recaptcha } from "@/components/forms/Recaptcha";
import {
  MembershipApplicationSchema,
  type MembershipApplicationInput,
} from "@/modules/membership/schemas";

type MembershipFormSchema = MembershipApplicationInput;

interface MembershipFormProps {
  formTitle?: string;
  formDescription?: string;
  membershipConditionsText?: string; // Sprint 15.4: Üyelik şartları metni
}

export function MembershipForm({
  formTitle = "Üyelik Başvuru Formu",
  formDescription = "Lütfen aşağıdaki formu doldurarak üyelik başvurunuzu yapın. Tüm alanlar zorunludur.",
  membershipConditionsText = "",
}: MembershipFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showConditionsModal, setShowConditionsModal] = useState(false);
  const [hasReadConditions, setHasReadConditions] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<MembershipFormSchema>({
    resolver: zodResolver(MembershipApplicationSchema),
    mode: "onBlur", // Validate on blur for better UX
    defaultValues: {
      firstName: "",
      lastName: "",
      identityNumber: "",
      gender: undefined as any,
      bloodType: undefined as any,
      birthPlace: "",
      birthDate: undefined as any, // Date input expects Date | undefined
      city: "",
      phone: "",
      email: "",
      address: "",
      conditionsAccepted: false,
    },
  });

  // Sprint 15.4: Watch conditionsAccepted to sync with hasReadConditions
  const conditionsAccepted = watch("conditionsAccepted");

  // Sprint 15.4: Handle conditions modal close - if user read conditions, auto-check checkbox
  const handleConditionsModalClose = () => {
    setShowConditionsModal(false);
    if (hasReadConditions && !conditionsAccepted) {
      setValue("conditionsAccepted", true);
    }
  };

  // Sprint 15.4: Mark conditions as read when user scrolls to bottom of modal
  const handleConditionsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isScrolledToBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 50; // 50px threshold
    if (isScrolledToBottom && !hasReadConditions) {
      setHasReadConditions(true);
      setValue("conditionsAccepted", true);
    }
  };

  const onSubmit = async (data: MembershipFormSchema, e?: React.BaseSyntheticEvent) => {
    // Prevent default form submission (page reload)
    e?.preventDefault();
    
    // Check reCAPTCHA (if enabled)
    if (recaptchaSiteKey && !recaptchaToken) {
      setSubmitError("Lütfen reCAPTCHA doğrulamasını tamamlayın.");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);

    try {
      // Prepare form data for API
      // birthDate is already a Date object from z.coerce.date()
      const formData = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        identityNumber: data.identityNumber.trim(),
        gender: data.gender,
        bloodType: data.bloodType,
        birthPlace: data.birthPlace.trim(),
        birthDate: data.birthDate instanceof Date
          ? data.birthDate.toISOString().split("T")[0] // Convert to YYYY-MM-DD for API
          : data.birthDate,
        city: data.city.trim(),
        phone: data.phone.trim(),
        email: data.email.trim().toLowerCase(),
        address: data.address.trim(),
        conditionsAccepted: data.conditionsAccepted,
        recaptchaToken: recaptchaToken || undefined,
      };

      const response = await fetch("/api/membership-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Başvuru gönderilirken bir hata oluştu" }));
        
        // Handle rate limit error (429)
        if (response.status === 429) {
          const retryAfter = response.headers.get("Retry-After");
          const resetTime = retryAfter
            ? `yaklaşık ${Math.ceil(parseInt(retryAfter) / 60)} dakika`
            : "birkaç dakika";
          throw new Error(`Çok fazla istek gönderdiniz. Lütfen ${resetTime} sonra tekrar deneyin.`);
        }
        
        throw new Error(errorData.error || errorData.message || "Başvuru gönderilirken bir hata oluştu");
      }

      // Success - show message and reset form
      setSubmitSuccess(true);
      setSubmitError(null); // Clear any previous errors
      reset();
      setRecaptchaToken(null); // Reset reCAPTCHA

      // Scroll to success message after a brief delay
      setTimeout(() => {
        const successElement = document.querySelector('[data-success-message]');
        if (successElement) {
          successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);

      // Success message stays visible (user can see it clearly)
      // Optionally hide after 15 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 15000);
    } catch (error) {
      console.error("Error submitting application:", error);
      const errorMessage = error instanceof Error ? error.message : "Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyin.";
      setSubmitError(errorMessage);
      
      // Scroll to error message after a brief delay
      setTimeout(() => {
        const errorElement = document.querySelector('[data-error-message]');
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
      
      // Clear error after 10 seconds
      setTimeout(() => {
        setSubmitError(null);
      }, 10000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                <FileText className="w-8 h-8 mr-3 text-blue-600" />
                {formTitle}
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                {formDescription}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8">
              {/* Sprint 15.1: Success message */}
              {submitSuccess && (
                <div data-success-message className="mb-6 p-4 bg-green-50 border-2 border-green-500 rounded-lg flex items-center shadow-md">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-green-900 font-bold text-lg mb-1">
                      Başvurunuz başarıyla gönderildi!
                    </p>
                    <p className="text-green-700 text-sm">
                      En kısa sürede size geri dönüş yapacağız.
                    </p>
                  </div>
                </div>
              )}

              {/* Error message */}
              {submitError && (
                <div data-error-message className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-lg flex items-center shadow-md">
                  <X className="w-6 h-6 text-red-600 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-red-900 font-bold text-lg mb-1">
                      Başvuru gönderilemedi
                    </p>
                    <p className="text-red-700 text-sm">
                      {submitError}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Sprint 15.1: Simetrik form layout - Her satır ayrı grid row (eşit yükseklik için) */}
                
                {/* Satır 1: Ad Soyad | TC Kimlik No */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ad Soyad <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="text"
                        {...register("firstName")}
                        placeholder="Ad"
                        className="w-full"
                        error={errors.firstName?.message}
                      />
                      <Input
                        type="text"
                        {...register("lastName")}
                        placeholder="Soyad"
                        className="w-full"
                        error={errors.lastName?.message}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      TC Kimlik No <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      {...register("identityNumber")}
                      placeholder="11 haneli TC kimlik numaranız"
                      maxLength={11}
                      className="w-full"
                      error={errors.identityNumber?.message}
                    />
                  </div>
                </div>

                {/* Satır 2: Cinsiyet | İkamet Ettiğiniz Şehir */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <Select
                      {...register("gender")}
                      label="Cinsiyet"
                      options={[...MEMBERSHIP_FORM_FIELDS.gender.options]}
                      placeholder="Seçiniz"
                      className="w-full"
                      error={errors.gender?.message}
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      İkamet Ettiğiniz Şehir <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      {...register("city")}
                      placeholder="Şehrinizi girin"
                      className="w-full"
                      error={errors.city?.message}
                    />
                  </div>
                </div>

                {/* Satır 3: Doğum Yeri | Doğum Tarihi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Doğum Yeri <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      {...register("birthPlace")}
                      placeholder="Doğum yerinizi girin"
                      className="w-full"
                      error={errors.birthPlace?.message}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Doğum Tarihi <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      {...register("birthDate")}
                      className="w-full"
                      error={errors.birthDate?.message}
                    />
                  </div>
                </div>

                {/* Satır 4: E-posta | Telefon Numarası */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      E-posta <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      {...register("email")}
                      placeholder="ornek@email.com"
                      className="w-full"
                      error={errors.email?.message}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Telefon Numarası <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="tel"
                      {...register("phone")}
                      placeholder="05551234567"
                      className="w-full"
                      error={errors.phone?.message}
                    />
                  </div>
                </div>

                {/* Satır 5: Kan Grubu (Tam genişlik) */}
                <div className="flex flex-col">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kan Grubu <span className="text-red-500">*</span>
                  </label>
                  <Select
                    {...register("bloodType")}
                    options={[...MEMBERSHIP_FORM_FIELDS.bloodType.options]}
                    placeholder="Seçiniz"
                    className="w-full"
                    error={errors.bloodType?.message}
                    required
                  />
                </div>

                {/* Satır 6: Adres (Tam genişlik) */}
                <div className="flex flex-col">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Adres <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    {...register("address")}
                    placeholder="Tam adresinizi girin"
                    rows={4}
                    className="w-full"
                    error={errors.address?.message}
                  />
                </div>

                {/* Sprint 15.4: Conditions Accepted Checkbox with "Read Conditions" link */}
                <div className="pt-4 border-t border-gray-200">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("conditionsAccepted", { value: true })}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      <span className="text-red-500">*</span>{" "}
                      {membershipConditionsText ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowConditionsModal(true)}
                            className="text-blue-600 hover:text-blue-800 underline font-medium"
                          >
                            Başvuru şartlarını oku
                          </button>
                          {" "}ve kabul ediyorum.
                        </>
                      ) : (
                        "Şartları ve koşulları okudum ve kabul ediyorum."
                      )}
                    </span>
                  </label>
                  {/* Fixed height for error message to prevent layout shift */}
                  {/* Using h-6 (24px) to accommodate text-sm line-height + margin */}
                  <div className="h-6 mt-1">
                    {errors.conditionsAccepted && (
                      <p className="text-sm text-red-600 leading-tight">{errors.conditionsAccepted.message}</p>
                    )}
                  </div>
                </div>

                {/* reCAPTCHA */}
                {recaptchaSiteKey && (
                  <div className="pt-4">
                    <Recaptcha
                      siteKey={recaptchaSiteKey}
                      onVerify={setRecaptchaToken}
                      onExpire={() => setRecaptchaToken(null)}
                      onError={() => setRecaptchaToken(null)}
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    onClick={() => {
                      reset();
                      setRecaptchaToken(null);
                    }}
                    variant="outline"
                    disabled={isSubmitting}
                    className="px-8 py-3 text-gray-700 border-gray-300 hover:bg-gray-50"
                  >
                    Temizle
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || (recaptchaSiteKey ? !recaptchaToken : false)}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Gönderiliyor..." : "Başvuruyu Gönder"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sprint 15.4: Conditions Modal */}
      {showConditionsModal && membershipConditionsText && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col border border-gray-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <FileCheck className="w-6 h-6 mr-2 text-blue-600" />
                Üyelik Başvuru Şartları ve Koşulları
              </h3>
              <button
                onClick={handleConditionsModalClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div
              onScroll={handleConditionsScroll}
              className="flex-1 overflow-y-auto p-6"
            >
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {membershipConditionsText}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {hasReadConditions && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">Şartlar okundu</span>
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleConditionsModalClose}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {hasReadConditions ? "Kapat ve Devam Et" : "Kapat"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
