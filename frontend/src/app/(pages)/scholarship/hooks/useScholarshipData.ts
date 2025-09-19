"use client";

import { useState } from 'react';
import { SCHOLARSHIP_CONTENT, FORM_SECTIONS } from '../constants';
import { ScholarshipFormData } from '../types';

export function useScholarshipData() {
  const [content] = useState(SCHOLARSHIP_CONTENT);
  const [formSections] = useState(FORM_SECTIONS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState<ScholarshipFormData>({
    adSoyad: "",
    email: "",
    telefon: "",
    universite: "",
    bolum: "",
    sinif: "",
    gpa: "",
    aileGelir: "",
    acilDurum: "",
    motivasyon: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Frontend-only: Form verilerini console'a yazdır
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Form submitted:', formData);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleNewApplication = () => {
    setIsSubmitted(false);
    setFormData({
      adSoyad: "",
      email: "",
      telefon: "",
      universite: "",
      bolum: "",
      sinif: "",
      gpa: "",
      aileGelir: "",
      acilDurum: "",
      motivasyon: "",
    });
  };

  return {
    content,
    formSections,
    formData,
    isSubmitting,
    isSubmitted,
    handleChange,
    handleSubmit,
    handleNewApplication
  };
}
