"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contratoRepository = exports.ContratoRepository = void 0;
class ContratoRepository {
    nextId = 100;
    nextContratoUsuarioId = 100;
    contratos = [
        {
            id: 1,
            id_inmueble: 1,
            fecha_inicio: '2026-10-01',
            fecha_fin: '2028-09-30',
            monto: 350000.0,
            estado: 'disponible',
            created_at: new Date('2026-09-01T10:00:00Z')
        },
        {
            id: 2,
            id_inmueble: 2,
            fecha_inicio: '2026-03-01',
            fecha_fin: '2028-02-28',
            monto: 290000.0,
            estado: 'vigente',
            created_at: new Date('2026-02-15T12:00:00Z')
        },
        {
            id: 3,
            id_inmueble: 4,
            fecha_inicio: '2026-11-01',
            fecha_fin: '2028-10-31',
            monto: 420000.0,
            estado: 'disponible',
            created_at: new Date('2026-09-10T15:00:00Z')
        }
    ];
    contratoXUsuarios = [
        { id: 1, id_contrato: 2, id_usuario: 1 }, // Carlos (locador)
        { id: 2, id_contrato: 2, id_usuario: 2 } // Ana (locatario)
    ];
    async findById(id) {
        const contrato = this.contratos.find(c => c.id === id);
        return contrato ? { ...contrato } : null;
    }
    async findByInmuebleId(inmuebleId) {
        return this.contratos.filter(c => c.id_inmueble === inmuebleId).map(c => ({ ...c }));
    }
    async findActiveByInmuebleId(inmuebleId) {
        const contrato = this.contratos.find(c => c.id_inmueble === inmuebleId && ['disponible', 'vigente'].includes(c.estado));
        return contrato ? { ...contrato } : null;
    }
    async getUsuariosByContratoId(contratoId) {
        return this.contratoXUsuarios.filter(cu => cu.id_contrato === contratoId).map(cu => ({ ...cu }));
    }
    async create(data) {
        const newContrato = {
            id: ++this.nextId,
            id_inmueble: data.id_inmueble,
            fecha_inicio: data.fecha_inicio || null,
            fecha_fin: data.fecha_fin || null,
            monto: data.monto,
            estado: data.estado || 'disponible',
            created_at: new Date()
        };
        this.contratos.push(newContrato);
        return { ...newContrato };
    }
    async asociarUsuario(contratoId, usuarioId) {
        const nuevoRegistro = {
            id: ++this.nextContratoUsuarioId,
            id_contrato: contratoId,
            id_usuario: usuarioId
        };
        this.contratoXUsuarios.push(nuevoRegistro);
        return { ...nuevoRegistro };
    }
}
exports.ContratoRepository = ContratoRepository;
exports.contratoRepository = new ContratoRepository();
