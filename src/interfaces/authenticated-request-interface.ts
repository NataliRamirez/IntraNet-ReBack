import { Request } from 'express';

/**
 * Extiende la solicitud HTTP para incluir
 * la información del usuario autenticado.
 */
export interface AuthenticatedRequest
  extends Request {

  user: {
    id: number;
    email: string;
    role: string;
  };
}