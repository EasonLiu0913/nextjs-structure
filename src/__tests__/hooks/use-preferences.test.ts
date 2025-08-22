import { renderHook, act } from "@testing-library/react";
import { useRouter, usePathname } from "next/navigation";
import { usePreferences } from "@/hooks/use-preferences";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { UserPreferencesInput } from "@/schemas/settings-schema";

// Mock Next.js navigation hooks
vi.mock("next/navigation");

const mockPush = vi.fn();
const mockUseRouter = vi.mocked(useRouter);
const mockUsePathname = vi.mocked(usePathname);

// Mock DOM APIs
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

const mockMatchMedia = vi.fn();

describe("usePreferences", () => {
  beforeEach(() => {
    // Reset mocks
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

    // Mock pathname
    mockUsePathname.mockReturnValue("/en/dashboard");

    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
      writable: true,
    });

    // Mock matchMedia
    Object.defineProperty(window, "matchMedia", {
      value: mockMatchMedia,
      writable: true,
    });

    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    // Mock document.documentElement
    const mockClassList = {
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn(),
      toggle: vi.fn(),
    };

    Object.defineProperty(document, "documentElement", {
      value: {
        classList: mockClassList,
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("applyLanguageChange", () => {
    it("should navigate to new language path when language differs", () => {
      mockUsePathname.mockReturnValue("/en/dashboard");
      const { result } = renderHook(() => usePreferences());

      act(() => {
        result.current.applyLanguageChange("zh");
      });

      expect(mockPush).toHaveBeenCalledWith("/zh/dashboard");
    });

    it("should not navigate when language is the same", () => {
      mockUsePathname.mockReturnValue("/en/dashboard");
      const { result } = renderHook(() => usePreferences());

      act(() => {
        result.current.applyLanguageChange("en");
      });

      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should handle root path correctly", () => {
      mockUsePathname.mockReturnValue("/en");
      const { result } = renderHook(() => usePreferences());

      act(() => {
        result.current.applyLanguageChange("zh");
      });

      expect(mockPush).toHaveBeenCalledWith("/zh");
    });

    it("should handle nested paths correctly", () => {
      mockUsePathname.mockReturnValue("/en/settings/profile");
      const { result } = renderHook(() => usePreferences());

      act(() => {
        result.current.applyLanguageChange("zh");
      });

      expect(mockPush).toHaveBeenCalledWith("/zh/settings/profile");
    });
  });

  describe("applyThemeChange", () => {
    it("should apply light theme", () => {
      const { result } = renderHook(() => usePreferences());

      act(() => {
        result.current.applyThemeChange("light");
      });

      expect(document.documentElement.classList.remove).toHaveBeenCalledWith(
        "light",
        "dark",
      );
      expect(document.documentElement.classList.add).toHaveBeenCalledWith(
        "light",
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith("theme", "light");
    });

    it("should apply dark theme", () => {
      const { result } = renderHook(() => usePreferences());

      act(() => {
        result.current.applyThemeChange("dark");
      });

      expect(document.documentElement.classList.remove).toHaveBeenCalledWith(
        "light",
        "dark",
      );
      expect(document.documentElement.classList.add).toHaveBeenCalledWith(
        "dark",
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith("theme", "dark");
    });

    it("should apply system theme with light preference", () => {
      mockMatchMedia.mockReturnValue({
        matches: false, // light theme
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      const { result } = renderHook(() => usePreferences());

      act(() => {
        result.current.applyThemeChange("system");
      });

      expect(document.documentElement.classList.remove).toHaveBeenCalledWith(
        "light",
        "dark",
      );
      expect(document.documentElement.classList.add).toHaveBeenCalledWith(
        "light",
      );
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("theme");
    });

    it("should apply system theme with dark preference", () => {
      mockMatchMedia.mockReturnValue({
        matches: true, // dark theme
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      const { result } = renderHook(() => usePreferences());

      act(() => {
        result.current.applyThemeChange("system");
      });

      expect(document.documentElement.classList.remove).toHaveBeenCalledWith(
        "light",
        "dark",
      );
      expect(document.documentElement.classList.add).toHaveBeenCalledWith(
        "dark",
      );
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("theme");
    });
  });

  describe("applyTimezoneChange", () => {
    it("should store timezone in localStorage", () => {
      const { result } = renderHook(() => usePreferences());

      act(() => {
        result.current.applyTimezoneChange("Asia/Tokyo");
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "timezone",
        "Asia/Tokyo",
      );
    });
  });

  describe("applyPreferences", () => {
    it("should apply all preferences correctly", () => {
      const { result } = renderHook(() => usePreferences());

      const preferences: UserPreferencesInput = {
        language: "zh",
        theme: "dark",
        timezone: "Asia/Tokyo",
        emailNotifications: true,
        pushNotifications: false,
        marketingEmails: true,
        profilePublic: false,
        showEmail: true,
        allowMessages: false,
      };

      act(() => {
        result.current.applyPreferences(preferences);
      });

      // Should apply language change
      expect(mockPush).toHaveBeenCalledWith("/zh/dashboard");

      // Should apply theme change
      expect(document.documentElement.classList.add).toHaveBeenCalledWith(
        "dark",
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith("theme", "dark");

      // Should apply timezone change
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "timezone",
        "Asia/Tokyo",
      );

      // Should store all boolean preferences
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "emailNotifications",
        "true",
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "pushNotifications",
        "false",
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "marketingEmails",
        "true",
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "profilePublic",
        "false",
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "showEmail",
        "true",
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "allowMessages",
        "false",
      );
    });

    it("should handle partial preferences", () => {
      const { result } = renderHook(() => usePreferences());

      const partialPreferences = {
        theme: "light",
        emailNotifications: false,
        pushNotifications: true,
        marketingEmails: false,
        profilePublic: true,
        showEmail: false,
        allowMessages: true,
      } as UserPreferencesInput;

      act(() => {
        result.current.applyPreferences(partialPreferences);
      });

      // Should not change language (no language provided)
      expect(mockPush).not.toHaveBeenCalled();

      // Should apply theme change
      expect(document.documentElement.classList.add).toHaveBeenCalledWith(
        "light",
      );

      // Should store boolean preferences
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "emailNotifications",
        "false",
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "pushNotifications",
        "true",
      );
    });
  });

  describe("theme initialization on mount", () => {
    it("should apply saved theme from localStorage", () => {
      mockLocalStorage.getItem.mockReturnValue("dark");

      renderHook(() => usePreferences());

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("theme");
      expect(document.documentElement.classList.add).toHaveBeenCalledWith(
        "dark",
      );
    });

    it("should apply system theme when no saved theme", () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      mockMatchMedia.mockReturnValue({
        matches: true, // dark system preference
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      renderHook(() => usePreferences());

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("theme");
      expect(document.documentElement.classList.add).toHaveBeenCalledWith(
        "dark",
      );
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("theme");
    });
  });

  describe("hook return values", () => {
    it("should return all expected functions", () => {
      const { result } = renderHook(() => usePreferences());

      expect(result.current).toHaveProperty("applyLanguageChange");
      expect(result.current).toHaveProperty("applyThemeChange");
      expect(result.current).toHaveProperty("applyTimezoneChange");
      expect(result.current).toHaveProperty("applyPreferences");

      expect(typeof result.current.applyLanguageChange).toBe("function");
      expect(typeof result.current.applyThemeChange).toBe("function");
      expect(typeof result.current.applyTimezoneChange).toBe("function");
      expect(typeof result.current.applyPreferences).toBe("function");
    });
  });
});
