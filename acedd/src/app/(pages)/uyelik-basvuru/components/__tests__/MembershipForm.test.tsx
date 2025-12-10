/**
 * MembershipForm component tests
 * Sprint 15.5: Form render, validation, and snapshot tests
 */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MembershipForm } from "../MembershipForm";

// Import real validation helpers (no mocking - test real implementation)

describe("MembershipForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render form with all required fields", () => {
    render(<MembershipForm />);

    // Check form title
    expect(screen.getByText("Üyelik Başvuru Formu")).toBeInTheDocument();

    // Check required fields
    // Note: "Ad Soyad" is now split into firstName and lastName inputs
    expect(screen.getByPlaceholderText("Ad")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Soyad")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/11 haneli TC kimlik numaranız/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cinsiyet/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Doğum yerinizi girin")).toBeInTheDocument();
    // Doğum Tarihi: label ayrı render edildiği için input'u name attribute ile buluyoruz
    expect(screen.getByText("Doğum Tarihi")).toBeInTheDocument(); // Check label exists
    // date input (type="date" may not have textbox role, so we use getByDisplayValue or querySelector)
    // Instead, we verify the label exists and that there's a date input with name="birthDate" in the form
    const birthDateInput = document.querySelector('input[name="birthDate"][type="date"]');
    expect(birthDateInput).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Şehrinizi girin")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("05551234567")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("ornek@email.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Tam adresinizi girin")).toBeInTheDocument();
  });

  it("should render conditions checkbox", () => {
    render(<MembershipForm />);

    const checkbox = screen.getByRole("checkbox", { name: /şartları/i });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it("should render conditions link when membershipConditionsText is provided", () => {
    render(<MembershipForm membershipConditionsText="Test conditions text" />);

    expect(screen.getByText("Başvuru şartlarını oku")).toBeInTheDocument();
  });

  it("should not render conditions link when membershipConditionsText is empty", () => {
    render(<MembershipForm membershipConditionsText="" />);

    expect(screen.queryByText("Başvuru şartlarını oku")).not.toBeInTheDocument();
    expect(screen.getByText(/Şartları ve koşulları okudum/i)).toBeInTheDocument();
  });

  it("should render submit button", () => {
    render(<MembershipForm />);

    const submitButton = screen.getByRole("button", { name: /Başvuruyu Gönder/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("type", "submit");
  });

  it("should render clear button", () => {
    render(<MembershipForm />);

    const clearButton = screen.getByRole("button", { name: /Temizle/i });
    expect(clearButton).toBeInTheDocument();
    expect(clearButton).toHaveAttribute("type", "button");
  });

  it("should match snapshot", () => {
    const { container } = render(<MembershipForm />);
    expect(container).toMatchSnapshot();
  });

  it("should match snapshot with conditions text", () => {
    const { container } = render(
      <MembershipForm membershipConditionsText="Test conditions text here" />
    );
    expect(container).toMatchSnapshot();
  });
});

