// src/config.ts
const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const API_BASE_URL = `${VITE_API_URL}/api`;
export const AUTH_BASE_URL = VITE_API_URL;