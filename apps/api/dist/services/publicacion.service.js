"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicacionService = exports.PublicacionService = void 0;
const publicacion_repository_1 = require("../repositories/publicacion.repository");
const contrato_repository_1 = require("../repositories/contrato.repository");
const inmueble_repository_1 = require("../repositories/inmueble.repository");
class PublicacionService {
    pubRepo;
    contRepo;
    inmRepo;
    constructor(pubRepo = publicacion_repository_1.publicacionRepository, contRepo = contrato_repository_1.contratoRepository, inmRepo = inmueble_repository_1.inmuebleRepository) {
        this.pubRepo = pubRepo;
        this.contRepo = contRepo;
        this.inmRepo = inmRepo;
    }
    /**
     * Regla de negocio crítica:
     * "No se puede publicar una propiedad sin asociarle un contrato."
     */
    async crearPublicacion(data) {
        // 1. Verificar existencia del inmueble
        const inmueble = await this.inmRepo.findById(data.id_inmueble);
        if (!inmueble) {
            throw new Error(`El inmueble con ID ${data.id_inmueble} no existe.`);
        }
        // 2. Verificar que el inmueble posea al menos un contrato asociado
        const contratos = await this.contRepo.findByInmuebleId(data.id_inmueble);
        if (!contratos || contratos.length === 0) {
            throw new Error('Regla de negocio no cumplida: No se puede publicar una propiedad sin asociarle previamente un contrato.');
        }
        // 3. Crear y retornar la publicación
        return await this.pubRepo.create(data);
    }
    async getPublicacionByInmuebleId(inmuebleId) {
        return await this.pubRepo.findByInmuebleId(inmuebleId);
    }
    async getPublicacionById(id) {
        return await this.pubRepo.findById(id);
    }
    async desactivarPublicacion(id) {
        return await this.pubRepo.update(id, { activa: false });
    }
}
exports.PublicacionService = PublicacionService;
exports.publicacionService = new PublicacionService();
