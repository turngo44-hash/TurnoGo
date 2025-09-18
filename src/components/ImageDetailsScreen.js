import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Platform,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

/**
 * Componente para la pantalla de detalles de imagen (título y descripción)
 */
const ImageDetailsScreen = ({
  visible,
  onClose,
  onSave,
  imageData,
  isActive = false,
  animateFrom = "right"
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const slideAnim = useState(new Animated.Value(width))[0]; // Comienza fuera de pantalla

  // Resetear el formulario y animar cuando se muestra
  useEffect(() => {
    if (visible) {
      setTitle('');
      setDescription('');
      setLoading(false);
      
      // Animar entrada y salida
      Animated.timing(slideAnim, {
        toValue: isActive ? 0 : width, // 0 es visible, width es oculto
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }, [visible, isActive]);

  // Manejar publicación
  const handlePublish = () => {
    if (!title.trim()) {
      Alert.alert("Campo requerido", "Por favor, agrega un título para tu imagen.");
      return;
    }
    
    setLoading(true);
    
    // Verificamos la relación de aspecto y ajustamos si es necesario
    let finalWidth = imageData.width;
    let finalHeight = imageData.height;
    
    // Aseguramos que siempre usemos la proporción 4:5 (ancho:alto)
    const aspectRatio = imageData.aspectRatio || [4, 5];
    const targetAspectRatio = aspectRatio[1] / aspectRatio[0]; // 5/4 = 1.25
    const currentAspectRatio = finalHeight / finalWidth;
    
    // Forzamos la relación de aspecto correcta (4:5)
    if (Math.abs(currentAspectRatio - targetAspectRatio) > 0.01) {
      console.log(`Ajustando proporción al guardar: actual ${currentAspectRatio}, objetivo ${targetAspectRatio}`);
      
      // Establecemos el tamaño final con la proporción correcta
      if (finalWidth > finalHeight) {
        // Si la imagen es más ancha que alta
        finalHeight = Math.round(finalWidth * targetAspectRatio);
      } else {
        // Si la imagen es más alta que ancha
        finalWidth = Math.round(finalHeight / targetAspectRatio);
      }
    }
    
    // Preparamos la información completa de la imagen para guardar
    const completeImageData = {
      ...imageData,
      width: finalWidth,
      height: finalHeight,
      // Metadatos para mostrar en la galería
      title: title.trim(),
      description: description.trim(),
      // Fecha actual para mostrar en la galería
      fecha: new Date().toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short',
        year: 'numeric'
      }),
      // Inicializamos likes en 0
      likes: 0,
      // ID único para la imagen
      id: `img_${Date.now()}`,
      // Timestamp para ordenación
      timestamp: Date.now(),
      // Status de carga (útil para mostrar indicadores visuales)
      status: 'completed',
    };
    
    // Notificamos al componente padre con los datos completos
    if (onSave && typeof onSave === 'function') {
      onSave(completeImageData);
    }
    
    // Limpiamos y cerramos
    resetForm();
    onClose();
  };

  // Limpiar el formulario
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLoading(false);
  };

  // Cerrar sin guardar
  const handleCancel = () => {
    resetForm();
    onClose();
  };

  // Si no es visible, no renderizar
  if (!visible) return null;

  // Si no hay datos de imagen pero es visible, mostramos contenedor vacío pero posicionado
  if (!imageData || !imageData.uri) {
    return (
      <Modal
        visible={visible}
        animationType="none"
        presentationStyle="overFullScreen"
        transparent={true}
        onRequestClose={handleCancel}
      >
        <View style={[
          styles.modalBackground,
          styles.hiddenContainer
        ]} />
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="none" // Sin animación automática, la controlamos nosotros
      presentationStyle="overFullScreen"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <Animated.View style={[
        styles.modalBackground,
        { transform: [{ translateX: slideAnim }] }
      ]}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
        {/* Cabecera */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalles de imagen</Text>
          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
            onPress={handlePublish}
            disabled={loading}
          >
            <Ionicons name="cloud-upload-outline" size={20} color={loading ? "#9CA3AF" : "#fff"} />
            <Text style={styles.saveButtonText}>
              {loading ? 'Publicando...' : 'Publicar'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Formulario mejorado */}
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Ionicons name="create-outline" size={24} color="#3B82F6" />
              <Text style={styles.formTitle}>Información de la imagen</Text>
            </View>

            {/* Campo de título */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Título <Text style={styles.requiredMark}>*</Text></Text>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Añade un título descriptivo"
                  value={title}
                  onChangeText={setTitle}
                  maxLength={60}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <Text style={styles.inputHelp}>Añade un título claro y descriptivo</Text>
            </View>
            
            {/* Campo de descripción */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descripción</Text>
              <View style={styles.textAreaContainer}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Describe esta imagen (opcional)"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  maxLength={200}
                  textAlignVertical="top"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={styles.inputFooter}>
                <Text style={styles.inputHelp}>Máximo 200 caracteres</Text>
                <Text style={styles.characterCount}>{description.length}/200</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: '#fff', // Fondo completamente blanco
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // Controlamos la posición con estas propiedades
    transform: [{ translateX: 0 }],
    opacity: 1,
  },
  hiddenContainer: {
    transform: [{ translateX: width }], // Inicialmente fuera de la pantalla a la derecha
    opacity: 0,
  },
  visibleContainer: {
    transform: [{ translateX: 0 }], // Visible en pantalla
    opacity: 1,
  },
  animateFromRight: {
    left: 0,
    right: 0,
  },
  animateFromLeft: {
    left: 0,
    right: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: Platform.OS === 'ios' ? 30 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    padding: 8,
    width: 44,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 14,
  },
  scrollContent: {
    padding: 0, // Eliminamos el padding para la imagen
    paddingBottom: 40,
  },
  imagePreviewContainer: {
    width: '100%',
    height: width * 1.25, // Aumentado de 0.7 a 1.25 para mantener la relación 4:5 y ocupar más espacio
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: '#f3f4f6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  formContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16, // Agregamos margen horizontal 
    marginBottom: 24,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#111827',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  requiredMark: {
    color: '#EF4444',
  },
  textInputContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  textInput: {
    fontSize: 16,
    color: '#111827',
    paddingVertical: 12,
  },
  textAreaContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textArea: {
    fontSize: 16,
    color: '#111827',
    height: 100,
  },
  inputHelp: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
    marginLeft: 4,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  characterCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  publishButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    marginHorizontal: 16, // Agregamos margen horizontal
  },
  publishButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  publishButtonIcon: {
    marginRight: 8,
  },
  publishButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ImageDetailsScreen;