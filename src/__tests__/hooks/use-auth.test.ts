import { renderHook } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/stores/auth-store";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Session } from "next-auth";

// Mock dependencies
vi.mock("next-auth/react");
vi.mock("@/stores/auth-store");

const mockUseSession = vi.mocked(useSession);
const mockUseAuthStore = vi.mocked(useAuthStore);

describe("useAuth", () => {
  const mockSetUser = vi.fn();
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default auth store mock
    mockUseAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      setUser: mockSetUser,
      setLoading: vi.fn(),
      setError: vi.fn(),
      login: vi.fn(),
      logout: mockLogout,
      clearError: vi.fn(),
    });
  });

  describe("session synchronization", () => {
    it("should sync authenticated session with store", () => {
      const mockSession: Session = {
        user: {
          email: "test@example.com",
          name: "Test User",
          image: "https://example.com/avatar.jpg",
        } as any,
        expires: "2024-12-31",
      };

      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
        update: vi.fn(),
      } as any);

      renderHook(() => useAuth());

      expect(mockSetUser).toHaveBeenCalledWith({
        id: "",
        email: "test@example.com",
        name: "Test User",
        avatar: "https://example.com/avatar.jpg",
      });
    });

    it("should handle session without id", () => {
      const mockSession: Session = {
        user: {
          email: "test@example.com",
          name: "Test User",
        } as any,
        expires: "2024-12-31",
      };

      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
        update: vi.fn(),
      } as any);

      renderHook(() => useAuth());

      expect(mockSetUser).toHaveBeenCalledWith({
        id: "",
        email: "test@example.com",
        name: "Test User",
        avatar: undefined,
      });
    });

    it("should handle session without image", () => {
      const mockSession: Session = {
        user: {
          email: "test@example.com",
          name: "Test User",
        } as any,
        expires: "2024-12-31",
      };

      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
        update: vi.fn(),
      } as any);

      renderHook(() => useAuth());

      expect(mockSetUser).toHaveBeenCalledWith({
        id: "",
        email: "test@example.com",
        name: "Test User",
        avatar: undefined,
      });
    });

    it("should handle session with missing user data", () => {
      const mockSession: Session = {
        user: {} as any,
        expires: "2024-12-31",
      };

      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
        update: vi.fn(),
      } as any);

      renderHook(() => useAuth());

      expect(mockSetUser).toHaveBeenCalledWith({
        id: "",
        email: "",
        name: "",
        avatar: undefined,
      });
    });

    it("should logout when session is unauthenticated", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
        update: vi.fn(),
      } as any);

      renderHook(() => useAuth());

      expect(mockLogout).toHaveBeenCalled();
    });

    it("should not sync when session is loading", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "loading",
        update: vi.fn(),
      } as any);

      renderHook(() => useAuth());

      expect(mockSetUser).not.toHaveBeenCalled();
      expect(mockLogout).not.toHaveBeenCalled();
    });
  });

  describe("return values", () => {
    it("should return authenticated state when both session and store are authenticated", () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
      };

      mockUseSession.mockReturnValue({
        data: { user: mockUser, expires: "2024-12-31" },
        status: "authenticated",
        update: vi.fn(),
      } as any);

      mockUseAuthStore.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        setUser: mockSetUser,
        setLoading: vi.fn(),
        setError: vi.fn(),
        login: vi.fn(),
        logout: mockLogout,
        clearError: vi.fn(),
      });

      const { result } = renderHook(() => useAuth());

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.session).toEqual({
        user: mockUser,
        expires: "2024-12-31",
      });
    });

    it("should return unauthenticated state when session is unauthenticated", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
        update: vi.fn(),
      } as any);

      mockUseAuthStore.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        setUser: mockSetUser,
        setLoading: vi.fn(),
        setError: vi.fn(),
        login: vi.fn(),
        logout: mockLogout,
        clearError: vi.fn(),
      });

      const { result } = renderHook(() => useAuth());

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.session).toBeNull();
    });

    it("should return loading state when session is loading", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "loading",
        update: vi.fn(),
      } as any);

      mockUseAuthStore.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        setUser: mockSetUser,
        setLoading: vi.fn(),
        setError: vi.fn(),
        login: vi.fn(),
        logout: mockLogout,
        clearError: vi.fn(),
      });

      const { result } = renderHook(() => useAuth());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isAuthenticated).toBe(false);
    });

    it("should return false for isAuthenticated when session is authenticated but store is not", () => {
      mockUseSession.mockReturnValue({
        data: { user: {} as any, expires: "2024-12-31" },
        status: "authenticated",
        update: vi.fn(),
      } as any);

      mockUseAuthStore.mockReturnValue({
        user: null,
        isAuthenticated: false, // Store not authenticated
        isLoading: false,
        error: null,
        setUser: mockSetUser,
        setLoading: vi.fn(),
        setError: vi.fn(),
        login: vi.fn(),
        logout: mockLogout,
        clearError: vi.fn(),
      });

      const { result } = renderHook(() => useAuth());

      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe("effect dependencies", () => {
    it("should re-sync when session changes", () => {
      const mockSession1: Session = {
        user: { email: "user1@example.com", name: "User 1" } as any,
        expires: "2024-12-31",
      };

      const mockSession2: Session = {
        user: { email: "user2@example.com", name: "User 2" } as any,
        expires: "2024-12-31",
      };

      const { rerender } = renderHook(() => useAuth());

      // First session
      mockUseSession.mockReturnValue({
        data: mockSession1,
        status: "authenticated",
        update: vi.fn(),
      } as any);

      rerender();

      expect(mockSetUser).toHaveBeenCalledWith({
        id: "",
        email: "user1@example.com",
        name: "User 1",
        avatar: undefined,
      });

      // Second session
      mockUseSession.mockReturnValue({
        data: mockSession2,
        status: "authenticated",
        update: vi.fn(),
      } as any);

      rerender();

      expect(mockSetUser).toHaveBeenCalledWith({
        id: "",
        email: "user2@example.com",
        name: "User 2",
        avatar: undefined,
      });
    });

    it("should re-sync when status changes", () => {
      // Start with loading state
      mockUseSession.mockReturnValue({
        data: null,
        status: "loading",
        update: vi.fn(),
      } as any);

      const { rerender } = renderHook(() => useAuth());

      expect(mockSetUser).not.toHaveBeenCalled();
      expect(mockLogout).not.toHaveBeenCalled();

      // Change to unauthenticated state
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
        update: vi.fn(),
      } as any);

      rerender();

      expect(mockLogout).toHaveBeenCalled();
    });
  });
});
