import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Header } from "@/components/layout/header";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Session } from "next-auth";

// Mock dependencies
vi.mock("next-auth/react");
vi.mock("next/navigation");
vi.mock("next-intl");
vi.mock("@/components/layout/language-switcher", () => ({
  LanguageSwitcher: () => (
    <div data-testid="language-switcher">Language Switcher</div>
  ),
}));

const mockUseSession = vi.mocked(useSession);
const mockUsePathname = vi.mocked(usePathname);
const mockUseTranslations = vi.mocked(useTranslations);
const mockUseLocale = vi.mocked(useLocale);

describe("Header", () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Default mock implementations
    mockUsePathname.mockReturnValue("/en");
    mockUseLocale.mockReturnValue("en");
    mockUseTranslations.mockReturnValue(
      vi.fn((key: string) => {
        const translations: Record<string, string> = {
          home: "Home",
          dashboard: "Dashboard",
          profile: "Profile",
          settings: "Settings",
          logout: "Logout",
        };
        return translations[key] || key;
      }) as any,
    );
  });

  it("renders logo and brand name", () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
      update: vi.fn(),
    } as any);

    render(<Header />);

    expect(screen.getByText("NextApp")).toBeInTheDocument();
    expect(screen.getByText("N")).toBeInTheDocument();
  });

  it("renders navigation links on desktop", () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
      update: vi.fn(),
    } as any);

    render(<Header />);

    // Desktop navigation should be visible
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("shows login and signup buttons when not authenticated", () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
      update: vi.fn(),
    } as any);

    render(<Header />);

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  it("shows user info and logout when authenticated", () => {
    const mockSession: Session = {
      user: {
        name: "John Doe",
        email: "john@example.com",
      },
      expires: "2024-12-31",
    };

    mockUseSession.mockReturnValue({
      data: mockSession,
      status: "authenticated",
      update: vi.fn(),
    } as any);

    render(<Header />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("shows loading state when session is loading", () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "loading",
      update: vi.fn(),
    } as any);

    render(<Header />);

    // Should show loading spinner
    const loadingElement = document.querySelector(".animate-pulse");
    expect(loadingElement).toBeInTheDocument();
  });

  it("toggles mobile menu when menu button is clicked", async () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
      update: vi.fn(),
    } as any);

    render(<Header />);

    const menuButton = screen.getByLabelText("Menu");
    expect(menuButton).toBeInTheDocument();

    // Click to open menu
    fireEvent.click(menuButton);

    // Wait for animation and check if mobile menu appears
    await waitFor(() => {
      const mobileNav = document.querySelector(".md\\:hidden.py-4.border-t");
      expect(mobileNav).toBeInTheDocument();
    });
  });

  it("highlights active navigation link", () => {
    mockUsePathname.mockReturnValue("/en/dashboard");
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
      update: vi.fn(),
    } as any);

    render(<Header />);

    const dashboardLink = screen.getByText("Dashboard");
    expect(dashboardLink).toHaveClass("text-primary");
  });

  it("renders language switcher", () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
      update: vi.fn(),
    } as any);

    render(<Header />);

    expect(screen.getByTestId("language-switcher")).toBeInTheDocument();
  });
});
