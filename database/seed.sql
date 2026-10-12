-- ==============================================================
-- PROYECTO INTEGRADOR DEVOPS: IT Incident Hub
-- Script de Datos de Prueba (Seed Data)
-- ==============================================================

-- Inserción de Usuarios del Equipo de TI
INSERT INTO users (name, email, role) VALUES
('Alex Rivera (DevOps)', 'devops.lead@incidents.local', 'ADMIN'),
('Carlos Mendoza (Backend)', 'backend.dev@incidents.local', 'TECHNICIAN'),
('Sofia Gomez (Frontend)', 'frontend.dev@incidents.local', 'TECHNICIAN'),
('Diego Ramirez (DB)', 'database.admin@incidents.local', 'ADMIN'),
('Laura Torres (QA)', 'qa.tester@incidents.local', 'TECHNICIAN'),
('Soporte Nivel 1', 'support.l1@incidents.local', 'TECHNICIAN')
ON CONFLICT (email) DO NOTHING;

-- Inserción de Incidentes de Prueba
INSERT INTO incidents (title, description, category, priority, status, reported_by, assigned_to_id) VALUES
('Fallo en switch principal piso 3', 'Pérdida de conectividad de red cableada en el área de operaciones.', 'NETWORK', 'ALTA', 'ASIGNADO', 'mgarcia@empresa.com', 2),
('Servidor de base de datos con alto uso de CPU', 'PostgreSQL reporta 98% de consumo sostenido de CPU.', 'SOFTWARE', 'CRITICA', 'EN_PROCESO', 'monitoring@empresa.com', 4),
('Falla de arranque en laptop corporativa #104', 'Pantalla azul recurrente al iniciar Windows 11.', 'HARDWARE', 'BAJA', 'NUEVO', 'jlopez@empresa.com', NULL),
('Problema de acceso VPN para usuarios remotos', 'Error 809 de timeout al autenticarse en Gateway corporativo.', 'SECURITY', 'MEDIA', 'RESUELTO', 'claudia.m@empresa.com', 1),
('Bloqueo de cuenta en Directorio Activo', 'Usuario bloqueado por múltiples intentos erróneos.', 'ACCESS', 'BAJA', 'CERRADO', 'rvaldez@empresa.com', 6);

-- Inserción de Historial y Comentarios
INSERT INTO incident_logs (incident_id, previous_status, new_status, changed_by, change_reason) VALUES
(1, 'NUEVO', 'ASIGNADO', 'Carlos Mendoza', 'Asignado para revisión de puertos físicos'),
(2, 'NUEVO', 'ASIGNADO', 'Diego Ramirez', 'Inicio de análisis de queries lentas'),
(2, 'ASIGNADO', 'EN_PROCESO', 'Diego Ramirez', 'Reiniciando réplica de lectura para aislar tráfico');

INSERT INTO incident_comments (incident_id, author_name, comment) VALUES
(1, 'Carlos Mendoza', 'Se procedió al reinicio del switch Cisco Catalyst. Esperando convergencia STP.'),
(2, 'Diego Ramirez', 'Identificada query pesada de reporte de nómina sin índice en fecha.'),
(4, 'Alex Rivera', 'Regla de firewall actualizada en puerto 1194. Servicio restablecido.');
