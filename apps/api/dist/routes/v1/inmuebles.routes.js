"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inmueble_controller_1 = require("../../controllers/inmueble.controller");
const auth_middleware_1 = require("../../gateway/middlewares/auth.middleware");
const router = (0, express_1.Router)();
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
router.get('/', inmueble_controller_1.inmuebleController.getAll.bind(inmueble_controller_1.inmuebleController));
router.get('/:id', inmueble_controller_1.inmuebleController.getById.bind(inmueble_controller_1.inmuebleController));
router.post('/', auth_middleware_1.authenticateGateway, (0, auth_middleware_1.requireRole)('locador'), inmueble_controller_1.inmuebleController.create.bind(inmueble_controller_1.inmuebleController));
router.put('/:id', auth_middleware_1.authenticateGateway, (0, auth_middleware_1.requireRole)('locador'), inmueble_controller_1.inmuebleController.update.bind(inmueble_controller_1.inmuebleController));
router.delete('/:id', auth_middleware_1.authenticateGateway, (0, auth_middleware_1.requireRole)('locador'), inmueble_controller_1.inmuebleController.delete.bind(inmueble_controller_1.inmuebleController));
exports.default = router;
