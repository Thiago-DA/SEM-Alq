"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || err.statusCode || 400;
    const message = err.message || 'Ocurrió un error inesperado en el servidor.';
    console.error(`[API Gateway Error] ${req.method} ${req.originalUrl} - Status: ${statusCode} - Mensaje: ${message}`);
    res.status(statusCode).json({
        success: false,
        message: 'Error en la solicitud',
        error: message
    });
};
exports.errorHandler = errorHandler;
