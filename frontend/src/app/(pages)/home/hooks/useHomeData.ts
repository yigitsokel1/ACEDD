"use client";

import { STATS_DATA, MISSION_DATA, ACTIVITY_DATA, TRUST_INDICATORS, HERO_DATA } from '../constants';

export function useHomeData() {
  // Frontend-only proje - statik veri döndür
  return {
    stats: STATS_DATA,
    missions: MISSION_DATA,
    activities: ACTIVITY_DATA,
    trustIndicators: TRUST_INDICATORS,
    hero: HERO_DATA
  };
}
