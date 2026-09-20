import { PublicacionDTO, CreatePublicacionDTO } from '../dtos';
import { IPublicacionRepository, publicacionRepository } from '../repositories/publicacion.repository';
import { IContratoRepository, contratoRepository } from '../repositories/contrato.repository';
import { IInmuebleRepository, inmuebleRepository } from '../repositories/inmueble.repository';

export class PublicacionService {
  constructor(
    private pubRepo: IPublicacionRepository = publicacionRepository,
    private contRepo: IContratoRepository = contratoRepository,
    private inmRepo: IInmuebleRepository = inmuebleRepository
  ) {}

  /**
   * Regla de negocio crítica:
   * "No se puede publicar una propiedad sin asociarle un contrato."
   */
  async crearPublicacion(data: CreatePublicacionDTO): Promise<PublicacionDTO> {
    // 1. Verificar existencia del inmueble
    const inmueble = await this.inmRepo.findById(data.id_inmueble);
    if (!inmueble) {
      throw new Error(`El inmueble con ID ${data.id_inmueble} no existe.`);
    }

    // 2. Verificar que el inmueble posea al menos un contrato asociado
    const contratos = await this.contRepo.findByInmuebleId(data.id_inmueble);
    if (!contratos || contratos.length === 0) {
      throw new Error(
        'Regla de negocio no cumplida: No se puede publicar una propiedad sin asociarle previamente un contrato.'
      );
    }

    // 3. Crear y retornar la publicación
    return await this.pubRepo.create(data);
  }

  async getPublicacionByInmuebleId(inmuebleId: number): Promise<PublicacionDTO | null> {
    return await this.pubRepo.findByInmuebleId(inmuebleId);
  }

  async getPublicacionById(id: number): Promise<PublicacionDTO | null> {
    return await this.pubRepo.findById(id);
  }

  async desactivarPublicacion(id: number): Promise<PublicacionDTO | null> {
    return await this.pubRepo.update(id, { activa: false });
  }
}

export const publicacionService = new PublicacionService();
