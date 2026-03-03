import { describe, it, expect } from "vitest";
import {
  isValidDomain,
  sanitizeDomain,
  validateAndSanitizeDomain,
} from "./domain";

describe("isValidDomain", () => {
  it("accepts valid domains", () => {
    expect(isValidDomain("example.com")).toBe(true);
    expect(isValidDomain("sub.example.com")).toBe(true);
    expect(isValidDomain("my-site.co.uk")).toBe(true);
    expect(isValidDomain("a.io")).toBe(true);
    expect(isValidDomain("test123.org")).toBe(true);
  });

  it("rejects invalid domains", () => {
    expect(isValidDomain("")).toBe(false);
    expect(isValidDomain("   ")).toBe(false);
    expect(isValidDomain("not a domain")).toBe(false);
    expect(isValidDomain("http://example.com")).toBe(false);
    expect(isValidDomain(".com")).toBe(false);
    expect(isValidDomain("example.")).toBe(false);
    expect(isValidDomain("-example.com")).toBe(false);
    expect(isValidDomain("example-.com")).toBe(false);
    expect(isValidDomain("a".repeat(254) + ".com")).toBe(false);
  });

  it("rejects non-string inputs", () => {
    expect(isValidDomain(null as unknown as string)).toBe(false);
    expect(isValidDomain(undefined as unknown as string)).toBe(false);
    expect(isValidDomain(123 as unknown as string)).toBe(false);
  });
});

describe("sanitizeDomain", () => {
  it("strips protocol", () => {
    expect(sanitizeDomain("https://example.com")).toBe("example.com");
    expect(sanitizeDomain("http://example.com")).toBe("example.com");
  });

  it("strips www prefix", () => {
    expect(sanitizeDomain("www.example.com")).toBe("example.com");
  });

  it("strips trailing path", () => {
    expect(sanitizeDomain("example.com/page/about")).toBe("example.com");
  });

  it("strips port", () => {
    expect(sanitizeDomain("example.com:3000")).toBe("example.com");
  });

  it("lowercases and trims", () => {
    expect(sanitizeDomain("  Example.COM  ")).toBe("example.com");
  });

  it("handles full URL with everything", () => {
    expect(sanitizeDomain("https://www.Example.COM:443/path?q=1")).toBe(
      "example.com"
    );
  });
});

describe("validateAndSanitizeDomain", () => {
  it("returns sanitized domain for valid input", () => {
    const result = validateAndSanitizeDomain("https://www.example.com/page");
    expect(result).toEqual({ valid: true, domain: "example.com" });
  });

  it("returns error for empty input", () => {
    expect(validateAndSanitizeDomain("")).toEqual({
      valid: false,
      error: "Domain is required",
    });
    expect(validateAndSanitizeDomain("   ")).toEqual({
      valid: false,
      error: "Domain is required",
    });
  });

  it("returns error for invalid domain after sanitization", () => {
    const result = validateAndSanitizeDomain("not a domain!!!");
    expect(result).toEqual({ valid: false, error: "Invalid domain format" });
  });
});
