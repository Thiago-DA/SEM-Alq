import { Router } from 'express';
import { inmuebleController } from '../../controllers/inmueble.controller';
import { authenticateGateway, requireRole } from '../../gateway/middlewares/auth.middleware';

const router = Router();

/**
 * @openapi
 * /api/v1/inmuebles:
 *   get:
 *     summary: Obtener todos los inmuebles registrados
 *     tags:
 *       - Inmuebles
 *     responses:
 *       200:
 *         description: Lista de inmuebles
 *   post:
 *     summary: Registrar un nuevo inmueble (ID autogenerado)
 *     tags:
 *       - Inmuebles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipo
 *               - direccion
 *               - numero
 *               - ciudad
 *               - ambientes
 *               - dormitorios
 *               - banos
 *               - m2
 *               - id_locador
 *             properties:
 *               tipo:
 *                 type: integer
 *               direccion:
 *                 type: string
 *               numero:
 *                 type: integer
 *               piso:
 *                 type: string
 *               ciudad:
 *                 type: string
 *               ambientes:
 *                 type: integer
 *               dormitorios:
 *                 type: integer
 *               banos:
 *                 type: integer
 *               m2:
 *                 type: integer
 *               descripcion:
 *                 type: string
 *               tags:
 *                 type: integer
 *               id_locador:
 *                 type: integer
 *               servicios:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Inmueble creado con éxito (ID generado automáticamente)
 */
router.get('/', inmuebleController.getAll.bind(inmuebleController));
router.get(
  '/disponibles',
  inmuebleController.getInmueblesDisponibles.bind(inmuebleController)
);
router.get('/:id', inmuebleController.getById.bind(inmuebleController));
router.post(
  '/',
  authenticateGateway,
  requireRole('locador'),
  inmuebleController.create.bind(inmuebleController)
);
router.put(
  '/:id',
  authenticateGateway,
  requireRole('locador'),
  inmuebleController.update.bind(inmuebleController)
);
router.delete(
  '/:id',
  authenticateGateway,
  requireRole('locador'),
  inmuebleController.delete.bind(inmuebleController)
);

export default router;
