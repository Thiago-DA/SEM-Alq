import {
  TipoInmuebleDTO,
  TagInmuebleDTO,
  ServicioDTO,
  RolDTO,
  UsuarioDTO,
  UsuarioXRolDTO,
  TipoIndiceDTO,
  EstadoContratoDTO,
  MedioPagoDTO
} from '../dtos';

export class LookupRepository {
  private tiposInmueble: TipoInmuebleDTO[] = [
    { id: 1, descripcion: 'Departamento' },
    { id: 2, descripcion: 'Casa' },
    { id: 3, descripcion: 'PH' },
    { id: 4, descripcion: 'Monoambiente' }
  ];

  private tagsInmueble: TagInmuebleDTO[] = [
    { id: 1, descripcion: 'Acepta mascotas', estado: true },
    { id: 2, descripcion: 'Con cochera', estado: true },
    { id: 3, descripcion: 'Amoblado', estado: true },
    { id: 4, descripcion: 'Balcón con vista abierta', estado: true }
  ];

  private servicios: ServicioDTO[] = [
    { id: 1, nombre: 'Luz', descripcion: 'Suministro de energía eléctrica' },
    { id: 2, nombre: 'Gas natural', descripcion: 'Red de gas natural' },
    { id: 3, nombre: 'Agua corriente', descripcion: 'Suministro de agua potable' },
    { id: 4, nombre: 'Internet', descripcion: 'Conexión fibra óptica' }
  ];

  private tiposIndice: TipoIndiceDTO[] = [
    { id: 1, descripcion: 'ICL (Índice de Contratos de Locación)', valor: 4.5 },
    { id: 2, descripcion: 'IPC (Índice de Precios al Consumidor)', valor: 3.8 },
    { id: 3, descripcion: 'CAC (Cámara Argentina de la Construcción)', valor: 5.1 }
  ];

  private estadosContrato: EstadoContratoDTO[] = [
    { id: 1, descripcion: 'disponible', valor: true },
    { id: 2, descripcion: 'vigente', valor: true },
    { id: 3, descripcion: 'finalizado', valor: false }
  ];

  private mediosPago: MedioPagoDTO[] = [
    { id: 1, nombre: 'Transferencia bancaria', descripcion: 'Transferencia directa a CBU/CVU' },
    { id: 2, nombre: 'Efectivo', descripcion: 'Pago presencial en efectivo' },
    { id: 3, nombre: 'Mercado Pago', descripcion: 'Pasarela digital de Mercado Pago' },
    { id: 4, nombre: 'Débito automático', descripcion: 'Débito automático en cuenta bancaria' }
  ];

  private roles: RolDTO[] = [
    { id: 0, descripcion: 'locatario' },
    { id: 1, descripcion: 'locador' },
    { id: 2, descripcion: 'administrador' }
  ];

  private usuarios: UsuarioDTO[] = [
    { id: 1, nombre: 'Carlos', apellido: 'Propietario', email: 'locador@rentar.com', numero_documento: '30111222', telefono: '3511112233' },
    { id: 2, nombre: 'Ana', apellido: 'Inquilina', email: 'locatario@rentar.com', numero_documento: '30222333', telefono: '3514445566' },
    { id: 3, nombre: 'Segundo', apellido: 'Locador', email: 'otro.locador@rentar.com', numero_documento: '30333444', telefono: '3517778899' }
  ];

  private usuariosXRoles: UsuarioXRolDTO[] = [
    { id_usuario: 1, id_rol: 1 }, // Carlos es locador
    { id_usuario: 2, id_rol: 0 }, // Ana es locatario
    { id_usuario: 3, id_rol: 1 }  // Segundo es locador
  ];

  // Tipos de Inmueble
  async getTipoById(id: number): Promise<TipoInmuebleDTO | null> {
    return this.tiposInmueble.find(t => t.id === id) || null;
  }
  async getAllTipos(): Promise<TipoInmuebleDTO[]> {
    return [...this.tiposInmueble];
  }

  // Tags
  async getTagById(id: number): Promise<TagInmuebleDTO | null> {
    return this.tagsInmueble.find(t => t.id === id) || null;
  }
  async getAllTags(): Promise<TagInmuebleDTO[]> {
    return [...this.tagsInmueble];
  }

  // Servicios
  async getServicioById(id: number): Promise<ServicioDTO | null> {
    return this.servicios.find(s => s.id === id) || null;
  }
  async getAllServicios(): Promise<ServicioDTO[]> {
    return [...this.servicios];
  }

  // Índices
  async getTipoIndiceById(id: number): Promise<TipoIndiceDTO | null> {
    return this.tiposIndice.find(i => i.id === id) || null;
  }

  // Estados de Contrato
  async getEstadoContratoById(id: number): Promise<EstadoContratoDTO | null> {
    return this.estadosContrato.find(e => e.id === id) || null;
  }

  // Medios de Pago
  async getMedioPagoById(id: number): Promise<MedioPagoDTO | null> {
    return this.mediosPago.find(m => m.id === id) || null;
  }
  async getAllMediosPago(): Promise<MedioPagoDTO[]> {
    return [...this.mediosPago];
  }

  // Roles & Usuarios
  async getRolById(id: number): Promise<RolDTO | null> {
    return this.roles.find(r => r.id === id) || null;
  }
  async getUsuarioById(id: number): Promise<UsuarioDTO | null> {
    return this.usuarios.find(u => u.id === id) || null;
  }
  async getRolesByUsuarioId(idUsuario: number): Promise<RolDTO[]> {
    const rolesIds = this.usuariosXRoles
      .filter(ur => ur.id_usuario === idUsuario)
      .map(ur => ur.id_rol);
    return this.roles.filter(r => rolesIds.includes(r.id));
  }
}

export const lookupRepository = new LookupRepository();
