import { Router } from 'express';
import misAlquileresRoutes from './mis-alquileres.routes';
import inmueblesRoutes from './inmuebles.routes';
import publicacionesRoutes from './publicaciones.routes';

const v1Router = Router();

// Rutas versión 1
v1Router.use('/mis-alquileres', misAlquileresRoutes);
v1Router.use('/inmuebles', inmueblesRoutes);
v1Router.use('/publicaciones', publicacionesRoutes);

export default v1Router;
