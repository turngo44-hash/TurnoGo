import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { loadSelectedProfessional, clearSelectedProfessional } from '../../store/slices/professionalSlice';
import { resetOnboarding } from '../../store/slices/appSlice';
import Notification from '../../components/Notification';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import { useNotification, NotificationMessages } from '../../hooks/useNotification';
import ErrorMappingService from '../../services/ErrorMappingService';

export default function LoginScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  
  // Configurar header nativo (sin botón de volver atrás)
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Iniciar Sesión',
      headerLeft: () => null, // Sin botón de volver atrás
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
      },
      headerStyle: {
        backgroundColor: '#ffffff',
        elevation: 1,
        shadowOpacity: 0.1,
      },
      headerRight: () => (
        <TouchableOpacity style={styles.debugButtonSmall} onPress={handleResetOnboarding}>
          <Text style={styles.debugButtonSmallText}>🔄</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  
  // Hook de notificaciones
  const {
    notification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showNotification,
    hideNotification,
  } = useNotification();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  // Referencias para navegación entre campos
  const scrollViewRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // Limpiar errores cuando el componente se monta
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Función para actualizar campos del formulario
  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // limpiar error del campo mientras escribe (no limpiar errores de envío completos)
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Validaciones por campo (formato). No mostrar errores de campo vacío aquí.
  const validateField = (field, value) => {
    const newErrors = { ...errors };
    if (!value || value.trim() === '') {
      // No mostrar error de "requerido" en onBlur; se mostrará en submit
      delete newErrors[field];
      setErrors(newErrors);
      return true;
    }

    switch (field) {
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) newErrors.email = 'Ingresa un correo electrónico válido';
        else delete newErrors.email;
        break;
      }
      case 'password': {
        if (value.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        else delete newErrors.password;
        break;
      }
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAllFields = () => {
    const newErrors = {};
    if (!formData.email || !formData.email.trim()) newErrors.email = 'El email es requerido';
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) newErrors.email = 'Ingresa un correo electrónico válido';
    }

    if (!formData.password) newErrors.password = 'La contraseña es requerida';
    else if (formData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';

    setErrors(newErrors);
    const keys = Object.keys(newErrors);
    return {
      valid: keys.length === 0,
      firstError: keys.length > 0 ? newErrors[keys[0]] : null,
      errors: newErrors,
    };
  };

  // Validar email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Habilitar envío solo si los campos cumplen requisitos básicos y no hay errores activos
  const canSubmit = (
    validateEmail(formData.email || '') &&
    formData.password &&
    formData.password.length >= 6 &&
    Object.keys(errors).length === 0 &&
    !isLoggingIn &&
    !isLoading
  );

  const handleLogin = async () => {
    // Validaciones (mostrar errores por campo)
    const { valid, firstError, errors: validationErrors } = validateAllFields();
    if (!valid) {
      // Asegurar que los mensajes de validación (p.ej. campos nulos) se muestren inline
      setErrors(validationErrors || {});
      // Enfocar el primer campo con error para que el usuario lo corrija.
      const firstField = Object.keys(validationErrors || {})[0];
      if (firstField === 'email') {
        emailRef.current?.focus();
        setFocusedField('email');
        // Asegurar que el ScrollView muestre el campo
        setTimeout(() => scrollViewRef.current?.scrollTo({ y: 0, animated: true }), 100);
      } else if (firstField === 'password') {
        passwordRef.current?.focus();
        setFocusedField('password');
        setTimeout(() => scrollViewRef.current?.scrollTo({ y: 120, animated: true }), 100);
      }

      return;
    }

    try {
      setIsLoggingIn(true);
      const result = await dispatch(loginUser({ 
        email: formData.email.trim(), 
        password: formData.password 
      }));
      
      if (loginUser.fulfilled.match(result)) {
        setIsLoggingIn(false);
        const successConfig = ErrorMappingService.createSuccessMessage('login', {
          name: result.payload.name || result.payload.displayName
        });
        showNotification(successConfig);

        // Cargar selección de profesional desde storage y navegar si no existe
        const selected = await dispatch(loadSelectedProfessional()).unwrap();
        if (!selected) {
          // Navegar a la pantalla de selección de profesional
          navigation.replace('SelectProfessional');
          return;
        }
        // Si hay seleccionado, navegar a Main (ya lo maneja RootNavigator normalmente)
      } else {
        setIsLoggingIn(false);
        const errorConfig = ErrorMappingService.mapAuthError(result.payload, 'login');
        showNotification(errorConfig);
      }
    } catch (error) {
      setIsLoggingIn(false);
      console.error('Error en login:', error);
      const errorConfig = ErrorMappingService.mapNetworkError(error);
      showNotification(errorConfig);
    }
  };

  const goToRegister = () => {
    dispatch(clearError());
    navigation.navigate('Register');
  };

  const handleGoogleLogin = () => {
    showInfo('Funcionalidad de Google en desarrollo');
  };

  const handleAppleLogin = () => {
    showInfo('Funcionalidad de Apple en desarrollo');
  };

  const handleWhatsAppLogin = () => {
    showInfo('Funcionalidad de WhatsApp en desarrollo');
  };

  const handleResetOnboarding = async () => {
    showWarning('¿Quieres resetear el onboarding para verlo de nuevo?', {
      duration: 6000
    });
    
    // Dar tiempo para que el usuario lea y luego ejecutar
    setTimeout(async () => {
  await dispatch(resetOnboarding());
  // También limpiar la selección de profesional
  await dispatch(clearSelectedProfessional());
  showSuccess('Onboarding reseteado. La app se recargará', {
        duration: 3000
      });
    }, 3000);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" backgroundColor="#ffffff" />
      
      {/* Notificación profesional */}
      <Notification
        visible={notification.visible}
        message={notification.message}
        type={notification.type}
        duration={notification.duration}
        onHide={hideNotification}
      />
      
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        scrollEventThrottle={16}
      >
        {/* Form */}
        <View style={styles.form}>
          <FloatingLabelInput
            inputRef={emailRef}
            label="Email"
            value={formData.email}
            onChangeText={(value) => updateField('email', value)}
            showError={!!errors.email}
            onBlur={() => { validateField('email', formData.email); setFocusedField(null); }}
            onFocus={() => setFocusedField('email')}
            forceFocus={focusedField === 'email'}
            onSubmitEditing={() => passwordRef.current?.focus()}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            editable={!isLoggingIn}
            returnKeyType="next"
            blurOnSubmit={false}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}

          <FloatingLabelInput
            inputRef={passwordRef}
            label="Contraseña"
            value={formData.password}
            onChangeText={(value) => updateField('password', value)}
            showError={!!errors.password}
            onBlur={() => { validateField('password', formData.password); setFocusedField(null); }}
            onFocus={() => setFocusedField('password')}
            forceFocus={focusedField === 'password'}
            onSubmitEditing={() => Keyboard.dismiss()}
            placeholder="Contraseña"
            secureTextEntry
            autoComplete="password"
            editable={!isLoggingIn}
            returnKeyType="done"
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}

          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={() => showInfo('Funcionalidad de recuperación en desarrollo')}
          >
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.loginButton, 
              (isLoading || isLoggingIn) && styles.loginButtonLoading
            ]}
            onPress={handleLogin}
            disabled={isLoading || isLoggingIn}
            activeOpacity={0.8}
          >
            <View style={styles.loginButtonContent}>
              {isLoggingIn ? (
                <>
                  <ActivityIndicator size="small" color="white" style={styles.spinner} />
                  <Text style={[styles.loginButtonText, styles.loginButtonTextLoading]}>
                    Iniciando sesión...
                  </Text>
                </>
              ) : (
                <Text style={styles.loginButtonText}>Iniciar sesión</Text>
              )}
            </View>
          </TouchableOpacity>

          {/* Separador */}
          <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>o continúa con</Text>
            <View style={styles.separatorLine} />
          </View>

          {/* Botones sociales */}
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
              <Image 
                source={require('../../../assets/images/google-logo.png')} 
                style={styles.socialIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.socialButton} onPress={handleAppleLogin}>
              <Ionicons name="logo-apple" size={24} color="#000000" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.socialButton} onPress={handleWhatsAppLogin}>
              <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ¿No tienes cuenta?{' '}
            <Text style={styles.footerLink} onPress={goToRegister}>
              Regístrate
            </Text>
          </Text>
        </View>
      </ScrollView>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  form: {
    marginBottom: 40,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 24,
    marginTop: 6,
  },
  forgotPasswordText: {
    fontSize: 14,
  color: colors.primary,
    fontWeight: '500',
  },
  loginButton: {
  backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 50,
    justifyContent: 'center',
  shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonLoading: {
  backgroundColor: '#0a9b88',
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  loginButtonTextLoading: {
    marginLeft: 8,
    opacity: 0.9,
  },
  spinner: {
    marginRight: 0,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18, // Reducido de 24 a 18 para subirlo
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  separatorText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16, // Reducido de 20 a 16 para subirlo
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: -10,
    marginBottom: 14,
    marginLeft: 4,
  },
  debugButtonSmall: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  debugButtonSmallText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  footerLink: {
  color: colors.primary,
    fontWeight: '600',
  },
});
