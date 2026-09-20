import { ContratoDTO, CreateContratoDTO, ContratoXUsuarioDTO } from '../dtos';

export interface IContratoRepository {
  findById(id: number): Promise<ContratoDTO | null>;
  findByInmuebleId(inmuebleId: number): Promise<ContratoDTO[]>;
  findActiveByInmuebleId(inmuebleId: number): Promise<ContratoDTO | null>;
  getUsuariosByContratoId(contratoId: number): Promise<ContratoXUsuarioDTO[]>;
  create(data: CreateContratoDTO): Promise<ContratoDTO>;
  asociarUsuario(contratoId: number, usuarioId: number): Promise<ContratoXUsuarioDTO>;
}

export class ContratoRepository implements IContratoRepository {
  private nextId = 100;
  private nextContratoUsuarioId = 100;

  private contratos: ContratoDTO[] = [
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

  private contratoXUsuarios: ContratoXUsuarioDTO[] = [
    { id: 1, id_contrato: 2, id_usuario: 1 }, // Carlos (locador)
    { id: 2, id_contrato: 2, id_usuario: 2 }  // Ana (locatario)
  ];

  async findById(id: number): Promise<ContratoDTO | null> {
    const contrato = this.contratos.find(c => c.id === id);
    return contrato ? { ...contrato } : null;
  }

  async findByInmuebleId(inmuebleId: number): Promise<ContratoDTO[]> {
    return this.contratos.filter(c => c.id_inmueble === inmuebleId).map(c => ({ ...c }));
  }

  async findActiveByInmuebleId(inmuebleId: number): Promise<ContratoDTO | null> {
    const contrato = this.contratos.find(c => c.id_inmueble === inmuebleId && ['disponible', 'vigente'].includes(c.estado));
    return contrato ? { ...contrato } : null;
  }

  async getUsuariosByContratoId(contratoId: number): Promise<ContratoXUsuarioDTO[]> {
    return this.contratoXUsuarios.filter(cu => cu.id_contrato === contratoId).map(cu => ({ ...cu }));
  }

  async create(data: CreateContratoDTO): Promise<ContratoDTO> {
    const newContrato: ContratoDTO = {
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

  async asociarUsuario(contratoId: number, usuarioId: number): Promise<ContratoXUsuarioDTO> {
    const nuevoRegistro: ContratoXUsuarioDTO = {
      id: ++this.nextContratoUsuarioId,
      id_contrato: contratoId,
      id_usuario: usuarioId
    };
    this.contratoXUsuarios.push(nuevoRegistro);
    return { ...nuevoRegistro };
  }
}

export const contratoRepository = new ContratoRepository();
