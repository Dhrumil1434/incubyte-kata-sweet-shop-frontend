export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  ME: '/auth/me',

  // User management
  USERS: '/users',

  // Sweet shop specific endpoints
  SWEETS: '/sweets',
  SWEETS_SEARCH: '/sweets/search',
  SWEET_PURCHASE: (id: number) => `/sweets/${id}/purchase`,
  SWEET_RESTOCK: (id: number) => `/sweets/${id}/restock`,
  SWEET_REACTIVATE: (id: number) => `/sweets/${id}/reactivate`,

  // Category endpoints
  CATEGORIES: '/sweet/category',
  CATEGORIES_ACTIVE: '/sweet/category/active/list',
  CATEGORY_REACTIVATE: (id: number) => `/sweet/category/${id}/reactivate`,

  // Purchase endpoints
  PURCHASES: '/purchases',
  PURCHASES_BY_USER: (userId: number) => `/purchases/user/${userId}`,
  PURCHASES_BY_SWEET: (sweetId: number) => `/purchases/sweet/${sweetId}`,
} as const;

export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  ACCOUNT_NOT_VERIFIED: 'ACCOUNT_NOT_VERIFIED',
  ACCOUNT_NOT_APPROVED: 'ACCOUNT_NOT_APPROVED',
  ACCOUNT_INACTIVE: 'ACCOUNT_INACTIVE',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  TOKEN_MISSING: 'TOKEN_MISSING',
  TOO_MANY_ATTEMPTS: 'TOO_MANY_ATTEMPTS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;
