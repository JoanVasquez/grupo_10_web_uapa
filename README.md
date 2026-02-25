## Participantes

- Sarai Rodríguez Santos
- Alan Edberg Cabrera Gómez
- Yanely de Jesús Ledesma Vega
- Fraulyn Anerky Ramírez Aguero
- Miguel Angel Rodríguez Díaz
- José Eladio Santana Fernández
- Joan Manuel Vásquez Rodríguez

# Aplicación de Producto

Aplicación de React + TypeScript construida con Vite.

## Requisitos

- Node.js 24.x
- npm 10+

## Inicio rápido

```bash
npm install
npm run dev
```

La app se ejecuta localmente con el servidor de desarrollo de Vite (por defecto: `http://localhost:5173`).

## Scripts disponibles

- `npm run dev`: inicia el servidor local de desarrollo.
- `npm run build`: verifica tipos y compila los archivos de producción en `dist/`.
- `npm run preview`: previsualiza localmente la compilación de producción.
- `npm run lint`: ejecuta las validaciones de ESLint.
- `npm run test`: ejecuta una vez las pruebas unitarias con Vitest.
- `npm run test:watch`: ejecuta Vitest en modo observación.

## Estructura del proyecto

```text
src/
  components/   componentes reutilizables de UI y funcionalidades
  pages/        páginas a nivel de ruta
  utils/        utilidades auxiliares de UI/configuración
  types/        tipos TypeScript compartidos
  test/         configuración de pruebas
```

## Verificaciones de calidad

Ejecuta esto antes de subir código:

```bash
npm run lint
npm run test
```

## GitHub Actions

Workflows en `.github/workflows`:

- `eslint.yml`: ejecuta ESLint en pull requests dirigidos a `master`.
- `test.yml`: ejecuta pruebas unitarias en pull requests dirigidos a `master`.
- `deploy.yml`: compila y despliega la app estática en GitHub Pages cuando hay pushes a `master` (incluyendo merge commits).

## Despliegue

El despliegue usa GitHub Pages por medio de Actions.

Configuración inicial (una sola vez):

1. Ve a `Settings` del repositorio.
2. Abre `Pages`.
3. Establece la fuente en `GitHub Actions`.
