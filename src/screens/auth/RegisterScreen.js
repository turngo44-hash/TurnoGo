import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { registerUser, clearError } from '../../store/slices/authSlice';
import Notification from '../../components/Notification';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import { useNotification, NotificationMessages } from '../../hooks/useNotification';
import ErrorMappingService from '../../services/ErrorMappingService';
import { useCountry } from '../../contexts/CountryContext';
import { CategorySelector, CategoryPicker } from '../../components/CategoryPicker';
import { CountryPicker as CountryPickerFirebase } from '../../components/CountryPickerFirebase';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  
  // Configurar header nativo
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Crear Negocio',
      headerBackTitleVisible: false,
      headerBackTitle: '', // Sin texto "Back"
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
      headerTintColor: '#1F2937',
      // Usar un headerLeft personalizado para controlar exactamente el icono de volver
      // Esto garantiza que no se muestre texto y permite controlar el margen izquierdo.
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 12, paddingRight: 12 }}>
          <Ionicons name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'} size={22} color="#1F2937" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  
  // Hook de país para obtener el indicativo telefónico
  const { selectedCountry, selectCountry } = useCountry();
  
  // Hook de notificaciones
  const {
    notification,
    showSuccess,
    showError,
    showWarning,
    showNotification,
    hideNotification,
  } = useNotification();

  // Estados del formulario
  const [formData, setFormData] = useState({
    businessName: '',
    businessEmail: '',
    businessPhone: '',
    businessCategory: null, // Objeto completo de la categoría seleccionada
    password: '',
    confirmPassword: '',
  });

  // Estados de validación
  const [errors, setErrors] = useState({});
  const [isRegistering, setIsRegistering] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showSubmitErrors, setShowSubmitErrors] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  // Referencias para navegación entre campos
  const scrollViewRef = useRef(null);
  const businessNameRef = useRef(null);
  const businessEmailRef = useRef(null);
  const businessPhoneRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  // Limpiar errores cuando el componente se monta
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Inicializar teléfono con indicativo del país seleccionado
  useEffect(() => {
    if (selectedCountry && (!formData.businessPhone || formData.businessPhone === '')) {
      setFormData(prev => ({
        ...prev,
        businessPhone: selectedCountry.phoneCode
      }));
    }
  }, [selectedCountry]);

  // Función para actualizar campos del formulario
  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Función para manejar selección de categoría de negocio
  const handleCategorySelect = (selectedCategory) => {
    updateField('businessCategory', selectedCategory);
    setShowCategoryPicker(false);
    // Enfocar el siguiente campo (contraseña) después de seleccionar categoría
    setTimeout(() => {
  passwordRef.current?.focus();
  setFocusedField('password');
    }, 200);
  };

  // Función para manejar la selección de país
  const handleCountrySelect = (selectedCountry) => {
    selectCountry(selectedCountry);
    setShowCountryPicker(false);
  };

  // Función para navegar al siguiente campo
  const focusNextField = (currentField) => {
    switch (currentField) {
      case 'businessName':
        businessEmailRef.current?.focus();
        break;
      case 'businessEmail':
        businessPhoneRef.current?.focus();
        break;
      case 'businessPhone':
        // Abrir selector de categoría en lugar de ir al siguiente campo
        setShowCategoryPicker(true);
        break;
      case 'password':
        confirmPasswordRef.current?.focus();
        break;
      case 'confirmPassword':
        // En el último campo, cerrar el teclado
        confirmPasswordRef.current?.blur();
        break;
      default:
        break;
    }
  };

  // Función para manejar el campo de teléfono con indicativo
  const handlePhoneChange = (value) => {
    // Limpiar el valor de entrada (solo dígitos)
    const cleanDigits = value.replace(/[^\d]/g, '');

    // Formatear según país (reglas simples)
    const formatPhoneNumber = (digits, countryCode) => {
      if (!digits) return '';
      // Estados Unidos / Canada: (XXX) XXX-XXXX
      if (countryCode === '+1') {
        if (digits.length <= 3) return digits;
        if (digits.length <= 6) return `(${digits.slice(0,3)}) ${digits.slice(3)}`;
        return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6,10)}`;
      }

      // Default: agrupar de 3 en 3 separados por espacio
      const parts = [];
      for (let i = 0; i < digits.length; i += 3) {
        parts.push(digits.slice(i, i + 3));
      }
      return parts.join(' ');
    };

    const formatted = formatPhoneNumber(cleanDigits, selectedCountry?.phoneCode || '');
    const fullPhoneNumber = `${selectedCountry?.phoneCode || ''} ${formatted}`.trim();
    updateField('businessPhone', fullPhoneNumber);
  };

  // Validación para cuando el usuario pierde el foco (onBlur) - solo validaciones de formato
  const validateField = (field, value) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'businessName':
        if (value.trim() === '') {
          // No mostrar error si está vacío (campo requerido solo al registrar)
          delete newErrors.businessName;
        } else if (value.trim().length < 3) {
          newErrors.businessName = 'El nombre del negocio debe tener al menos 3 caracteres';
        } else {
          delete newErrors.businessName;
        }
        break;

      case 'businessEmail':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value.trim() === '') {
          if (!showSubmitErrors) {
            delete newErrors.businessEmail;
          }
        } else if (!emailRegex.test(value)) {
          newErrors.businessEmail = 'Ingresa un correo electrónico válido';
        } else {
          delete newErrors.businessEmail;
        }
        break;

      case 'businessPhone':
        const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (value.trim() === '') {
          if (!showSubmitErrors) {
            delete newErrors.businessPhone;
          }
        } else if (!phoneRegex.test(cleanPhone)) {
          newErrors.businessPhone = 'Ingresa un número de teléfono válido';
        } else {
          delete newErrors.businessPhone;
        }
        break;

      case 'businessCategory':
        if (!value || !value.id) {
          if (!showSubmitErrors) {
            delete newErrors.businessCategory;
          }
        } else {
          delete newErrors.businessCategory;
        }
        break;

      case 'password':
        if (!value) {
          if (!showSubmitErrors) {
            delete newErrors.password;
          }
        } else if (value.length < 6) {
          newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        } else {
          delete newErrors.password;
        }
        break;

      case 'confirmPassword':
        if (!value) {
          if (!showSubmitErrors) {
            delete newErrors.confirmPassword;
          }
        } else if (formData.password && value !== formData.password) {
          newErrors.confirmPassword = 'Las contraseñas no coinciden';
        } else {
          delete newErrors.confirmPassword;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validación completa para cuando presiona el botón (incluye campos requeridos)
  const validateAllFields = () => {
    const newErrors = {};

    // Validar businessName
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'El nombre del negocio es requerido';
    } else if (formData.businessName.trim().length < 3) {
      newErrors.businessName = 'El nombre del negocio debe tener al menos 3 caracteres';
    }

    // Validar businessEmail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.businessEmail.trim()) {
      newErrors.businessEmail = 'El correo electrónico del negocio es requerido';
    } else if (!emailRegex.test(formData.businessEmail)) {
      newErrors.businessEmail = 'Ingresa un correo electrónico válido';
    }

    // Validar businessPhone
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    // Considerar como vacío si el valor solo contiene el indicativo del país (p.ej. '+57')
    const onlyDigits = (formData.businessPhone || '').replace(/\D/g, '');
    const countryDigits = (selectedCountry?.phoneCode || '').replace(/\D/g, '');
    if (!formData.businessPhone.trim() || onlyDigits.length === 0 || onlyDigits.length <= countryDigits.length) {
      newErrors.businessPhone = 'El teléfono del negocio es requerido';
    } else {
      // Reconstruir versión con + para validar formato internacional
      const withPlus = (formData.businessPhone || '').startsWith('+') ? formData.businessPhone.replace(/\s/g,'') : `+${onlyDigits}`;
      if (!phoneRegex.test(withPlus)) {
        newErrors.businessPhone = 'Ingresa un número de teléfono válido';
      }
    }

    // Validar businessCategory
    if (!formData.businessCategory || !formData.businessCategory.id) {
      newErrors.businessCategory = 'Selecciona una categoría de negocio';
    }

    // Validar password
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmPassword
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    const keys = Object.keys(newErrors);
    return {
      valid: keys.length === 0,
      firstError: keys.length > 0 ? newErrors[keys[0]] : null,
      errors: newErrors,
    };
  };

  // Manejar el registro
  const handleRegister = async () => {
    // Validar todos los campos
    const { valid, firstError, errors: validationErrors } = validateAllFields();
    if (!valid) {
      // Marcar que ya hicimos submit para que los errores requeridos no se eliminen al hacer blur
      setShowSubmitErrors(true);
      // Asegurar que los mensajes de validación se muestren inline
      setErrors(validationErrors || {});
      // Enfocar el primer campo con error
      const firstField = Object.keys(validationErrors || {})[0];
      if (firstField === 'businessName') {
        businessNameRef.current?.focus();
        setFocusedField('businessName');
        setTimeout(() => scrollViewRef.current?.scrollTo({ y: 0, animated: true }), 100);
      } else if (firstField === 'businessEmail') {
        businessEmailRef.current?.focus();
        setFocusedField('businessEmail');
        setTimeout(() => scrollViewRef.current?.scrollTo({ y: 60, animated: true }), 100);
      } else if (firstField === 'businessPhone') {
        businessPhoneRef.current?.focus();
        setFocusedField('businessPhone');
        setTimeout(() => scrollViewRef.current?.scrollTo({ y: 120, animated: true }), 100);
      } else if (firstField === 'businessCategory') {
        setShowCategoryPicker(true);
      } else if (firstField === 'password') {
        passwordRef.current?.focus();
        setFocusedField('password');
        setTimeout(() => scrollViewRef.current?.scrollTo({ y: 260, animated: true }), 100);
      } else if (firstField === 'confirmPassword') {
        confirmPasswordRef.current?.focus();
        setFocusedField('confirmPassword');
        setTimeout(() => scrollViewRef.current?.scrollTo({ y: 320, animated: true }), 100);
      }
      return;
    }

    try {
      setIsRegistering(true);
      // Si llegamos aquí, limpiar bandera de submit-errors (estamos intentando enviar)
      setShowSubmitErrors(false);

      // Normalizar teléfono: extraer dígitos y anteponer +countryCode si es necesario
      const onlyDigits = (formData.businessPhone || '').replace(/\D/g, '');
      const countryDigits = (selectedCountry?.phoneCode || '').replace(/\D/g, '');
      let normalizedPhone = '';
      if (onlyDigits.length === 0) {
        normalizedPhone = '';
      } else if (onlyDigits.startsWith(countryDigits)) {
        normalizedPhone = `+${onlyDigits}`;
      } else if (countryDigits.length > 0) {
        normalizedPhone = `+${countryDigits}${onlyDigits.replace(new RegExp('^' + countryDigits), '')}`;
      } else {
        normalizedPhone = `+${onlyDigits}`;
      }

      const result = await dispatch(registerUser({ 
        email: formData.businessEmail.trim(), 
        password: formData.password, 
        name: formData.businessName.trim(),
        businessCategoryId: formData.businessCategory.id, // ID de la categoría seleccionada
        countryId: selectedCountry?.id, // ID del país seleccionado
        phone: normalizedPhone
      }));
      
      if (registerUser.fulfilled.match(result)) {
        setIsRegistering(false);
  // Registro exitoso: limpiar la bandera y errores
  setShowSubmitErrors(false);
  setErrors({});
        const successConfig = ErrorMappingService.createSuccessMessage('register', {
          businessName: formData.businessName
        });
        
        showNotification(successConfig);
  // Navegar a selección de profesional para que el negocio elija su perfil
  navigation.replace('SelectProfessional');
      } else {
        setIsRegistering(false);
  // Mantener showSubmitErrors true para que los errores sigan visibles
        const errorConfig = ErrorMappingService.mapAuthError(result.payload, 'register');
        showNotification(errorConfig);
      }
    } catch (error) {
      setIsRegistering(false);
      console.error('Error en registro:', error);
      const errorConfig = ErrorMappingService.mapNetworkError(error);
      showNotification(errorConfig);
    }
  };

  // Habilitar el botón solo cuando el formulario pase validaciones básicas
  const canSubmitRegister = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.businessName || formData.businessName.trim().length < 3) return false;
    if (!formData.businessEmail || !emailRegex.test(formData.businessEmail)) return false;
    if (!formData.password || formData.password.length < 6) return false;
    if (!formData.confirmPassword || formData.confirmPassword !== formData.password) return false;
    if (!formData.businessCategory || !formData.businessCategory.id) return false;
    // teléfono mínimo: debe contener más que el código de país
    const onlyDigits = (formData.businessPhone || '').replace(/\D/g, '');
    const countryDigits = (selectedCountry?.phoneCode || '').replace(/\D/g, '');
    if (onlyDigits.length <= countryDigits.length) return false;
    return true;
  };

  const goToLogin = () => {
    dispatch(clearError());
    navigation.navigate('Login');
  };

  // Renderizar selector de categoría de negocio
  const renderCategorySelector = () => {
    return (
      <View style={styles.inputContainer}>
        <CategorySelector
          selectedCategory={formData.businessCategory}
          onPress={() => setShowCategoryPicker(true)}
          style={[
            styles.categorySelector,
            errors.businessCategory && styles.inputErrorNoBg
          ]}
          placeholder="Selecciona la categoría"
        />
        {errors.businessCategory && (
          <Text style={styles.errorTextInline}>{errors.businessCategory}</Text>
        )}
      </View>
    );
  };

  // Renderizar campo de teléfono con indicativo del país
  const renderPhoneInput = () => {
    return (
      <View>
        {/* Render FloatingLabelInput sin wrapper extra para evitar contenedores superpuestos */}
        <FloatingLabelInput
          inputRef={businessPhoneRef}
          label="Número de contacto"
          value={formData.businessPhone.replace(selectedCountry?.phoneCode || '', '').trim()}
          onChangeText={handlePhoneChange}
          onFocus={() => setFocusedField('businessPhone')}
          onBlur={() => { validateField('businessPhone', formData.businessPhone); setFocusedField(null); }}
          onSubmitEditing={() => { setShowCategoryPicker(true); setFocusedField(null); }}
          showError={!!errors.businessPhone}
          forceFocus={focusedField === 'businessPhone'}
          editable={!isRegistering}
          returnKeyType="next"
          placeholder="Número de contacto"
          keyboardType="phone-pad"
          style={
            errors.businessPhone
              ? { borderColor: '#EF4444', borderWidth: 2 }
              : (focusedField === 'businessPhone' ? { borderColor: '#000000', borderWidth: 2 } : { borderColor: '#E5E7EB', borderWidth: 1 })
          }
          labelBackground={'#ffffff'}
          leftComponent={(
            <TouchableOpacity
              style={styles.countryCodeContainer}
              onPress={() => setShowCountryPicker(true)}
            >
              {selectedCountry?.flagUrl ? (
                <Image
                  source={{ uri: selectedCountry.flagUrl }}
                  style={styles.flagImage}
                  defaultSource={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==' }}
                />
              ) : (
                <Text style={styles.flagText}>{selectedCountry?.flag || '🌍'}</Text>
              )}
              <Text style={styles.countryCodeText}>{selectedCountry?.phoneCode || '+57'}</Text>
              <Text style={styles.chevron}>▼</Text>
            </TouchableOpacity>
          )}
          leftComponentWidth={110}
        />
        {errors.businessPhone && (
          <Text style={styles.errorText}>{errors.businessPhone}</Text>
        )}
      </View>
    );
  };

  // Renderizar campo de input con validación usando FloatingLabelInput
  const renderInput = (field, placeholder, options = {}) => {
    // Obtener la referencia correcta según el campo
    const getFieldRef = () => {
      switch (field) {
        case 'businessName': return businessNameRef;
        case 'businessEmail': return businessEmailRef;
        case 'password': return passwordRef;
        case 'confirmPassword': return confirmPasswordRef;
        default: return null;
      }
    };

    // Determinar el tipo de botón de retorno
    const getReturnKeyType = () => {
      if (field === 'confirmPassword') return 'done';
      return 'next';
    };

    return (
      <View>
        <FloatingLabelInput
          inputRef={getFieldRef()}
          label={options.label || placeholder}
          value={formData[field]}
          onChangeText={(value) => updateField(field, value)}
          showError={!!errors[field]}
          onBlur={() => { validateField(field, formData[field]); setFocusedField(null); }}
          onFocus={() => setFocusedField(field)}
          forceFocus={focusedField === field}
          onSubmitEditing={() => focusNextField(field)}
          placeholder={placeholder}
          editable={!isRegistering}
          returnKeyType={getReturnKeyType()}
          blurOnSubmit={field === 'confirmPassword'}
          {...options}
        />
        {errors[field] && (
          <Text style={styles.errorText}>{errors[field]}</Text>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
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
      
      {/* Modal de carga personalizado */}
      <Modal
        visible={isRegistering}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.loadingModal}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#DC2626" />
            <Text style={styles.loadingText}>Creando tu cuenta...</Text>
            <Text style={styles.loadingSubtext}>
              Estamos configurando tu negocio en TurnoGo.{'\n'}
              Este proceso puede tomar unos segundos.
            </Text>
          </View>
        </View>
      </Modal>

      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        scrollEventThrottle={16}
      >
        <View style={styles.form}>
          {renderInput('businessName', 'Nombre de tu negocio', {
            label: 'Nombre del Negocio',
            autoCapitalize: 'words'
          })}

          {renderInput('businessEmail', 'correo@tunegocio.com', {
            label: 'Correo Electrónico del Negocio',
            keyboardType: 'email-address',
            autoCapitalize: 'none',
            autoComplete: 'email'
          })}

          {renderPhoneInput()}

          {renderCategorySelector()}

          {renderInput('password', 'Mínimo 6 caracteres', {
            label: 'Contraseña',
            secureTextEntry: true,
            autoComplete: 'new-password',
            passwordRules: 'minlength: 6;',
            textContentType: 'newPassword'
          })}

          {renderInput('confirmPassword', 'Repite tu contraseña', {
            label: 'Confirmar Contraseña',
            secureTextEntry: true,
            autoComplete: 'new-password',
            passwordRules: 'minlength: 6;',
            textContentType: 'newPassword'
          })}

          <TouchableOpacity
            style={[
              styles.registerButton, 
              isRegistering && styles.registerButtonLoading,
              !canSubmitRegister() && styles.registerButtonDisabled
            ]}
            onPress={handleRegister}
            disabled={isRegistering || !canSubmitRegister()}
            activeOpacity={0.8}
          >
            <View style={styles.registerButtonContent}>
              {isRegistering ? (
                <>
                  <ActivityIndicator size="small" color="white" style={styles.spinner} />
                  <Text style={[styles.registerButtonText, styles.registerButtonTextLoading]}>
                    Creando cuenta...
                  </Text>
                </>
              ) : (
                <Text style={styles.registerButtonText}>Crear Cuenta de Negocio</Text>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginLink} 
            onPress={goToLogin}
            disabled={isRegistering}
          >
            <Text style={styles.loginLinkText}>
              ¿Ya tienes cuenta? <Text style={styles.loginLinkBold}>Inicia Sesión</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Category Picker Modal */}
      <CategoryPicker
        selectedCategory={formData.businessCategory}
        onCategorySelect={handleCategorySelect}
        visible={showCategoryPicker}
        onClose={() => setShowCategoryPicker(false)}
      />

      {/* Country Picker Modal */}
      <CountryPickerFirebase
        visible={showCountryPicker}
        onClose={() => setShowCountryPicker(false)}
        onCountrySelect={handleCountrySelect}
      />

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#DC2626',
    marginTop: 20,
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 12, // Uniformar con FloatingLabelInput.container marginBottom
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  // Error state without background color (solo borde rojo)
  inputErrorNoBg: {
    borderColor: '#EF4444',
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
  marginTop: -10,
  marginBottom: 14,
  marginLeft: 4,
  },
  errorTextBelow: {
    fontSize: 12,
    color: '#EF4444',
  marginTop: 6,
  marginBottom: 12,
  marginLeft: 4,
  },
  // Mensaje de error compacto que va pegado al input y no añade espacio extra abajo
  errorTextInline: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 2,
    marginBottom: 6,
    marginLeft: 4,
  },
  registerButton: {
    backgroundColor: '#DC2626',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#DC2626',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  registerButtonLoading: {
    backgroundColor: '#B91C1C',
  },
  registerButtonDisabled: {
    backgroundColor: '#F3B1B1',
    opacity: 0.8,
  },
  registerButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButtonTextLoading: {
    marginLeft: 8,
    opacity: 0.9,
  },
  spinner: {
    marginRight: 0,
  },
  loginLink: {
    alignItems: 'center',
    marginBottom: 30,
  },
  loginLinkText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLinkBold: {
    color: '#DC2626',
    fontWeight: '600',
  },
  loadingModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    maxWidth: 300,
    margin: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 15,
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Estilos para el picker de tipo de negocio
  pickerInput: {
    justifyContent: 'center',
  },
  pickerText: {
    fontSize: 16,
    color: '#1F2937',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  
  // Estilos para el modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalCloseButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  modalOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalOptionSelected: {
    backgroundColor: '#FEF2F2',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  modalOptionTextSelected: {
    color: '#DC2626',
    fontWeight: '600',
  },
  
  // Estilos para el campo de teléfono con indicativo
  phoneInputContainer: {
  // Unificado con el estilo de los otros inputs (mismo padding, altura y corner radius)
  position: 'relative',
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: 8,
  backgroundColor: '#ffffff',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 1,
  overflow: 'visible',
  paddingHorizontal: 18,
  height: 52, // Altura fija para igualar exactamente otros inputs
  paddingVertical: 0, // eliminar padding vertical extra para igualar altura
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  paddingRight: 12,
  height: '100%', // ocupar toda la altura del contenedor
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    marginRight: 12,
  },
  flagText: {
    fontSize: 18,
    marginRight: 6,
  },
  flagImage: {
  width: 24,
  height: 18,
    borderRadius: 2,
    marginRight: 6,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginRight: 4,
  },
  chevron: {
    fontSize: 12,
    color: '#6B7280',
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 0, // Eliminar padding vertical extra para mantener altura consistente
    width: '100%', // Asegurar que ocupe todo el ancho
  },
  phoneInputWrapper: {
  flex: 1,
  position: 'relative',
  // Allow the inner input to stretch and fill the parent's height
  justifyContent: 'flex-start',
  alignSelf: 'stretch',
  alignItems: 'stretch',
  height: '100%', // ocupar toda la altura del contenedor padre
  },
  phoneInputTouchArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  categorySelector: {
    minHeight: 52, // Misma altura que FloatingLabelInput
  },
});
