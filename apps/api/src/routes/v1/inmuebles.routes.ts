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
/**
 * @openapi
 * /api/v1/inmuebles/disponibles:
 *   get:
 *     summary: Obtener propiedades disponibles para alquilar
 *     description: Devuelve los inmuebles que tienen una publicación activa y no se encuentran alquilados.
 *     tags:
 *       - Inmuebles
 *     responses:
 *       200:
 *         description: Lista de propiedades disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Propiedades disponibles obtenidas exitosamente
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       tipo:
 *                         type: integer
 *                         example: 1
 *                       direccion:
 *                         type: string
 *                         example: Av. Colón
 *                       numero:
 *                         type: integer
 *                         example: 1550
 *                       piso:
 *                         type: string
 *                         nullable: true
 *                         example: 4B
 *                       ciudad:
 *                         type: string
 *                         example: Córdoba
 *                       ambientes:
 *                         type: integer
 *                         example: 3
 *                       dormitorios:
 *                         type: integer
 *                         example: 2
 *                       banos:
 *                         type: integer
 *                         example: 1
 *                       m2:
 *                         type: integer
 *                         example: 65
 *                       descripcion:
 *                         type: string
 *                         nullable: true
 *                       tags:
 *                         type: integer
 *                         nullable: true
 *                         example: 1
 *                       id_locador:
 *                         type: integer
 *                         example: 1
 *                       servicios:
 *                         type: integer
 *                         nullable: true
 *                         example: 4
 *                       created_at:
 *                         type: string
 *                         format: date-time
 */
router.get(
  '/disponibles',
  inmuebleController.getInmueblesDisponibles.bind(inmuebleController)
);
router.get(
  '/disponibles',
  inmuebleController.getInmueblesDisponibles.bind(inmuebleController)
);
/**
 * @openapi
 * /api/v1/inmuebles/{id}:
 *   get:
 *     summary: Obtener detalle de un inmueble
 *     description: Devuelve el detalle de un inmueble incluyendo su tipo, tag, servicio y publicación activa.
 *     tags:
 *       - Inmuebles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del inmueble
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Detalle del inmueble obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     tipo_inmueble:
 *                       type: string
 *                       example: Departamento
 *                     direccion:
 *                       type: string
 *                       example: Av. Colón
 *                     numero:
 *                       type: integer
 *                       example: 1550
 *                     piso:
 *                       type: string
 *                       nullable: true
 *                       example: 4B
 *                     ciudad:
 *                       type: string
 *                       example: Córdoba
 *                     ambientes:
 *                       type: integer
 *                       example: 3
 *                     dormitorios:
 *                       type: integer
 *                       example: 2
 *                     banos:
 *                       type: integer
 *                       example: 1
 *                     m2:
 *                       type: integer
 *                       example: 65
 *                     descripcion:
 *                       type: string
 *                       nullable: true
 *                     tag:
 *                       type: string
 *                       nullable: true
 *                       example: Acepta mascotas
 *                     servicio:
 *                       type: string
 *                       nullable: true
 *                       example: Internet
 *                     id_locador:
 *                       type: integer
 *                       example: 1
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     publicacion:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         titulo:
 *                           type: string
 *                           example: Alquiler Departamento 2 Dormitorios - Centro / Alberdi
 *                         precio:
 *                           type: number
 *                           example: 350000
 *                         activa:
 *                           type: boolean
 *                           example: true
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: El ID proporcionado no es un número entero válido
 *       404:
 *         description: Inmueble no encontrado
 */
router.get('/:id', inmuebleController.getById.bind(inmuebleController));
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
