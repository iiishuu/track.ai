const DOMAIN_REGEX =
  /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

const MAX_DOMAIN_LENGTH = 253;

export function isValidDomain(input: string): boolean {
  if (!input || typeof input !== "string") return false;

  const trimmed = input.trim().toLowerCase();
  if (trimmed.length === 0 || trimmed.length > MAX_DOMAIN_LENGTH) return false;

  return DOMAIN_REGEX.test(trimmed);
}

export function sanitizeDomain(input: string): string {
  let domain = input.trim().toLowerCase();

  // Strip protocol
  domain = domain.replace(/^https?:\/\//, "");

  // Strip www.
  domain = domain.replace(/^www\./, "");

  // Strip trailing slash and path
  domain = domain.split("/")[0];

  // Strip port
  domain = domain.split(":")[0];

  return domain;
}

export function validateAndSanitizeDomain(
  input: string
): { valid: true; domain: string } | { valid: false; error: string } {
  if (!input || typeof input !== "string" || input.trim().length === 0) {
    return { valid: false, error: "Domain is required" };
  }

  const domain = sanitizeDomain(input);

  if (!isValidDomain(domain)) {
    return { valid: false, error: "Invalid domain format" };
  }

  return { valid: true, domain };
}
