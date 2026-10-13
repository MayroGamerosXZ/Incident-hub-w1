# 🛡️ IT Incident Hub - Semana 1

> **Proyecto Integrador DevOps** | Entrega Parcial Semana 1  
> **Universidad:** UMG - Análisis de Sistemas II  
> **Organización Azure DevOps:** `DevOps-UMG-Mayro` | **Proyecto:** `incident-hub`  
> **Repositorio Oficial:** [MayroGamerosXZ/Incident-hub-w1](https://github.com/MayroGamerosXZ/Incident-hub-w1)

---

## 👥 Equipo de Ingeniería y Roles Asignados

Para garantizar el cumplimiento de las normas DevOps de trazabilidad y gobernanza de código, las responsabilidades se distribuyen formalmente entre 6 áreas técnicas:

| Rol / Área | Responsable Oficial | Git Author / Usuario | Responsabilidad Principal |
|---|---|---|---|
| **DevOps & Cloud Lead** | **Mayro Geovanni Barrios Gameros** (`@MayroGamerosXZ`) | `devops.lead@incidents.local` | Liderazgo del proyecto, Azure Pipelines, GitHub Actions, Docker y Self-hosted agent. |
| **Backend Engineer** | Carlos Mendoza | `backend.dev@incidents.local` | API REST Node.js/Express, controladores y lógica de negocio. |
| **Frontend UI/UX Dev** | Sofia Gomez | `frontend.dev@incidents.local` | Interfaz React (Vite), estado reactivo y dashboard de incidentes. |
| **Database Architect** | Diego Ramirez | `database.admin@incidents.local` | Esquema relacional PostgreSQL, scripts DDL y persistencia. |
| **QA & Test Specialist** | Laura Torres | `qa.tester@incidents.local` | Suite de pruebas unitarias/integración en Jest y control de fallos. |
| **SecOps & Quality Auditor** | Andres Morales | `secops.audit@incidents.local` | Auditoría de dependencias (`npm audit`), deuda técnica y SemVer. |

---

## 🏗️ Arquitectura de la Solución

* **Frontend:** React 18 SPA con Vite (compilación estática ultrarrápida en `dist/`).
* **Backend:** Node.js con Express, arquitectura por capas (rutas, controladores, modelos).
* **Persistencia:** PostgreSQL con esquemas relacionales, triggers de auditoría y relaciones foráneas.
* **Integración Continua:**
  * **Azure Pipelines (`azure-pipelines.yml`):** Compilación, pruebas unitarias, escaneo de dependencias y empaquetado de artefactos (`drop`).
  * **GitHub Actions (`.github/workflows/ci.yml`):** Validación estática (linting) y escaneo de vulnerabilidades en cada Pull Request.

---

## 📂 Estructura Oficial del Repositorio

```text
incident-hub/
├── .github/
│   └── workflows/
│       └── ci.yml               # Workflow de validación para Pull Requests
├── backend/                     # API REST Node.js + Express
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── db.js
│   ├── package.json
│   └── server.js
├── frontend/                    # Cliente Web React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── database/                    # Scripts DDL y datos de prueba
│   ├── schema.sql
│   └── seed.sql
├── tests/                       # Pruebas automatizadas (Jest)
│   ├── api.test.js
│   └── package.json
├── devops/                      # Configuración de contenedores y utilidades
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   ├── docker-compose.yml
│   └── switch-git-user.ps1
├── docs/                        # Documentación técnica obligatoria
│   ├── arquitectura.md
│   ├── branching.md
│   ├── deuda_tecnica.md
│   ├── seguridad.md
│   └── release_strategy.md
├── azure-pipelines.yml          # Pipeline principal de Azure DevOps
├── .gitignore
└── README.md
```

---

## 🚀 Requisitos de Instalación y Ejecución Local

### Prerrequisitos
* Node.js v18+ y npm v9+
* PostgreSQL 14+ (o Docker Desktop)

### 1. Base de Datos
Ejecutar los scripts de inicialización en PostgreSQL:
```bash
psql -U postgres -d postgres -f database/schema.sql
psql -U postgres -d incident_hub_db -f database/seed.sql
```

### 2. Backend
```bash
cd backend
npm install
npm run dev
# Servidor escuchando en http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
# Aplicación web disponible en http://localhost:5173
```

### 4. Pruebas Unitarias
```bash
cd tests
npm install
npm test
```

---

## 📌 Trazabilidad con Azure Boards
Cada commit y Pull Request en este repositorio está vinculado a un Work Item en Azure Boards mediante la sintaxis `AB#ID`.
Para consultar el tablero completo de trabajo, visite:
👉 [Azure Boards - IT Incident Hub](https://dev.azure.com/DevOps-UMG-Mayro/incident-hub/_boards)
