"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mis_alquileres_controller_1 = require("../../controllers/mis-alquileres.controller");
const auth_middleware_1 = require("../../gateway/middlewares/auth.middleware");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /api/v1/mis-alquileres:
 *   get:
 *     summary: Obtener todas las propiedades publicadas del locador autenticado
 *     description: Retorna el inventario de inmuebles publicados por el locador, tanto las disponibles para alquiler como aquellas con contrato ya pactado con un locatario.
 *     tags:
 *       - Mis Alquileres
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         schema:
 *           type: integer
 *           default: 1
 *         description: ID del usuario autenticado (debe tener rol locador)
 *     responses:
 *       200:
 *         description: Listado obtenido exitosamente
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
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado (no es locador)
 */
router.get('/', auth_middleware_1.authenticateGateway, (0, auth_middleware_1.requireRole)('locador'), mis_alquileres_controller_1.misAlquileresController.getMisAlquileres.bind(mis_alquileres_controller_1.misAlquileresController));
exports.default = router;
