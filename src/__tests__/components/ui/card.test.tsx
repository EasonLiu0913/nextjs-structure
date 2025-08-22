import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { describe, it, expect } from "vitest";

describe("Card Components", () => {
  describe("Card", () => {
    it("renders correctly with default classes", () => {
      render(<Card data-testid="card">Card content</Card>);

      const card = screen.getByTestId("card");
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass(
        "rounded-lg",
        "border",
        "bg-card",
        "text-card-foreground",
        "shadow-sm",
      );
    });

    it("applies custom className", () => {
      render(
        <Card className="custom-class" data-testid="card">
          Card content
        </Card>,
      );

      const card = screen.getByTestId("card");
      expect(card).toHaveClass("custom-class");
      expect(card).toHaveClass("rounded-lg"); // Should still have default classes
    });

    it("forwards ref correctly", () => {
      const ref = { current: null };
      render(
        <Card ref={ref} data-testid="card">
          Card content
        </Card>,
      );

      expect(ref.current).toBeTruthy();
    });
  });

  describe("CardHeader", () => {
    it("renders with correct default classes", () => {
      render(<CardHeader data-testid="card-header">Header content</CardHeader>);

      const header = screen.getByTestId("card-header");
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass("flex", "flex-col", "space-y-1.5", "p-6");
    });

    it("applies custom className", () => {
      render(
        <CardHeader className="custom-header" data-testid="card-header">
          Header
        </CardHeader>,
      );

      const header = screen.getByTestId("card-header");
      expect(header).toHaveClass("custom-header");
      expect(header).toHaveClass("flex", "flex-col"); // Should still have default classes
    });
  });

  describe("CardTitle", () => {
    it("renders as h3 element with correct classes", () => {
      render(<CardTitle>Card Title</CardTitle>);

      const title = screen.getByRole("heading", { level: 3 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent("Card Title");
      expect(title).toHaveClass(
        "text-2xl",
        "font-semibold",
        "leading-none",
        "tracking-tight",
      );
    });

    it("applies custom className", () => {
      render(<CardTitle className="custom-title">Title</CardTitle>);

      const title = screen.getByRole("heading", { level: 3 });
      expect(title).toHaveClass("custom-title");
      expect(title).toHaveClass("text-2xl"); // Should still have default classes
    });
  });

  describe("CardDescription", () => {
    it("renders as paragraph with correct classes", () => {
      render(<CardDescription>Card description text</CardDescription>);

      const description = screen.getByText("Card description text");
      expect(description).toBeInTheDocument();
      expect(description.tagName).toBe("P");
      expect(description).toHaveClass("text-sm", "text-muted-foreground");
    });

    it("applies custom className", () => {
      render(
        <CardDescription className="custom-desc">Description</CardDescription>,
      );

      const description = screen.getByText("Description");
      expect(description).toHaveClass("custom-desc");
      expect(description).toHaveClass("text-sm"); // Should still have default classes
    });
  });

  describe("CardContent", () => {
    it("renders with correct default classes", () => {
      render(
        <CardContent data-testid="card-content">Content here</CardContent>,
      );

      const content = screen.getByTestId("card-content");
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass("p-6", "pt-0");
    });

    it("applies custom className", () => {
      render(
        <CardContent className="custom-content" data-testid="card-content">
          Content
        </CardContent>,
      );

      const content = screen.getByTestId("card-content");
      expect(content).toHaveClass("custom-content");
      expect(content).toHaveClass("p-6"); // Should still have default classes
    });
  });

  describe("CardFooter", () => {
    it("renders with correct default classes", () => {
      render(<CardFooter data-testid="card-footer">Footer content</CardFooter>);

      const footer = screen.getByTestId("card-footer");
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass("flex", "items-center", "p-6", "pt-0");
    });

    it("applies custom className", () => {
      render(
        <CardFooter className="custom-footer" data-testid="card-footer">
          Footer
        </CardFooter>,
      );

      const footer = screen.getByTestId("card-footer");
      expect(footer).toHaveClass("custom-footer");
      expect(footer).toHaveClass("flex", "items-center"); // Should still have default classes
    });
  });

  describe("Complete Card Structure", () => {
    it("renders a complete card with all components", () => {
      render(
        <Card data-testid="complete-card">
          <CardHeader>
            <CardTitle>Test Card Title</CardTitle>
            <CardDescription>This is a test card description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is the main content of the card.</p>
          </CardContent>
          <CardFooter>
            <button>Action Button</button>
          </CardFooter>
        </Card>,
      );

      // Check all parts are rendered
      expect(screen.getByTestId("complete-card")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
        "Test Card Title",
      );
      expect(
        screen.getByText("This is a test card description"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("This is the main content of the card."),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Action Button" }),
      ).toBeInTheDocument();
    });

    it("maintains proper semantic structure", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Semantic Test</CardTitle>
            <CardDescription>Testing semantic structure</CardDescription>
          </CardHeader>
          <CardContent>Content area</CardContent>
          <CardFooter>Footer area</CardFooter>
        </Card>,
      );

      const card = screen.getByText("Semantic Test").closest("div");
      const title = screen.getByRole("heading", { level: 3 });
      const description = screen.getByText("Testing semantic structure");

      expect(card).toContainElement(title);
      expect(card).toContainElement(description);
      expect(description.tagName).toBe("P");
    });
  });
});
