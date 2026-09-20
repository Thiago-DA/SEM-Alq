import { PublicacionDTO, CreatePublicacionDTO } from '../dtos';

export interface IPublicacionRepository {
  findById(id: number): Promise<PublicacionDTO | null>;
  findByInmuebleId(inmuebleId: number): Promise<PublicacionDTO | null>;
  findAll(): Promise<PublicacionDTO[]>;
  create(data: CreatePublicacionDTO): Promise<PublicacionDTO>;
  update(id: number, data: Partial<PublicacionDTO>): Promise<PublicacionDTO | null>;
  delete(id: number): Promise<boolean>;
}

export class PublicacionRepository implements IPublicacionRepository {
  private nextId = 100;

  private publicaciones: PublicacionDTO[] = [
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

  async findById(id: number): Promise<PublicacionDTO | null> {
    const pub = this.publicaciones.find(p => p.id === id);
    return pub ? { ...pub } : null;
  }

  async findByInmuebleId(inmuebleId: number): Promise<PublicacionDTO | null> {
    const pub = this.publicaciones.find(p => p.id_inmueble === inmuebleId && p.activa);
    return pub ? { ...pub } : null;
  }

  async findAll(): Promise<PublicacionDTO[]> {
    return this.publicaciones.map(p => ({ ...p }));
  }

  async create(data: CreatePublicacionDTO): Promise<PublicacionDTO> {
    const newPub: PublicacionDTO = {
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

  async update(id: number, data: Partial<PublicacionDTO>): Promise<PublicacionDTO | null> {
    const index = this.publicaciones.findIndex(p => p.id === id);
    if (index === -1) return null;

    this.publicaciones[index] = {
      ...this.publicaciones[index],
      ...data
    };
    return { ...this.publicaciones[index] };
  }

  async delete(id: number): Promise<boolean> {
    const index = this.publicaciones.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.publicaciones.splice(index, 1);
    return true;
  }
}

export const publicacionRepository = new PublicacionRepository();
