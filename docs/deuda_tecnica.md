# 💳 Registro de Deuda Técnica (Technical Debt Log)

En cumplimiento de la rúbrica DevOps, se han identificado **5 deudas técnicas reales** en el proyecto, de las cuales se programará la resolución de al menos 2 en la Semana 2:

| # | Deuda Técnica Identificada | Categoría | Impacto | Estado | Tarea / Trazabilidad |
|---|---|---|---|---|---|
| **DT-1** | Falta de validación estricta de esquemas de entrada (Sanitización en API) | Seguridad | Medio: Riesgo de inyección de payloads inválidos. | **Programada para Semana 2** | AB#8 / `refactor/input-validation` |
| **DT-2** | Centralización de errores sin middleware unificado en Express | Mantenibilidad | Bajo: Códigos de error HTTP dispersos en controladores. | **Programada para Semana 2** | AB#15 / `refactor/error-middleware` |
| **DT-3** | Inexistencia de paginación basada en cursor para grandes volúmenes | Escalabilidad | Medio: Degradación de rendimiento cuando la tabla crezca. | Identificada | Backlog |
| **DT-4** | Dependencia de mocks en memoria sin pool persistente obligatorio | Arquitectura | Bajo: Diseñado para aislamiento de CI, pero pendiente pool estricto. | Identificada | Backlog |
| **DT-5** | Ausencia de índices compuestos para reportes analíticos complejos | Rendimiento BD | Bajo: Consultas analíticas en lotes masivos. | Identificada | Backlog |
