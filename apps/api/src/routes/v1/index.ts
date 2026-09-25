import { Router } from 'express';
import misAlquileresRoutes from './mis-alquileres.routes';
import inmueblesRoutes from './inmuebles.routes';
import usuariosRoutes from './usuarios.routes';
import authRoutes from './auth.routes';

const v1Router = Router();

// Rutas versión 1
v1Router.use('/mis-alquileres', misAlquileresRoutes);
v1Router.use('/inmuebles', inmueblesRoutes);
v1Router.use('/registrar-usuario', usuariosRoutes);
v1Router.use('/auth', authRoutes);


export default v1Router;
