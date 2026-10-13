-- ==============================================================
-- PROYECTO INTEGRADOR DEVOPS: IT Incident Hub
-- Script DDL de Base de Datos PostgreSQL
-- Responsable: [DB Engineer] Diego Ramirez (AB#7, AB#18)
-- ==============================================================

-- Creación de Base de Datos
-- CREATE DATABASE incident_hub_db;

-- 1. Tabla de Usuarios / Técnicos
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'TECHNICIAN', -- 'ADMIN', 'COORDINATOR', 'TECHNICIAN', 'USER'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla Principal de Incidentes
CREATE TABLE IF NOT EXISTS incidents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'HARDWARE', 'SOFTWARE', 'NETWORK', 'SECURITY', 'ACCESS'
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIA', -- 'BAJA', 'MEDIA', 'ALTA', 'CRITICA'
    status VARCHAR(30) NOT NULL DEFAULT 'NUEVO', -- 'NUEVO', 'ASIGNADO', 'EN_PROCESO', 'RESUELTO', 'CERRADO'
    reported_by VARCHAR(100) NOT NULL,
    assigned_to_id INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE
);

-- 3. Tabla de Bitácora / Historial de Estados
CREATE TABLE IF NOT EXISTS incident_logs (
    id SERIAL PRIMARY KEY,
    incident_id INT NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    previous_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    changed_by VARCHAR(100) NOT NULL,
    change_reason VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla de Comentarios de Seguimiento
CREATE TABLE IF NOT EXISTS incident_comments (
    id SERIAL PRIMARY KEY,
    incident_id INT NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    author_name VARCHAR(100) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices de Rendimiento para Búsquedas y Filtros
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_priority ON incidents(priority);
CREATE INDEX IF NOT EXISTS idx_incidents_category ON incidents(category);
CREATE INDEX IF NOT EXISTS idx_incidents_assigned_to ON incidents(assigned_to_id);

-- 5. Vista Analitica para Indicadores de Dashboard (AB#7, AB#18)
CREATE OR REPLACE VIEW v_incident_metrics AS
SELECT
    category,
    priority,
    status,
    COUNT(*) AS total_incidents
FROM incidents
GROUP BY category, priority, status;
