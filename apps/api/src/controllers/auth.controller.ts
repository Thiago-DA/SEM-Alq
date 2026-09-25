import { Request, Response, NextFunction } from 'express';
import { ApiResponse, LoginDTO } from '../dtos';
import { authService, LoginResponseDTO } from '../services/auth.service';

export class AuthController {
  async login(
    req: Request<unknown, unknown, LoginDTO>,
    res: Response<ApiResponse<LoginResponseDTO>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const resultado = await authService.login(req.body);

      res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso.',
        data: resultado
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();