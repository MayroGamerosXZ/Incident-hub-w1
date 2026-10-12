# 🚀 Estrategia de Release y Versionamiento Semántico

## 1. Ambientes de Despliegue y Puertas de Aprobación

El ciclo de entrega contempla una progresión de tres ambientes controlados:

```
[Artefacto Drop]
       │
       ▼
┌──────────────────┐
│  Ambiente DEV    │ -> Despliegue automático tras pasar CI en main.
└────────┬─────────┘
         │
         ▼ (Aprobación del QA Specialist - Laura Torres)
┌──────────────────┐
│ Ambiente STAGING │ -> Pruebas de integración y validación funcional.
└────────┬─────────┘
         │
         ▼ (Aprobación manual del Release Manager / SecOps Lead)
┌──────────────────┐
│ Ambiente PROD    │ -> Despliegue final etiquetado con SemVer.
└──────────────────┘
```

## 2. Estrategia de Semantic Versioning (SemVer 2.0.0)

La secuencia evolutiva de versiones a través de las 3 semanas de proyecto se define como:

* **`v0.1.0-w1` (Semana 1):** Versión inicial de desarrollo (Backlog, arquitectura, módulos CRUD base, filtros y primeros PRs).
* **`v0.2.0-w2` (Semana 2):** Versión estabilizada con CI/CD (Pipelines automatizados, resolución de 2 deudas técnicas y fallo controlado resuelto).
* **`v1.0.0` (Semana 3):** Release oficial final para presentación y defensa del proyecto (Dashboard completo, documentación sellada y artefactos publicados).
