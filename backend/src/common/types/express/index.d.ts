import { Profile } from '@prisma/client';

declare global {
  namespace Express {
    export interface Request {
      profile?: Profile;
      authorizationType?: string;
    }
  }
}

export {};
