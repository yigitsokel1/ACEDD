"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FileText } from "lucide-react";
import { FormData, MEMBERSHIP_CONTENT, FORM_FIELDS } from "../constants";

export function MembershipForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    phone: "",
    birthDate: "",
    academicLevel: "",
    maritalStatus: "",
    hometown: "",
    placeOfBirth: "",
    nationality: "",
    currentAddress: "",
    tcId: "",
    lastValidDate: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/membership-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Başvuru gönderilirken bir hata oluştu');
      }

      alert("Başvurunuz başarıyla gönderildi! En kısa sürede size geri dönüş yapacağız.");
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        gender: "",
        email: "",
        phone: "",
        birthDate: "",
        academicLevel: "",
        maritalStatus: "",
        hometown: "",
        placeOfBirth: "",
        nationality: "",
        currentAddress: "",
        tcId: "",
        lastValidDate: ""
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      alert("Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setFormData({
      firstName: "",
      lastName: "",
      gender: "",
      email: "",
      phone: "",
      birthDate: "",
      academicLevel: "",
      maritalStatus: "",
      hometown: "",
      placeOfBirth: "",
      nationality: "",
      currentAddress: "",
      tcId: "",
      lastValidDate: ""
    });
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                <FileText className="w-8 h-8 mr-3 text-blue-600" />
                {MEMBERSHIP_CONTENT.form.title}
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                {MEMBERSHIP_CONTENT.form.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* İsim */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        İsim *
                      </label>
                      <Input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="Adınızı girin"
                        required
                        className="w-full"
                      />
                    </div>

                    {/* Cinsiyet */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cinsiyet *
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange("gender", e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {FORM_FIELDS.gender.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="email@example.com"
                        required
                        className="w-full"
                      />
                    </div>

                    {/* Akademik Seviye */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Akademik Seviye *
                      </label>
                      <select
                        value={formData.academicLevel}
                        onChange={(e) => handleInputChange("academicLevel", e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {FORM_FIELDS.academicLevel.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Memleket */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Memleket *
                      </label>
                      <Input
                        type="text"
                        value={formData.hometown}
                        onChange={(e) => handleInputChange("hometown", e.target.value)}
                        placeholder="Memleketinizi girin"
                        required
                        className="w-full"
                      />
                    </div>

                    {/* Mevcut Adres */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Mevcut Adres *
                      </label>
                      <Textarea
                        value={formData.currentAddress}
                        onChange={(e) => handleInputChange("currentAddress", e.target.value)}
                        placeholder="Mevcut adresinizi girin"
                        required
                        rows={3}
                        className="w-full"
                      />
                    </div>

                    {/* TC Kimlik No */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        TC. Kimlik No (Zorunlu değil)
                      </label>
                      <Input
                        type="text"
                        value={formData.tcId}
                        onChange={(e) => handleInputChange("tcId", e.target.value)}
                        placeholder="TC Kimlik numaranızı girin"
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Soyisim */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Soyisim *
                      </label>
                      <Input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Soyadınızı girin"
                        required
                        className="w-full"
                      />
                    </div>

                    {/* Doğum Tarihi */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Doğum Tarihi *
                      </label>
                      <Input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => handleInputChange("birthDate", e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>

                    {/* Telefon */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Telefon Numarası *
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Telefon numaranızı girin"
                        required
                        className="w-full"
                      />
                    </div>

                    {/* Medeni Hal */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Medeni Hal *
                      </label>
                      <select
                        value={formData.maritalStatus}
                        onChange={(e) => handleInputChange("maritalStatus", e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {FORM_FIELDS.maritalStatus.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Doğum Yeri */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Doğum Yeri *
                      </label>
                      <Input
                        type="text"
                        value={formData.placeOfBirth}
                        onChange={(e) => handleInputChange("placeOfBirth", e.target.value)}
                        placeholder="Doğum yerinizi girin"
                        required
                        className="w-full"
                      />
                    </div>

                    {/* Ulus */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ulus *
                      </label>
                      <Input
                        type="text"
                        value={formData.nationality}
                        onChange={(e) => handleInputChange("nationality", e.target.value)}
                        placeholder="Uyruğunuzu girin"
                        required
                        className="w-full"
                      />
                    </div>

                    {/* Son Geçerlilik Tarihi */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Son Geçerlilik Tarihi (Ör. 20.10.1960)
                      </label>
                      <Input
                        type="date"
                        value={formData.lastValidDate}
                        onChange={(e) => handleInputChange("lastValidDate", e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
                  <Button
                    type="button"
                    onClick={handleClear}
                    variant="outline"
                    className="px-8 py-3 text-gray-700 border-gray-300 hover:bg-gray-50"
                  >
                    Kaydı Sil
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSubmitting ? "Gönderiliyor..." : "Kaydı Gönder"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

