import { InmuebleDTO, CreateInmuebleDTO, UpdateInmuebleDTO } from '../dtos';

export interface IInmuebleRepository {
  findAll(): Promise<InmuebleDTO[]>;
  findById(id: number): Promise<InmuebleDTO | null>;
  findByLocadorId(locadorId: number): Promise<InmuebleDTO[]>;
  create(data: CreateInmuebleDTO): Promise<InmuebleDTO>;
  update(id: number, data: UpdateInmuebleDTO): Promise<InmuebleDTO | null>;
  delete(id: number): Promise<boolean>;
}

export class InmuebleRepository implements IInmuebleRepository {
  private nextId = 10; // Contador secuencial para autogeneración de ID

  private inmuebles: InmuebleDTO[] = [
    {
      id: 1,
      tipo: 1, // Departamento
      direccion: 'Av. Colón',
      numero: 1550,
      piso: '4B',
      ciudad: 'Córdoba',
      ambientes: 3,
      dormitorios: 2,
      banos: 1,
      m2: 65,
      descripcion: 'Hermoso departamento luminoso con balcón y excelentes accesos',
      tags: 1,
      id_locador: 1, // Carlos Propietario
      servicios: 4, // Internet
      created_at: new Date('2026-09-01T09:00:00Z')
    },
    {
      id: 2,
      tipo: 1, // Departamento
      direccion: 'Bv. Chacabuco',
      numero: 720,
      piso: '2A',
      ciudad: 'Córdoba',
      ambientes: 2,
      dormitorios: 1,
      banos: 1,
      m2: 48,
      descripcion: 'Departamento en Nueva Córdoba a metros de Ciudad Universitaria',
      tags: 2,
      id_locador: 1, // Carlos Propietario
      servicios: 1, // Luz
      created_at: new Date('2026-02-10T10:00:00Z')
    },
    {
      id: 3,
      tipo: 2, // Casa
      direccion: 'Calle Los Plátanos',
      numero: 340,
      piso: null,
      ciudad: 'Córdoba',
      ambientes: 4,
      dormitorios: 3,
      banos: 2,
      m2: 120,
      descripcion: 'Casa familiar con amplio patio y asador',
      tags: 1,
      id_locador: 1, // Carlos Propietario (no publicada aún)
      servicios: 2, // Gas natural
      created_at: new Date('2026-08-15T11:00:00Z')
    },
    {
      id: 4,
      tipo: 3, // PH
      direccion: 'Av. Rafael Núñez',
      numero: 4100,
      piso: null,
      ciudad: 'Córdoba',
      ambientes: 3,
      dormitorios: 2,
      banos: 1,
      m2: 80,
      descripcion: 'PH en Cerro de las Rosas con entrada independiente',
      tags: 2,
      id_locador: 3, // Segundo Propietario
      servicios: 3, // Agua corriente
      created_at: new Date('2026-09-10T14:00:00Z')
    }
  ];

  async findAll(): Promise<InmuebleDTO[]> {
    return this.inmuebles.map(i => ({ ...i }));
  }

  async findById(id: number): Promise<InmuebleDTO | null> {
    const inmueble = this.inmuebles.find(i => i.id === id);
    return inmueble ? { ...inmueble } : null;
  }

  async findByLocadorId(locadorId: number): Promise<InmuebleDTO[]> {
    return this.inmuebles
      .filter(i => i.id_locador === locadorId)
      .map(i => ({ ...i }));
  }

  /**
   * El ID del inmueble se genera de forma automática.
   */
  async create(data: CreateInmuebleDTO): Promise<InmuebleDTO> {
    const nuevoId = ++this.nextId;
    const nuevoInmueble: InmuebleDTO = {
      id: nuevoId,
      tipo: data.tipo,
      direccion: data.direccion,
      numero: data.numero,
      piso: data.piso || null,
      ciudad: data.ciudad,
      ambientes: data.ambientes,
      dormitorios: data.dormitorios,
      banos: data.banos,
      m2: data.m2,
      descripcion: data.descripcion || null,
      tags: data.tags || null,
      id_locador: data.id_locador,
      servicios: data.servicios || null,
      created_at: new Date()
    };

    this.inmuebles.push(nuevoInmueble);
    return { ...nuevoInmueble };
  }

  async update(id: number, data: UpdateInmuebleDTO): Promise<InmuebleDTO | null> {
    const index = this.inmuebles.findIndex(i => i.id === id);
    if (index === -1) return null;

    this.inmuebles[index] = {
      ...this.inmuebles[index],
      ...data
    };
    return { ...this.inmuebles[index] };
  }

  async delete(id: number): Promise<boolean> {
    const index = this.inmuebles.findIndex(i => i.id === id);
    if (index === -1) return false;

    this.inmuebles.splice(index, 1);
    return true;
  }
}

export const inmuebleRepository = new InmuebleRepository();
