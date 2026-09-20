import { Request, Response, NextFunction } from 'express';
import { inmuebleService } from '../services/inmueble.service';
import { ApiResponse, InmuebleDTO } from '../dtos';

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

  async getById(req: Request, res: Response<ApiResponse<InmuebleDTO>>, next: NextFunction): Promise<void> {
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

  async create(req: Request, res: Response<ApiResponse<InmuebleDTO>>, next: NextFunction): Promise<void> {
    try {
      // El ID no debe ser provisto por el cliente, es autogenerado
      const { id, ...createData } = req.body;
      const nuevoInmueble = await inmuebleService.create(createData);

      res.status(201).json({
        success: true,
        message: 'Inmueble creado exitosamente con ID generado automáticamente.',
        data: nuevoInmueble
      });
    } catch (error) {
      next(error);
    }
  }

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
