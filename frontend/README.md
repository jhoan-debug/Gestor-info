# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Guía rápida del frontend (añadida por Copilot)

Resumen en español y puntos clave para otros desarrolladores:

- **Entrada principal:** `frontend/src/main.jsx` y `frontend/src/App.jsx` controlan el arranque y la navegación.
- **Cliente API:** `frontend/src/api.js` centraliza llamadas axios; cambia `baseURL` a `import.meta.env.VITE_API_URL` en producción.
- **Autenticación:** `frontend/src/AuthContext.jsx` y `hooks/useAuth.js` manejan el estado de sesión. Considerar usar cookies httpOnly/JWT para mayor seguridad.
- **Supabase:** `frontend/src/supabaseClient.js` contiene la URL y la clave anon; mover a variables de entorno (Vite: `VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY`).
- **Gráficos:** Este proyecto usa `recharts` (instalar con `npm install recharts`).
- **Otras dependencias útiles:** `axios`, `framer-motion`, `@supabase/supabase-js`.

Comandos básicos:

```bash
# Instalar dependencias
npm install

# Levantar el dev server (Vite)
npm run dev

# Build de producción
npm run build
```

Variables de entorno recomendadas (archivo `.env` a nivel de `frontend/`):

```
VITE_API_URL=http://127.0.0.1:8000
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_KEY=tu_clave_anon
```

Seguridad y buenas prácticas:

- No comitees claves en el repositorio. Reemplaza las claves embebidas por variables de entorno.
- Revisa `frontend/src/supabaseClient.js` y `frontend/src/api.js` al desplegar.

Si quieres, puedo aplicar estos cambios automáticos para usar `import.meta.env` en los archivos relevantes.
