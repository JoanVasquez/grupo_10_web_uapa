# Frontend · Documentación Técnica

## Descripción general

El frontend es una **Single Page Application (SPA)** desarrollada con **React, TypeScript y Vite**. Su objetivo es ofrecer una interfaz de usuario moderna para autenticación y administración de productos, conectándose con la API del backend mediante RTK Query.

La aplicación está diseñada para:

- registrar usuarios;
- autenticar sesiones;
- visualizar productos en una tabla responsiva;
- crear y editar productos;
- eliminar registros existentes;
- mantener una estructura de componentes reutilizables.

---

## Stack del frontend

- **React 18** para la construcción de interfaces.
- **TypeScript** para tipado estático.
- **Vite** como bundler y servidor de desarrollo.
- **Redux Toolkit / RTK Query** para manejo de estado remoto.
- **React Router DOM** para enrutamiento.
- **Tailwind CSS** para estilos utilitarios.
- **Vitest + Testing Library** para pruebas.

---

## Estructura del proyecto

```text
frontend/
├── src/
│   ├── components/
│   │   ├── common/      # Componentes reutilizables de UI
│   │   └── features/    # Componentes compuestos por funcionalidad
│   ├── hooks/           # Hooks personalizados para lógica de formularios y tablas
│   ├── pages/           # Páginas enlazadas por rutas
│   ├── stores/          # Configuración de Redux y RTK Query
│   ├── types/           # Tipos TypeScript del dominio
│   ├── utils/           # Constantes y validaciones auxiliares
│   ├── test/            # Setup global de pruebas
│   └── __tests__/       # Casos de prueba adicionales
├── Dockerfile.dev
├── nginx.conf
├── vite.config.ts
└── package.json
```

---

## Flujo de navegación

La aplicación define dos grandes espacios:

1. **Ruta `/`**
   - muestra `AuthPage`;
   - permite alternar entre inicio de sesión y registro.

2. **Ruta `/dashboard/*`**
   - carga el layout administrativo;
   - muestra dashboard, tabla de productos y formulario de registro/edición.

### Flujo funcional esperado

1. El usuario entra a la pantalla de autenticación.
2. Si no tiene cuenta, se registra.
3. Inicia sesión y obtiene un token.
4. El token se guarda en `localStorage`.
5. Las peticiones a productos incluyen el header `Authorization: Bearer <token>`.
6. El usuario puede consultar, editar, registrar y eliminar productos.

---

## Arquitectura interna

### 1. Punto de entrada

- `src/main.tsx` monta React, `BrowserRouter` y el `Provider` de Redux.
- `src/App.tsx` delega la navegación principal a `AppLayout`.

### 2. Layout y páginas

#### `AppLayout`

Administra las rutas principales de la aplicación:

- `/` → autenticación.
- `/dashboard/*` → panel administrativo.

#### `AuthPage`

- contiene el contenedor visual para autenticación;
- alterna entre `SignIn` y `SignUp` usando estado local;
- usa un `Card` como contenedor principal.

#### `ProductsTablePage`

- renderiza la tabla dinámica de productos;
- muestra alertas de éxito o error;
- se apoya en `useProductsTable`.

#### `RegisterUpdateProductsPage`

- reutiliza un formulario dinámico;
- soporta creación y edición;
- usa `useProductForm` para centralizar validación y envío.

---

## Gestión de estado y consumo de API

El frontend utiliza **Redux Toolkit** con **RTK Query**.

### Store global

El store registra dos APIs:

- `authApi`
- `productApi`

### `authApi`

Incluye endpoints para:

- `register`
- `login`
- `logout` (definido en el frontend, aunque el backend actual expone principalmente login/registro en rutas visibles)

### `productApi`

Incluye endpoints para:

- crear producto;
- actualizar producto;
- listar productos;
- obtener un producto por ID;
- eliminar producto.

### Base URL

La base de la API se toma desde:

```ts
import.meta.env.VITE_BASE_API
```

Esto permite configurar diferentes URLs por ambiente sin modificar el código fuente.

---

## Componentes principales

### Componentes comunes

El directorio `components/common` agrupa piezas reutilizables, entre ellas:

- `Button`
- `Input`
- `Textarea`
- `Alert`
- `Card`
- `Badge`
- `Icons`
- `FormError`

Su propósito es estandarizar la experiencia visual y evitar duplicación.

### Componentes de funcionalidad (`features`)

Incluyen componentes compuestos y orientados al dominio, por ejemplo:

- `Header`
- `Sidebar`
- `Section`
- `DashBoard`
- `DynamicForm`
- `DynamicDataTable`
- `SignIn`
- `SignUp`
- `AppLayout`

---

## Formularios y validaciones

La app emplea hooks personalizados para separar la lógica del renderizado.

### Hooks principales

- `useSignInForm`
- `useSignUpForm`
- `useProductForm`
- `useProductsTable`

### Responsabilidades típicas de estos hooks

- control de estado de campos;
- validación de entradas;
- mapeo de errores;
- integración con mutaciones/queries RTK Query;
- navegación o actualización de vistas tras operaciones exitosas.

---

## Tipos del dominio

El frontend define tipos en `src/types` para mantener consistencia con la API:

- `User`
- `Product`
- `Response`
- `FormField`

Esto reduce errores de integración y mejora la mantenibilidad del código.

---

## Estilos y experiencia responsive

La aplicación usa **Tailwind CSS** y una estructura orientada a interfaces adaptables.

### Consideraciones visuales implementadas

- pantalla de autenticación centrada;
- dashboard con navegación lateral;
- tabla adaptable a diferentes tamaños de pantalla;
- formularios organizados por columnas;
- componentes reutilizables con estilos consistentes.

---

## Configuración local

### Requisitos

- Node.js
- npm

### Instalación

```bash
cd frontend
npm install
```

### Variables de entorno

Crear un archivo `.env` opcional dentro de `frontend/` si deseas sobreescribir la API:

```env
VITE_BASE_API=http://localhost:3000
```

### Ejecución en desarrollo

```bash
npm run dev
```

Disponible normalmente en:

- `http://localhost:5173`

### Build de producción

```bash
npm run build
```

### Previsualización local

```bash
npm run preview
```

---

## Scripts disponibles

- `npm run dev` → inicia Vite en desarrollo.
- `npm run build` → compila TypeScript y genera build de producción.
- `npm run preview` → sirve localmente la compilación.
- `npm run lint` → ejecuta ESLint.
- `npm run test` → ejecuta pruebas con Vitest.
- `npm run test:coverage` → genera cobertura.
- `npm run test:watch` → ejecuta pruebas en modo observación.

---

## Pruebas

El proyecto cuenta con pruebas en:

- componentes comunes;
- layout y páginas;
- hooks;
- store y APIs;
- componentes de autenticación y dashboard.

Archivos relevantes incluyen pruebas de:

- `Button`
- `Input`
- `Textarea`
- `Icons`
- `Header`
- `Sidebar`
- `SignIn`
- `SignUp`
- `AppLayout`
- páginas y hooks de productos

### Comandos de calidad recomendados

```bash
npm run lint
npm run test
npm run build
```

---

## Despliegue y contenedores

### Docker

El frontend dispone de:

- `Dockerfile.dev` para desarrollo en contenedor.
- `nginx.conf` para servir la aplicación según la estrategia de despliegue necesaria.

### Integración con Docker Compose

Cuando se levanta desde la raíz del repositorio:

```bash
docker compose up --build
```

el frontend queda conectado al backend mediante la variable `VITE_BASE_API` configurada en `docker-compose.yml`.

---

## Riesgos o puntos de mejora identificados

- Revisar consistencia entre endpoints disponibles en frontend y backend, especialmente logout.
- Añadir manejo centralizado de sesión expirada.
- Considerar persistencia de usuario autenticado en Redux si el proyecto evoluciona.
- Incorporar documentación visual de componentes si se desea escalar el sistema de diseño.

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

### Colaboración aplicada al frontend

La naturaleza del frontend favorece trabajo colaborativo en:

- diseño de componentes reutilizables;
- implementación de páginas y flujos de navegación;
- validación de formularios;
- pruebas unitarias;
- revisión de experiencia responsive;
- integración con contratos del backend.

---

## Documento relacionado

Para la visión completa del sistema consulta también:

- [`../README.md`](../README.md)
- [`../backend/README.md`](../backend/README.md)
