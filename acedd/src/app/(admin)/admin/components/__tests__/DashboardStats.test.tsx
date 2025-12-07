/**
 * DashboardStats Component Tests
 * 
 * Full UI tests using @testing-library/react
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardStats } from "../DashboardStats";

describe("DashboardStats Component", () => {
  it("should render loading state when data is null", () => {
    render(<DashboardStats data={null} />);

    // Should show loading indicator (appears 5 times, once per stat card)
    const loadingIndicators = screen.getAllByText("Yükleniyor...");
    expect(loadingIndicators.length).toBe(5);
    // Should show placeholder "—" for all stats
    const placeholders = screen.getAllByText("—");
    expect(placeholders.length).toBe(5); // 5 stat cards
  });

  it("should render stats with real data", () => {
    const mockData = {
      membership: {
        total: 10,
        pending: 3,
      },
      scholarship: {
        total: 8,
        pending: 2,
      },
      members: {
        total: 50,
        active: 45,
      },
      messages: {
        unread: 5,
      },
      events: {
        upcomingTotal: 3,
      },
    };

    render(<DashboardStats data={mockData} />);

    // Verify stat values are displayed
    expect(screen.getByText("18")).toBeInTheDocument(); // totalApplications: 10 + 8
    // "5" appears twice (pendingApplications and unreadMessages), so use getAllByText
    const fives = screen.getAllByText("5");
    expect(fives.length).toBe(2); // pendingApplications: 3 + 2, and unreadMessages: 5
    expect(screen.getByText("45")).toBeInTheDocument(); // activeMembers
    expect(screen.getByText("3")).toBeInTheDocument(); // upcomingEvents

    // Verify stat titles
    expect(screen.getByText("Toplam Başvuru")).toBeInTheDocument();
    expect(screen.getByText("Bekleyen Başvurular")).toBeInTheDocument();
    expect(screen.getByText("Aktif Üyeler")).toBeInTheDocument();
    expect(screen.getByText("Okunmamış Mesajlar")).toBeInTheDocument();
    expect(screen.getByText("Yaklaşan Etkinlikler")).toBeInTheDocument();
  });

  it("should highlight pending applications when count > 0", () => {
    const mockData = {
      membership: {
        total: 10,
        pending: 3,
      },
      scholarship: {
        total: 8,
        pending: 2,
      },
      members: {
        total: 50,
        active: 45,
      },
      messages: {
        unread: 0,
      },
      events: {
        upcomingTotal: 0,
      },
    };

    const { container } = render(<DashboardStats data={mockData} />);

    // Find the "Bekleyen Başvurular" card (should have highlight border)
    const cards = container.querySelectorAll('[class*="border-2"]');
    expect(cards.length).toBeGreaterThan(0); // At least one highlighted card
  });

  it("should highlight unread messages when count > 0", () => {
    const mockData = {
      membership: {
        total: 0,
        pending: 0,
      },
      scholarship: {
        total: 0,
        pending: 0,
      },
      members: {
        total: 0,
        active: 0,
      },
      messages: {
        unread: 5,
      },
      events: {
        upcomingTotal: 0,
      },
    };

    const { container } = render(<DashboardStats data={mockData} />);

    // Find highlighted cards
    const cards = container.querySelectorAll('[class*="border-2"]');
    expect(cards.length).toBeGreaterThan(0); // At least one highlighted card
  });

  it("should render with zero values", () => {
    const mockData = {
      membership: {
        total: 0,
        pending: 0,
      },
      scholarship: {
        total: 0,
        pending: 0,
      },
      members: {
        total: 0,
        active: 0,
      },
      messages: {
        unread: 0,
      },
      events: {
        upcomingTotal: 0,
      },
    };

    render(<DashboardStats data={mockData} />);

    // All values should be "0"
    const zeroValues = screen.getAllByText("0");
    expect(zeroValues.length).toBeGreaterThanOrEqual(5); // At least 5 stat cards with "0"
  });

  it("should render with partial data", () => {
    const mockData = {
      membership: {
        total: 5,
        pending: 1,
      },
      // Missing other fields
    } as any;

    render(<DashboardStats data={mockData} />);

    // Should still render without crashing
    expect(screen.getByText("Toplam Başvuru")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument(); // membership.total
    // Missing fields should default to 0 (appears multiple times)
    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBeGreaterThanOrEqual(3); // At least 3 stats with "0"
  });
});
