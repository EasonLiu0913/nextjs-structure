import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import { describe, it, expect } from "vitest";

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: "Click me" }),
    ).toBeInTheDocument();
  });

  describe("Variant classes", () => {
    it("applies default variant classes", () => {
      render(<Button variant="default">Default Button</Button>);
      const button = screen.getByRole("button", { name: "Default Button" });
      expect(button).toHaveClass("bg-primary", "text-primary-foreground");
    });

    it("applies destructive variant classes", () => {
      render(<Button variant="destructive">Destructive Button</Button>);
      const button = screen.getByRole("button", { name: "Destructive Button" });
      expect(button).toHaveClass(
        "bg-destructive",
        "text-destructive-foreground",
      );
    });

    it("applies outline variant classes", () => {
      render(<Button variant="outline">Outline Button</Button>);
      const button = screen.getByRole("button", { name: "Outline Button" });
      expect(button).toHaveClass("border", "border-input", "bg-background");
    });

    it("applies secondary variant classes", () => {
      render(<Button variant="secondary">Secondary Button</Button>);
      const button = screen.getByRole("button", { name: "Secondary Button" });
      expect(button).toHaveClass("bg-secondary", "text-secondary-foreground");
    });

    it("applies ghost variant classes", () => {
      render(<Button variant="ghost">Ghost Button</Button>);
      const button = screen.getByRole("button", { name: "Ghost Button" });
      // Ghost variant only has hover classes, no default background
      expect(button).toHaveClass(
        "hover:bg-accent",
        "hover:text-accent-foreground",
      );
    });

    it("applies link variant classes", () => {
      render(<Button variant="link">Link Button</Button>);
      const button = screen.getByRole("button", { name: "Link Button" });
      expect(button).toHaveClass(
        "text-primary",
        "underline-offset-4",
        "hover:underline",
      );
    });
  });

  describe("Size classes", () => {
    it("applies default size classes", () => {
      render(<Button size="default">Default Size</Button>);
      const button = screen.getByRole("button", { name: "Default Size" });
      expect(button).toHaveClass("h-10", "px-4", "py-2");
    });

    it("applies small size classes", () => {
      render(<Button size="sm">Small Button</Button>);
      const button = screen.getByRole("button", { name: "Small Button" });
      expect(button).toHaveClass("h-9", "rounded-md", "px-3");
    });

    it("applies large size classes", () => {
      render(<Button size="lg">Large Button</Button>);
      const button = screen.getByRole("button", { name: "Large Button" });
      expect(button).toHaveClass("h-11", "rounded-md", "px-8");
    });

    it("applies icon size classes", () => {
      render(<Button size="icon">Icon</Button>);
      const button = screen.getByRole("button", { name: "Icon" });
      expect(button).toHaveClass("h-10", "w-10");
    });
  });

  describe("Combined variant and size", () => {
    it("applies both variant and size classes correctly", () => {
      render(
        <Button variant="destructive" size="lg">
          Large Destructive
        </Button>,
      );
      const button = screen.getByRole("button", { name: "Large Destructive" });

      // Variant classes
      expect(button).toHaveClass(
        "bg-destructive",
        "text-destructive-foreground",
      );
      // Size classes
      expect(button).toHaveClass("h-11", "rounded-md", "px-8");
    });

    it("applies ghost variant with small size", () => {
      render(
        <Button variant="ghost" size="sm">
          Small Ghost
        </Button>,
      );
      const button = screen.getByRole("button", { name: "Small Ghost" });

      // Variant classes
      expect(button).toHaveClass(
        "hover:bg-accent",
        "hover:text-accent-foreground",
      );
      // Size classes
      expect(button).toHaveClass("h-9", "rounded-md", "px-3");
    });

    it("applies outline variant with icon size", () => {
      render(
        <Button variant="outline" size="icon">
          ⚙️
        </Button>,
      );
      const button = screen.getByRole("button", { name: "⚙️" });

      // Variant classes
      expect(button).toHaveClass("border", "border-input", "bg-background");
      // Size classes
      expect(button).toHaveClass("h-10", "w-10");
    });
  });

  describe("Base classes", () => {
    it("always applies base classes regardless of variant and size", () => {
      render(
        <Button variant="ghost" size="sm">
          Test
        </Button>,
      );
      const button = screen.getByRole("button", { name: "Test" });

      // Base classes that should always be present
      expect(button).toHaveClass(
        "inline-flex",
        "items-center",
        "justify-center",
        "whitespace-nowrap",
        "rounded-md",
        "text-sm",
        "font-medium",
        "ring-offset-background",
        "transition-colors",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-ring",
        "focus-visible:ring-offset-2",
        "disabled:pointer-events-none",
        "disabled:opacity-50",
      );
    });
  });

  describe("States", () => {
    it("can be disabled", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button", { name: "Disabled" });
      expect(button).toBeDisabled();
      expect(button).toHaveClass(
        "disabled:pointer-events-none",
        "disabled:opacity-50",
      );
    });

    it("maintains variant classes when disabled", () => {
      render(
        <Button variant="destructive" disabled>
          Disabled Destructive
        </Button>,
      );
      const button = screen.getByRole("button", {
        name: "Disabled Destructive",
      });
      expect(button).toBeDisabled();
      expect(button).toHaveClass(
        "bg-destructive",
        "text-destructive-foreground",
      );
    });
  });

  describe("Custom className", () => {
    it("merges custom className with variant classes", () => {
      render(
        <Button variant="outline" className="custom-class">
          Custom
        </Button>,
      );
      const button = screen.getByRole("button", { name: "Custom" });

      // Should have both custom and variant classes
      expect(button).toHaveClass("custom-class");
      expect(button).toHaveClass("border", "border-input", "bg-background");
    });
  });

  describe("asChild prop", () => {
    it("renders as child element when asChild is true", () => {
      render(
        <Button asChild>
          <span role="link">Link Button</span>
        </Button>,
      );

      const link = screen.getByRole("link", { name: "Link Button" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveClass("inline-flex", "items-center", "justify-center");
    });
  });
});
