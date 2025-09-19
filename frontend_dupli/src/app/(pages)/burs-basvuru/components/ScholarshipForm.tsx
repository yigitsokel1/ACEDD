"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Textarea } from "@/components/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { SCHOLARSHIP_FORM_FIELDS } from "../constants";

const scholarshipFormSchema = z.object({
  // Personal Info
  fullName: z.string().min(2, "Ad soyad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  phone: z.string().min(10, "Geçerli bir telefon numarası girin"),
  birthDate: z.string().min(1, "Doğum tarihi gereklidir"),
  address: z.string().min(10, "Adres en az 10 karakter olmalıdır"),
  
  // Education Info
  schoolName: z.string().min(2, "Okul adı en az 2 karakter olmalıdır"),
  grade: z.string().min(1, "Sınıf/Seviye gereklidir"),
  gpa: z.number().min(0).max(4, "Not ortalaması 0-4 arasında olmalıdır"),
  department: z.string().optional(),
  
  // Family Info
  familyIncome: z.number().min(0, "Aile geliri 0'dan büyük olmalıdır"),
  familyMembers: z.number().min(1, "Aile üye sayısı en az 1 olmalıdır"),
  workingMembers: z.number().min(0, "Çalışan üye sayısı 0'dan küçük olamaz"),
  familySituation: z.string().min(10, "Aile durumu en az 10 karakter olmalıdır"),
  
  // Motivation
  motivation: z.string().min(20, "Motivasyon en az 20 karakter olmalıdır"),
  goals: z.string().min(20, "Hedefler en az 20 karakter olmalıdır"),
  achievements: z.string().optional(),
});

type ScholarshipFormData = z.infer<typeof scholarshipFormSchema>;

export function ScholarshipForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<ScholarshipFormData>({
    resolver: zodResolver(scholarshipFormSchema),
  });

  const steps = [
    { key: "personalInfo", title: "Kişisel Bilgiler" },
    { key: "educationInfo", title: "Eğitim Bilgileri" },
    { key: "familyInfo", title: "Aile Bilgileri" },
    { key: "motivation", title: "Motivasyon ve Hedefler" },
  ];

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1:
        return ["fullName", "email", "phone", "birthDate", "address"];
      case 2:
        return ["schoolName", "grade", "gpa", "department"];
      case 3:
        return ["familyIncome", "familyMembers", "workingMembers", "familySituation"];
      case 4:
        return ["motivation", "goals", "achievements"];
      default:
        return [];
    }
  };

  const onSubmit = async (data: ScholarshipFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log("Form data:", data);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
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
            Başvurunuz Başarıyla Gönderildi!
          </h3>
          <p className="text-gray-600 mb-4">
            Başvurunuz değerlendirilmeye alınmıştır. Sonuçlar size e-posta ile bildirilecektir.
          </p>
          <Button onClick={() => {
            setIsSubmitted(false);
            setCurrentStep(1);
          }}>
            Yeni Başvuru Yap
          </Button>
        </CardContent>
      </Card>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {SCHOLARSHIP_FORM_FIELDS.personalInfo.title}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                {...register("fullName")}
                label={SCHOLARSHIP_FORM_FIELDS.personalInfo.fields.fullName.label}
                placeholder={SCHOLARSHIP_FORM_FIELDS.personalInfo.fields.fullName.placeholder}
                error={errors.fullName?.message}
                required={SCHOLARSHIP_FORM_FIELDS.personalInfo.fields.fullName.required}
              />
              <Input
                {...register("email")}
                type="email"
                label={SCHOLARSHIP_FORM_FIELDS.personalInfo.fields.email.label}
                placeholder={SCHOLARSHIP_FORM_FIELDS.personalInfo.fields.email.placeholder}
                error={errors.email?.message}
                required={SCHOLARSHIP_FORM_FIELDS.personalInfo.fields.email.required}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                {...register("phone")}
                type="tel"
                label={SCHOLARSHIP_FORM_FIELDS.personalInfo.fields.phone.label}
                placeholder={SCHOLARSHIP_FORM_FIELDS.personalInfo.fields.phone.placeholder}
                error={errors.phone?.message}
                required={SCHOLARSHIP_FORM_FIELDS.personalInfo.fields.phone.required}
              />
              <Input
                {...register("birthDate")}
                type="date"
                label={SCHOLARSHIP_FORM_FIELDS.personalInfo.fields.birthDate.label}
                error={errors.birthDate?.message}
                required={SCHOLARSHIP_FORM_FIELDS.personalInfo.fields.birthDate.required}
              />
            </div>
            <Textarea
              {...register("address")}
              label={SCHOLARSHIP_FORM_FIELDS.personalInfo.fields.address.label}
              placeholder={SCHOLARSHIP_FORM_FIELDS.personalInfo.fields.address.placeholder}
              error={errors.address?.message}
              required={SCHOLARSHIP_FORM_FIELDS.personalInfo.fields.address.required}
              rows={3}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {SCHOLARSHIP_FORM_FIELDS.educationInfo.title}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                {...register("schoolName")}
                label={SCHOLARSHIP_FORM_FIELDS.educationInfo.fields.schoolName.label}
                placeholder={SCHOLARSHIP_FORM_FIELDS.educationInfo.fields.schoolName.placeholder}
                error={errors.schoolName?.message}
                required={SCHOLARSHIP_FORM_FIELDS.educationInfo.fields.schoolName.required}
              />
              <Input
                {...register("grade")}
                label={SCHOLARSHIP_FORM_FIELDS.educationInfo.fields.grade.label}
                placeholder={SCHOLARSHIP_FORM_FIELDS.educationInfo.fields.grade.placeholder}
                error={errors.grade?.message}
                required={SCHOLARSHIP_FORM_FIELDS.educationInfo.fields.grade.required}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                {...register("gpa", { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0"
                max="4"
                label={SCHOLARSHIP_FORM_FIELDS.educationInfo.fields.gpa.label}
                placeholder={SCHOLARSHIP_FORM_FIELDS.educationInfo.fields.gpa.placeholder}
                error={errors.gpa?.message}
                required={SCHOLARSHIP_FORM_FIELDS.educationInfo.fields.gpa.required}
              />
              <Input
                {...register("department")}
                label={SCHOLARSHIP_FORM_FIELDS.educationInfo.fields.department.label}
                placeholder={SCHOLARSHIP_FORM_FIELDS.educationInfo.fields.department.placeholder}
                error={errors.department?.message}
                required={SCHOLARSHIP_FORM_FIELDS.educationInfo.fields.department.required}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {SCHOLARSHIP_FORM_FIELDS.familyInfo.title}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                {...register("familyIncome", { valueAsNumber: true })}
                type="number"
                label={SCHOLARSHIP_FORM_FIELDS.familyInfo.fields.familyIncome.label}
                placeholder={SCHOLARSHIP_FORM_FIELDS.familyInfo.fields.familyIncome.placeholder}
                error={errors.familyIncome?.message}
                required={SCHOLARSHIP_FORM_FIELDS.familyInfo.fields.familyIncome.required}
              />
              <Input
                {...register("familyMembers", { valueAsNumber: true })}
                type="number"
                label={SCHOLARSHIP_FORM_FIELDS.familyInfo.fields.familyMembers.label}
                placeholder={SCHOLARSHIP_FORM_FIELDS.familyInfo.fields.familyMembers.placeholder}
                error={errors.familyMembers?.message}
                required={SCHOLARSHIP_FORM_FIELDS.familyInfo.fields.familyMembers.required}
              />
            </div>
            <Input
              {...register("workingMembers", { valueAsNumber: true })}
              type="number"
              label={SCHOLARSHIP_FORM_FIELDS.familyInfo.fields.workingMembers.label}
              placeholder={SCHOLARSHIP_FORM_FIELDS.familyInfo.fields.workingMembers.placeholder}
              error={errors.workingMembers?.message}
              required={SCHOLARSHIP_FORM_FIELDS.familyInfo.fields.workingMembers.required}
            />
            <Textarea
              {...register("familySituation")}
              label={SCHOLARSHIP_FORM_FIELDS.familyInfo.fields.familySituation.label}
              placeholder={SCHOLARSHIP_FORM_FIELDS.familyInfo.fields.familySituation.placeholder}
              error={errors.familySituation?.message}
              required={SCHOLARSHIP_FORM_FIELDS.familyInfo.fields.familySituation.required}
              rows={3}
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {SCHOLARSHIP_FORM_FIELDS.motivation.title}
            </h3>
            <Textarea
              {...register("motivation")}
              label={SCHOLARSHIP_FORM_FIELDS.motivation.fields.motivation.label}
              placeholder={SCHOLARSHIP_FORM_FIELDS.motivation.fields.motivation.placeholder}
              error={errors.motivation?.message}
              required={SCHOLARSHIP_FORM_FIELDS.motivation.fields.motivation.required}
              rows={4}
            />
            <Textarea
              {...register("goals")}
              label={SCHOLARSHIP_FORM_FIELDS.motivation.fields.goals.label}
              placeholder={SCHOLARSHIP_FORM_FIELDS.motivation.fields.goals.placeholder}
              error={errors.goals?.message}
              required={SCHOLARSHIP_FORM_FIELDS.motivation.fields.goals.required}
              rows={4}
            />
            <Textarea
              {...register("achievements")}
              label={SCHOLARSHIP_FORM_FIELDS.motivation.fields.achievements.label}
              placeholder={SCHOLARSHIP_FORM_FIELDS.motivation.fields.achievements.placeholder}
              error={errors.achievements?.message}
              required={SCHOLARSHIP_FORM_FIELDS.motivation.fields.achievements.required}
              rows={3}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Burs Başvuru Formu</CardTitle>
        <CardDescription>
          Başvurunuzu adım adım doldurun. Her adımda gerekli bilgileri eksiksiz girin.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Adım {currentStep} / {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              %{Math.round((currentStep / steps.length) * 100)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {renderStepContent()}

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Önceki
            </Button>
            {currentStep < steps.length ? (
              <Button type="button" onClick={nextStep}>
                Sonraki
              </Button>
            ) : (
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Gönderiliyor..." : "Başvuruyu Gönder"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
