import { LoginDTO, UsuarioDTO } from '../dtos';
import { getSupabaseAuth } from '../config/supabase';
import { usuarioRepository } from '../repositories/usuario.repository';

export interface LoginResponseDTO {
  usuario: UsuarioDTO;
  roles: string[];
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export class AuthService {
  async login(data: LoginDTO): Promise<LoginResponseDTO> {
    if (typeof data.email !== 'string' || !data.email.trim()) {
      const error = new Error('El email es obligatorio.');
      (error as any).statusCode = 400;
      throw error;
    }

    if (typeof data.contraseña !== 'string' || !data.contraseña) {
      const error = new Error('La contraseña es obligatoria.');
      (error as any).statusCode = 400;
      throw error;
    }

    const email = data.email.trim().toLowerCase();

    const { data: authData, error: authError } =
      await getSupabaseAuth().auth.signInWithPassword({
        email,
        password: data.contraseña
      });

    if (authError || !authData.user || !authData.session) {
      const error = new Error('El email o la contraseña son incorrectos.');
      (error as any).statusCode = 401;
      throw error;
    }

    const usuario = await usuarioRepository.findByAuthUserId(
      authData.user.id
    );

    if (!usuario) {
      const error = new Error(
        'El usuario autenticado no tiene un perfil registrado.'
      );
      (error as any).statusCode = 401;
      throw error;
    }

    const roles = await usuarioRepository.getRolesByUsuarioId(usuario.id);

    return {
      usuario,
      roles: roles.map(role => role.descripcion),
      access_token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
      expires_in: authData.session.expires_in
    };
  }
}

export const authService = new AuthService();