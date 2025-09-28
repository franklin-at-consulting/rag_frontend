# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Configuration

- API base URL
  - Set `VITE_API_BASE_URL` to point the frontend to your backend API base.
  - Default (if unset) is `https://cepd-ai.com/api`.
  - Create a `.env` file at the project root:
    
    VITE_API_BASE_URL=https://cepd-ai.com/api
  
  - The app uses `src/config.js` to read this value and build endpoints via `apiUrl(path)`.
