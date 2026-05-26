# BioMon ADI - Gestión de Biodiversidad Forestal

Sistema integral para el monitoreo de reforestación, gestión de voluntarios y reportes comunitarios en la zona de La Angostura.

##  Stack Tecnológico
- **Frontend:** React 19 + Vite
- **Estilos:** Vanilla CSS (Diseño Premium / Glassmorphism)
- **Estado Global:** React Hooks (useState, useEffect, Context)
- **Enrutamiento:** React Router Dom 7
- **Mapa:** Leaflet + React Leaflet
- **Backend Simulado:** JSON Server (REST API)
- **Notificaciones:** SweetAlert2
- **Iconografía:** Lucide React

##  Arquitectura y Funcionalidades
- **Panel Administrativo:** Gestión de inventario de abonos, censo de árboles (altas/bajas), y control de usuarios/voluntarios.
- **Sistema de Roles:** Acceso diferenciado para Administradores, Voluntarios y Usuarios registrados.
- **Seguimiento de Plantación:** Registro detallado de progreso, clima y cuidados por especie.
- **Buzón Interno:** Gestión de reportes de robo, labores de voluntariado y soporte técnico.
- **Modo Oscuro:** Implementación nativa mediante variables CSS y persistencia en LocalStorage.

## 🔧 Instalación y Despliegue

### 1. Clonar y dependencias
```bash
npm install
```

### 2. Levantar Servidor de Datos (Backend)
En una terminal independiente, ejecutar el servidor JSON (Puerto 3005):
```bash
npx json-server --watch db.json --port 3005
```

### 3. Ejecutar Aplicación (Frontend)
```bash
npm run dev
```

##  Estructura Principal
- `/src/components`: Componentes reutilizables y secciones del dashboard.
- `/src/pages`: Vistas principales de la aplicación.
- `/src/services`: Capa de abstracción para peticiones API (Axios/Fetch).
- `/src/styles`: Sistema de diseño modular y temas (Dark/Light).
- `db.json`: Base de datos local para persistencia de información.

##  Endpoints de la API (JSON Server)
La API está disponible en `http://localhost:3005` con los siguientes recursos:

- **Árboles:** `/arboles` - Censo y seguimiento de especies.
- **Usuarios:** `/usuarios` - Gestión de cuentas y roles.
- **Estadísticas:** `/stats_tipos` - Métricas de planificación por tipo.
- **Abonos:** `/abonos` - Inventario de fertilizantes.
- **Reportes:** `/reportes` - Buzón de soporte técnico.
- **Robos:** `/reportes_robados` - Denuncias de sustracción.
- **Voluntariado:** `/reportes_voluntariado` - Registro de labores de campo.

##  Rutas de la Aplicación
- **Admin:** `/admin` - Dashboard de control total (Privado).
- **Usuario:** `/dashboard-user` - Vista de usuario final.
- **Voluntario:** `/dashboard-voluntario` - Panel de reportes de labores.
