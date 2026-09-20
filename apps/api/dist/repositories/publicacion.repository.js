"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicacionRepository = exports.PublicacionRepository = void 0;
class PublicacionRepository {
    nextId = 100;
    publicaciones = [
        {
            id: 1,
            id_inmueble: 1,
            titulo: 'Alquiler Departamento 2 Dormitorios - Centro / Alberdi',
            precio: 350000.0,
            activa: true,
            created_at: new Date('2026-09-02T10:00:00Z')
        },
        {
            id: 2,
            id_inmueble: 2,
            titulo: 'Alquiler 1 Dormitorio Nueva Córdoba',
            precio: 290000.0,
            activa: true,
            created_at: new Date('2026-02-20T11:00:00Z')
        },
        {
            id: 3,
            id_inmueble: 4,
            titulo: 'PH en Cerro de las Rosas',
            precio: 420000.0,
            activa: true,
            created_at: new Date('2026-09-11T12:00:00Z')
        }
    ];
    async findById(id) {
        const pub = this.publicaciones.find(p => p.id === id);
        return pub ? { ...pub } : null;
    }
    async findByInmuebleId(inmuebleId) {
        const pub = this.publicaciones.find(p => p.id_inmueble === inmuebleId && p.activa);
        return pub ? { ...pub } : null;
    }
    async findAll() {
        return this.publicaciones.map(p => ({ ...p }));
    }
    async create(data) {
        const newPub = {
            id: ++this.nextId,
            id_inmueble: data.id_inmueble,
            titulo: data.titulo,
            precio: data.precio,
            activa: data.activa !== undefined ? data.activa : true,
            created_at: new Date()
        };
        this.publicaciones.push(newPub);
        return { ...newPub };
    }
    async update(id, data) {
        const index = this.publicaciones.findIndex(p => p.id === id);
        if (index === -1)
            return null;
        this.publicaciones[index] = {
            ...this.publicaciones[index],
            ...data
        };
        return { ...this.publicaciones[index] };
    }
    async delete(id) {
        const index = this.publicaciones.findIndex(p => p.id === id);
        if (index === -1)
            return false;
        this.publicaciones.splice(index, 1);
        return true;
    }
}
exports.PublicacionRepository = PublicacionRepository;
exports.publicacionRepository = new PublicacionRepository();
