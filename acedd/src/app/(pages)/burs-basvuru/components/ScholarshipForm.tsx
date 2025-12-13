"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Textarea } from "@/components/ui";
import { Select } from "@/components/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { SCHOLARSHIP_FORM_FIELDS } from "../constants";
import { FieldArray } from "@/components/forms/FieldArray";
import { Recaptcha } from "@/components/forms/Recaptcha";
import { 
  ScholarshipApplicationSchema, 
  ScholarshipApplicationInput 
} from "@/modules/scholarship/schemas";
import { logClientError } from "@/lib/utils/clientLogging";

type ScholarshipFormData = ScholarshipApplicationInput;

export function ScholarshipForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
    reset,
  } = useForm<ScholarshipFormData>({
    resolver: zodResolver(ScholarshipApplicationSchema),
    mode: "onBlur", // Validate on blur for better UX
    defaultValues: {
      relatives: [],
      educationHistory: [{ schoolName: "", startDate: "" as any, endDate: undefined, graduation: "Hayır", department: "", percentage: 0 }],
      references: [],
    },
  });

  const steps = [
    { title: "Genel Bilgi", description: "Kişisel ve iletişim bilgileri" },
    { title: "Akrabalar", description: "Yaşamakta olan akrabalar" },
    { title: "Okul Geçmişi", description: "Girmiş olduğunuz okullar" },
    { title: "Referanslar", description: "Referans bilgileri" },
  ];


  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    // Type assertion için daha güvenli bir yaklaşım
    const isValid = await trigger(fieldsToValidate as (keyof ScholarshipFormData)[]);
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
        return ["name", "surname", "phone", "alternativePhone", "email", "birthDate", "birthPlace", "tcNumber", "idIssuePlace", "idIssueDate", "gender", "maritalStatus", "hometown", "bankAccount", "ibanNumber", "university", "faculty", "department", "grade", "turkeyRanking", "physicalDisability", "healthProblem", "familyMonthlyIncome", "familyMonthlyExpenses", "scholarshipIncome", "permanentAddress", "currentAccommodation", "selfIntroduction", "interests"];
      case 2:
        return ["relatives"];
      case 3:
        return ["educationHistory"];
      case 4:
        return ["references"];
      default:
        return [];
    }
  };

  const onSubmit = async (data: ScholarshipFormData) => {
    // Validate entire form before submission
    const isValid = await trigger();
    if (!isValid) {
      setSubmitError("Lütfen formdaki hataları düzeltin.");
      return;
    }

    // Check reCAPTCHA
    if (recaptchaSiteKey && !recaptchaToken) {
      setSubmitError("Lütfen reCAPTCHA doğrulamasını tamamlayın.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare form data for API
      const formData = {
        ...data,
        recaptchaToken: recaptchaToken || undefined,
      };

      const response = await fetch("/api/scholarship-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Parse error response
        let errorMessage = "Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyin.";
        
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // If JSON parsing fails, use default message
        }

        setSubmitError(errorMessage);
        // Reset reCAPTCHA on error
        setRecaptchaToken(null);
        return;
      }

      // Success
      const result = await response.json();
      setIsSubmitted(true);
      reset();
      setRecaptchaToken(null);
    } catch (error) {
      logClientError("[ScholarshipForm][SUBMIT]", error);
      
      // Network error or other unexpected errors
      if (error instanceof TypeError && error.message.includes("fetch")) {
        setSubmitError("Bağlantı hatası. İnternet bağlantınızı kontrol edin ve tekrar deneyin.");
      } else {
        setSubmitError("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
      }
      
      // Reset reCAPTCHA on error
      setRecaptchaToken(null);
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
            Burs başvurunuz alınmıştır. Başvurunuz değerlendirilmeye alınacak ve sonuçlar size e-posta ile bildirilecektir.
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
          <div className="space-y-8">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
              <h3 className="text-lg font-semibold text-blue-900">
                {SCHOLARSHIP_FORM_FIELDS.generalInfo.title}
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                Lütfen tüm zorunlu alanları (*) doldurun
              </p>
            </div>
            
            {/* Temel Bilgiler */}
            <div className="space-y-6">
              <h4 className="text-md font-semibold text-gray-800 border-b pb-2">Kişisel Bilgiler</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  {...register("name")}
                  label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.name.label}
                  placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.name.placeholder}
                  error={errors.name?.message}
                  required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.name.required}
                />
                <Input
                  {...register("surname")}
                  label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.surname.label}
                  placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.surname.placeholder}
                  error={errors.surname?.message}
                  required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.surname.required}
                />
              </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                {...register("phone")}
                type="tel"
                label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.phone.label}
                placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.phone.placeholder}
                error={errors.phone?.message}
                required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.phone.required}
              />
              <Input
                {...register("email")}
                type="email"
                label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.email.label}
                placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.email.placeholder}
                error={errors.email?.message}
                required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.email.required}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                {...register("alternativePhone")}
                type="tel"
                label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.alternativePhone.label}
                placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.alternativePhone.placeholder}
                error={errors.alternativePhone?.message}
                required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.alternativePhone.required}
              />
              <Input
                {...register("birthDate")}
                type="date"
                label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.birthDate.label}
                error={errors.birthDate?.message}
                required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.birthDate.required}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                {...register("birthPlace")}
                label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.birthPlace.label}
                placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.birthPlace.placeholder}
                error={errors.birthPlace?.message}
                required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.birthPlace.required}
              />
              <div></div>
            </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  {...register("tcNumber")}
                  label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.tcNumber.label}
                  placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.tcNumber.placeholder}
                  error={errors.tcNumber?.message}
                  required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.tcNumber.required}
                />
                <Input
                  {...register("idIssuePlace")}
                  label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.idIssuePlace.label}
                  placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.idIssuePlace.placeholder}
                  error={errors.idIssuePlace?.message}
                  required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.idIssuePlace.required}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  {...register("idIssueDate")}
                  type="date"
                  label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.idIssueDate.label}
                  error={errors.idIssueDate?.message}
                  required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.idIssueDate.required}
                />
                <Select
                  {...register("gender")}
                  label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.gender.label}
                  options={[...SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.gender.options]}
                  error={errors.gender?.message}
                  required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.gender.required}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Select
                  {...register("maritalStatus")}
                  label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.maritalStatus.label}
                  options={[...SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.maritalStatus.options]}
                  error={errors.maritalStatus?.message}
                  required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.maritalStatus.required}
                />
                <Input
                  {...register("hometown")}
                  label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.hometown.label}
                  placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.hometown.placeholder}
                  error={errors.hometown?.message}
                  required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.hometown.required}
                />
              </div>
            </div>

            {/* Banka Bilgileri */}
            <div className="space-y-6">
              <h4 className="text-md font-semibold text-gray-800 border-b pb-2">Banka Bilgileri</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  {...register("bankAccount")}
                  label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.bankAccount.label}
                  placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.bankAccount.placeholder}
                  error={errors.bankAccount?.message}
                  required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.bankAccount.required}
                />
                <Input
                  {...register("ibanNumber")}
                  label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.ibanNumber.label}
                  placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.ibanNumber.placeholder}
                  error={errors.ibanNumber?.message}
                  required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.ibanNumber.required}
                />
              </div>
            </div>

            {/* Üniversite Bilgileri */}
            <div className="space-y-6">
              <h4 className="text-md font-semibold text-gray-800 border-b pb-2">Üniversite Bilgileri</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  {...register("university")}
                  label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.university.label}
                  placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.university.placeholder}
                  error={errors.university?.message}
                  required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.university.required}
                />
                <Input
                  {...register("faculty")}
                  label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.faculty.label}
                  placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.faculty.placeholder}
                  error={errors.faculty?.message}
                  required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.faculty.required}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  {...register("department")}
                  label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.department.label}
                  placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.department.placeholder}
                  error={errors.department?.message}
                  required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.department.required}
                />
                <Input
                  {...register("grade")}
                  label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.grade.label}
                  placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.grade.placeholder}
                  error={errors.grade?.message}
                  required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.grade.required}
                />
                {SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.turkeyRanking && (
                  <Input
                    {...register("turkeyRanking", { valueAsNumber: true })}
                    type="number"
                    min="1"
                    step="1"
                    label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.turkeyRanking.label}
                    placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.turkeyRanking.placeholder}
                    error={errors.turkeyRanking?.message}
                    required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.turkeyRanking.required}
                  />
                )}
              </div>
            </div>

            {/* Sağlık ve Aile Bilgileri */}
            <div className="space-y-6">
              <h4 className="text-md font-semibold text-gray-800 border-b pb-2">Sağlık ve Aile Bilgileri</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <Select
                  {...register("physicalDisability")}
                  label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.physicalDisability.label}
                  options={[...SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.physicalDisability.options]}
                  error={errors.physicalDisability?.message}
                  required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.physicalDisability.required}
                />
                <Select
                  {...register("healthProblem")}
                  label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.healthProblem.label}
                  options={[...SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.healthProblem.options]}
                  error={errors.healthProblem?.message}
                  required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.healthProblem.required}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  {...register("familyMonthlyIncome", { valueAsNumber: true })}
                  type="number"
                  min="0"
                  step="1"
                  label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.familyMonthlyIncome.label}
                  placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.familyMonthlyIncome.placeholder}
                  error={errors.familyMonthlyIncome?.message}
                  required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.familyMonthlyIncome.required}
                />
                <Input
                  {...register("familyMonthlyExpenses", { valueAsNumber: true })}
                  type="number"
                  min="0"
                  step="1"
                  label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.familyMonthlyExpenses.label}
                  placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.familyMonthlyExpenses.placeholder}
                  error={errors.familyMonthlyExpenses?.message}
                  required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.familyMonthlyExpenses.required}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Select
                  {...register("scholarshipIncome")}
                  label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.scholarshipIncome.label}
                  options={[...SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.scholarshipIncome.options]}
                  error={errors.scholarshipIncome?.message}
                  required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.scholarshipIncome.required}
                />
              </div>
            </div>

            {/* Adres ve İletişim Bilgileri */}
            <div className="space-y-6">
              <h4 className="text-md font-semibold text-gray-800 border-b pb-2">Adres ve İletişim Bilgileri</h4>
              <Textarea
                {...register("permanentAddress")}
                label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.permanentAddress.label}
                placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.permanentAddress.placeholder}
                error={errors.permanentAddress?.message}
                required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.permanentAddress.required}
                rows={3}
              />

              <Input
                {...register("currentAccommodation")}
                label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.currentAccommodation.label}
                placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.currentAccommodation.placeholder}
                error={errors.currentAccommodation?.message}
                required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.currentAccommodation.required}
              />
            </div>

            {/* Ek Bilgiler */}
            <div className="space-y-6">
              <h4 className="text-md font-semibold text-gray-800 border-b pb-2">Ek Bilgiler</h4>

              {SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.interests && (
                <Textarea
                  {...register("interests")}
                  label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.interests.label}
                  placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.interests.placeholder}
                  error={errors.interests?.message}
                  required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.interests.required}
                  rows={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.interests.rows || 3}
                />
              )}

              <Textarea
                {...register("selfIntroduction")}
                label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.selfIntroduction.label}
                placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.selfIntroduction.placeholder}
                error={errors.selfIntroduction?.message}
                required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.selfIntroduction.required}
                rows={4}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-blue-100 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-blue-900">
                {SCHOLARSHIP_FORM_FIELDS.relativesInfo.title}
              </h3>
            </div>
            
            <FieldArray<ScholarshipFormData, "relatives">
              name="relatives"
              control={control as any}
              addLabel="Akraba Ekle"
              removeLabel="Kaldır"
              minItems={0}
              maxItems={50}
              itemTitle={(index) => `Akraba ${index + 1}`}
              defaultValue={{ kinship: "", name: "", surname: "", birthDate: "", education: "", occupation: "", healthInsurance: "", healthDisability: "", income: 0, phone: "", additionalNotes: "" }}
              errors={errors}
              renderItem={(field, index, itemErrors) => (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Input
                      {...register(`relatives.${index}.kinship`)}
                      label={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.kinship.label}
                      placeholder={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.kinship.placeholder}
                      error={itemErrors?.kinship?.message as string | undefined}
                      required={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.kinship.required}
                    />
                    <Input
                      {...register(`relatives.${index}.name`)}
                      label={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.name.label}
                      placeholder={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.name.placeholder}
                      error={itemErrors?.name?.message as string | undefined}
                      required={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.name.required}
                    />
                    <Input
                      {...register(`relatives.${index}.surname`)}
                      label={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.surname.label}
                      placeholder={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.surname.placeholder}
                      error={itemErrors?.surname?.message as string | undefined}
                      required={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.surname.required}
                    />
                    <Input
                      {...register(`relatives.${index}.birthDate`)}
                      type="date"
                      label={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.birthDate.label}
                      error={itemErrors?.birthDate?.message as string | undefined}
                      required={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.birthDate.required}
                    />
                    <Input
                      {...register(`relatives.${index}.education`)}
                      label={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.education.label}
                      placeholder={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.education.placeholder}
                      error={itemErrors?.education?.message as string | undefined}
                      required={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.education.required}
                    />
                    <Input
                      {...register(`relatives.${index}.occupation`)}
                      label={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.occupation.label}
                      placeholder={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.occupation.placeholder}
                      error={itemErrors?.occupation?.message as string | undefined}
                      required={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.occupation.required}
                    />
                    <Input
                      {...register(`relatives.${index}.healthInsurance`)}
                      label={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.healthInsurance.label}
                      placeholder={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.healthInsurance.placeholder}
                      error={itemErrors?.healthInsurance?.message as string | undefined}
                      required={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.healthInsurance.required}
                    />
                    <Input
                      {...register(`relatives.${index}.healthDisability`)}
                      label={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.healthDisability.label}
                      placeholder={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.healthDisability.placeholder}
                      error={itemErrors?.healthDisability?.message as string | undefined}
                      required={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.healthDisability.required}
                    />
                    <Input
                      {...register(`relatives.${index}.income`, { valueAsNumber: true })}
                      type="number"
                      min="0"
                      step="1"
                      label={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.income.label}
                      placeholder={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.income.placeholder}
                      error={itemErrors?.income?.message as string | undefined}
                      required={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.income.required}
                    />
                    <Input
                      {...register(`relatives.${index}.phone`)}
                      type="tel"
                      label={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.phone.label}
                      placeholder={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.phone.placeholder}
                      error={itemErrors?.phone?.message as string | undefined}
                      required={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.phone.required}
                    />
                  </div>
                  
                  <div className="mt-4">
                    <Textarea
                      {...register(`relatives.${index}.additionalNotes`)}
                      label={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.additionalNotes.label}
                      placeholder={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.additionalNotes.placeholder}
                      error={itemErrors?.additionalNotes?.message as string | undefined}
                      required={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.additionalNotes.required}
                      rows={3}
                    />
                  </div>
                </>
              )}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-blue-100 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-blue-900">
                {SCHOLARSHIP_FORM_FIELDS.educationHistory.title}
              </h3>
            </div>
            
            <FieldArray<ScholarshipFormData, "educationHistory">
              name="educationHistory"
              control={control as any}
              addLabel="Okul Ekle"
              removeLabel="Kaldır"
              minItems={1}
              maxItems={50}
              itemTitle={(index) => `Okul ${index + 1}`}
              defaultValue={{ schoolName: "", startDate: "", endDate: undefined, graduation: "", department: "", percentage: 0 }}
              errors={errors}
              renderItem={(field, index, itemErrors) => (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Input
                    {...register(`educationHistory.${index}.schoolName`)}
                    label={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.schoolName.label}
                    placeholder={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.schoolName.placeholder}
                    error={itemErrors?.schoolName?.message as string | undefined}
                    required={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.schoolName.required}
                  />
                  <Input
                    {...register(`educationHistory.${index}.startDate`)}
                    type="date"
                    label={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.startDate.label}
                    error={itemErrors?.startDate?.message as string | undefined}
                    required={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.startDate.required}
                  />
                  <Input
                    {...register(`educationHistory.${index}.endDate`)}
                    type="date"
                    label={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.endDate.label}
                    error={itemErrors?.endDate?.message as string | undefined}
                    required={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.endDate.required}
                  />
                  <Input
                    {...register(`educationHistory.${index}.graduation`)}
                    label={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.graduation.label}
                    placeholder={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.graduation.placeholder}
                    error={itemErrors?.graduation?.message as string | undefined}
                    required={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.graduation.required}
                  />
                  <Input
                    {...register(`educationHistory.${index}.department`)}
                    label={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.department.label}
                    placeholder={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.department.placeholder}
                    error={itemErrors?.department?.message as string | undefined}
                    required={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.department.required}
                  />
                  <Input
                    {...register(`educationHistory.${index}.percentage`, { valueAsNumber: true })}
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    label={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.percentage.label}
                    placeholder={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.percentage.placeholder}
                    error={itemErrors?.percentage?.message as string | undefined}
                    required={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.percentage.required}
                  />
                </div>
              )}
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-blue-100 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-blue-900">
                {SCHOLARSHIP_FORM_FIELDS.references.title}
              </h3>
            </div>
            
            <FieldArray<ScholarshipFormData, "references">
              name="references"
              control={control as any}
              addLabel="Referans Ekle"
              removeLabel="Kaldır"
              minItems={0}
              maxItems={20}
              itemTitle={(index) => `Referans ${index + 1}`}
              defaultValue={{ relationship: "", fullName: "", isAcddMember: "", job: "", address: "", phone: "" }}
              errors={errors}
              renderItem={(field, index, itemErrors) => (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Input
                      {...register(`references.${index}.relationship`)}
                      label={SCHOLARSHIP_FORM_FIELDS.references.fields.relationship.label}
                      placeholder={SCHOLARSHIP_FORM_FIELDS.references.fields.relationship.placeholder}
                      error={itemErrors?.relationship?.message as string | undefined}
                      required={SCHOLARSHIP_FORM_FIELDS.references.fields.relationship.required}
                    />
                    <Input
                      {...register(`references.${index}.fullName`)}
                      label={SCHOLARSHIP_FORM_FIELDS.references.fields.fullName.label}
                      placeholder={SCHOLARSHIP_FORM_FIELDS.references.fields.fullName.placeholder}
                      error={itemErrors?.fullName?.message as string | undefined}
                      required={SCHOLARSHIP_FORM_FIELDS.references.fields.fullName.required}
                    />
                    <Select
                      {...register(`references.${index}.isAcddMember`)}
                      label={SCHOLARSHIP_FORM_FIELDS.references.fields.isAcddMember.label}
                      options={[...SCHOLARSHIP_FORM_FIELDS.references.fields.isAcddMember.options]}
                      error={itemErrors?.isAcddMember?.message as string | undefined}
                      required={SCHOLARSHIP_FORM_FIELDS.references.fields.isAcddMember.required}
                    />
                    <Input
                      {...register(`references.${index}.job`)}
                      label={SCHOLARSHIP_FORM_FIELDS.references.fields.job.label}
                      placeholder={SCHOLARSHIP_FORM_FIELDS.references.fields.job.placeholder}
                      error={itemErrors?.job?.message as string | undefined}
                      required={SCHOLARSHIP_FORM_FIELDS.references.fields.job.required}
                    />
                    <Input
                      {...register(`references.${index}.phone`)}
                      type="tel"
                      label={SCHOLARSHIP_FORM_FIELDS.references.fields.phone.label}
                      placeholder={SCHOLARSHIP_FORM_FIELDS.references.fields.phone.placeholder}
                      error={itemErrors?.phone?.message as string | undefined}
                      required={SCHOLARSHIP_FORM_FIELDS.references.fields.phone.required}
                    />
                  </div>
                  
                  <div className="mt-4">
                    <Textarea
                      {...register(`references.${index}.address`)}
                      label={SCHOLARSHIP_FORM_FIELDS.references.fields.address.label}
                      placeholder={SCHOLARSHIP_FORM_FIELDS.references.fields.address.placeholder}
                      error={itemErrors?.address?.message as string | undefined}
                      required={SCHOLARSHIP_FORM_FIELDS.references.fields.address.required}
                      rows={3}
                    />
                  </div>
                </>
              )}
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
      <CardContent key={currentStep}>
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

        <form onSubmit={handleSubmit(onSubmit as any)}>
          {renderStepContent()}

          {/* Error Message */}
          {submitError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm text-red-800">{submitError}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitError(null)}
                  className="ml-auto flex-shrink-0 text-red-400 hover:text-red-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {currentStep === steps.length && recaptchaSiteKey && (
            <div className="mt-6">
              <Recaptcha
                siteKey={recaptchaSiteKey}
                onVerify={(token) => {
                  setRecaptchaToken(token);
                  setSubmitError(null);
                }}
                onExpire={() => {
                  setRecaptchaToken(null);
                }}
                onError={() => {
                  setRecaptchaToken(null);
                  setSubmitError("reCAPTCHA doğrulaması başarısız oldu. Lütfen tekrar deneyin.");
                }}
              />
            </div>
          )}

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
                disabled={isSubmitting || (recaptchaSiteKey ? !recaptchaToken : false)}
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
