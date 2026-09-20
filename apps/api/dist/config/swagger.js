"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'RentAR - API Gateway & Backend Services',
            version: '1.0.0',
            description: 'Documentación oficial de la API de RentAR para la gestión integral de alquileres, inmuebles, contratos y publicaciones.',
            contact: {
                name: 'Equipo de Desarrollo RentAR'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor Local (API Gateway)'
            }
        ],
        components: {
            securitySchemes: {
                UserIdHeader: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-user-id',
                    description: 'Identificador del usuario autenticado (ej. 1 para Carlos Locador)'
                }
            }
        }
    },
    apis: ['./src/routes/**/*.ts', './src/gateway/**/*.ts', './src/dtos/**/*.ts']
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
