/**
 * Frontend Configuration
 */

// API Base URL - Change based on environment
window.API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

// Feature Flags
window.FEATURES = {
  ENABLE_REAL_TIME_TRACKING: true,
  ENABLE_CHAT_SUPPORT: true,
  ENABLE_PAYMENT_GATEWAY: true,
  ENABLE_NOTIFICATIONS: true,
};

// App Configuration
window.APP_CONFIG = {
  APP_NAME: 'Vehicle Breakdown Assistance',
  APP_VERSION: '1.0.0',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
};

// Toast/Notification config
window.TOAST_CONFIG = {
  DURATION: 3000, // 3 seconds
  POSITION: 'bottom-right',
};

// Log configuration
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

window.DEBUG = isDevelopment;

if (window.DEBUG) {
  console.log('🚀 Development Mode Enabled');
  console.log('API Base URL:', window.API_BASE_URL);
}