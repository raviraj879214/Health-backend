import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    sub: number;
    roleId: number;
    // any other fields from JWT
  };

}