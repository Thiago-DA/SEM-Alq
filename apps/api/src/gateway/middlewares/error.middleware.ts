import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../dtos';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response<ApiResponse<null>>,
  next: NextFunction
): void => {
  const statusCode = err.status || err.statusCode || 400;
  const message = err.message || 'Ocurrió un error inesperado en el servidor.';

  console.error(`[API Gateway Error] ${req.method} ${req.originalUrl} - Status: ${statusCode} - Mensaje: ${message}`);

  res.status(statusCode).json({
    success: false,
    message: 'Error en la solicitud',
    error: message
  });
};
