/**
 * Configuración y validación de variables de entorno
 * Este archivo centraliza todas las variables de entorno y las valida
 */

class EnvConfig {
  constructor() {
    this.validateRequiredEnvVars();
  }

  // Firebase Configuration
  firebase = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  };

  // App Configuration
  app = {
    name: process.env.EXPO_PUBLIC_APP_NAME || 'TurnoGo',
    version: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
    environment: process.env.EXPO_PUBLIC_ENVIRONMENT || 'development',
  };

  // Variables requeridas
  requiredEnvVars = [
    'EXPO_PUBLIC_FIREBASE_API_KEY',
    'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
    'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'EXPO_PUBLIC_FIREBASE_APP_ID',
  ];

  /**
   * Valida que todas las variables de entorno requeridas estén configuradas
   */
  validateRequiredEnvVars() {
    const missingVars = this.requiredEnvVars.filter(
      (varName) => !process.env[varName]
    );

    if (missingVars.length > 0) {
      const errorMessage = `
❌ Variables de entorno faltantes:
${missingVars.map((varName) => `  - ${varName}`).join('\n')}

📋 Para configurar:
1. Copia .env.example a .env
2. Completa los valores desde tu proyecto Firebase
3. Reinicia la aplicación

Más info: https://docs.expo.dev/guides/environment-variables/
      `;
      
      console.error(errorMessage);
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }

  /**
   * Verifica si estamos en modo desarrollo
   */
  isDevelopment() {
    return this.app.environment === 'development';
  }

  /**
   * Verifica si estamos en modo producción
   */
  isProduction() {
    return this.app.environment === 'production';
  }

  /**
   * Obtiene la configuración de Firebase
   */
  getFirebaseConfig() {
    return this.firebase;
  }

  /**
   * Obtiene la configuración de la app
   */
  getAppConfig() {
    return this.app;
  }
}

// Crear instancia única
const envConfig = new EnvConfig();

export default envConfig;
