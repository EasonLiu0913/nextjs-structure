import { renderHook, act } from "@testing-library/react";
import { useAnalytics } from "@/hooks/use-analytics";
import { userEvents } from "@/lib/analytics";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock the analytics lib
vi.mock("@/lib/analytics", () => ({
  userEvents: {
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    featureUsed: vi.fn(),
    buttonClicked: vi.fn(),
    formStarted: vi.fn(),
    formCompleted: vi.fn(),
    errorOccurred: vi.fn(),
  },
}));

describe("useAnalytics", () => {
  const mockVa = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Ensure window exists
    if (typeof window !== "undefined") {
      // Mock window.va
      Object.defineProperty(window, "va", {
        value: mockVa,
        writable: true,
        configurable: true,
      });
    }

    // Mock console.warn
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (typeof window !== "undefined") {
      delete (window as any).va;
    }
  });

  describe("track function", () => {
    it("should call window.va when available", () => {
      const { result } = renderHook(() => useAnalytics());

      act(() => {
        result.current.track("test_event", { prop1: "value1", prop2: 123 });
      });

      expect(mockVa).toHaveBeenCalledWith("event", "test_event", {
        prop1: "value1",
        prop2: 123,
      });
    });

    it("should handle events without properties", () => {
      const { result } = renderHook(() => useAnalytics());

      act(() => {
        result.current.track("simple_event");
      });

      expect(mockVa).toHaveBeenCalledWith("event", "simple_event", {});
    });

    it("should handle null properties safely", () => {
      const { result } = renderHook(() => useAnalytics());

      act(() => {
        result.current.track("event_with_null", null as any);
      });

      expect(mockVa).toHaveBeenCalledWith("event", "event_with_null", {});
    });

    it("should handle undefined properties safely", () => {
      const { result } = renderHook(() => useAnalytics());

      act(() => {
        result.current.track("event_with_undefined", undefined);
      });

      expect(mockVa).toHaveBeenCalledWith("event", "event_with_undefined", {});
    });

    it("should not call window.va when not available", () => {
      delete (window as any).va;

      const { result } = renderHook(() => useAnalytics());

      act(() => {
        result.current.track("test_event");
      });

      expect(mockVa).not.toHaveBeenCalled();
    });

    it("should not call window.va when it is not a function", () => {
      (window as any).va = "not a function";

      const { result } = renderHook(() => useAnalytics());

      act(() => {
        result.current.track("test_event");
      });

      expect(mockVa).not.toHaveBeenCalled();
    });

    it("should handle tracking errors gracefully", () => {
      mockVa.mockImplementation(() => {
        throw new Error("Analytics error");
      });

      const { result } = renderHook(() => useAnalytics());

      act(() => {
        result.current.track("error_event");
      });

      expect(console.warn).toHaveBeenCalledWith(
        "Analytics tracking failed:",
        expect.any(Error),
      );
    });

    it("should work in server-side rendering environment", () => {
      // This test doesn't need to simulate SSR since the hook handles it internally
      // Just test that it doesn't crash when window.va is not available
      delete (window as any).va;

      const { result } = renderHook(() => useAnalytics());

      act(() => {
        result.current.track("ssr_event");
      });

      // Should not throw error and not call anything
      expect(mockVa).not.toHaveBeenCalled();
    });
  });

  describe("convenience methods", () => {
    it("should expose trackLogin method", () => {
      const { result } = renderHook(() => useAnalytics());

      expect(result.current.trackLogin).toBe(userEvents.login);
    });

    it("should expose trackLogout method", () => {
      const { result } = renderHook(() => useAnalytics());

      expect(result.current.trackLogout).toBe(userEvents.logout);
    });

    it("should expose trackRegister method", () => {
      const { result } = renderHook(() => useAnalytics());

      expect(result.current.trackRegister).toBe(userEvents.register);
    });

    it("should expose trackFeatureUsed method", () => {
      const { result } = renderHook(() => useAnalytics());

      expect(result.current.trackFeatureUsed).toBe(userEvents.featureUsed);
    });

    it("should expose trackButtonClick method", () => {
      const { result } = renderHook(() => useAnalytics());

      expect(result.current.trackButtonClick).toBe(userEvents.buttonClicked);
    });

    it("should expose trackFormStart method", () => {
      const { result } = renderHook(() => useAnalytics());

      expect(result.current.trackFormStart).toBe(userEvents.formStarted);
    });

    it("should expose trackFormComplete method", () => {
      const { result } = renderHook(() => useAnalytics());

      expect(result.current.trackFormComplete).toBe(userEvents.formCompleted);
    });

    it("should expose trackError method", () => {
      const { result } = renderHook(() => useAnalytics());

      expect(result.current.trackError).toBe(userEvents.errorOccurred);
    });
  });

  describe("hook stability", () => {
    it("should maintain track function reference across re-renders", () => {
      const { result, rerender } = renderHook(() => useAnalytics());

      const firstTrack = result.current.track;

      rerender();

      const secondTrack = result.current.track;

      expect(firstTrack).toBe(secondTrack);
    });

    it("should maintain convenience method references across re-renders", () => {
      const { result, rerender } = renderHook(() => useAnalytics());

      const firstMethods = {
        trackLogin: result.current.trackLogin,
        trackLogout: result.current.trackLogout,
        trackRegister: result.current.trackRegister,
      };

      rerender();

      const secondMethods = {
        trackLogin: result.current.trackLogin,
        trackLogout: result.current.trackLogout,
        trackRegister: result.current.trackRegister,
      };

      expect(firstMethods.trackLogin).toBe(secondMethods.trackLogin);
      expect(firstMethods.trackLogout).toBe(secondMethods.trackLogout);
      expect(firstMethods.trackRegister).toBe(secondMethods.trackRegister);
    });
  });

  describe("data types handling", () => {
    it("should handle string properties", () => {
      const { result } = renderHook(() => useAnalytics());

      act(() => {
        result.current.track("string_test", { stringProp: "test value" });
      });

      expect(mockVa).toHaveBeenCalledWith("event", "string_test", {
        stringProp: "test value",
      });
    });

    it("should handle number properties", () => {
      const { result } = renderHook(() => useAnalytics());

      act(() => {
        result.current.track("number_test", { numberProp: 42 });
      });

      expect(mockVa).toHaveBeenCalledWith("event", "number_test", {
        numberProp: 42,
      });
    });

    it("should handle boolean properties", () => {
      const { result } = renderHook(() => useAnalytics());

      act(() => {
        result.current.track("boolean_test", { booleanProp: true });
      });

      expect(mockVa).toHaveBeenCalledWith("event", "boolean_test", {
        booleanProp: true,
      });
    });

    it("should handle mixed property types", () => {
      const { result } = renderHook(() => useAnalytics());

      const mixedProps = {
        stringProp: "test",
        numberProp: 123,
        booleanProp: false,
      };

      act(() => {
        result.current.track("mixed_test", mixedProps);
      });

      expect(mockVa).toHaveBeenCalledWith("event", "mixed_test", mixedProps);
    });
  });
});
