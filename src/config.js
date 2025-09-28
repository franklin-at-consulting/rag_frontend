// Central API configuration
// Uses Vite env var with a secure default
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://cepd-ai.com/api';

// Helper to build endpoint URLs consistently
export const apiUrl = (path) => `${API_BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

