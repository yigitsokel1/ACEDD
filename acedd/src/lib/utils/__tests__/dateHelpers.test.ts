/**
 * Tests for Date Helper Functions
 * 
 * Sprint 16 - Block G: Unit tests for date normalization helpers
 * 
 * Tests cover:
 * - normalizeDateInput()
 * - toStartOfDayUTC()
 * - Edge cases (null, undefined, invalid dates)
 */

import { describe, it, expect } from "vitest";
import { normalizeDateInput, toStartOfDayUTC } from "../dateHelpers";

describe("normalizeDateInput", () => {
  it("should return Date object when given a valid Date", () => {
    const date = new Date("2024-01-15T10:30:00Z");
    const result = normalizeDateInput(date);
    
    expect(result).toBeInstanceOf(Date);
    expect(result?.getTime()).toBe(date.getTime());
  });

  it("should return Date object when given a valid ISO string", () => {
    const dateString = "2024-01-15T10:30:00Z";
    const result = normalizeDateInput(dateString);
    
    expect(result).toBeInstanceOf(Date);
    expect(result?.getTime()).toBe(new Date(dateString).getTime());
  });

  it("should return Date object when given YYYY-MM-DD string", () => {
    const dateString = "2024-01-15";
    const result = normalizeDateInput(dateString);
    
    expect(result).toBeInstanceOf(Date);
    expect(result).not.toBeNull();
  });

  it("should return null when given null", () => {
    const result = normalizeDateInput(null);
    expect(result).toBeNull();
  });

  it("should return null when given undefined", () => {
    const result = normalizeDateInput(undefined);
    expect(result).toBeNull();
  });

  it("should return null when given empty string", () => {
    const result = normalizeDateInput("");
    expect(result).toBeNull();
  });

  it("should return null when given whitespace-only string", () => {
    const result = normalizeDateInput("   ");
    expect(result).toBeNull();
  });

  it("should return null when given invalid date string", () => {
    const result = normalizeDateInput("invalid-date");
    expect(result).toBeNull();
  });

  it("should return null when given invalid Date object", () => {
    const invalidDate = new Date("invalid");
    const result = normalizeDateInput(invalidDate);
    expect(result).toBeNull();
  });
});

describe("toStartOfDayUTC", () => {
  it("should return Date at start of day UTC when given valid Date", () => {
    const date = new Date("2024-01-15T10:30:45Z");
    const result = toStartOfDayUTC(date);
    
    expect(result).toBeInstanceOf(Date);
    expect(result).not.toBeNull();
    
    if (result) {
      expect(result.getUTCHours()).toBe(0);
      expect(result.getUTCMinutes()).toBe(0);
      expect(result.getUTCSeconds()).toBe(0);
      expect(result.getUTCMilliseconds()).toBe(0);
      expect(result.getUTCFullYear()).toBe(2024);
      expect(result.getUTCMonth()).toBe(0); // January (0-indexed)
      expect(result.getUTCDate()).toBe(15);
    }
  });

  it("should return Date at start of day UTC when given valid ISO string", () => {
    const dateString = "2024-01-15T10:30:45Z";
    const result = toStartOfDayUTC(dateString);
    
    expect(result).toBeInstanceOf(Date);
    expect(result).not.toBeNull();
    
    if (result) {
      expect(result.getUTCHours()).toBe(0);
      expect(result.getUTCMinutes()).toBe(0);
      expect(result.getUTCSeconds()).toBe(0);
      expect(result.getUTCMilliseconds()).toBe(0);
    }
  });

  it("should return null when given null", () => {
    const result = toStartOfDayUTC(null);
    expect(result).toBeNull();
  });

  it("should return null when given undefined", () => {
    const result = toStartOfDayUTC(undefined);
    expect(result).toBeNull();
  });

  it("should return null when given invalid date string", () => {
    const result = toStartOfDayUTC("invalid-date");
    expect(result).toBeNull();
  });

  it("should handle different timezones correctly", () => {
    // Test with a date that would be different in local timezone
    const date = new Date("2024-01-15T23:30:00Z");
    const result = toStartOfDayUTC(date);
    
    expect(result).toBeInstanceOf(Date);
    expect(result).not.toBeNull();
    
    if (result) {
      // Should always be start of day in UTC regardless of input time
      expect(result.getUTCHours()).toBe(0);
      expect(result.getUTCMinutes()).toBe(0);
      expect(result.getUTCSeconds()).toBe(0);
      expect(result.getUTCMilliseconds()).toBe(0);
      // Date should be 15th (same day in UTC)
      expect(result.getUTCDate()).toBe(15);
    }
  });
});

