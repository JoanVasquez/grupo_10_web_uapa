# Grupo 10 Web UAPA · Documentación General

## Descripción del proyecto

Este repositorio contiene una aplicación web full stack para autenticación de usuarios y gestión de productos. La solución está dividida en dos aplicaciones independientes pero coordinadas:

- **Frontend**: SPA construida con **React + TypeScript + Vite**, encargada de la interfaz de usuario, navegación, formularios, tablas responsivas y consumo de la API.
- **Backend**: API REST construida con **Node.js + Express + TypeScript + TypeORM**, responsable de autenticación, validación, persistencia de datos y reglas básicas de negocio.
- **Base de datos**: **PostgreSQL**, orquestada mediante Docker Compose para entornos de desarrollo.

La aplicación permite registrar usuarios, iniciar sesión y administrar productos mediante operaciones CRUD protegidas por token JWT.

---

## Objetivos técnicos

- Centralizar el flujo de autenticación y autorización del sistema.
- Registrar, consultar, actualizar y eliminar productos desde una interfaz moderna y responsiva.
- Aplicar una separación clara de responsabilidades entre presentación, estado, API, servicios y acceso a datos.
- Facilitar el desarrollo colaborativo del equipo mediante documentación técnica, pruebas automatizadas y contenedores Docker.

---

## Arquitectura general

```text
grupo_10_web_uapa/
├── backend/              # API REST, lógica de negocio y acceso a datos
├── frontend/             # Aplicación cliente en React
├── docker-compose.yml    # Orquestación de frontend, backend y PostgreSQL
└── .env.example          # Variables de entorno base para el backend
```

### Flujo funcional resumido

1. El usuario accede al frontend.
2. El frontend presenta formularios de registro o autenticación.
3. El backend valida la petición y, si corresponde, genera un JWT.
4. El frontend almacena el token y lo envía en las peticiones protegidas.
5. El backend procesa las operaciones CRUD de productos sobre PostgreSQL.
6. El frontend refresca la información mediante RTK Query y actualiza la interfaz.

---

## Stack tecnológico

### Frontend

- React 18
- TypeScript
- Vite
- Redux Toolkit + RTK Query
- React Router DOM
- Tailwind CSS
- Vitest + Testing Library

### Backend

- Node.js
- TypeScript
- Express
- TypeORM
- tsyringe
- PostgreSQL
- JWT (`jsonwebtoken`)
- `express-validator`
- Jest

### DevOps / entorno

- Docker
- Docker Compose
- Nginx para servir el frontend en contenedor

---

## Módulos principales

### Frontend

El frontend incluye los siguientes bloques funcionales:

- Pantalla de autenticación con alternancia entre **inicio de sesión** y **creación de cuenta**.
- Layout administrativo con sidebar, header y panel principal.
- Formulario dinámico para registro y edición de productos.
- Tabla dinámica para visualizar el inventario.
- Hooks personalizados para encapsular lógica de formularios y tablas.
- Integración con el backend usando RTK Query.

📘 Documentación detallada: [`frontend/README.md`](./frontend/README.md)

### Backend

El backend incluye los siguientes bloques funcionales:

- Inicialización de servidor Express.
- Configuración centralizada de base de datos con TypeORM.
- Inyección de dependencias para servicios, repositorios y controladores.
- Endpoints de autenticación y productos.
- Middleware de validación, autenticación y manejo de errores.
- Entidades `User` y `Product` persistidas en PostgreSQL.

📘 Documentación detallada: [`backend/README.md`](./backend/README.md)

---

## Variables de entorno

El proyecto utiliza variables principalmente en el backend. Puedes partir del archivo `.env.example`.

### Backend

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=product_db
JWT_SECRET=change-me-in-production
JWT_EXP_TIME=24h
```

### Frontend

El frontend espera la variable:

```env
VITE_BASE_API=http://localhost:3000
```

En Docker Compose esta variable ya se inyecta automáticamente al servicio frontend.

---

## Ejecución local por módulos

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

Servidor esperado: `http://localhost:3000`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Cliente esperado: `http://localhost:5173`

### 3. Base de datos PostgreSQL

Puedes levantarla manualmente o mediante Docker Compose.

---

## Ejecución completa con Docker Compose

Desde la raíz del repositorio:

```bash
docker compose up --build
```

Servicios disponibles:

- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:3000`
- **PostgreSQL**: `localhost:5432`

### Servicios definidos

- `db`: contenedor PostgreSQL 16 Alpine.
- `backend`: API en modo desarrollo con recarga.
- `frontend`: Vite en modo desarrollo accesible desde la red del host.

---

## API disponible

### Autenticación

- `POST /api/auth/register` → registrar usuario.
- `POST /api/auth/login` → autenticar y recibir JWT.

### Productos

- `POST /api/product` → crear producto.
- `GET /api/product` → listar productos paginados.
- `GET /api/product/:id` → obtener un producto por ID.
- `PUT /api/product/:id` → actualizar producto.
- `DELETE /api/product/:id` → eliminar producto.

### Salud del servicio

- `GET /health` → verificar disponibilidad del backend.

---

## Calidad y pruebas

### Frontend

```bash
cd frontend
npm run lint
npm run test
npm run build
```

### Backend

```bash
cd backend
npm run lint
npm run test
npm run build
```

---

## Colaboración del equipo

Este proyecto fue desarrollado de manera colaborativa por el equipo **Grupo 10 Web UAPA**.

### Participantes

- Sarai Rodríguez Santos
- Alan Edberg Cabrera Gómez
- Yanely de Jesús Ledesma Vega
- Fraulyn Anerky Ramírez Aguero
- Miguel Angel Rodríguez Díaz
- José Eladio Santana Fernández
- Joan Manuel Vásquez Rodríguez

### Enfoque de colaboración recomendado/documentado

Para mantener consistencia técnica y organizativa en el proyecto, la documentación asume una colaboración basada en:

- definición compartida de requisitos funcionales;
- separación entre frontend y backend;
- uso de ramas para nuevas funcionalidades o correcciones;
- validación del código mediante pruebas y linting;
- integración temprana usando Docker Compose;
- documentación continua para facilitar mantenimiento y escalabilidad.

---

## Recomendaciones de mantenimiento

- Mantener sincronizados los contratos entre frontend y backend.
- Sustituir `synchronize: true` por migraciones en ambientes productivos.
- Endurecer políticas CORS y configuración segura de cookies/JWT antes de desplegar en producción.
- Añadir documentación de endpoints con Swagger/OpenAPI si el proyecto seguirá creciendo.
- Incorporar variables de entorno específicas por ambiente (`development`, `test`, `production`).

---

## Documentos relacionados

- [README general del proyecto](./README.md)
- [Documentación del frontend](./frontend/README.md)
- [Documentación del backend](./backend/README.md)
