import { cn, formatDate, sleep, debounce, throttle } from "@/lib/utils";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("Utils", () => {
  describe("cn (className utility)", () => {
    it("merges class names correctly", () => {
      const result = cn("px-2 py-1", "bg-red-500");
      expect(result).toBe("px-2 py-1 bg-red-500");
    });

    it("handles conditional classes", () => {
      const isActive = true;
      const result = cn("base-class", isActive && "active-class");
      expect(result).toBe("base-class active-class");
    });

    it("handles false conditional classes", () => {
      const isActive = false;
      const result = cn("base-class", isActive && "active-class");
      expect(result).toBe("base-class");
    });

    it("merges conflicting Tailwind classes correctly", () => {
      const result = cn("px-2 px-4"); // px-4 should override px-2
      expect(result).toBe("px-4");
    });

    it("handles arrays of classes", () => {
      const result = cn(["px-2", "py-1"], "bg-blue-500");
      expect(result).toBe("px-2 py-1 bg-blue-500");
    });

    it("handles objects with conditional classes", () => {
      const result = cn({
        "px-2": true,
        "py-1": true,
        "bg-red-500": false,
        "bg-blue-500": true,
      });
      expect(result).toBe("px-2 py-1 bg-blue-500");
    });

    it("handles undefined and null values", () => {
      const result = cn("px-2", undefined, null, "py-1");
      expect(result).toBe("px-2 py-1");
    });
  });

  describe("formatDate", () => {
    it("formats date correctly", () => {
      const date = new Date("2024-03-15");
      const result = formatDate(date);
      expect(result).toBe("March 15, 2024");
    });

    it("handles different dates", () => {
      const date = new Date("2023-12-25");
      const result = formatDate(date);
      expect(result).toBe("December 25, 2023");
    });

    it("handles leap year dates", () => {
      const date = new Date("2024-02-29");
      const result = formatDate(date);
      expect(result).toBe("February 29, 2024");
    });

    it("handles first day of year", () => {
      const date = new Date("2024-01-01");
      const result = formatDate(date);
      expect(result).toBe("January 1, 2024");
    });

    it("handles last day of year", () => {
      const date = new Date("2024-12-31");
      const result = formatDate(date);
      expect(result).toBe("December 31, 2024");
    });
  });

  describe("sleep", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("resolves after specified time", async () => {
      const promise = sleep(1000);

      // Fast-forward time
      vi.advanceTimersByTime(1000);

      await expect(promise).resolves.toBeUndefined();
    });

    it("does not resolve before specified time", async () => {
      const promise = sleep(1000);
      let resolved = false;

      promise.then(() => {
        resolved = true;
      });

      // Advance time by less than sleep duration
      vi.advanceTimersByTime(500);

      // Allow microtasks to run
      await Promise.resolve();

      expect(resolved).toBe(false);
    });

    it("works with zero milliseconds", async () => {
      const promise = sleep(0);
      vi.advanceTimersByTime(0);
      await expect(promise).resolves.toBeUndefined();
    });
  });

  describe("debounce", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("delays function execution", () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 1000);

      debouncedFn("test");
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1000);
      expect(mockFn).toHaveBeenCalledWith("test");
    });

    it("cancels previous calls when called multiple times", () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 1000);

      debouncedFn("first");
      vi.advanceTimersByTime(500);

      debouncedFn("second");
      vi.advanceTimersByTime(500);

      // First call should be cancelled, only second should execute
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(500);
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith("second");
    });

    it("preserves function arguments", () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 1000);

      debouncedFn("arg1", "arg2", 123);
      vi.advanceTimersByTime(1000);

      expect(mockFn).toHaveBeenCalledWith("arg1", "arg2", 123);
    });

    it("works with zero delay", () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 0);

      debouncedFn("test");
      vi.advanceTimersByTime(0);

      expect(mockFn).toHaveBeenCalledWith("test");
    });
  });

  describe("throttle", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("executes function immediately on first call", () => {
      const mockFn = vi.fn();
      const throttledFn = throttle(mockFn, 1000);

      throttledFn("test");
      expect(mockFn).toHaveBeenCalledWith("test");
    });

    it("ignores subsequent calls within throttle period", () => {
      const mockFn = vi.fn();
      const throttledFn = throttle(mockFn, 1000);

      throttledFn("first");
      throttledFn("second");
      throttledFn("third");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith("first");
    });

    it("allows execution after throttle period expires", () => {
      const mockFn = vi.fn();
      const throttledFn = throttle(mockFn, 1000);

      throttledFn("first");
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(1000);

      throttledFn("second");
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith("second");
    });

    it("preserves function arguments", () => {
      const mockFn = vi.fn();
      const throttledFn = throttle(mockFn, 1000);

      throttledFn("arg1", "arg2", 123);
      expect(mockFn).toHaveBeenCalledWith("arg1", "arg2", 123);
    });

    it("works with zero limit", () => {
      const mockFn = vi.fn();
      const throttledFn = throttle(mockFn, 0);

      throttledFn("first");
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(0);

      throttledFn("second");
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });
});
