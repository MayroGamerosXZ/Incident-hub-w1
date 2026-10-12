# 🏛️ Documento de Arquitectura de Software

## 1. Visión General del Sistema
**IT Incident Hub** es una plataforma centralizada de ingeniería diseñada para sustituir reportes dispersos de incidentes de TI por una solución web trazable, con observabilidad completa y preparada para Integración y Entrega Continua (CI/CD).

```
+-------------------------------------------------------------+
|                     CAPA DE PRESENTACIÓN                    |
|             React 18 SPA + Vite (Puerto 5173 / 80)          |
|    - Vistas de consulta, filtros reactivos y KPIs           |
+------------------------------+------------------------------+
                               | Peticiones HTTP / JSON REST
                               v
+-------------------------------------------------------------+
|                      CAPA DE APLICACIÓN                     |
|            Node.js + Express REST API (Puerto 5000)         |
|   - Controladores de incidentes, validación y bitácora      |
+------------------------------+------------------------------+
                               | Conexión TCP / Driver pg
                               v
+-------------------------------------------------------------+
|                      CAPA DE PERSISTENCIA                   |
|                  PostgreSQL 15 (Puerto 5432)                |
|    - Tablas: users, incidents, incident_logs, comments      |
+-------------------------------------------------------------+
```

## 2. Decisiones Arquitectónicas (ADR)
1. **Separación de Frontend y Backend:** Permite compilaciones independientes y escalado horizontal.
2. **React con Vite en Frontend:** Genera un artefacto estático ligero (`dist/`) sin dependencias de Node.js en producción.
3. **Persistencia Híbrida / Resiliente:** La API cuenta con capa de persistencia PostgreSQL y fallback en memoria para soportar pruebas automatizadas en agentes de CI sin dependencias externas obligatorias.
