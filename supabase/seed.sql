-- =============================================================================
-- RentAR - Datos Semilla (seed.sql)
-- =============================================================================

-- Catálogos
INSERT INTO tipo_inmueble (id, descripcion) VALUES
(1, 'Departamento'),
(2, 'Casa'),
(3, 'PH'),
(4, 'Monoambiente')
ON CONFLICT (id) DO NOTHING;

-- Tags individuales por fila
INSERT INTO tag_inmueble (id, descripcion) VALUES
(1, 'Acepta mascotas'),
(2, 'Con cochera'),
(3, 'Amoblado'),
(4, 'Balcón con vista abierta')
ON CONFLICT (id) DO NOTHING;

-- Servicios individuales por fila
INSERT INTO servicio (id, nombre, descripcion) VALUES
(1, 'Luz', 'Suministro de energía eléctrica'),
(2, 'Gas natural', 'Red de gas natural por cañería'),
(3, 'Agua corriente', 'Suministro de agua potable de red'),
(4, 'Internet', 'Conexión a internet por fibra óptica')
ON CONFLICT (id) DO NOTHING;

INSERT INTO rol (id, nombre, descripcion) VALUES
(1, 'locador', 'Propietario que publica y gestiona sus inmuebles en alquiler'),
(2, 'locatario', 'Inquilino que busca, solicita y alquila inmuebles'),
(3, 'administrador', 'Administrador de la plataforma RentAR')
ON CONFLICT (id) DO NOTHING;

-- Usuarios de prueba
INSERT INTO usuario (id, nombre, email, telefono) VALUES
(1, 'Carlos Propietario', 'locador@rentar.com', '+54 9 351 111-2233'),
(2, 'Ana Inquilina', 'locatario@rentar.com', '+54 9 351 444-5566'),
(3, 'Segundo Propietario', 'otro.locador@rentar.com', '+54 9 351 777-8899')
ON CONFLICT (id) DO NOTHING;

-- Roles de usuarios
INSERT INTO usuario_x_rol (id_usuario, id_rol) VALUES
(1, 1), -- Carlos es locador
(2, 2), -- Ana es locatario
(3, 1)  -- Segundo es locador
ON CONFLICT (id_usuario, id_rol) DO NOTHING;

-- Inmueble 1 (Carlos): Departamento disponible publicado
INSERT INTO inmueble (id, tipo, direccion, numero, piso, ciudad, ambientes, dormitorios, banos, m2, descripcion, tags, id_locador, servicios) VALUES
(1, 1, 'Av. Colón', 1550, '4B', 'Córdoba', 3, 2, 1, 65, 'Hermoso departamento luminoso con balcón y excelentes accesos', 1, 1, 4);

-- Contrato para Inmueble 1 (disponible)
INSERT INTO contrato (id, id_inmueble, fecha_inicio, fecha_fin, monto, estado) VALUES
(1, 1, '2026-10-01', '2028-09-30', 350000.00, 'disponible');

-- Publicación activa para Inmueble 1
INSERT INTO publicacion (id, id_inmueble, titulo, precio, activa) VALUES
(1, 1, 'Alquiler Departamento 2 Dormitorios - Centro / Alberdi', 350000.00, TRUE);


-- Inmueble 2 (Carlos): Departamento publicado y ALQUILADO
INSERT INTO inmueble (id, tipo, direccion, numero, piso, ciudad, ambientes, dormitorios, banos, m2, descripcion, tags, id_locador, servicios) VALUES
(2, 1, 'Bv. Chacabuco', 720, '2A', 'Córdoba', 2, 1, 1, 48, 'Departamento en Nueva Córdoba a metros de Ciudad Universitaria', 2, 1, 1);

-- Contrato para Inmueble 2 (vigente / pactado)
INSERT INTO contrato (id, id_inmueble, fecha_inicio, fecha_fin, monto, estado) VALUES
(2, 2, '2026-03-01', '2028-02-28', 290000.00, 'vigente');

-- Relación contrato con locador y locatario (Ana)
INSERT INTO contrato_x_usuario (id_contrato, id_usuario) VALUES
(2, 1), -- Carlos (locador)
(2, 2); -- Ana (locatario)

-- Publicación activa para Inmueble 2
INSERT INTO publicacion (id, id_inmueble, titulo, precio, activa) VALUES
(2, 2, 'Alquiler 1 Dormitorio Nueva Córdoba', 290000.00, TRUE);


-- Inmueble 3 (Carlos): Casa registrada pero NO publicada aún
INSERT INTO inmueble (id, tipo, direccion, numero, piso, ciudad, ambientes, dormitorios, banos, m2, descripcion, tags, id_locador, servicios) VALUES
(3, 2, 'Calle Los Plátanos', 340, NULL, 'Córdoba', 4, 3, 2, 120, 'Casa familiar con amplio patio y asador', 1, 1, 2);


-- Inmueble 4 (Segundo Propietario): De otro locador
INSERT INTO inmueble (id, tipo, direccion, numero, piso, ciudad, ambientes, dormitorios, banos, m2, descripcion, tags, id_locador, servicios) VALUES
(4, 3, 'Av. Rafael Núñez', 4100, NULL, 'Córdoba', 3, 2, 1, 80, 'PH en Cerro de las Rosas con entrada independiente', 2, 3, 3);

INSERT INTO contrato (id, id_inmueble, fecha_inicio, fecha_fin, monto, estado) VALUES
(3, 4, '2026-11-01', '2028-10-31', 420000.00, 'disponible');

INSERT INTO publicacion (id, id_inmueble, titulo, precio, activa) VALUES
(3, 4, 'PH en Cerro de las Rosas', 420000.00, TRUE);

-- Ajuste de secuencias
SELECT setval('tipo_inmueble_id_seq', (SELECT MAX(id) FROM tipo_inmueble));
SELECT setval('tag_inmueble_id_seq', (SELECT MAX(id) FROM tag_inmueble));
SELECT setval('servicio_id_seq', (SELECT MAX(id) FROM servicio));
SELECT setval('rol_id_seq', (SELECT MAX(id) FROM rol));
SELECT setval('usuario_id_seq', (SELECT MAX(id) FROM usuario));
SELECT setval('inmueble_id_seq', (SELECT MAX(id) FROM inmueble));
SELECT setval('contrato_id_seq', (SELECT MAX(id) FROM contrato));
SELECT setval('publicacion_id_seq', (SELECT MAX(id) FROM publicacion));
