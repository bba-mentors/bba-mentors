import express, { type Request, type Response, type NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import apiRouter from './server/api.ts';
import { securityHeadersMiddleware, createRateLimiter } from './server/security.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Disable server fingerprint header to confuse malicious scanners
  app.disable('x-powered-by');

  // 2. Apply Security Headers (CSP, Anti-Sniff, Anti-Clickjack, Referrer Policy)
  app.use(securityHeadersMiddleware);

  // 3. Limit JSON request body size to 1MB to prevent memory exhaustion attacks
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // 4. General API Rate Limiter: max 150 requests per minute per IP
  const generalApiLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 150,
    message: 'Too many requests. Please slow down.',
  });
  app.use('/api', generalApiLimiter);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      platform: 'BBA Mentors Education Platform',
      version: '1.0.0',
      tagline: 'Learn. Test. Improve.',
      timestamp: new Date().toISOString(),
    });
  });

  // Mount API router
  app.use('/api', apiRouter);

  // 5. Global API Error Catcher (Prevents stack trace leakage to public)
  app.use('/api', (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('[BBA Mentors API Error]:', err);
    if (res.headersSent) {
      return next(err);
    }
    res.status(err.status || 500).json({
      error: err.message && process.env.NODE_ENV !== 'production'
        ? err.message
        : 'An unexpected error occurred. Please try again or contact support.',
    });
  });

  // Vite middleware for dev vs production static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BBA Mentors] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[BBA Mentors] Failed to start server:', err);
  process.exit(1);
});
