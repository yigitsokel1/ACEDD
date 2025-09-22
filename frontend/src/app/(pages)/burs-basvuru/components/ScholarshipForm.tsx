"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Textarea } from "@/components/ui";
import { Select } from "@/components/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { SCHOLARSHIP_FORM_FIELDS } from "../constants";
import { Plus, Trash2 } from "lucide-react";

const scholarshipFormSchema = z.object({
  // Genel Bilgi
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  surname: z.string().min(2, "Soyisim en az 2 karakter olmalıdır"),
  phone: z.string().min(10, "Geçerli bir telefon numarası girin"),
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  birthDate: z.string().min(1, "Doğum tarihi gereklidir"),
  birthPlace: z.string().min(2, "Doğum yeri en az 2 karakter olmalıdır"),
  tcNumber: z.string().min(11, "TC kimlik numarası 11 haneli olmalıdır"),
  idIssuePlace: z.string().min(2, "Verildiği yer en az 2 karakter olmalıdır"),
  idIssueDate: z.string().min(1, "Kimlik veriliş tarihi gereklidir"),
  gender: z.string().min(1, "Cinsiyet seçimi gereklidir"),
  maritalStatus: z.string().min(1, "Medeni hal seçimi gereklidir"),
  hometown: z.string().min(2, "Memleket en az 2 karakter olmalıdır"),
  bankAccount: z.string().min(2, "Banka hesabı en az 2 karakter olmalıdır"),
  ibanNumber: z.string().min(26, "İBAN numarası en az 26 karakter olmalıdır"),
  university: z.string().min(2, "Üniversite adı en az 2 karakter olmalıdır"),
  faculty: z.string().min(2, "Fakülte/Bölüm en az 2 karakter olmalıdır"),
  grade: z.string().min(1, "Sınıf bilgisi gereklidir"),
  turkeyRanking: z.number().min(1, "Türkiye sıralaması en az 1 olmalıdır"),
  physicalDisability: z.string().min(1, "Fiziksel engel durumu seçimi gereklidir"),
  healthProblem: z.string().min(1, "Sağlık sorunu durumu seçimi gereklidir"),
  familyMonthlyIncome: z.number().min(0, "Aile geliri 0'dan büyük olmalıdır"),
  familyMonthlyExpenses: z.number().min(0, "Aile gideri 0'dan büyük olmalıdır"),
  scholarshipIncome: z.string().min(1, "Burs/kredi durumu seçimi gereklidir"),
  alternativePhone: z.string().optional(),
  permanentAddress: z.string().min(10, "Daimi adres en az 10 karakter olmalıdır"),
  currentAccommodation: z.string().min(2, "Konaklama durumu en az 2 karakter olmalıdır"),
  interests: z.string().optional(),
  selfIntroduction: z.string().min(20, "Kendini tanıtma en az 20 karakter olmalıdır"),
  
  // Akrabalar
  relatives: z.array(z.object({
    kinship: z.string().min(1, "Akrabalık derecesi gereklidir"),
    name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
    surname: z.string().min(2, "Soyisim en az 2 karakter olmalıdır"),
    birthDate: z.string().min(1, "Doğum tarihi gereklidir"),
    education: z.string().min(1, "Eğitim durumu gereklidir"),
    occupation: z.string().min(1, "Meslek gereklidir"),
    job: z.string().min(1, "İş bilgisi gereklidir"),
    healthInsurance: z.string().min(1, "Sağlık sigortası durumu gereklidir"),
    healthDisability: z.string().min(1, "Sağlık engeli durumu gereklidir"),
    income: z.number().min(0, "Gelir 0'dan büyük olmalıdır"),
    phone: z.string().min(10, "Geçerli telefon numarası girin"),
    additionalNotes: z.string().optional(),
  })).min(1, "En az bir akraba bilgisi gereklidir"),
  
  // Eğitim Geçmişi
  educationHistory: z.array(z.object({
    schoolName: z.string().min(2, "Okul adı en az 2 karakter olmalıdır"),
    startDate: z.string().min(1, "Başlama tarihi gereklidir"),
    endDate: z.string().min(1, "Bitiş tarihi gereklidir"),
    graduation: z.string().min(1, "Mezuniyet durumu gereklidir"),
    department: z.string().min(1, "Bölüm bilgisi gereklidir"),
    percentage: z.number().min(0).max(100, "Yüzde 0-100 arasında olmalıdır"),
  })).min(1, "En az bir okul bilgisi gereklidir"),
  
  // Referanslar
  references: z.array(z.object({
    relationship: z.string().min(1, "İlişki derecesi gereklidir"),
    fullName: z.string().min(2, "Ad soyad en az 2 karakter olmalıdır"),
    isAcddMember: z.string().min(1, "AÇDD üyeliği durumu seçimi gereklidir"),
    job: z.string().min(1, "Meslek bilgisi gereklidir"),
    address: z.string().min(10, "Adres en az 10 karakter olmalıdır"),
    phone: z.string().min(10, "Geçerli telefon numarası girin"),
  })).min(1, "En az bir referans bilgisi gereklidir"),
});

type ScholarshipFormData = z.infer<typeof scholarshipFormSchema>;

export function ScholarshipForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
  } = useForm<ScholarshipFormData>({
    resolver: zodResolver(scholarshipFormSchema),
    defaultValues: {
      relatives: [{ kinship: "", name: "", surname: "", birthDate: "", education: "", occupation: "", job: "", healthInsurance: "", healthDisability: "", income: 0, phone: "", additionalNotes: "" }],
      educationHistory: [{ schoolName: "", startDate: "", endDate: "", graduation: "", department: "", percentage: 0 }],
      references: [{ relationship: "", fullName: "", isAcddMember: "", job: "", address: "", phone: "" }],
    },
  });

  const { fields: relativeFields, append: appendRelative, remove: removeRelative } = useFieldArray({
    control,
    name: "relatives",
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: "educationHistory",
  });

  const { fields: referenceFields, append: appendReference, remove: removeReference } = useFieldArray({
    control,
    name: "references",
  });

  const steps = [
    { key: "generalInfo", title: "Genel Bilgi" },
    { key: "relativesInfo", title: "Akrabalar" },
    { key: "educationHistory", title: "Eğitim Geçmişi" },
    { key: "references", title: "Referanslar" },
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
        return ["name", "surname", "phone", "email", "birthDate", "birthPlace", "tcNumber", "idIssuePlace", "idIssueDate", "gender", "maritalStatus", "hometown", "bankAccount", "ibanNumber", "university", "faculty", "grade", "turkeyRanking", "physicalDisability", "healthProblem", "familyMonthlyIncome", "familyMonthlyExpenses", "scholarshipIncome", "permanentAddress", "currentAccommodation", "selfIntroduction"];
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
            <div className="bg-blue-100 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-blue-900">
                {SCHOLARSHIP_FORM_FIELDS.generalInfo.title}
              </h3>
            </div>
            
            {/* Temel Bilgiler */}
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
                {...register("birthDate")}
                type="date"
                label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.birthDate.label}
                placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.birthDate.placeholder}
                error={errors.birthDate?.message}
                required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.birthDate.required}
              />
              <Input
                {...register("birthPlace")}
                label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.birthPlace.label}
                placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.birthPlace.placeholder}
                error={errors.birthPlace?.message}
                required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.birthPlace.required}
              />
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
                placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.idIssueDate.placeholder}
                error={errors.idIssueDate?.message}
                required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.idIssueDate.required}
              />
              <Select
                {...register("gender")}
                label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.gender.label}
                options={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.gender.options}
                error={errors.gender?.message}
                required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.gender.required}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Select
                {...register("maritalStatus")}
                label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.maritalStatus.label}
                options={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.maritalStatus.options}
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
                {...register("grade")}
                label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.grade.label}
                placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.grade.placeholder}
                error={errors.grade?.message}
                required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.grade.required}
              />
              <Input
                {...register("turkeyRanking", { valueAsNumber: true })}
                type="number"
                label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.turkeyRanking.label}
                placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.turkeyRanking.placeholder}
                error={errors.turkeyRanking?.message}
                required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.turkeyRanking.required}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Select
                {...register("physicalDisability")}
                label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.physicalDisability.label}
                options={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.physicalDisability.options}
                error={errors.physicalDisability?.message}
                required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.physicalDisability.required}
              />
              <Select
                {...register("healthProblem")}
                label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.healthProblem.label}
                options={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.healthProblem.options}
                error={errors.healthProblem?.message}
                required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.healthProblem.required}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                {...register("familyMonthlyIncome", { valueAsNumber: true })}
                type="number"
                label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.familyMonthlyIncome.label}
                placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.familyMonthlyIncome.placeholder}
                error={errors.familyMonthlyIncome?.message}
                required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.familyMonthlyIncome.required}
              />
              <Input
                {...register("familyMonthlyExpenses", { valueAsNumber: true })}
                type="number"
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
                options={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.scholarshipIncome.options}
                error={errors.scholarshipIncome?.message}
                required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.scholarshipIncome.required}
              />
              <Input
                {...register("alternativePhone")}
                type="tel"
                label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.alternativePhone.label}
                placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.alternativePhone.placeholder}
                error={errors.alternativePhone?.message}
                required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.alternativePhone.required}
              />
            </div>

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

            <Input
              {...register("interests")}
              label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.interests.label}
              placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.interests.placeholder}
              error={errors.interests?.message}
              required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.interests.required}
            />

            <Textarea
              {...register("selfIntroduction")}
              label={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.selfIntroduction.label}
              placeholder={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.selfIntroduction.placeholder}
              error={errors.selfIntroduction?.message}
              required={SCHOLARSHIP_FORM_FIELDS.generalInfo.fields.selfIntroduction.required}
              rows={4}
            />
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
            
            {relativeFields.map((field, index) => (
              <Card key={field.id} className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-semibold text-gray-900">
                    Akraba {index + 1}
                  </h4>
                  {relativeFields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeRelative(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Input
                    {...register(`relatives.${index}.kinship`)}
                    label={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.kinship.label}
                    placeholder={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.kinship.placeholder}
                    error={errors.relatives?.[index]?.kinship?.message}
                    required={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.kinship.required}
                  />
                  <Input
                    {...register(`relatives.${index}.name`)}
                    label={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.name.label}
                    placeholder={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.name.placeholder}
                    error={errors.relatives?.[index]?.name?.message}
                    required={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.name.required}
                  />
                  <Input
                    {...register(`relatives.${index}.surname`)}
                    label={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.surname.label}
                    placeholder={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.surname.placeholder}
                    error={errors.relatives?.[index]?.surname?.message}
                    required={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.surname.required}
                  />
                  <Input
                    {...register(`relatives.${index}.birthDate`)}
                    type="date"
                    label={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.birthDate.label}
                    placeholder={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.birthDate.placeholder}
                    error={errors.relatives?.[index]?.birthDate?.message}
                    required={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.birthDate.required}
                  />
                  <Input
                    {...register(`relatives.${index}.education`)}
                    label={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.education.label}
                    placeholder={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.education.placeholder}
                    error={errors.relatives?.[index]?.education?.message}
                    required={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.education.required}
                  />
                  <Input
                    {...register(`relatives.${index}.occupation`)}
                    label={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.occupation.label}
                    placeholder={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.occupation.placeholder}
                    error={errors.relatives?.[index]?.occupation?.message}
                    required={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.occupation.required}
                  />
                  <Input
                    {...register(`relatives.${index}.job`)}
                    label={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.job.label}
                    placeholder={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.job.placeholder}
                    error={errors.relatives?.[index]?.job?.message}
                    required={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.job.required}
                  />
                  <Input
                    {...register(`relatives.${index}.healthInsurance`)}
                    label={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.healthInsurance.label}
                    placeholder={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.healthInsurance.placeholder}
                    error={errors.relatives?.[index]?.healthInsurance?.message}
                    required={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.healthInsurance.required}
                  />
                  <Input
                    {...register(`relatives.${index}.healthDisability`)}
                    label={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.healthDisability.label}
                    placeholder={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.healthDisability.placeholder}
                    error={errors.relatives?.[index]?.healthDisability?.message}
                    required={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.healthDisability.required}
                  />
                  <Input
                    {...register(`relatives.${index}.income`, { valueAsNumber: true })}
                    type="number"
                    label={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.income.label}
                    placeholder={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.income.placeholder}
                    error={errors.relatives?.[index]?.income?.message}
                    required={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.income.required}
                  />
                  <Input
                    {...register(`relatives.${index}.phone`)}
                    type="tel"
                    label={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.phone.label}
                    placeholder={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.phone.placeholder}
                    error={errors.relatives?.[index]?.phone?.message}
                    required={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.phone.required}
                  />
                </div>
                
                <div className="mt-4">
                  <Textarea
                    {...register(`relatives.${index}.additionalNotes`)}
                    label={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.additionalNotes.label}
                    placeholder={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.additionalNotes.placeholder}
                    error={errors.relatives?.[index]?.additionalNotes?.message}
                    required={SCHOLARSHIP_FORM_FIELDS.relativesInfo.fields.additionalNotes.required}
                    rows={3}
                  />
                </div>
              </Card>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => appendRelative({ kinship: "", name: "", surname: "", birthDate: "", education: "", occupation: "", job: "", healthInsurance: "", healthDisability: "", income: 0, phone: "", additionalNotes: "" })}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Sıra Ekle
            </Button>
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
            
            {educationFields.map((field, index) => (
              <Card key={field.id} className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-semibold text-gray-900">
                    Okul {index + 1}
                  </h4>
                  {educationFields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeEducation(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Input
                    {...register(`educationHistory.${index}.schoolName`)}
                    label={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.schoolName.label}
                    placeholder={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.schoolName.placeholder}
                    error={errors.educationHistory?.[index]?.schoolName?.message}
                    required={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.schoolName.required}
                  />
                  <Input
                    {...register(`educationHistory.${index}.startDate`)}
                    type="date"
                    label={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.startDate.label}
                    placeholder={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.startDate.placeholder}
                    error={errors.educationHistory?.[index]?.startDate?.message}
                    required={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.startDate.required}
                  />
                  <Input
                    {...register(`educationHistory.${index}.endDate`)}
                    type="date"
                    label={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.endDate.label}
                    placeholder={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.endDate.placeholder}
                    error={errors.educationHistory?.[index]?.endDate?.message}
                    required={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.endDate.required}
                  />
                  <Input
                    {...register(`educationHistory.${index}.graduation`)}
                    label={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.graduation.label}
                    placeholder={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.graduation.placeholder}
                    error={errors.educationHistory?.[index]?.graduation?.message}
                    required={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.graduation.required}
                  />
                  <Input
                    {...register(`educationHistory.${index}.department`)}
                    label={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.department.label}
                    placeholder={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.department.placeholder}
                    error={errors.educationHistory?.[index]?.department?.message}
                    required={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.department.required}
                  />
                  <Input
                    {...register(`educationHistory.${index}.percentage`, { valueAsNumber: true })}
                    type="number"
                    min="0"
                    max="100"
                    label={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.percentage.label}
                    placeholder={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.percentage.placeholder}
                    error={errors.educationHistory?.[index]?.percentage?.message}
                    required={SCHOLARSHIP_FORM_FIELDS.educationHistory.fields.percentage.required}
                  />
                </div>
              </Card>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => appendEducation({ schoolName: "", startDate: "", endDate: "", graduation: "", department: "", percentage: 0 })}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Sıra Ekle
            </Button>
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
            
            {referenceFields.map((field, index) => (
              <Card key={field.id} className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-semibold text-gray-900">
                    Referans {index + 1}
                  </h4>
                  {referenceFields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeReference(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Input
                    {...register(`references.${index}.relationship`)}
                    label={SCHOLARSHIP_FORM_FIELDS.references.fields.relationship.label}
                    placeholder={SCHOLARSHIP_FORM_FIELDS.references.fields.relationship.placeholder}
                    error={errors.references?.[index]?.relationship?.message}
                    required={SCHOLARSHIP_FORM_FIELDS.references.fields.relationship.required}
                  />
                  <Input
                    {...register(`references.${index}.fullName`)}
                    label={SCHOLARSHIP_FORM_FIELDS.references.fields.fullName.label}
                    placeholder={SCHOLARSHIP_FORM_FIELDS.references.fields.fullName.placeholder}
                    error={errors.references?.[index]?.fullName?.message}
                    required={SCHOLARSHIP_FORM_FIELDS.references.fields.fullName.required}
                  />
                  <Select
                    {...register(`references.${index}.isAcddMember`)}
                    label={SCHOLARSHIP_FORM_FIELDS.references.fields.isAcddMember.label}
                    options={SCHOLARSHIP_FORM_FIELDS.references.fields.isAcddMember.options}
                    error={errors.references?.[index]?.isAcddMember?.message}
                    required={SCHOLARSHIP_FORM_FIELDS.references.fields.isAcddMember.required}
                  />
                  <Input
                    {...register(`references.${index}.job`)}
                    label={SCHOLARSHIP_FORM_FIELDS.references.fields.job.label}
                    placeholder={SCHOLARSHIP_FORM_FIELDS.references.fields.job.placeholder}
                    error={errors.references?.[index]?.job?.message}
                    required={SCHOLARSHIP_FORM_FIELDS.references.fields.job.required}
                  />
                  <Input
                    {...register(`references.${index}.phone`)}
                    type="tel"
                    label={SCHOLARSHIP_FORM_FIELDS.references.fields.phone.label}
                    placeholder={SCHOLARSHIP_FORM_FIELDS.references.fields.phone.placeholder}
                    error={errors.references?.[index]?.phone?.message}
                    required={SCHOLARSHIP_FORM_FIELDS.references.fields.phone.required}
                  />
                </div>
                
                <div className="mt-4">
                  <Textarea
                    {...register(`references.${index}.address`)}
                    label={SCHOLARSHIP_FORM_FIELDS.references.fields.address.label}
                    placeholder={SCHOLARSHIP_FORM_FIELDS.references.fields.address.placeholder}
                    error={errors.references?.[index]?.address?.message}
                    required={SCHOLARSHIP_FORM_FIELDS.references.fields.address.required}
                    rows={3}
                  />
                </div>
              </Card>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => appendReference({ relationship: "", fullName: "", isAcddMember: "", job: "", address: "", phone: "" })}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Sıra Ekle
            </Button>
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
