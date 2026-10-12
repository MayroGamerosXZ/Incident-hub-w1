# 🔒 Política de Seguridad y Análisis de Dependencias

## 1. Gestión de Secretos y Variables Protegidas (Regla 9)
* **Prohibición Estricta:** Ninguna contraseña, token o credencial de base de datos se almacena en el código fuente.
* **Archivos `.env`:** El archivo `.env` se encuentra explícitamente excluido en el `.gitignore`. Solo se versiona `.env.example` con placeholders genéricos.
* **Secretos en CI/CD:** Las variables sensibles se inyectan en tiempo de ejecución a través de:
  - **Azure Pipelines:** Variables secretas protegidas en *Library Variable Groups*.
  - **GitHub Actions:** *Repository Secrets* (`SETTINGS -> Secrets and variables -> Actions`).

## 2. Auditoría de Dependencias (SCA - Software Composition Analysis)
El escaneo de vulnerabilidades se ejecuta mediante `npm audit --audit-level=high` en el pipeline de Pull Requests.

### Matriz de Análisis de Vulnerabilidades (Semana 1)
| Paquete | Versión Analizada | Severidad | CVE / Advisory | Decisión de Ingeniería |
|---|---|---|---|---|
| `express` | 4.19.2 | None | N/A | Paquete seguro y actualizado a la última versión 4.x estable. |
| `pg` | 8.11.5 | None | N/A | Driver oficial de PostgreSQL sin vulnerabilidades conocidas. |
| `vite` | 5.2.11 | None | N/A | Bundler moderno con parche para CVE-2024-31207 aplicado. |
| `react` | 18.3.1 | None | N/A | Core de React actualizado. |
