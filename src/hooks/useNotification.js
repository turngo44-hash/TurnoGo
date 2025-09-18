import { useState, useCallback } from 'react';

export const useNotification = () => {
  const [notification, setNotification] = useState({
    visible: false,
    message: '',
    type: 'info',
    duration: 4000,
  });

  const showNotification = useCallback((config) => {
    setNotification({
      visible: true,
      message: config.message,
      type: config.type || 'info',
      duration: config.duration || 4000,
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, visible: false }));
  }, []);

  // Métodos de conveniencia para diferentes tipos
  const showSuccess = useCallback((message, options = {}) => {
    showNotification({
      message,
      type: 'success',
      ...options,
    });
  }, [showNotification]);

  const showError = useCallback((message, options = {}) => {
    showNotification({
      message,
      type: 'error',
      ...options,
    });
  }, [showNotification]);

  const showWarning = useCallback((message, options = {}) => {
    showNotification({
      message,
      type: 'warning',
      ...options,
    });
  }, [showNotification]);

  const showInfo = useCallback((message, options = {}) => {
    showNotification({
      message,
      type: 'info',
      ...options,
    });
  }, [showNotification]);

  return {
    notification,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification,
  };
};

// Mensajes predefinidos profesionales para diferentes escenarios
export const NotificationMessages = {
  // Errores de autenticación
  auth: {
    emailExists: 'Este email ya está registrado. ¿Quizás quieras iniciar sesión?',
    invalidEmail: 'Por favor verifica que el email sea válido',
    weakPassword: 'La contraseña debe tener al menos 6 caracteres',
    wrongPassword: 'La contraseña no es correcta. Inténtalo de nuevo',
    userNotFound: 'No encontramos una cuenta con este email',
    tooManyRequests: 'Demasiados intentos. Espera un momento antes de volver a intentar',
    networkError: 'Problema de conexión. Revisa tu internet e intenta de nuevo',
    invalidCredentials: 'Email o contraseña incorrectos',
    userDisabled: 'Esta cuenta ha sido deshabilitada. Contacta a soporte',
    requiresRecentLogin: 'Por seguridad, necesitas iniciar sesión nuevamente',
  },
  
  // Éxitos
  success: {
    accountCreated: '¡Cuenta creada exitosamente! Bienvenido a TurnoGo',
    loginSuccess: '¡Hola de nuevo! Has iniciado sesión correctamente',
    profileUpdated: 'Tu perfil ha sido actualizado',
    passwordReset: 'Te hemos enviado un email para restablecer tu contraseña',
  },
  
  // Validaciones
  validation: {
    requiredFields: 'Por favor completa todos los campos obligatorios',
    passwordMismatch: 'Las contraseñas no coinciden',
    invalidPhone: 'Por favor ingresa un número de teléfono válido',
    nameRequired: 'El nombre es obligatorio',
    businessNameRequired: 'El nombre del negocio es obligatorio',
  },
  
  // Generales
  general: {
    unexpectedError: 'Algo salió mal. Por favor intenta de nuevo',
    saveSuccess: 'Guardado exitosamente',
    deleteSuccess: 'Eliminado correctamente',
    updateSuccess: 'Actualizado correctamente',
  }
};
