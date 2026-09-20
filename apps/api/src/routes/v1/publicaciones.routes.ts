import { Router, Request, Response, NextFunction } from 'express';
import { publicacionService } from '../../services/publicacion.service';
import { authenticateGateway, requireRole } from '../../gateway/middlewares/auth.middleware';

const router = Router();

/**
 * @openapi
 * /api/v1/publicaciones:
 *   post:
 *     summary: Crear una publicación para un inmueble
 *     description: Requiere que el inmueble ya cuente con un contrato asociado (regla de negocio).
 *     tags:
 *       - Publicaciones
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_inmueble
 *               - titulo
 *               - precio
 *             properties:
 *               id_inmueble:
 *                 type: integer
 *               titulo:
 *                 type: string
 *               precio:
 *                 type: number
 *     responses:
 *       201:
 *         description: Publicación creada exitosamente
 *       400:
 *         description: Error al publicar (ej. no cuenta con contrato asociado)
 */
router.post(
  '/',
  authenticateGateway,
  requireRole('locador'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nuevaPub = await publicacionService.crearPublicacion(req.body);
      res.status(201).json({
        success: true,
        message: 'Publicación creada exitosamente.',
        data: nuevaPub
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
