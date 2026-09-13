import crypto from 'crypto';
import firebaseConfig from '../firebase-applet-config.json';

const PROJECT_ID = firebaseConfig.projectId;
const ISSUER = `https://securetoken.google.com/${PROJECT_ID}`;
const CERTS_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

interface CertCache {
  certs: Record<string, string>;
  fetchedAt: number;
}

let certCache: CertCache | null = null;
const CERT_TTL_MS = 60 * 60 * 1000; // 1 hour

async function getCert(kid: string): Promise<string | null> {
  const now = Date.now();
  if (!certCache || now - certCache.fetchedAt > CERT_TTL_MS) {
    const res = await fetch(CERTS_URL);
    if (!res.ok) {
      throw new Error('Unable to fetch Firebase signing certificates');
    }
    const certs = (await res.json()) as Record<string, string>;
    certCache = { certs, fetchedAt: now };
  }
  return certCache.certs[kid] || null;
}

function base64UrlDecode(input: string): Buffer {
  return Buffer.from(input, 'base64url');
}

export interface VerifiedFirebaseUser {
  uid: string;
  email: string;
  emailVerified: boolean;
}

/**
 * Verifies a Firebase Auth ID token's RS256 signature and claims against
 * Google's public certificates. No service account credentials are required
 * since these certs are public; this is the same trust model firebase-admin
 * uses under the hood for verifyIdToken.
 */
export async function verifyFirebaseIdToken(idToken: unknown): Promise<VerifiedFirebaseUser | null> {
  if (typeof idToken !== 'string' || !idToken) return null;

  const parts = idToken.split('.');
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, signatureB64] = parts;

  let header: any;
  let payload: any;
  try {
    header = JSON.parse(base64UrlDecode(headerB64).toString('utf-8'));
    payload = JSON.parse(base64UrlDecode(payloadB64).toString('utf-8'));
  } catch {
    return null;
  }

  if (header.alg !== 'RS256' || !header.kid) return null;

  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== 'number' || payload.exp < now) return null;
  if (typeof payload.iat !== 'number' || payload.iat > now + 60) return null;
  if (payload.aud !== PROJECT_ID) return null;
  if (payload.iss !== ISSUER) return null;
  if (!payload.sub || typeof payload.sub !== 'string') return null;

  let certPem: string | null;
  try {
    certPem = await getCert(header.kid);
  } catch {
    return null;
  }
  if (!certPem) return null;

  const signature = base64UrlDecode(signatureB64);
  const signedData = `${headerB64}.${payloadB64}`;

  const isValid = crypto.verify('RSA-SHA256', Buffer.from(signedData), certPem, signature);
  if (!isValid) return null;

  return {
    uid: payload.sub,
    email: typeof payload.email === 'string' ? payload.email : '',
    emailVerified: Boolean(payload.email_verified),
  };
}
