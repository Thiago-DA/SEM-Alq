-- =============================================================================
-- RentAR - Esquema Inicial de Base de Datos
-- Migración: 20260918000000_init_rentar_schema.sql
-- =============================================================================

-- 1. Tabla de Tipos de Inmueble (Departamento, Casa, PH, etc.)
CREATE TABLE IF NOT EXISTS tipo_inmueble (
    id SERIAL PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL
);

-- 2. Tabla de Tag de Inmueble (tag individual por registro)
CREATE TABLE IF NOT EXISTS tag_inmueble (
    id SERIAL PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL
);

-- 3. Tabla de Servicio (servicio individual por registro: Luz, Gas natural, Agua, Internet, etc.)
CREATE TABLE IF NOT EXISTS servicio (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255)
);

-- 4. Tabla de Roles (locador, locatario, administrador)
CREATE TABLE IF NOT EXISTS rol (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
);

-- 5. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefono VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabla de Relación Usuario por Rol
CREATE TABLE IF NOT EXISTS usuario_x_rol (
    id SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    id_rol INT NOT NULL REFERENCES rol(id) ON DELETE CASCADE,
    UNIQUE(id_usuario, id_rol)
);

-- 7. Tabla Inmueble (id autogenerado)
CREATE TABLE IF NOT EXISTS inmueble (
    id SERIAL PRIMARY KEY,
    tipo INT NOT NULL REFERENCES tipo_inmueble(id),
    direccion VARCHAR(255) NOT NULL,
    numero INT NOT NULL,
    piso VARCHAR(50),
    ciudad VARCHAR(100) NOT NULL,
    ambientes INT NOT NULL DEFAULT 1,
    dormitorios INT NOT NULL DEFAULT 0,
    banos INT NOT NULL DEFAULT 1,
    m2 INT NOT NULL,
    descripcion VARCHAR(500),
    tags INT REFERENCES tag_inmueble(id),
    id_locador INT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    servicios INT REFERENCES servicio(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Tabla Contrato
CREATE TABLE IF NOT EXISTS contrato (
    id SERIAL PRIMARY KEY,
    id_inmueble INT NOT NULL REFERENCES inmueble(id) ON DELETE CASCADE,
    fecha_inicio DATE,
    fecha_fin DATE,
    monto NUMERIC(12, 2) NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'disponible', -- 'disponible', 'vigente', 'finalizado', 'cancelado'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Tabla Contrato por Usuario (relaciona contrato con usuarios como locador y locatario)
CREATE TABLE IF NOT EXISTS contrato_x_usuario (
    id SERIAL PRIMARY KEY,
    id_contrato INT NOT NULL REFERENCES contrato(id) ON DELETE CASCADE,
    id_usuario INT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE
);

-- 10. Tabla Publicacion (requiere contrato asociado a nivel de negocio)
CREATE TABLE IF NOT EXISTS publicacion (
    id SERIAL PRIMARY KEY,
    id_inmueble INT NOT NULL REFERENCES inmueble(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    precio NUMERIC(12, 2) NOT NULL,
    activa BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización de consultas
CREATE INDEX IF NOT EXISTS idx_inmueble_locador ON inmueble(id_locador);
CREATE INDEX IF NOT EXISTS idx_contrato_inmueble ON contrato(id_inmueble);
CREATE INDEX IF NOT EXISTS idx_publicacion_inmueble ON publicacion(id_inmueble);
CREATE INDEX IF NOT EXISTS idx_contrato_usuario_contrato ON contrato_x_usuario(id_contrato);
CREATE INDEX IF NOT EXISTS idx_contrato_usuario_usuario ON contrato_x_usuario(id_usuario);
