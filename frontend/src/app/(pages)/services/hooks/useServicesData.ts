"use client";

import { SERVICES_CONTENT, SERVICE_CARDS } from '../constants';

export function useServicesData() {
  // Frontend-only proje - statik veri döndür
  return {
    content: SERVICES_CONTENT,
    services: SERVICE_CARDS
  };
}
