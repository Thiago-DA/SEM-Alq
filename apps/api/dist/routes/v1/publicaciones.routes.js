"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const publicacion_service_1 = require("../../services/publicacion.service");
const auth_middleware_1 = require("../../gateway/middlewares/auth.middleware");
const router = (0, express_1.Router)();
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
router.post('/', auth_middleware_1.authenticateGateway, (0, auth_middleware_1.requireRole)('locador'), async (req, res, next) => {
    try {
        const nuevaPub = await publicacion_service_1.publicacionService.crearPublicacion(req.body);
        res.status(201).json({
            success: true,
            message: 'Publicación creada exitosamente.',
            data: nuevaPub
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
