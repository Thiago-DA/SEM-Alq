"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookupRepository = exports.LookupRepository = void 0;
class LookupRepository {
    tiposInmueble = [
        { id: 1, descripcion: 'Departamento' },
        { id: 2, descripcion: 'Casa' },
        { id: 3, descripcion: 'PH' },
        { id: 4, descripcion: 'Monoambiente' }
    ];
    tagsInmueble = [
        { id: 1, descripcion: 'Acepta mascotas' },
        { id: 2, descripcion: 'Con cochera' },
        { id: 3, descripcion: 'Amoblado' },
        { id: 4, descripcion: 'Balcón con vista abierta' }
    ];
    servicios = [
        { id: 1, nombre: 'Luz', descripcion: 'Suministro de energía eléctrica' },
        { id: 2, nombre: 'Gas natural', descripcion: 'Red de gas natural por cañería' },
        { id: 3, nombre: 'Agua corriente', descripcion: 'Suministro de agua potable de red' },
        { id: 4, nombre: 'Internet', descripcion: 'Conexión a internet por fibra óptica' }
    ];
    roles = [
        { id: 1, nombre: 'locador', descripcion: 'Propietario que publica y gestiona sus inmuebles en alquiler' },
        { id: 2, nombre: 'locatario', descripcion: 'Inquilino que busca, solicita y alquila inmuebles' },
        { id: 3, nombre: 'administrador', descripcion: 'Administrador de la plataforma RentAR' }
    ];
    usuarios = [
        { id: 1, nombre: 'Carlos Propietario', email: 'locador@rentar.com', telefono: '+54 9 351 111-2233' },
        { id: 2, nombre: 'Ana Inquilina', email: 'locatario@rentar.com', telefono: '+54 9 351 444-5566' },
        { id: 3, nombre: 'Segundo Propietario', email: 'otro.locador@rentar.com', telefono: '+54 9 351 777-8899' }
    ];
    usuariosXRoles = [
        { id: 1, id_usuario: 1, id_rol: 1 }, // Carlos es locador
        { id: 2, id_usuario: 2, id_rol: 2 }, // Ana es locatario
        { id: 3, id_usuario: 3, id_rol: 1 } // Segundo es locador
    ];
    // Tipos
    async getTipoById(id) {
        return this.tiposInmueble.find(t => t.id === id) || null;
    }
    async getAllTipos() {
        return [...this.tiposInmueble];
    }
    // Tags
    async getTagById(id) {
        return this.tagsInmueble.find(t => t.id === id) || null;
    }
    async getAllTags() {
        return [...this.tagsInmueble];
    }
    // Servicios
    async getServicioById(id) {
        return this.servicios.find(s => s.id === id) || null;
    }
    async getAllServicios() {
        return [...this.servicios];
    }
    // Roles
    async getRolById(id) {
        return this.roles.find(r => r.id === id) || null;
    }
    async getRolByNombre(nombre) {
        return this.roles.find(r => r.nombre.toLowerCase() === nombre.toLowerCase()) || null;
    }
    // Usuarios
    async getUsuarioById(id) {
        return this.usuarios.find(u => u.id === id) || null;
    }
    async getUsuarioByEmail(email) {
        return this.usuarios.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    }
    async getRolesByUsuarioId(idUsuario) {
        const rolesIds = this.usuariosXRoles
            .filter(ur => ur.id_usuario === idUsuario)
            .map(ur => ur.id_rol);
        return this.roles.filter(r => rolesIds.includes(r.id));
    }
}
exports.LookupRepository = LookupRepository;
exports.lookupRepository = new LookupRepository();
