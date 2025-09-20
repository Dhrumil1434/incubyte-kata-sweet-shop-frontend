/**
 * Development Environment Configuration
 * Aligns with your KATA_SWEET_SHOP_BACKEND setup
 */

export const environment = {
  production: false,

  // API Configuration
  apiUrl: 'http://localhost:5000/api',
  apiVersion: 'v1',

  // Application Info
  appName: 'Kata Sweet Shop',
  version: '1.0.0',

  // Default Settings
  defaultLanguage: 'en',
  supportedLanguages: ['en'],
  defaultPageSize: 10,
  maxPageSize: 100,

  // File Upload Limits
  uploadMaxSize: 10 * 1024 * 1024, // 10MB
  supportedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  supportedDocumentTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],

  // Session & Auth
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  refreshTokenInterval: 5 * 60 * 1000, // 5 minutes

  // Error Handling
  errorRetryAttempts: 3,
  errorRetryDelay: 1000, // 1 second

  // Development Settings
  debugMode: true,
  logLevel: 'debug',

  // Feature Flags
  enableMockData: false,
  enableErrorSimulation: false,
  enablePerformanceMonitoring: true,
};
