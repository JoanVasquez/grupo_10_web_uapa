# Backend · Documentación Técnica

## Descripción general

El backend es una **API REST** desarrollada con **Node.js, Express, TypeScript y TypeORM**. Su responsabilidad es gestionar la autenticación de usuarios, aplicar validaciones, exponer endpoints para productos y persistir la información en PostgreSQL.

La API está estructurada en capas para separar responsabilidades entre:

- rutas;
- controladores;
- servicios;
- repositorios;
- entidades;
- middlewares;
- utilidades y manejo de errores.

---

## Stack del backend

- **Node.js**
- **Express**
- **TypeScript**
- **TypeORM**
- **PostgreSQL**
- **tsyringe** para inyección de dependencias
- **jsonwebtoken** para JWT
- **bcryptjs** para hash de contraseñas
- **express-validator** para validación de requests
- **Jest** para pruebas

---

## Estructura del proyecto

```text
backend/
├── src/
│   ├── config/          # Configuración de base de datos
│   ├── controller/      # Controladores HTTP
│   ├── entity/          # Entidades TypeORM
│   ├── error/           # Excepciones personalizadas
│   ├── middleware/      # Validación, auth y manejo de errores
│   ├── repository/      # Acceso a datos
│   ├── route/           # Definición de endpoints
│   ├── service/         # Lógica de negocio
│   ├── types/           # Contratos e interfaces
│   ├── utils/           # Constantes, status y plantillas de respuesta
│   ├── __tests__/       # Pruebas
│   ├── app.ts           # Configuración de Express
│   ├── container.ts     # Registro de dependencias
│   └── index.ts         # Arranque de la aplicación
├── Dockerfile.dev
├── jest.config.js
├── tsconfig.json
└── package.json
```

---

## Inicialización de la aplicación

### `src/index.ts`

Es el punto de entrada del backend. Sus responsabilidades son:

- cargar variables de entorno;
- registrar dependencias;
- iniciar el servidor Express;
- manejar señales de apagado (`SIGTERM`, `SIGINT`).

### `src/app.ts`

Configura el servidor Express:

- habilita `cors`;
- registra `cookie-parser`;
- parsea JSON y formularios;
- expone `GET /health`;
- monta rutas de autenticación y productos;
- instala el middleware global de errores;
- responde `404` para rutas inexistentes.

---

## Configuración de base de datos

La configuración vive en `src/config/database.ts`.

### Características relevantes

- usa un singleton de `DataSource`;
- en pruebas utiliza **SQLite en memoria**;
- en desarrollo usa **PostgreSQL**;
- carga credenciales desde variables de entorno con nombres alternos;
- inicializa entidades `User` y `Product`;
- actualmente usa `synchronize: true`.

### Observación importante

`synchronize: true` es útil para desarrollo, pero no se recomienda para producción. En un entorno real debería reemplazarse por migraciones controladas.

---

## Modelo de datos

### Entidad `User`

Tabla: `tbl_users`

Campos principales:

- `id` (UUID)
- `email`
- `username`
- `password`
- `is_active`

### Entidad `Product`

Tabla: `tbl_products`

Campos principales:

- `id` (UUID)
- `code`
- `name`
- `description`
- `price`
- `category`
- `brand`
- `model`
- `stock`
- `createdAt`
- `updatedAt`

---

## Inyección de dependencias

El proyecto usa **tsyringe** para desacoplar controladores, servicios y repositorios.

Esto permite:

- reemplazar implementaciones con menor impacto;
- simplificar pruebas;
- mantener una arquitectura más modular.

En términos prácticos, los controladores resuelven sus dependencias desde el contenedor y delegan la lógica de negocio a servicios especializados.

---

## Capas de la aplicación

### 1. Rutas

Ubicadas en `src/route/`.

#### `auth-routes.ts`

Define:

- `POST /api/auth/register`
- `POST /api/auth/login`

Aplica validaciones y luego delega en `AuthController`.

#### `product-routes.ts`

Define:

- `POST /api/product`
- `GET /api/product/:id`
- `PUT /api/product/:id`
- `GET /api/product`
- `DELETE /api/product/:id`

Estas rutas requieren autenticación JWT y validaciones según el caso.

### 2. Controladores

#### `AuthController`

Responsable de:

- registrar usuarios;
- autenticar credenciales;
- generar JWT;
- devolver el token en respuesta;
- establecer una cookie segura `token`;
- limpiar cookie en el flujo de logout definido en el controlador.

#### `ProductController`

Extiende un controlador base para reutilizar operaciones CRUD sobre `Product`.

### 3. Servicios

Los servicios encapsulan la lógica de negocio. En el proyecto destacan:

- `user-service.ts`
- `product-service.ts`
- `generic-service.ts`

Esto sugiere una reutilización de patrones CRUD comunes y una especialización donde es necesaria, por ejemplo en autenticación o reglas de usuario.

### 4. Repositorios

Ubicados en `src/repository/`.

Permiten aislar el acceso a TypeORM y la persistencia de entidades.

### 5. Middlewares

Ubicados en `src/middleware/`.

- `validate-request.ts`: procesa errores de validación.
- `auth.ts`: valida JWT para proteger rutas.
- `error-handler.ts`: transforma excepciones en respuestas HTTP consistentes.

---

## Validaciones

Las validaciones están centralizadas en `src/utils/constants.ts` mediante `express-validator`.

### Validaciones de usuario

#### Registro

- `email` válido
- `username` con longitud entre 2 y 8
- `password` con longitud mínima de 5

#### Login

- `email` válido
- `password` obligatorio

### Validaciones de producto

- `code`: entre 3 y 5 caracteres
- `name`: entre 4 y 8 caracteres
- `category`: entre 4 y 8 caracteres
- `brand`: entre 4 y 6 caracteres
- `model`: entre 2 y 6 caracteres
- `price`: número mayor que 0
- `stock`: entero mayor que 1

### Validaciones de paginación

- `page` numérico
- `per_page` numérico

---

## Autenticación y seguridad

La autenticación se basa en **JWT**.

### Flujo

1. El usuario envía email y contraseña.
2. El servicio valida credenciales.
3. El backend genera un token firmado con `JWT_SECRET`.
4. El token se devuelve en la respuesta.
5. Las rutas protegidas esperan el token en el header `Authorization`.

### Variables relacionadas

- `JWT_SECRET`
- `JWT_EXP_TIME`

### Consideraciones

- La cookie del token se configura con `httpOnly`, `secure` y `sameSite: strict`.
- En ambientes locales sin HTTPS, la bandera `secure: true` puede requerir ajustes si se desea depender de cookies para pruebas manuales.
- El frontend actual opera principalmente leyendo el token desde la respuesta para enviarlo por header.

---

## Formato de respuestas

El backend utiliza una plantilla de respuesta (`ResponseTemplate`) para mantener consistencia.

De forma conceptual, las respuestas incluyen:

- código HTTP;
- estado;
- descripción;
- datos devueltos.

Esto facilita que el frontend procese la API de forma homogénea.

---

## Variables de entorno

Puedes comenzar desde `.env.example`.

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=product_db
JWT_SECRET=change-me-in-production
JWT_EXP_TIME=24h
```

Además, el backend utiliza:

```env
PORT=3000
NODE_ENV=development
```

---

## Ejecución local

### Requisitos

- Node.js
- npm
- PostgreSQL disponible

### Instalación

```bash
cd backend
npm install
```

### Desarrollo

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Producción local

```bash
npm run start
```

Servidor esperado:

- `http://localhost:3000`

Endpoint de verificación:

- `GET http://localhost:3000/health`

---

## Scripts disponibles

- `npm run dev` → inicia el backend con recarga.
- `npm run build` → compila TypeScript a `dist/`.
- `npm run start` → ejecuta la build compilada.
- `npm run test` → corre pruebas Jest.
- `npm run test:coverage` → cobertura de pruebas.
- `npm run test-watch` → modo observación.
- `npm run lint` → análisis estático con ESLint.
- `npm run lint:fix` → corrige problemas autocorregibles.

---

## Pruebas

Existen pruebas automatizadas para:

- repositorios;
- middlewares;
- errores y utilidades;
- servicios y controladores.

### Comandos recomendados

```bash
npm run lint
npm run test
npm run build
```

---

## Integración con Docker Compose

Desde la raíz del repositorio puede iniciarse toda la solución con:

```bash
docker compose up --build
```

El servicio backend se configura con:

- puerto `3000`;
- conexión a la base `db`;
- credenciales de PostgreSQL por variables de entorno;
- volumen para desarrollo.

---

## Riesgos técnicos y mejoras recomendadas

- implementar migraciones formales de base de datos;
- ampliar la cobertura de seguridad y configuración CORS;
- documentar la API con OpenAPI/Swagger;
- revisar estrategia de refresh token si la aplicación evoluciona;
- unificar completamente el flujo de logout entre frontend y backend visible en rutas.

---

## Colaboración del equipo

### Participantes

- Sarai Rodríguez Santos
- Alan Edberg Cabrera Gómez
- Yanely de Jesús Ledesma Vega
- Fraulyn Anerky Ramírez Aguero
- Miguel Angel Rodríguez Díaz
- José Eladio Santana Fernández
- Joan Manuel Vásquez Rodríguez

### Colaboración aplicada al backend

La colaboración en backend normalmente abarca:

- diseño de entidades y contratos;
- definición de rutas y controladores;
- implementación de validaciones;
- pruebas de servicios y middlewares;
- integración con base de datos;
- revisión de seguridad y manejo de errores.

---

## Documento relacionado

Para una vista completa del sistema consulta también:

- [`../README.md`](../README.md)
- [`../frontend/README.md`](../frontend/README.md)
