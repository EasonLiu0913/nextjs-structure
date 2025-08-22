import { renderHook, act } from "@testing-library/react";
import { useToast, toast, reducer } from "@/hooks/use-toast";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock the toast UI component types
vi.mock("@/components/ui/toast", () => ({
  ToastProps: {},
  ToastActionElement: {},
}));

describe("useToast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllTimers();
  });

  describe("useToast hook", () => {
    it("should initialize with empty toasts", () => {
      const { result } = renderHook(() => useToast());

      expect(result.current.toasts).toEqual([]);
    });

    it("should add a toast", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({
          title: "Test Toast",
          description: "This is a test toast",
        });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe("Test Toast");
      expect(result.current.toasts[0].description).toBe("This is a test toast");
      expect(result.current.toasts[0].open).toBe(true);
    });

    it("should limit toasts to TOAST_LIMIT", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: "Toast 1" });
        result.current.toast({ title: "Toast 2" });
        result.current.toast({ title: "Toast 3" });
      });

      // Should only keep the latest toast (TOAST_LIMIT = 1)
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe("Toast 3");
    });

    it("should dismiss a specific toast", () => {
      const { result } = renderHook(() => useToast());

      let toastId: string;

      act(() => {
        const toastResult = result.current.toast({
          title: "Test Toast",
        });
        toastId = toastResult.id;
      });

      expect(result.current.toasts[0].open).toBe(true);

      act(() => {
        result.current.dismiss(toastId);
      });

      expect(result.current.toasts[0].open).toBe(false);
    });

    it("should dismiss all toasts when no id provided", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: "Toast 1" });
      });

      expect(result.current.toasts[0].open).toBe(true);

      act(() => {
        result.current.dismiss();
      });

      expect(result.current.toasts[0].open).toBe(false);
    });
  });

  describe("toast function", () => {
    it("should return toast control methods", () => {
      let toastResult: ReturnType<typeof toast>;

      act(() => {
        toastResult = toast({ title: "Test" });
      });

      expect(toastResult!).toHaveProperty("id");
      expect(toastResult!).toHaveProperty("dismiss");
      expect(toastResult!).toHaveProperty("update");
      expect(typeof toastResult!.dismiss).toBe("function");
      expect(typeof toastResult!.update).toBe("function");
    });

    it("should generate unique ids", () => {
      let toast1: ReturnType<typeof toast>;
      let toast2: ReturnType<typeof toast>;

      act(() => {
        toast1 = toast({ title: "Toast 1" });
        toast2 = toast({ title: "Toast 2" });
      });

      expect(toast1!.id).not.toBe(toast2!.id);
    });

    it("should allow updating toast", () => {
      const { result } = renderHook(() => useToast());

      let toastResult: ReturnType<typeof toast>;

      act(() => {
        toastResult = toast({ title: "Original Title" });
      });

      act(() => {
        toastResult!.update({
          id: toastResult!.id,
          title: "Updated Title",
          description: "New description",
        });
      });

      expect(result.current.toasts[0].title).toBe("Updated Title");
      expect(result.current.toasts[0].description).toBe("New description");
    });

    it("should dismiss toast using returned dismiss method", () => {
      const { result } = renderHook(() => useToast());

      let toastResult: ReturnType<typeof toast>;

      act(() => {
        toastResult = toast({ title: "Test Toast" });
      });

      expect(result.current.toasts[0].open).toBe(true);

      act(() => {
        toastResult!.dismiss();
      });

      expect(result.current.toasts[0].open).toBe(false);
    });
  });

  describe("reducer", () => {
    const initialState = { toasts: [] };

    it("should add toast", () => {
      const toast = {
        id: "1",
        title: "Test Toast",
        open: true,
      };

      const action = {
        type: "ADD_TOAST" as const,
        toast,
      };

      const newState = reducer(initialState, action);

      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0]).toEqual(toast);
    });

    it("should update existing toast", () => {
      const existingToast = {
        id: "1",
        title: "Original Title",
        open: true,
      };

      const state = { toasts: [existingToast] };

      const action = {
        type: "UPDATE_TOAST" as const,
        toast: {
          id: "1",
          title: "Updated Title",
        },
      };

      const newState = reducer(state, action);

      expect(newState.toasts[0].title).toBe("Updated Title");
      expect(newState.toasts[0].open).toBe(true); // Should preserve other properties
    });

    it("should dismiss specific toast", () => {
      const toast1 = { id: "1", title: "Toast 1", open: true };
      const toast2 = { id: "2", title: "Toast 2", open: true };

      const state = { toasts: [toast1, toast2] };

      const action = {
        type: "DISMISS_TOAST" as const,
        toastId: "1",
      };

      const newState = reducer(state, action);

      expect(newState.toasts[0].open).toBe(false);
      expect(newState.toasts[1].open).toBe(true);
    });

    it("should dismiss all toasts when no toastId provided", () => {
      const toast1 = { id: "1", title: "Toast 1", open: true };
      const toast2 = { id: "2", title: "Toast 2", open: true };

      const state = { toasts: [toast1, toast2] };

      const action = {
        type: "DISMISS_TOAST" as const,
      };

      const newState = reducer(state, action);

      expect(newState.toasts[0].open).toBe(false);
      expect(newState.toasts[1].open).toBe(false);
    });

    it("should remove specific toast", () => {
      const toast1 = { id: "1", title: "Toast 1", open: true };
      const toast2 = { id: "2", title: "Toast 2", open: true };

      const state = { toasts: [toast1, toast2] };

      const action = {
        type: "REMOVE_TOAST" as const,
        toastId: "1",
      };

      const newState = reducer(state, action);

      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0].id).toBe("2");
    });

    it("should remove all toasts when no toastId provided", () => {
      const toast1 = { id: "1", title: "Toast 1", open: true };
      const toast2 = { id: "2", title: "Toast 2", open: true };

      const state = { toasts: [toast1, toast2] };

      const action = {
        type: "REMOVE_TOAST" as const,
      };

      const newState = reducer(state, action);

      expect(newState.toasts).toHaveLength(0);
    });
  });
});
