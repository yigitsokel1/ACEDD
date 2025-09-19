"use client";

import { CONTACT_CONTENT, CONTACT_INFO } from '../constants';

export function useContactData() {
  // Frontend-only proje - statik veri döndür
  return {
    content: CONTACT_CONTENT,
    contactInfo: CONTACT_INFO
  };
}
