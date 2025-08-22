import { render, screen } from "@testing-library/react";
import { useTranslations, useLocale } from "next-intl";
import { Footer } from "@/components/layout/footer";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock dependencies
vi.mock("next-intl");

const mockUseTranslations = vi.mocked(useTranslations);
const mockUseLocale = vi.mocked(useLocale);

describe("Footer", () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Default mock implementations
    mockUseLocale.mockReturnValue("en");
    mockUseTranslations.mockReturnValue(
      vi.fn((key: string) => {
        const translations: Record<string, string> = {
          description: "A modern Next.js application with enterprise features",
          product: "Product",
          features: "Features",
          pricing: "Pricing",
          documentation: "Documentation",
          company: "Company",
          about: "About",
          contact: "Contact",
          careers: "Careers",
          legal: "Legal",
          privacy: "Privacy Policy",
          terms: "Terms of Service",
          cookies: "Cookie Policy",
          rights: "All rights reserved.",
        };
        return translations[key] || key;
      }) as any,
    );
  });

  it("renders footer with correct structure", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass("bg-gray-50", "border-t");
  });

  it("displays company logo and brand name", () => {
    render(<Footer />);

    expect(screen.getByText("NextApp")).toBeInTheDocument();
    expect(screen.getByText("N")).toBeInTheDocument();
  });

  it("displays company description", () => {
    render(<Footer />);

    expect(
      screen.getByText("A modern Next.js application with enterprise features"),
    ).toBeInTheDocument();
  });

  it("renders product section with correct links", () => {
    render(<Footer />);

    expect(screen.getByText("Product")).toBeInTheDocument();

    const featuresLink = screen.getByRole("link", { name: "Features" });
    const pricingLink = screen.getByRole("link", { name: "Pricing" });
    const docsLink = screen.getByRole("link", { name: "Documentation" });

    expect(featuresLink).toHaveAttribute("href", "/en/features");
    expect(pricingLink).toHaveAttribute("href", "/en/pricing");
    expect(docsLink).toHaveAttribute("href", "/en/docs");
  });

  it("renders company section with correct links", () => {
    render(<Footer />);

    expect(screen.getByText("Company")).toBeInTheDocument();

    const aboutLink = screen.getByRole("link", { name: "About" });
    const contactLink = screen.getByRole("link", { name: "Contact" });
    const careersLink = screen.getByRole("link", { name: "Careers" });

    expect(aboutLink).toHaveAttribute("href", "/en/about");
    expect(contactLink).toHaveAttribute("href", "/en/contact");
    expect(careersLink).toHaveAttribute("href", "/en/careers");
  });

  it("renders legal section with correct links", () => {
    render(<Footer />);

    expect(screen.getByText("Legal")).toBeInTheDocument();

    const privacyLink = screen.getByRole("link", { name: "Privacy Policy" });
    const termsLink = screen.getByRole("link", { name: "Terms of Service" });
    const cookiesLink = screen.getByRole("link", { name: "Cookie Policy" });

    expect(privacyLink).toHaveAttribute("href", "/en/privacy");
    expect(termsLink).toHaveAttribute("href", "/en/terms");
    expect(cookiesLink).toHaveAttribute("href", "/en/cookies");
  });

  it("displays current year in copyright", () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} NextApp. All rights reserved.`),
    ).toBeInTheDocument();
  });

  it("adapts links to different locales", () => {
    mockUseLocale.mockReturnValue("zh");

    render(<Footer />);

    const featuresLink = screen.getByRole("link", { name: "Features" });
    const aboutLink = screen.getByRole("link", { name: "About" });
    const privacyLink = screen.getByRole("link", { name: "Privacy Policy" });

    expect(featuresLink).toHaveAttribute("href", "/zh/features");
    expect(aboutLink).toHaveAttribute("href", "/zh/about");
    expect(privacyLink).toHaveAttribute("href", "/zh/privacy");
  });

  it("applies hover styles to links", () => {
    render(<Footer />);

    const featuresLink = screen.getByRole("link", { name: "Features" });
    expect(featuresLink).toHaveClass(
      "text-muted-foreground",
      "hover:text-primary",
    );
  });

  it("has proper semantic structure", () => {
    render(<Footer />);

    // Check for proper heading hierarchy
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings).toHaveLength(3); // Product, Company, Legal

    // Check for proper list structure
    const lists = screen.getAllByRole("list");
    expect(lists).toHaveLength(3); // One for each section

    // Check for proper list items
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(9); // 3 items per section
  });

  it("maintains responsive grid layout classes", () => {
    render(<Footer />);

    const gridContainer = screen
      .getByRole("contentinfo")
      .querySelector(".grid");
    expect(gridContainer).toHaveClass(
      "grid",
      "grid-cols-1",
      "md:grid-cols-4",
      "gap-8",
    );
  });

  it("uses correct translation keys", () => {
    const mockT = vi.fn((key: string) => key);
    mockUseTranslations.mockReturnValue(mockT as any);

    render(<Footer />);

    // Verify translation function was called with expected keys
    expect(mockT).toHaveBeenCalledWith("description");
    expect(mockT).toHaveBeenCalledWith("product");
    expect(mockT).toHaveBeenCalledWith("company");
    expect(mockT).toHaveBeenCalledWith("legal");
    expect(mockT).toHaveBeenCalledWith("features");
    expect(mockT).toHaveBeenCalledWith("privacy");
    expect(mockT).toHaveBeenCalledWith("rights");
  });
});
