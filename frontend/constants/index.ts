export const IS_PRODUCTION = import.meta.env.VITE_NODE_ENV == 'production';

export const BASE_URL = IS_PRODUCTION ? import.meta.env.VITE_BASE_URL : 'http://localhost:5000';