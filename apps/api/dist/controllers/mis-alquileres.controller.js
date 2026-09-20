"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.misAlquileresController = exports.MisAlquileresController = void 0;
const inmueble_service_1 = require("../services/inmueble.service");
class MisAlquileresController {
    async getMisAlquileres(req, res, next) {
        try {
            // El ID del locador proviene del contexto de autenticación inyectado por el API Gateway
            const user = req.user;
            const locadorId = user?.id || parseInt(req.header('x-user-id') || '1', 10);
            const propiedades = await inmueble_service_1.inmuebleService.getMisInmueblesPublicados(locadorId);
            res.status(200).json({
                success: true,
                message: `Se recuperaron ${propiedades.length} propiedad(es) publicadas para el locador.`,
                data: propiedades
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.MisAlquileresController = MisAlquileresController;
exports.misAlquileresController = new MisAlquileresController();
