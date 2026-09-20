"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inmuebleController = exports.InmuebleController = void 0;
const inmueble_service_1 = require("../services/inmueble.service");
class InmuebleController {
    async getAll(req, res, next) {
        try {
            const inmuebles = await inmueble_service_1.inmuebleService.findAll();
            res.status(200).json({
                success: true,
                message: 'Inmuebles obtenidos exitosamente',
                data: inmuebles
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    error: 'El ID proporcionado debe ser un número entero válido.'
                });
                return;
            }
            const inmueble = await inmueble_service_1.inmuebleService.getById(id);
            if (!inmueble) {
                res.status(404).json({
                    success: false,
                    error: `Inmueble con ID ${id} no encontrado.`
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: inmueble
            });
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            // El ID no debe ser provisto por el cliente, es autogenerado
            const { id, ...createData } = req.body;
            const nuevoInmueble = await inmueble_service_1.inmuebleService.create(createData);
            res.status(201).json({
                success: true,
                message: 'Inmueble creado exitosamente con ID generado automáticamente.',
                data: nuevoInmueble
            });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    error: 'ID inválido.'
                });
                return;
            }
            const actualizado = await inmueble_service_1.inmuebleService.update(id, req.body);
            if (!actualizado) {
                res.status(404).json({
                    success: false,
                    error: `Inmueble con ID ${id} no encontrado.`
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Inmueble actualizado exitosamente.',
                data: actualizado
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    error: 'ID inválido.'
                });
                return;
            }
            const eliminado = await inmueble_service_1.inmuebleService.delete(id);
            if (!eliminado) {
                res.status(404).json({
                    success: false,
                    error: `Inmueble con ID ${id} no encontrado.`
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Inmueble eliminado correctamente.'
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.InmuebleController = InmuebleController;
exports.inmuebleController = new InmuebleController();
