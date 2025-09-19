"use client";

import { ABOUT_CONTENT, FEATURE_CARDS } from '../constants';

export function useAboutData() {
  // Frontend-only proje - statik veri döndür
  return {
    content: ABOUT_CONTENT,
    features: FEATURE_CARDS
  };
}
