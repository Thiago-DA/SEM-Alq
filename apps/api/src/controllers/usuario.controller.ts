import { Request, Response, NextFunction } from 'express';
import { ApiResponse, CreateUsuarioDTO, UsuarioDTO } from '../dtos';
import { usuarioService } from '../services/usuario.service';

export class UsuarioController {
  async registrar(
    req: Request<unknown, unknown, CreateUsuarioDTO>,
    res: Response<ApiResponse<UsuarioDTO>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const usuario = await usuarioService.registrar(req.body);
      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente.',
        data: usuario
      });
    } catch (error) {
      next(error);
    }
  }
}

export const usuarioController = new UsuarioController();