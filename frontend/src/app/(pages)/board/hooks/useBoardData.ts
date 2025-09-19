"use client";

import { BOARD_CONTENT, BOARD_MEMBERS } from '../constants';

export function useBoardData() {
  // Frontend-only proje - statik veri döndür
  return {
    content: BOARD_CONTENT,
    members: BOARD_MEMBERS
  };
}
