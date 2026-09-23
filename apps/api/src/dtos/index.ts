/**
 * Data Transfer Objects (DTOs) para RentAR
 * Cada tabla de la base de datos cuenta con su DTO representativo.
 */

// 1. DTO para tabla tipo_inmueble
export interface TipoInmuebleDTO {
  id: number;
  descripcion: string;
}

// 2. DTO para tabla tag_inmueble
export interface TagInmuebleDTO {
  id: number;
  descripcion: string;
}

// 3. DTO para tabla servicio
export interface ServicioDTO {
  id: number;
  nombre: string;
  descripcion: string;
}

// 4. DTO para tabla rol
export interface RolDTO {
  id: number;
  nombre: 'locador' | 'locatario' | 'administrador' | string;
  descripcion: string;
}

// 5. DTO para tabla usuario
export interface UsuarioDTO {
  id: number;
  nombre: string;
  email: string;
  telefono?: string | null;
  created_at?: Date | string;
}

// 6. DTO para tabla usuario_x_rol
export interface UsuarioXRolDTO {
  id: number;
  id_usuario: number;
  id_rol: number;
}

// 7. DTOs para tabla inmueble
export interface InmuebleDTO {
  id: number;
  tipo: number;
  direccion: string;
  numero: number;
  piso?: string | null;
  ciudad: string;
  ambientes: number;
  dormitorios: number;
  banos: number;
  m2: number;
  descripcion?: string | null;
  tags?: number | null;
  id_locador: number;
  servicios?: number | null;
  created_at?: Date | string;
}

export interface InmuebleDetalleDTO {
  id: number;
  tipo_inmueble: string;
  direccion: string;
  numero: number;
  piso?: string | null;
  ciudad: string;
  ambientes: number;
  dormitorios: number;
  banos: number;
  m2: number;
  descripcion?: string | null;
  tag?: string | null;
  servicio?: string | null;
  id_locador: number;
  created_at?: Date | string;
  publicacion?: {
    id: number;
    titulo: string;
    precio: number;
    activa: boolean;
    created_at?: Date | string;
  } | null;
}

export interface CreateInmuebleDTO {
  tipo: number;
  direccion: string;
  numero: number;
  piso?: string | null;
  ciudad: string;
  ambientes: number;
  dormitorios: number;
  banos: number;
  m2: number;
  descripcion?: string | null;
  tags?: number | null;
  id_locador: number;
  servicios?: number | null;
}

export interface UpdateInmuebleDTO {
  tipo?: number;
  direccion?: string;
  numero?: number;
  piso?: string | null;
  ciudad?: string;
  ambientes?: number;
  dormitorios?: number;
  banos?: number;
  m2?: number;
  descripcion?: string | null;
  tags?: number | null;
  servicios?: number | null;
}

// 8. DTOs para tabla contrato
export interface ContratoDTO {
  id: number;
  id_inmueble: number;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  monto: number;
  estado: string; // 'disponible' | 'vigente' | 'finalizado' | 'cancelado'
  created_at?: Date | string;
}

export interface CreateContratoDTO {
  id_inmueble: number;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  monto: number;
  estado?: string;
}

// 9. DTO para tabla contrato_x_usuario
export interface ContratoXUsuarioDTO {
  id: number;
  id_contrato: number;
  id_usuario: number;
}

// 10. DTOs para tabla publicacion
export interface PublicacionDTO {
  id: number;
  id_inmueble: number;
  titulo: string;
  precio: number;
  activa: boolean;
  created_at?: Date | string;
}

export interface PublicacionDisponibleDTO {
  id: number;
  id_inmueble: number;
  titulo: string;
  precio: number;
  activa: boolean;
  created_at?: Date | string;

  inmueble: {
    id: number;
    tipo: number;
    direccion: string;
    numero: number;
    piso?: string | null;
    ciudad: string;
    ambientes: number;
    dormitorios: number;
    banos: number;
    m2: number;
    descripcion?: string | null;
    tags?: number | null;
    servicios?: number | null;
  };
}

export interface CreatePublicacionDTO {
  id_inmueble: number;
  titulo: string;
  precio: number;
  activa?: boolean;
}

// 11. DTO Compuesto para la vista del Frontend: "Mis Alquileres / Mis Propiedades"
export interface MisAlquileresDTO {
  id_inmueble: number;
  direccion_completa: string;
  direccion: string;
  numero: number;
  piso?: string | null;
  ciudad: string;
  ambientes: number;
  dormitorios: number;
  banos: number;
  m2: number;
  descripcion?: string | null;
  tipo_inmueble: string;
  tag?: string | null;
  servicio?: string | null;
  publicacion: {
    id: number;
    titulo: string;
    precio: number;
    activa: boolean;
    created_at?: Date | string;
  };
  contrato: {
    id: number;
    monto: number;
    fecha_inicio?: string | null;
    fecha_fin?: string | null;
    estado: string;
  };
  estado_alquiler: 'disponible' | 'alquilado';
}

// Estructura uniforme de respuesta API Gateway
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string | null;
}
