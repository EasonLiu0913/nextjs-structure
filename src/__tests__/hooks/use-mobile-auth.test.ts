import { renderHook, act } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMobileAuth, getBrowserInfo } from "@/hooks/use-mobile-auth";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Session } from "next-auth";

// Mock dependencies
vi.mock("next-auth/react");
vi.mock("next/navigation");

const mockUseSession = vi.mocked(useSession);
const mockUseRouter = vi.mocked(useRouter);
const mockPush = vi.fn();

describe("useMobileAuth", () => {
  const originalLocation = window.location;
  const originalNavigator = window.navigator;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock router
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    } as any);

    // Mock window.location
    delete (window as any).location;
    window.location = {
      ...originalLocation,
      href: "",
      reload: vi.fn(),
    } as any;

    // Mock navigator
    Object.defineProperty(window, "navigator", {
      value: {
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      writable: true,
    });

    // Mock window dimensions
    Object.defineProperty(window, "innerWidth", {
      value: 1024,
      writable: true,
    });

    // Mock addEventListener/removeEventListener
    vi.spyOn(window, "addEventListener");
    vi.spyOn(window, "removeEventListener");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
    });
    Object.defineProperty(window, "navigator", {
      value: originalNavigator,
      writable: true,
    });
  });

  describe("mobile detection", () => {
    it("should detect mobile device by user agent", () => {
      Object.defineProperty(window, "navigator", {
        value: {
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
        },
        writable: true,
      });

      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
        update: vi.fn(),
      } as any);

      const { result } = renderHook(() => useMobileAuth());

      expect(result.current.isMobile).toBe(true);
    });

    it("should detect mobile by viewport width", () => {
      Object.defineProperty(window, "innerWidth", {
        value: 600,
        writable: true,
      });

      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
        update: vi.fn(),
      } as any);

      const { result } = renderHook(() => useMobileAuth());

      expect(result.current.isMobile).toBe(true);
    });

    it("should detect desktop device", () => {
      Object.defineProperty(window, "navigator", {
        value: { userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
        writable: true,
      });

      Object.defineProperty(window, "innerWidth", {
        value: 1024,
        writable: true,
      });

      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
        update: vi.fn(),
      } as any);

      const { result } = renderHook(() => useMobileAuth());

      expect(result.current.isMobile).toBe(false);
    });

    it("should listen to window resize events", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
        update: vi.fn(),
      } as any);

      renderHook(() => useMobileAuth());

      expect(window.addEventListener).toHaveBeenCalledWith(
        "resize",
        expect.any(Function),
      );
    });

    it("should cleanup resize listener on unmount", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
        update: vi.fn(),
      } as any);

      const { unmount } = renderHook(() => useMobileAuth());

      unmount();

      expect(window.removeEventListener).toHaveBeenCalledWith(
        "resize",
        expect.any(Function),
      );
    });
  });

  describe("authentication handling", () => {
    it("should redirect to login when requireAuth is true and unauthenticated", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
        update: vi.fn(),
      } as any);

      renderHook(() => useMobileAuth({ requireAuth: true }));

      expect(mockPush).toHaveBeenCalledWith("/en/login");
    });

    it("should not redirect when requireAuth is false", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
        update: vi.fn(),
      } as any);

      renderHook(() => useMobileAuth({ requireAuth: false }));

      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should not redirect when status is loading", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "loading",
        update: vi.fn(),
      } as any);

      renderHook(() => useMobileAuth({ requireAuth: true }));

      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should handle mobile redirect after authentication", async () => {
      vi.useFakeTimers();

      // Set mobile device
      Object.defineProperty(window, "navigator", {
        value: {
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
        },
        writable: true,
      });

      const mockSession: Session = {
        user: { email: "test@example.com", name: "Test User" } as any,
        expires: "2024-12-31",
      };

      // Start with unauthenticated
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
        update: vi.fn(),
      } as any);

      const { result, rerender } = renderHook(() => useMobileAuth());

      // Simulate auth attempt
      act(() => {
        result.current.handleMobileRedirect("/en/login");
      });

      expect(result.current.authAttempts).toBe(1);

      // Change to authenticated
      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
        update: vi.fn(),
      } as any);

      rerender();

      // Fast forward timer
      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(window.location.href).toBe("/en/dashboard");

      vi.useRealTimers();
    });
  });

  describe("handleMobileRedirect", () => {
    it("should use window.location.href for mobile devices", () => {
      Object.defineProperty(window, "navigator", {
        value: {
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
        },
        writable: true,
      });

      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
        update: vi.fn(),
      } as any);

      const { result } = renderHook(() => useMobileAuth());

      act(() => {
        result.current.handleMobileRedirect("/en/login");
      });

      expect(window.location.href).toBe("/en/login");
      expect(result.current.authAttempts).toBe(1);
    });

    it("should use router.push for desktop devices", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
        update: vi.fn(),
      } as any);

      const { result } = renderHook(() => useMobileAuth());

      act(() => {
        result.current.handleMobileRedirect("/en/login");
      });

      expect(mockPush).toHaveBeenCalledWith("/en/login");
      expect(result.current.authAttempts).toBe(1);
    });
  });

  describe("retryAuthentication", () => {
    it("should reload page for mobile devices", () => {
      Object.defineProperty(window, "navigator", {
        value: {
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
        },
        writable: true,
      });

      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
        update: vi.fn(),
      } as any);

      const { result } = renderHook(() => useMobileAuth());

      act(() => {
        result.current.retryAuthentication();
      });

      expect(window.location.reload).toHaveBeenCalled();
      expect(result.current.authAttempts).toBe(1);
    });

    it("should navigate to login for desktop devices", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
        update: vi.fn(),
      } as any);

      const { result } = renderHook(() => useMobileAuth());

      act(() => {
        result.current.retryAuthentication();
      });

      expect(mockPush).toHaveBeenCalledWith("/en/login");
      expect(result.current.authAttempts).toBe(1);
    });
  });

  describe("return values", () => {
    it("should return correct authentication state", () => {
      const mockSession: Session = {
        user: { email: "test@example.com", name: "Test User" } as any,
        expires: "2024-12-31",
      };

      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
        update: vi.fn(),
      } as any);

      const { result } = renderHook(() => useMobileAuth());

      expect(result.current.session).toEqual(mockSession);
      expect(result.current.status).toBe("authenticated");
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.authAttempts).toBe(0);
    });

    it("should return loading state", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "loading",
        update: vi.fn(),
      } as any);

      const { result } = renderHook(() => useMobileAuth());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe("options handling", () => {
    it("should use custom redirectTo option", async () => {
      vi.useFakeTimers();

      Object.defineProperty(window, "navigator", {
        value: {
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
        },
        writable: true,
      });

      const mockSession: Session = {
        user: { email: "test@example.com", name: "Test User" } as any,
        expires: "2024-12-31",
      };

      // Start with unauthenticated
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
        update: vi.fn(),
      } as any);

      const { result, rerender } = renderHook(() =>
        useMobileAuth({ redirectTo: "/custom/path" }),
      );

      // Simulate auth attempt
      act(() => {
        result.current.handleMobileRedirect("/en/login");
      });

      // Change to authenticated
      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
        update: vi.fn(),
      } as any);

      rerender();

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(window.location.href).toBe("/custom/path");

      vi.useRealTimers();
    });
  });
});

describe("getBrowserInfo", () => {
  const originalNavigator = window.navigator;

  afterEach(() => {
    window.navigator = originalNavigator;
  });

  it("should detect iPhone", () => {
    Object.defineProperty(window, "navigator", {
      value: {
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
      },
      writable: true,
    });

    const info = getBrowserInfo();

    expect(info.isMobile).toBe(true);
    expect(info.isSafari).toBe(true);
    expect(info.isMobileSafari).toBe(true);
    expect(info.browser).toBe("mobile-safari");
  });

  it("should detect Android", () => {
    Object.defineProperty(window, "navigator", {
      value: {
        userAgent:
          "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36",
      },
      writable: true,
    });

    const info = getBrowserInfo();

    expect(info.isMobile).toBe(true);
    expect(info.isSafari).toBe(false);
    expect(info.isMobileSafari).toBe(false);
    expect(info.browser).toBe("other");
  });

  it("should detect desktop Safari", () => {
    Object.defineProperty(window, "navigator", {
      value: {
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
      },
      writable: true,
    });

    const info = getBrowserInfo();

    expect(info.isMobile).toBe(false);
    expect(info.isSafari).toBe(true);
    expect(info.isMobileSafari).toBe(false);
    expect(info.browser).toBe("safari");
  });

  it("should detect desktop Chrome", () => {
    Object.defineProperty(window, "navigator", {
      value: {
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      writable: true,
    });

    const info = getBrowserInfo();

    expect(info.isMobile).toBe(false);
    expect(info.isSafari).toBe(false);
    expect(info.isMobileSafari).toBe(false);
    expect(info.browser).toBe("other");
  });

  it("should handle server-side rendering", () => {
    const originalWindow = global.window;
    delete (global as any).window;

    const info = getBrowserInfo();

    expect(info.isMobile).toBe(false);
    expect(info.browser).toBe("unknown");

    global.window = originalWindow;
  });
});
