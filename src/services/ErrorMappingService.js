import { NotificationMessages } from '../hooks/useNotification';

/**
 * Servicio para mapear errores de Firebase a mensajes profesionales
 */
export class ErrorMappingService {
  
  /**
   * Mapea códigos de error de Firebase Auth a mensajes profesionales
   * @param {string} errorCode - Código de error de Firebase
   * @param {string} operation - Tipo de operación (login, register, etc.)
   * @returns {string} Mensaje profesional para mostrar al usuario
   */
  static mapAuthError(errorCode, operation = 'general') {
    if (!errorCode) return NotificationMessages.general.unexpectedError;
    
    // Normalizar el código de error
    const normalizedCode = errorCode.toLowerCase().replace('auth/', '');
    
    const authErrorMap = {
      // Errores de registro
      'email-already-in-use': {
        message: NotificationMessages.auth.emailExists,
        type: 'warning'
      },
      'weak-password': {
        message: NotificationMessages.auth.weakPassword,
        type: 'warning'
      },
      'invalid-email': {
        message: NotificationMessages.auth.invalidEmail,
        type: 'warning'
      },
      
      // Errores de login
      'user-not-found': {
        message: NotificationMessages.auth.userNotFound,
        type: 'warning'
      },
      'wrong-password': {
        message: NotificationMessages.auth.wrongPassword,
        type: 'error'
      },
      'invalid-credential': {
        message: NotificationMessages.auth.invalidCredentials,
        type: 'error'
      },
      
      // Errores de seguridad
      'too-many-requests': {
        message: NotificationMessages.auth.tooManyRequests,
        type: 'warning'
      },
      'user-disabled': {
        message: NotificationMessages.auth.userDisabled,
        type: 'error'
      },
      
      // Errores de red
      'network-request-failed': {
        message: NotificationMessages.auth.networkError,
        type: 'warning'
      },
      
      // Errores de sesión
      'requires-recent-login': {
        message: NotificationMessages.auth.requiresRecentLogin,
        type: 'info'
      },
      
      // Errores de operación
      'operation-not-allowed': {
        message: 'Esta operación no está permitida. Contacta a soporte',
        type: 'error'
      }
    };
    
    // Buscar el error específico
    const errorInfo = authErrorMap[normalizedCode];
    
    if (errorInfo) {
      return {
        message: errorInfo.message,
        type: errorInfo.type,
        duration: this.getErrorDuration(errorInfo.type)
      };
    }
    
    // Error no mapeado - mostrar mensaje genérico
    return {
      message: `Error: ${errorCode}`,
      type: 'error',
      duration: 5000
    };
  }
  
  /**
   * Mapea errores de validación de formularios
   * @param {Object} validationErrors - Objeto con errores de validación
   * @returns {Object} Configuración de notificación
   */
  static mapValidationError(validationErrors) {
    const errorCount = Object.keys(validationErrors).length;
    
    if (errorCount === 1) {
      const field = Object.keys(validationErrors)[0];
      const error = validationErrors[field];
      
      return {
        message: `${field}: ${error}`,
        type: 'warning',
        duration: 4000
      };
    }
    
    return {
      message: `Hay ${errorCount} campos con errores. Por favor revísalos`,
      type: 'warning',
      duration: 5000
    };
  }
  
  /**
   * Mapea errores de red generales
   * @param {Error} error - Error de red
   * @returns {Object} Configuración de notificación
   */
  static mapNetworkError(error) {
    if (error.code === 'NETWORK_ERROR' || error.message.includes('network')) {
      return {
        message: NotificationMessages.auth.networkError,
        type: 'warning',
        duration: 6000
      };
    }
    
    return {
      message: NotificationMessages.general.unexpectedError,
      type: 'error',
      duration: 5000
    };
  }
  
  /**
   * Obtiene la duración apropiada para el tipo de error
   * @param {string} type - Tipo de notificación
   * @returns {number} Duración en milisegundos
   */
  static getErrorDuration(type) {
    const durations = {
      'error': 6000,     // Errores críticos - más tiempo
      'warning': 5000,   // Advertencias - tiempo medio
      'info': 4000,      // Información - menos tiempo
      'success': 4000    // Éxitos - menos tiempo
    };
    
    return durations[type] || 5000;
  }
  
  /**
   * Crea mensajes de éxito personalizados
   * @param {string} operation - Tipo de operación exitosa
   * @param {Object} data - Datos adicionales (nombre, email, etc.)
   * @returns {Object} Configuración de notificación de éxito
   */
  static createSuccessMessage(operation, data = {}) {
    const successMessages = {
      'register': {
        message: data.businessName 
          ? `¡Bienvenido a TurnoGo, ${data.businessName}! Tu cuenta de negocio está lista`
          : NotificationMessages.success.accountCreated,
        duration: 6000
      },
      'login': {
        message: data.name 
          ? `¡Hola ${data.name}! Bienvenido de vuelta`
          : NotificationMessages.success.loginSuccess,
        duration: 4000
      },
      'profile-update': {
        message: NotificationMessages.success.profileUpdated,
        duration: 3000
      },
      'password-reset': {
        message: NotificationMessages.success.passwordReset,
        duration: 8000
      }
    };
    
    const successInfo = successMessages[operation] || {
      message: NotificationMessages.general.saveSuccess,
      duration: 3000
    };
    
    return {
      ...successInfo,
      type: 'success'
    };
  }
}

export default ErrorMappingService;
