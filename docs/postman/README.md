# Postman — BioMon ADI API

Colección y entorno generados desde las rutas reales de `backend/src/routes/`.

## Importar en Postman

1. **Import** → arrastra o selecciona:
   - `BioMon-ADI-API.postman_collection.json`
   - `BioMon-Local.postman_environment.json`
2. Activa el environment **BioMon Local** (esquina superior derecha).
3. Ejecuta **01 - Auth → POST Login Admin** (guarda `token` automáticamente).
4. Prueba el resto de requests (heredan `Bearer {{token}}`).

## Requisitos

- Backend Express en marcha (`backend/`: `npm run dev`).
- `PORT=3005` en `.env` del backend (mismo puerto que el proxy de Vite).
- Base de datos con seeds: `npm run setup` (usuarios demo).

## Credenciales demo (seed)

| Rol        | Email                         | Password      |
|------------|-------------------------------|---------------|
| Admin      | admin@reforestacion.com       | password123   |
| Voluntario | voluntario@reforestacion.com  | password123   |
| Usuario    | usuario@reforestacion.com     | password123   |

## Variables de entorno

| Variable            | Uso                                      |
|---------------------|------------------------------------------|
| `baseUrl`           | `http://localhost:3005/api`              |
| `token`             | JWT (se llena al hacer login)            |
| `resourceId`        | ID para rutas `:id`                      |
| `adminEmail` / …    | Logins por rol                           |

## Regenerar la colección

Si cambian rutas en el backend:

```bash
node docs/postman/generate-postman.js
```

## Notas

- **Reportes de robo:** `POST /api/reportes` con `"tipo": "robo"` (no hay `/reportes_robados`).
- **Health:** `GET http://localhost:3005/` está fuera del prefijo `/api`.
- Respuestas estándar muchas veces: `{ status, message, data, error }`; auth devuelve `{ token, user }`.

Documentación de arquitectura: [`../ARCHITECTURE.md`](../ARCHITECTURE.md) (sección 8).
