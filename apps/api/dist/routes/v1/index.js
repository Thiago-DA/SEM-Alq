"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mis_alquileres_routes_1 = __importDefault(require("./mis-alquileres.routes"));
const inmuebles_routes_1 = __importDefault(require("./inmuebles.routes"));
const publicaciones_routes_1 = __importDefault(require("./publicaciones.routes"));
const v1Router = (0, express_1.Router)();
// Rutas versión 1
v1Router.use('/mis-alquileres', mis_alquileres_routes_1.default);
v1Router.use('/inmuebles', inmuebles_routes_1.default);
v1Router.use('/publicaciones', publicaciones_routes_1.default);
exports.default = v1Router;
