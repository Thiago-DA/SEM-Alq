/**
 * Shared Types for RentAR
 */
export interface TipoInmueble {
    id: number;
    descripcion: string;
}
export interface TagInmueble {
    id: number;
    descripcion: string;
}
export interface Servicio {
    id: number;
    nombre: string;
    descripcion: string;
}
export interface Rol {
    id: number;
    nombre: 'locador' | 'locatario' | 'administrador' | string;
    descripcion: string;
}
export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    telefono?: string | null;
    created_at?: string | Date;
}
export interface UsuarioXRol {
    id: number;
    id_usuario: number;
    id_rol: number;
}
export interface Inmueble {
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
    created_at?: string | Date;
}
export type EstadoContrato = 'borrador' | 'disponible' | 'vigente' | 'finalizado' | 'cancelado';
export interface Contrato {
    id: number;
    id_inmueble: number;
    fecha_inicio?: string | null;
    fecha_fin?: string | null;
    monto: number;
    estado: EstadoContrato | string;
    created_at?: string | Date;
}
export interface ContratoXUsuario {
    id: number;
    id_contrato: number;
    id_usuario: number;
}
export interface Publicacion {
    id: number;
    id_inmueble: number;
    titulo: string;
    precio: number;
    activa: boolean;
    created_at?: string | Date;
}
/**
 * Item detallado para la vista "Mis Propiedades / Mis Alquileres" del Locador
 */
export interface MisAlquileresItem {
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
        fecha_publicacion?: string | Date;
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
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string | null;
}
