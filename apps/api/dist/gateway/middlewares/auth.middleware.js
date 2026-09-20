"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticateGateway = void 0;
const lookup_repository_1 = require("../../repositories/lookup.repository");
/**
 * Middleware del API Gateway para resolver el usuario autenticado.
 * Simula la resolución de JWT / sesión a partir de header x-user-id o Authorization.
 */
const authenticateGateway = async (req, res, next) => {
    try {
        const userIdHeader = req.header('x-user-id') || '1'; // Default: usuario demo locador Carlos
        const userId = parseInt(userIdHeader, 10);
        if (isNaN(userId)) {
            res.status(401).json({
                success: false,
                error: 'No autorizado: Cabecera x-user-id inválida o ausente.'
            });
            return;
        }
        const usuario = await lookup_repository_1.lookupRepository.getUsuarioById(userId);
        if (!usuario) {
            res.status(401).json({
                success: false,
                error: `No autorizado: No existe un usuario registrado con el ID ${userId}.`
            });
            return;
        }
        const roles = await lookup_repository_1.lookupRepository.getRolesByUsuarioId(userId);
        req.user = {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            roles: roles.map(r => r.nombre)
        };
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authenticateGateway = authenticateGateway;
/**
 * Middleware para asegurar que el usuario tenga un rol específico (ej. 'locador').
 */
const requireRole = (roleRequired) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !user.roles.includes(roleRequired)) {
            res.status(403).json({
                success: false,
                error: `Acceso denegado: Se requiere el rol '${roleRequired}' para realizar esta acción.`
            });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
