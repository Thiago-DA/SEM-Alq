import type { Usuario } from '@rentar/shared-types';

export type { Rol as RolDTO, UsuarioXRol as UsuarioXRolDTO } from '@rentar/shared-types';
export type UsuarioDTO = Omit<Usuario, 'contraseña'>;

