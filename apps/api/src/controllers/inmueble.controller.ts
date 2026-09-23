import { Request, Response, NextFunction } from 'express';
import { inmuebleService } from '../services/inmueble.service';
import { ApiResponse, InmuebleDTO, InmuebleDetalleDTO } from '../dtos';

export class InmuebleController {
  async getAll(req: Request, res: Response<ApiResponse<InmuebleDTO[]>>, next: NextFunction): Promise<void> {
    try {
      const inmuebles = await inmuebleService.findAll();
      res.status(200).json({
        success: true,
        message: 'Inmuebles obtenidos exitosamente',
        data: inmuebles
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response<ApiResponse<InmuebleDetalleDTO>>, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'El ID proporcionado debe ser un número entero válido.'
        });
        return;
      }

      const inmueble = await inmuebleService.getById(id);
      if (!inmueble) {
        res.status(404).json({
          success: false,
          error: `Inmueble con ID ${id} no encontrado.`
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: inmueble
      });
    } catch (error) {
      next(error);
    }
  }

  async getInmueblesDisponibles(req: Request, res: Response<ApiResponse<InmuebleDTO[]>>, next: NextFunction): Promise<void> {
    try {
      const inmuebles = await inmuebleService.getInmueblesDisponibles();
      res.status(200).json({
        success: true,
        message: 'Propiedades disponibles obtenidas exitosamente',
        data: inmuebles
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Endpoint de registro de propiedad (US-01).
   * Todo inmueble debe registrarse con fotos y condiciones de contrato asociadas.
   */
  async create(req: Request, res: Response<ApiResponse<InmuebleDTO>>, next: NextFunction): Promise<void> {
    try {
      const user = (req as any).user;
      const locadorId = user?.id || parseInt(req.header('x-user-id') || '1', 10);

      const nuevo = await inmuebleService.registrarPropiedadCompleta(req.body, locadorId);
      res.status(201).json({
        success: true,
        message: 'Propiedad registrada exitosamente con contrato y fotos vinculadas.',
        data: nuevo
      });
    } catch (error) {
      next(error);
    }
  }
  // TODO: mantener consistencia con la creación. Pendiente para cuando se defina la US de modificar propiedades.
  async update(req: Request, res: Response<ApiResponse<InmuebleDTO>>, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'ID inválido.'
        });
        return;
      }

      const actualizado = await inmuebleService.update(id, req.body);
      if (!actualizado) {
        res.status(404).json({
          success: false,
          error: `Inmueble con ID ${id} no encontrado.`
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Inmueble actualizado exitosamente.',
        data: actualizado
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response<ApiResponse<null>>, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'ID inválido.'
        });
        return;
      }

      const eliminado = await inmuebleService.delete(id);
      if (!eliminado) {
        res.status(404).json({
          success: false,
          error: `Inmueble con ID ${id} no encontrado.`
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Inmueble eliminado correctamente.'
      });
    } catch (error) {
      next(error);
    }
  }
}

export const inmuebleController = new InmuebleController();

