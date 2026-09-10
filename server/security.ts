import type { Request, Response, NextFunction } from 'express';

// =========================================================
// 1. IN-MEMORY SLIDING-WINDOW RATE LIMITER
// Protects against DoS, brute-force password attacks & spam
// =========================================================

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

export function createRateLimiter(options: {
  windowMs: number;
  max: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
}) {
  const store = new Map<string, RateLimitRecord>();
  const { windowMs, max, message = 'Too many requests. Please wait a few moments and try again.' } = options;

  // Periodic cleanup of expired rate limit entries every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      if (record.resetTime <= now) {
        store.delete(key);
      }
    }
  }, Math.max(windowMs, 60000));

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
      req.socket.remoteAddress ||
      'unknown';
    
    const key = options.keyGenerator ? options.keyGenerator(req) : `${req.path}:${clientIp}`;

    const record = store.get(key);

    if (!record || record.resetTime <= now) {
      store.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= max) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfter.toString());
      res.status(429).json({
        error: message,
        retryAfterSeconds: retryAfter,
      });
      return;
    }

    record.count += 1;
    next();
  };
}

// =========================================================
// 2. SECURITY HEADERS & DEFENSES
// =========================================================

export function securityHeadersMiddleware(req: Request, res: Response, next: NextFunction) {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent Clickjacking (iframe embedding only from same origin)
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // XSS protection for older browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer policy: send origin only on cross-origin HTTPS
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Restrict unused browser APIs
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' 'unsafe-inline' data: blob: https:; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https:;"
  );

  next();
}

// =========================================================
// 3. INPUT SANITIZATION & VALIDATION HELPERS
// Prevents Stored XSS, Injection, and Malicious Payloads
// =========================================================

export function sanitizeString(val: unknown, maxLength = 2000): string {
  if (typeof val !== 'string') return '';
  
  // Trim and cap length to prevent buffer/memory exhaustion attacks
  let clean = val.trim().slice(0, maxLength);

  // Strip script tags and dangerous HTML event handlers
  clean = clean
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''); // strip invisible control characters

  return clean;
}

export function isValidEmail(email: unknown): boolean {
  if (typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length > 254) return false;
  // Standard RFC 5322 simplified email regex
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return regex.test(trimmed);
}

export function isValidIndianPhone(phone: unknown): boolean {
  if (typeof phone !== 'string') return false;
  // Normalize by removing spaces, dashes, +91, etc.
  const digits = phone.replace(/[\s\-\(\)\+]/g, '');
  const raw10 = digits.startsWith('91') && digits.length === 12 ? digits.slice(2) : digits;
  // Valid Indian mobile: starts with 6, 7, 8, or 9 and has exactly 10 digits
  return /^[6-9]\d{9}$/.test(raw10);
}

export function normalizePhone(phone: unknown): string {
  if (typeof phone !== 'string') return '';
  const digits = phone.replace(/[\s\-\(\)\+]/g, '');
  return digits.startsWith('91') && digits.length === 12 ? digits.slice(2) : digits;
}
