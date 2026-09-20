import {
  InmuebleDTO,
  CreateInmuebleDTO,
  UpdateInmuebleDTO,
  MisAlquileresDTO
} from '../dtos';
import { IInmuebleRepository, inmuebleRepository } from '../repositories/inmueble.repository';
import { IPublicacionRepository, publicacionRepository } from '../repositories/publicacion.repository';
import { IContratoRepository, contratoRepository } from '../repositories/contrato.repository';
import { lookupRepository } from '../repositories/lookup.repository';

export class InmuebleService {
  constructor(
    private inmRepo: IInmuebleRepository = inmuebleRepository,
    private pubRepo: IPublicacionRepository = publicacionRepository,
    private contRepo: IContratoRepository = contratoRepository
  ) {}

  async findAll(): Promise<InmuebleDTO[]> {
    return await this.inmRepo.findAll();
  }

  async getById(id: number): Promise<InmuebleDTO | null> {
    return await this.inmRepo.findById(id);
  }

  async create(data: CreateInmuebleDTO): Promise<InmuebleDTO> {
    // Validaciones de negocio básicas
    if (!data.direccion || !data.numero || !data.ciudad) {
      throw new Error('Dirección, número y ciudad son campos requeridos.');
    }
    if (!data.id_locador) {
      throw new Error('El ID del locador es obligatorio.');
    }

    return await this.inmRepo.create(data);
  }

  async update(id: number, data: UpdateInmuebleDTO): Promise<InmuebleDTO | null> {
    const existing = await this.inmRepo.findById(id);
    if (!existing) {
      throw new Error(`Inmueble con ID ${id} no encontrado.`);
    }
    return await this.inmRepo.update(id, data);
  }

  async delete(id: number): Promise<boolean> {
    const existing = await this.inmRepo.findById(id);
    if (!existing) {
      throw new Error(`Inmueble con ID ${id} no encontrado.`);
    }
    return await this.inmRepo.delete(id);
  }

  /**
   * Obtiene todos los inmuebles que el locador ha publicado para alquilar,
   * tanto aquellos disponibles (sin locatario pactado aún) como aquellos ya alquilados.
   */
  async getMisInmueblesPublicados(idLocador: number): Promise<MisAlquileresDTO[]> {
    // 1. Obtener los inmuebles que pertenecen a este locador
    const inmueblesLocador = await this.inmRepo.findByLocadorId(idLocador);

    const resultado: MisAlquileresDTO[] = [];

    for (const inmueble of inmueblesLocador) {
      // 2. Buscar si el inmueble cuenta con una publicación activa
      const publicacion = await this.pubRepo.findByInmuebleId(inmueble.id);
      if (!publicacion) {
        // La propiedad está registrada pero no publicada -> no forma parte del catálogo de "Mis alquileres publicados"
        continue;
      }

      // 3. Obtener el contrato asociado (por regla de negocio, toda publicación debe tener contrato)
      const contratos = await this.contRepo.findByInmuebleId(inmueble.id);
      const contratoPrincipal = contratos.length > 0 ? contratos[0] : null;

      // 4. Determinar si se encuentra actualmente alquilada o disponible
      let estadoAlquiler: 'disponible' | 'alquilado' = 'disponible';
      if (contratoPrincipal) {
        const usuariosContrato = await this.contRepo.getUsuariosByContratoId(contratoPrincipal.id);
        // Si hay más de un usuario asignado (locador + locatario) o el estado del contrato es 'vigente'
        const tieneLocatario = usuariosContrato.some(u => u.id_usuario !== idLocador);
        if (tieneLocatario || contratoPrincipal.estado === 'vigente') {
          estadoAlquiler = 'alquilado';
        }
      }

      // 5. Cargar catálogos relacionados (tipo, tags, servicios)
      const tipoObj = await lookupRepository.getTipoById(inmueble.tipo);
      const tagObj = inmueble.tags ? await lookupRepository.getTagById(inmueble.tags) : null;
      const servicioObj = inmueble.servicios ? await lookupRepository.getServicioById(inmueble.servicios) : null;

      const pisoTexto = inmueble.piso ? ` Piso ${inmueble.piso}` : '';
      const direccionCompleta = `${inmueble.direccion} ${inmueble.numero}${pisoTexto}, ${inmueble.ciudad}`;

      resultado.push({
        id_inmueble: inmueble.id,
        direccion_completa: direccionCompleta,
        direccion: inmueble.direccion,
        numero: inmueble.numero,
        piso: inmueble.piso,
        ciudad: inmueble.ciudad,
        ambientes: inmueble.ambientes,
        dormitorios: inmueble.dormitorios,
        banos: inmueble.banos,
        m2: inmueble.m2,
        descripcion: inmueble.descripcion,
        tipo_inmueble: tipoObj ? tipoObj.descripcion : 'Inmueble',
        tag: tagObj ? tagObj.descripcion : null,
        servicio: servicioObj ? `${servicioObj.nombre} (${servicioObj.descripcion})` : null,
        publicacion: {
          id: publicacion.id,
          titulo: publicacion.titulo,
          precio: publicacion.precio,
          activa: publicacion.activa,
          created_at: publicacion.created_at
        },
        contrato: {
          id: contratoPrincipal ? contratoPrincipal.id : 0,
          monto: contratoPrincipal ? contratoPrincipal.monto : publicacion.precio,
          fecha_inicio: contratoPrincipal?.fecha_inicio || null,
          fecha_fin: contratoPrincipal?.fecha_fin || null,
          estado: contratoPrincipal ? contratoPrincipal.estado : 'sin contrato'
        },
        estado_alquiler: estadoAlquiler
      });
    }

    return resultado;
  }
}

export const inmuebleService = new InmuebleService();
