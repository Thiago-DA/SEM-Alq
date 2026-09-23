import {
  InmuebleDTO,
  FotoInmuebleDTO,
  CreateFotoDTO,
  InmuebleXTagDTO,
  TagInmuebleDTO
} from '../dtos';
import { getSupabaseAdmin } from '../config/supabase';

export interface IInmuebleRepository {
  findAll(): Promise<InmuebleDTO[]>;
  findById(id: number): Promise<InmuebleDTO | null>;
  findByLocadorId(locadorId: number): Promise<InmuebleDTO[]>;
  create(data: Omit<InmuebleDTO, 'id'>): Promise<InmuebleDTO>;
  update(id: number, data: Partial<InmuebleDTO>): Promise<InmuebleDTO | null>;
  delete(id: number): Promise<boolean>;
  addFotos(idInmueble: number, fotos: CreateFotoDTO[]): Promise<FotoInmuebleDTO[]>;
  getFotosByInmuebleId(idInmueble: number): Promise<FotoInmuebleDTO[]>;
  addTags(idInmueble: number, tagIds: number[]): Promise<void>;
  getTagsByInmuebleId(idInmueble: number): Promise<TagInmuebleDTO[]>;
}

export class InmuebleRepository implements IInmuebleRepository {
  async findAll(): Promise<InmuebleDTO[]> {
    const { data, error } = await getSupabaseAdmin().from('inmueble').select('*').order('id');
    if (error) throw error;
    return (data ?? []) as InmuebleDTO[];
  }

  async findById(id: number): Promise<InmuebleDTO | null> {
    const { data, error } = await getSupabaseAdmin().from('inmueble').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data as InmuebleDTO | null;
  }

  async findByLocadorId(locadorId: number): Promise<InmuebleDTO[]> {
    const { data, error } = await getSupabaseAdmin()
      .from('inmueble')
      .select('*')
      .eq('id_locador', locadorId)
      .order('id');
    if (error) throw error;
    return (data ?? []) as InmuebleDTO[];
  }

  async create(data: Omit<InmuebleDTO, 'id'>): Promise<InmuebleDTO> {
    const { data: inmueble, error } = await getSupabaseAdmin().from('inmueble').insert(data).select('*').single();
    if (error || !inmueble) throw error ?? new Error('No se pudo crear el inmueble.');
    return inmueble as InmuebleDTO;
  }

  async update(id: number, data: Partial<InmuebleDTO>): Promise<InmuebleDTO | null> {
    const { data: inmueble, error } = await getSupabaseAdmin()
      .from('inmueble')
      .update(data)
      .eq('id', id)
      .select('*')
      .maybeSingle();
    if (error) throw error;
    return inmueble as InmuebleDTO | null;
  }

  async delete(id: number): Promise<boolean> {
    const { error, count } = await getSupabaseAdmin()
      .from('inmueble')
      .delete({ count: 'exact' })
      .eq('id', id);
    if (error) throw error;
    return (count ?? 0) > 0;
  }

  async addFotos(idInmueble: number, fotos: CreateFotoDTO[]): Promise<FotoInmuebleDTO[]> {
    const tienePrincipal = fotos.some(foto => foto.es_principal === true);
    const filas = fotos.map((foto, index) => ({
      id_inmueble: idInmueble,
      url: foto.url,
      es_principal: tienePrincipal ? Boolean(foto.es_principal) : index === 0,
      peso_kb: foto.peso_kb,
      formato: foto.formato.toLowerCase(),
      orden: index + 1
    }));
    const { data, error } = await getSupabaseAdmin().from('foto_inmueble').insert(filas).select('*');
    if (error) throw error;
    return (data ?? []) as FotoInmuebleDTO[];
  }

  async getFotosByInmuebleId(idInmueble: number): Promise<FotoInmuebleDTO[]> {
    const { data, error } = await getSupabaseAdmin()
      .from('foto_inmueble')
      .select('*')
      .eq('id_inmueble', idInmueble)
      .order('orden');
    if (error) throw error;
    return (data ?? []) as FotoInmuebleDTO[];
  }

  async addTags(idInmueble: number, tagIds: number[]): Promise<void> {
    const filas = tagIds.map(id_tag => ({ id_inmueble: idInmueble, id_tag }));
    const { error } = await getSupabaseAdmin().from('inmueble_x_tag').insert(filas);
    if (error) throw error;
  }

  async getTagsByInmuebleId(idInmueble: number): Promise<TagInmuebleDTO[]> {
    const { data, error } = await getSupabaseAdmin()
      .from('inmueble_x_tag')
      .select('id_tag, tags_inmueble(id, descripcion, estado)')
      .eq('id_inmueble', idInmueble);
    if (error) throw error;
    return (data ?? []).map((row: any) => row.tags_inmueble).filter(Boolean) as TagInmuebleDTO[];
  }
}

export const inmuebleRepository = new InmuebleRepository();
