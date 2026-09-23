
import { Request, Response, NextFunction } from 'express';
import { publicacionService } from '../services/publicacion.service';

export class PublicacionController {
  async obtenerPublicacionesActivas(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const publicaciones =
        await publicacionService.getPublicacionesActivas();

      res.status(200).json({
        success: true,
        data: publicaciones
      });
    } catch (error) {
      next(error);
    }
  }
}

export const publicacionController = new PublicacionController();