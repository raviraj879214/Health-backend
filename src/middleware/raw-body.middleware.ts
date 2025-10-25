import { Request, Response, NextFunction } from 'express';
import getRawBody from 'raw-body';

export function rawBodyMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Only for Stripe webhook routes
  if (req.originalUrl.startsWith('/api/stripe-subscriptions')) {
    getRawBody(
      req,
      { length: req.headers['content-length'], limit: '1mb' },
      (err, body) => {
        if (err) return next(err);
        req.rawBody = body; // TypeScript now knows about this property
        next();
      }
    );
  } else {
    next();
  }
}
