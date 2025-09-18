# Sistema de Notificaciones Profesionales - TurnoGo

Este sistema reemplaza los `Alert` nativos con notificaciones elegantes estilo Facebook/Instagram.

## 🎯 Características

- ✅ **Notificaciones no intrusivas** que se muestran en la parte superior
- ✅ **Animaciones suaves** de entrada y salida
- ✅ **Diferentes tipos**: success, error, warning, info
- ✅ **Botones de acción** personalizables
- ✅ **Auto-dismiss** configurable
- ✅ **Mapeo automático** de errores de Firebase
- ✅ **Mensajes profesionales** pre-definidos

## 📁 Estructura de Archivos

```
src/
├── components/
│   └── Notification.js          # Componente de notificación
├── hooks/
│   └── useNotification.js       # Hook para manejar notificaciones
├── services/
│   └── ErrorMappingService.js   # Mapeo de errores a mensajes profesionales
└── screens/
    └── auth/
        └── RegisterScreen.js    # Ejemplo de implementación
```

## 🚀 Uso Básico

### 1. Importar el hook y componente

```javascript
import Notification from '../../components/Notification';
import { useNotification, NotificationMessages } from '../../hooks/useNotification';
import ErrorMappingService from '../../services/ErrorMappingService';
```

### 2. Configurar en el componente

```javascript
export default function MiPantalla() {
  const {
    notification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showNotification,
    hideNotification,
  } = useNotification();

  return (
    <View style={styles.container}>
      {/* Agregar el componente de notificación */}
      <Notification
        visible={notification.visible}
        message={notification.message}
        type={notification.type}
        duration={notification.duration}
        onHide={hideNotification}
        actionText={notification.actionText}
        onActionPress={notification.onActionPress}
      />
      
      {/* Resto del contenido */}
    </View>
  );
}
```

## 📝 Ejemplos de Uso

### Notificaciones Simples

```javascript
// Éxito
showSuccess('¡Perfil actualizado correctamente!');

// Error
showError('No se pudo conectar al servidor');

// Advertencia
showWarning('Este campo es obligatorio');

// Información
showInfo('Revisa tu email para confirmar la cuenta');
```

### Notificaciones con Botón de Acción

```javascript
showError('Error al guardar los datos', {
  actionText: 'Reintentar',
  onActionPress: () => {
    hideNotification();
    guardarDatos(); // Función para reintentar
  }
});
```

### Usando ErrorMappingService para Firebase

```javascript
// En caso de error de autenticación
try {
  const result = await dispatch(loginUser({ email, password }));
  
  if (loginUser.fulfilled.match(result)) {
    const successConfig = ErrorMappingService.createSuccessMessage('login', {
      name: result.payload.name
    });
    showNotification(successConfig);
  } else {
    const errorConfig = ErrorMappingService.mapAuthError(result.payload, 'login');
    showNotification({
      ...errorConfig,
      onActionPress: () => {
        hideNotification();
        if (errorConfig.actionText === '¿Olvidaste?') {
          navigation.navigate('ForgotPassword');
        }
      }
    });
  }
} catch (error) {
  const errorConfig = ErrorMappingService.mapNetworkError(error);
  showNotification(errorConfig);
}
```

## 🎨 Personalización

### Configuración Avanzada

```javascript
showNotification({
  message: 'Mensaje personalizado',
  type: 'success', // 'success', 'error', 'warning', 'info'
  duration: 6000,  // Duración en milisegundos
  actionText: 'Acción',
  onActionPress: () => {
    // Lógica de la acción
    hideNotification();
  }
});
```

### Mensajes Pre-definidos

```javascript
// Usar mensajes profesionales pre-definidos
showError(NotificationMessages.auth.emailExists);
showSuccess(NotificationMessages.success.accountCreated);
showWarning(NotificationMessages.validation.requiredFields);
```

## 🔧 Configuración de Errores de Firebase

El `ErrorMappingService` mapea automáticamente errores de Firebase:

```javascript
// Errores de autenticación mapeados automáticamente:
'email-already-in-use' → 'Este email ya está registrado. ¿Quizás quieras iniciar sesión?'
'weak-password' → 'La contraseña debe tener al menos 6 caracteres'
'user-not-found' → 'No encontramos una cuenta con este email'
'wrong-password' → 'La contraseña no es correcta. Inténtalo de nuevo'
'too-many-requests' → 'Demasiados intentos. Espera un momento antes de volver a intentar'
// Y muchos más...
```

## 📱 Estilos y Temas

Los estilos siguen el diseño de la app con colores consistentes:

- **Success**: Verde (#10B981)
- **Error**: Rojo (#EF4444) 
- **Warning**: Amarillo (#F59E0B)
- **Info**: Azul (#3B82F6)

## 🔄 Migración de Alert a Notificaciones

### Antes (Alert nativo)
```javascript
Alert.alert('Error', 'Algo salió mal', [
  { text: 'OK', onPress: () => console.log('OK') }
]);
```

### Después (Notificación profesional)
```javascript
showError('Algo salió mal', {
  actionText: 'Reintentar',
  onActionPress: () => {
    hideNotification();
    // Lógica de reintento
  }
});
```

## 🚨 Casos de Uso Específicos

### Login Screen
```javascript
// Error de credenciales
const errorConfig = ErrorMappingService.mapAuthError('wrong-password', 'login');
showNotification({
  ...errorConfig,
  onActionPress: () => navigation.navigate('ForgotPassword')
});
```

### Formularios de Validación
```javascript
// Error de validación
if (!validateForm()) {
  showWarning('Por favor completa todos los campos', {
    actionText: 'Revisar',
    onActionPress: () => hideNotification()
  });
}
```

### Operaciones de Red
```javascript
// Error de conexión
const errorConfig = ErrorMappingService.mapNetworkError(networkError);
showNotification({
  ...errorConfig,
  onActionPress: () => retryOperation()
});
```

## 💡 Mejores Prácticas

1. **Usar mensajes específicos** en lugar de genéricos
2. **Incluir botones de acción** cuando sea útil para el usuario
3. **Mapear errores de Firebase** usando el servicio
4. **Mantener consistencia** en el tono y estilo de los mensajes
5. **No abusar** de las notificaciones - solo para feedback importante

## 🔜 Próximas Mejoras

- [ ] Soporte para notificaciones con imágenes
- [ ] Notificaciones persistentes para operaciones largas
- [ ] Sistema de cola para múltiples notificaciones
- [ ] Integración con push notifications
- [ ] Temas personalizables

---

Este sistema proporciona una experiencia de usuario más profesional y moderna comparado con los alerts nativos, siguiendo las mejores prácticas de aplicaciones como Facebook e Instagram.
