import { OpenAPI } from '@/api';

export const initOpenAPI = () => {
    OpenAPI.BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
};
