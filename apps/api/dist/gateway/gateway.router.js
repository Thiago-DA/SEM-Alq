"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const v1_1 = __importDefault(require("../routes/v1"));
const gatewayRouter = (0, express_1.Router)();
// Middleware de Gateway: identificación, logging y desacoplamiento
gatewayRouter.use((req, res, next) => {
    res.setHeader('X-Gateway-Version', '1.0.0');
    res.setHeader('X-Service-Layer', 'RentAR-Core-Backend');
    console.log(`[API Gateway] ${new Date().toISOString()} | ${req.method} ${req.originalUrl}`);
    next();
});
// Health check para monitoreo y gateway status
gatewayRouter.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        gateway: 'RentAR API Gateway',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});
// Enrutamiento versionado: todas las APIs actuales bajo /api/v1
gatewayRouter.use('/v1', v1_1.default);
exports.default = gatewayRouter;
