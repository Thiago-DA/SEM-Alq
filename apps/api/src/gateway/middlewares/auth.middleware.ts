import { Request, Response, NextFunction } from 'express';
import { lookupRepository } from '../../repositories/lookup.repository';

export interface AuthenticatedUser {
  id: number;
  nombre: string;
  email: string;
  roles: string[];
}

/**
 * Middleware del API Gateway para resolver el usuario autenticado.
 * Simula la resolución de JWT / sesión a partir de header x-user-id o Authorization.
 */
export const authenticateGateway = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userIdHeader = req.header('x-user-id') || '1'; // Default: usuario demo locador Carlos
    const userId = parseInt(userIdHeader, 10);

    if (isNaN(userId)) {
      res.status(401).json({
        success: false,
        error: 'No autorizado: Cabecera x-user-id inválida o ausente.'
      });
      return;
    }

    const usuario = await lookupRepository.getUsuarioById(userId);
    if (!usuario) {
      res.status(401).json({
        success: false,
        error: `No autorizado: No existe un usuario registrado con el ID ${userId}.`
      });
      return;
    }

    const roles = await lookupRepository.getRolesByUsuarioId(userId);

    (req as any).user = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      roles: roles.map(r => r.nombre)
    } as AuthenticatedUser;

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware para asegurar que el usuario tenga un rol específico (ej. 'locador').
 */
export const requireRole = (roleRequired: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user as AuthenticatedUser;
    if (!user || !user.roles.includes(roleRequired)) {
      res.status(403).json({
        success: false,
        error: `Acceso denegado: Se requiere el rol '${roleRequired}' para realizar esta acción.`
      });
      return;
    }
    next();
  };
};
