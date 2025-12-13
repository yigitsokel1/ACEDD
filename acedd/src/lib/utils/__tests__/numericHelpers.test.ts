/**
 * Tests for Numeric Helper Functions
 * 
 * Sprint 16 - Block G: Unit tests for numeric normalization helpers
 * 
 * Tests cover:
 * - normalizeNumericInput()
 * - normalizePositiveNumericInput()
 * - normalizeIntegerInput()
 * - Edge cases (null, undefined, invalid numbers, strings with commas/dots)
 */

import { describe, it, expect } from "vitest";
import {
  normalizeNumericInput,
  normalizePositiveNumericInput,
  normalizeIntegerInput,
} from "../numericHelpers";

describe("normalizeNumericInput", () => {
  it("should return number when given a valid number", () => {
    expect(normalizeNumericInput(42)).toBe(42);
    expect(normalizeNumericInput(0)).toBe(0);
    expect(normalizeNumericInput(-10)).toBe(-10);
    expect(normalizeNumericInput(3.14)).toBe(3.14);
  });

  it("should return number when given a valid numeric string", () => {
    expect(normalizeNumericInput("42")).toBe(42);
    expect(normalizeNumericInput("0")).toBe(0);
    expect(normalizeNumericInput("-10")).toBe(-10);
    expect(normalizeNumericInput("3.14")).toBe(3.14);
  });

  it("should handle string with comma as decimal separator", () => {
    expect(normalizeNumericInput("3,14")).toBe(3.14);
    expect(normalizeNumericInput("1234,56")).toBe(1234.56);
  });

  it("should handle string with whitespace", () => {
    expect(normalizeNumericInput("  42  ")).toBe(42);
    expect(normalizeNumericInput("  3.14  ")).toBe(3.14);
    expect(normalizeNumericInput("1 234.56")).toBe(1234.56); // Space removed
  });

  it("should return null when given null", () => {
    expect(normalizeNumericInput(null)).toBeNull();
  });

  it("should return null when given undefined", () => {
    expect(normalizeNumericInput(undefined)).toBeNull();
  });

  it("should return null when given empty string", () => {
    expect(normalizeNumericInput("")).toBeNull();
  });

  it("should return null when given whitespace-only string", () => {
    expect(normalizeNumericInput("   ")).toBeNull();
  });

  it("should return null when given invalid string", () => {
    expect(normalizeNumericInput("abc")).toBeNull();
    expect(normalizeNumericInput("not-a-number")).toBeNull();
  });

  it("should return null when given NaN", () => {
    expect(normalizeNumericInput(NaN)).toBeNull();
  });

  it("should handle very large numbers", () => {
    expect(normalizeNumericInput("999999999")).toBe(999999999);
    expect(normalizeNumericInput("1.5e10")).toBe(15000000000);
  });

  it("should handle very small numbers", () => {
    expect(normalizeNumericInput("0.0001")).toBe(0.0001);
    expect(normalizeNumericInput("-0.0001")).toBe(-0.0001);
  });
});

describe("normalizePositiveNumericInput", () => {
  it("should return number when given a positive number", () => {
    expect(normalizePositiveNumericInput(42)).toBe(42);
    expect(normalizePositiveNumericInput(0)).toBe(0);
    expect(normalizePositiveNumericInput(3.14)).toBe(3.14);
  });

  it("should return number when given a positive numeric string", () => {
    expect(normalizePositiveNumericInput("42")).toBe(42);
    expect(normalizePositiveNumericInput("0")).toBe(0);
    expect(normalizePositiveNumericInput("3.14")).toBe(3.14);
  });

  it("should return null when given negative number", () => {
    expect(normalizePositiveNumericInput(-10)).toBeNull();
    expect(normalizePositiveNumericInput("-10")).toBeNull();
    expect(normalizePositiveNumericInput(-3.14)).toBeNull();
  });

  it("should return null when given null", () => {
    expect(normalizePositiveNumericInput(null)).toBeNull();
  });

  it("should return null when given undefined", () => {
    expect(normalizePositiveNumericInput(undefined)).toBeNull();
  });

  it("should return null when given invalid string", () => {
    expect(normalizePositiveNumericInput("abc")).toBeNull();
  });

  it("should handle string with comma as decimal separator", () => {
    expect(normalizePositiveNumericInput("3,14")).toBe(3.14);
  });
});

describe("normalizeIntegerInput", () => {
  it("should return integer when given a valid integer", () => {
    expect(normalizeIntegerInput(42)).toBe(42);
    expect(normalizeIntegerInput(0)).toBe(0);
    expect(normalizeIntegerInput(-10)).toBe(-10);
  });

  it("should return integer when given a valid integer string", () => {
    expect(normalizeIntegerInput("42")).toBe(42);
    expect(normalizeIntegerInput("0")).toBe(0);
    expect(normalizeIntegerInput("-10")).toBe(-10);
  });

  it("should floor decimal numbers", () => {
    expect(normalizeIntegerInput(3.14)).toBe(3);
    expect(normalizeIntegerInput(3.99)).toBe(3);
    expect(normalizeIntegerInput(-3.14)).toBe(-4); // Math.floor(-3.14) = -4 (always rounds down)
    expect(normalizeIntegerInput("3.14")).toBe(3);
    expect(normalizeIntegerInput("3,14")).toBe(3);
  });

  it("should return null when given null", () => {
    expect(normalizeIntegerInput(null)).toBeNull();
  });

  it("should return null when given undefined", () => {
    expect(normalizeIntegerInput(undefined)).toBeNull();
  });

  it("should return null when given invalid string", () => {
    expect(normalizeIntegerInput("abc")).toBeNull();
  });

  it("should handle string with comma as decimal separator", () => {
    expect(normalizeIntegerInput("1234,56")).toBe(1234);
  });
});

