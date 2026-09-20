"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const gateway_router_1 = __importDefault(require("./gateway/gateway.router"));
const swagger_1 = require("./config/swagger");
const error_middleware_1 = require("./gateway/middlewares/error.middleware");
const createApp = () => {
    const app = (0, express_1.default)();
    // Middlewares globales
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // Documentación Swagger OpenAPI
    app.use('/api/v1/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
    app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
    // Exposición del API Gateway bajo /api
    // Las rutas quedan versionadas: /api/v1/mis-alquileres, /api/v1/inmuebles, etc.
    app.use('/api', gateway_router_1.default);
    // Manejador centralizado de errores
    app.use(error_middleware_1.errorHandler);
    return app;
};
exports.createApp = createApp;
exports.app = (0, exports.createApp)();
