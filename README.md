# BioMon ADI - Gestión de Biodiversidad Forestal

## 1. Introducción y Arquitectura General
Sistema integral para el monitoreo de reforestación, gestión de voluntarios y reportes comunitarios en la zona de La Angostura.

El proyecto es un sistema **Full Stack** estructurado en un solo repositorio que separa claramente la interfaz de usuario (Frontend) y los servicios de datos (Backend).
- **Panel Administrativo:** Gestión de inventario de abonos, censo de árboles (altas/bajas), y control total de usuarios/voluntarios.
- **Sistema de Roles:** Acceso y flujos diferenciados para Administradores, Voluntarios y Usuarios Visitantes.
- **Seguimiento de Plantación:** Registro detallado de progreso, clima, cuidados por especie y reportes históricos.
- **Buzón Interno:** Gestión de reportes de robo, labores de voluntariado y peticiones comunitarias.
- **Modo Oscuro:** Implementación nativa para la reducción de fatiga visual.

---

## 2. Backend (API)
El backend está construido con **Node.js, Express, MySQL y Sequelize**. Proporciona una API RESTful segura y documentada.

### Instrucciones de Instalación
```bash
cd backend
npm install
```

### Variables de Entorno
Copia el archivo de ejemplo para configurar tus credenciales locales:
```bash
cp .env.example .env
```
Asegúrate de configurar en tu archivo `.env` las credenciales requeridas para:
- Conexión a Base de Datos MySQL (`DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`, `DB_HOST`).
- Seguridad JWT (`JWT_SECRET`, `JWT_EXPIRES_IN`).
- Almacenamiento Cloudinary (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).
- Envío de Correos SMTP (`SMTP_USER`, `SMTP_PASS`).

### Inicialización de Base de Datos y Servidor
```bash
# Crea la base de datos automáticamente, corre migraciones y aplica seeders
npm run setup

# Levanta el servidor backend en modo desarrollo
npm run dev
```

### Documentación Swagger
La API está completamente documentada de forma interactiva. Una vez que el servidor backend esté corriendo, accede a Swagger en:
- 👉 **http://localhost:3005/api-docs** *(o el puerto que hayas definido)*

### Comandos de Pruebas
Las pruebas unitarias y de integración están construidas con **Jest** y **Supertest**.
```bash
cd backend
npm test
```

---

## 3. Frontend (App)
La aplicación cliente está desarrollada con **React 19**, construida con **Vite** y estilizada mediante **Tailwind CSS 4**.

### Comandos de Instalación (Vite)
```bash
cd frontend/ReacProyecto
npm install
```

### Configuración de Tailwind CSS
El proyecto utiliza **Tailwind CSS 4** junto con variables nativas de CSS para manejar temas oscuros y diseños premium (glassmorphism). Toda la integración se maneja a través de Vite y `postcss.config.js`. No se requieren pasos extra de compilación, Tailwind está listo para usarse.

### Ejecución del Servidor de Desarrollo
```bash
cd frontend/ReacProyecto
npm run dev
```
La aplicación estará disponible de forma predeterminada en **http://localhost:5173**.

### Ejecución de Pruebas
Las pruebas de componentes y simulaciones de flujos de usuario (como el login) están configuradas con **Vitest** y **Testing Library**.
```bash
cd frontend/ReacProyecto
npm test
```
