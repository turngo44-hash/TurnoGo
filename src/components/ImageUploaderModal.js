import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Platform,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Animated
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

// Configuraciones de tamaño recomendadas para imágenes según estándares actuales
const IMAGE_DIMENSIONS = {
  thumbnail: { width: 150, height: 150 },
  profile: { width: 500, height: 500 },
  gallery: { width: 1080, height: 1350 }, // Relación 4:5 (estándar actual de Instagram)
  portrait: { width: 1080, height: 1920 }, // Stories/Reels 9:16
  landscape: { width: 1920, height: 1080 }, // 16:9
  cover: { width: 1200, height: 630 },
};

const ImageUploaderModal = ({ visible, onClose, onSave, title = "Agregar Imagen", aspectRatio = [4, 5], purpose = "gallery", isActive = true }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageType, setImageType] = useState('gallery'); // gallery, profile, cover
  const slideAnim = useState(new Animated.Value(0))[0]; // Comienza visible

  // Solicitar permisos de cámara/galería
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
        Alert.alert(
          'Permisos necesarios',
          'Necesitamos acceso a tu cámara y galería para subir imágenes.',
          [{ text: 'OK' }]
        );
        return false;
      }
      return true;
    }
    return true;
  };

  // Seleccionar imagen de la galería
  const pickImage = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    setLoading(true);
    try {
      // Asegurarnos de que el aspecto sea exactamente 4:5
      const aspectArray = [4, 5];
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: aspectArray,
        quality: 0.8,
        allowsMultipleSelection: false,
        exif: false, // No necesitamos metadata EXIF para ahorrar espacio
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Verificamos que la imagen tenga la proporción correcta
        const selectedImage = result.assets[0];
        
        // Cálculo de la relación de aspecto actual
        const currentAspect = selectedImage.height / selectedImage.width;
        const targetAspect = aspectArray[1] / aspectArray[0]; // 5/4 = 1.25
        
        // Si la proporción no es la correcta (con un pequeño margen de error)
        if (Math.abs(currentAspect - targetAspect) > 0.05) {
          console.log(`Ajustando proporción: actual ${currentAspect}, objetivo ${targetAspect}`);
          
          // Guardamos la imagen original pero añadimos metadatos para el recorte posterior
          // cuando la mostremos
          selectedImage._needsCrop = true;
          selectedImage._targetAspect = targetAspect;
        }
        
        setImage(selectedImage);
      }
    } catch (error) {
      console.error("Error al seleccionar imagen:", error);
      Alert.alert("Error", "No se pudo cargar la imagen seleccionada.");
    } finally {
      setLoading(false);
    }
  };

  // Tomar una foto con la cámara
  const takePhoto = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    setLoading(true);
    try {
      // Asegurarnos de que el aspecto sea exactamente 4:5
      const aspectArray = [4, 5];
      
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: aspectArray,
        quality: 0.8,
        exif: false, // No necesitamos metadata EXIF para ahorrar espacio
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Verificamos que la imagen tenga la proporción correcta
        const selectedImage = result.assets[0];
        
        // Cálculo de la relación de aspecto actual
        const currentAspect = selectedImage.height / selectedImage.width;
        const targetAspect = aspectArray[1] / aspectArray[0]; // 5/4 = 1.25
        
        // Si la proporción no es la correcta (con un pequeño margen de error)
        if (Math.abs(currentAspect - targetAspect) > 0.05) {
          console.log(`Ajustando proporción: actual ${currentAspect}, objetivo ${targetAspect}`);
          
          // Guardamos la imagen original pero añadimos metadatos para el recorte posterior
          // cuando la mostremos
          selectedImage._needsCrop = true;
          selectedImage._targetAspect = targetAspect;
        }
        
        setImage(selectedImage);
      }
    } catch (error) {
      console.error("Error al tomar foto:", error);
      Alert.alert("Error", "No se pudo capturar la imagen.");
    } finally {
      setLoading(false);
    }
  };

  // Pasar a la siguiente pantalla para añadir detalles
  const handleNext = () => {
    if (image) {
      // Simplemente pasamos la información básica de la imagen al componente padre
      const baseImageInfo = {
        uri: image.uri,
        width: image.width || 800,
        height: image.height || 1000,
        type: image.type || 'image/jpeg',
        fileSize: image.fileSize,
        fileName: image.fileName || `image_${Date.now()}.jpg`,
        purpose: purpose,
        aspectRatio: aspectRatio,
        // Flag para indicar si necesita recorte
        _needsCrop: image._needsCrop || false
      };
      
      // Notificamos al componente padre para continuar al siguiente paso
      if (onSave && typeof onSave === 'function') {
        onSave(baseImageInfo);
      }
      
      // No cerramos el modal, eso lo hará el componente padre
      // Pero limpiamos el estado local
      setImage(null);
      setLoading(false);
    } else {
      Alert.alert("Error", "Por favor selecciona una imagen primero.");
    }
  };

  // Cerrar el modal y limpiar estados
  const handleClose = () => {
    setImage(null);
    setLoading(false);
    onClose();
  };

  // Renderizar información del tamaño recomendado
  const renderSizeInfo = () => {
    // Eliminamos la información de tamaño recomendado como solicitado
    return null;
  };
  
  // Efecto para la animación
  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: isActive ? 0 : -width, // 0 es visible, -width es oculto (a la izquierda)
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }, [visible, isActive]);

  return (
    <Modal
      visible={visible}
      animationType="none" // Sin animación automática
      transparent={true}
      onRequestClose={handleClose}
    >
      <Animated.View 
        style={[
          styles.modalOverlay,
          !isActive && styles.modalOverlayInactive,
          { transform: [{ translateX: slideAnim }] }
        ]}
      >
        <View style={styles.modalContent}>
          {/* Cabecera modernizada */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={handleClose}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
            <TouchableOpacity 
              style={[styles.saveButton, !image && styles.saveButtonDisabled]} 
              onPress={handleNext}
              disabled={!image}
            >
              <Ionicons name="arrow-forward" size={22} color={!image ? "#9CA3AF" : "#fff"} />
              <Text style={[styles.saveButtonText, !image && styles.saveButtonTextDisabled]}>
                Siguiente
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Vista previa de imagen con overlay moderno */}
            <View style={styles.previewContainer}>
              {loading ? (
                <ActivityIndicator size="large" color="#3B82F6" />
              ) : image ? (
                <View style={styles.previewWrapper}>
                  <View style={styles.imageContainer}>
                    <Image 
                      source={{ uri: image.uri }} 
                      style={[
                        styles.previewImage,
                        // Si se necesita recortar la imagen, aplica estilos específicos
                        image._needsCrop && {
                          width: '100%',
                          height: width * (aspectRatio[1]/aspectRatio[0]), // altura = ancho * (5/4)
                        }
                      ]} 
                      resizeMode={image._needsCrop ? "contain" : "cover"}
                    />
                    {/* Guías de recorte si la imagen necesita ser ajustada */}
                    {image._needsCrop && (
                      <View style={styles.cropGuides}>
                        <View style={styles.cropGuideVertical} />
                        <View style={styles.cropGuideHorizontal} />
                        
                        {/* Mensaje informativo sobre el recorte */}
                        <View style={styles.cropMessageContainer}>
                          <Text style={styles.cropMessageText}>
                            La imagen será ajustada a proporción 4:5
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                  <View style={styles.imageOverlay}>
                    <TouchableOpacity 
                      style={styles.changeImageButton}
                      onPress={pickImage}
                    >
                      <Ionicons name="refresh-outline" size={20} color="#fff" />
                      <Text style={styles.changeImageText}>Cambiar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.placeholderContainer}>
                  <Ionicons name="images-outline" size={80} color="#ccc" />
                  <Text style={styles.placeholderText}>
                    Selecciona una imagen para tu galería
                  </Text>
                </View>
              )}
            </View>

            {/* Eliminamos los campos de título y descripción para moverlos a la siguiente pantalla */}

            {/* Información de tamaño recomendado */}
            {renderSizeInfo()}

            {/* Opciones de selección con nuevo diseño */}
            <View style={styles.optionsContainer}>
              <View style={styles.buttonGroupContainer}>
                <TouchableOpacity 
                  style={styles.optionButtonNew} 
                  onPress={takePhoto}
                >
                  <Ionicons name="camera" size={22} color="#fff" />
                  <Text style={styles.optionTextNew}>Tomar Foto</Text>
                </TouchableOpacity>

                <View style={styles.buttonSeparator} />

                <TouchableOpacity 
                  style={styles.optionButtonNew} 
                  onPress={pickImage}
                >
                  <Ionicons name="images" size={22} color="#fff" />
                  <Text style={styles.optionTextNew}>Galería</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#fff', // Fondo blanco limpio para aspecto más moderno
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalOverlayInactive: {
    opacity: 0.7, // Reducimos la opacidad cuando no está activo
    pointerEvents: 'none', // Evitamos que se pueda interactuar cuando está inactivo
  },
  modalActive: {
    transform: [{ translateX: 0 }], // Visible en pantalla
    transition: 'transform 0.3s ease-in-out', // Transición suave
  },
  modalInactive: {
    transform: [{ translateX: -Dimensions.get('window').width }], // Fuera de la pantalla hacia la izquierda
    transition: 'transform 0.3s ease-in-out', // Transición suave
  },
  modalContent: {
    backgroundColor: '#fff',
    flex: 1,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 12, // Más espacio arriba en iOS para evitar el notch
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
    flex: 1, // Para que ocupe todo el espacio disponible en el centro
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
    width: 100, // Ancho fijo para mejor balance visual con el botón de cerrar
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  saveButtonTextDisabled: {
    color: '#9CA3AF',
  },
  scrollContent: {
    padding: 0, // Eliminamos el padding para que la imagen ocupe todo el ancho
  },
  previewContainer: {
    width: '100%', // Aumentado de 90% a 100% para ocupar todo el ancho
    height: width * 1.25, // Aumentado para mantener la relación 4:5
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginHorizontal: 0, // Sin margen horizontal
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  previewWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  // Guías para recorte (ayuda visual)
  cropGuides: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cropGuideVertical: {
    position: 'absolute',
    width: '80%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  cropGuideHorizontal: {
    position: 'absolute',
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  cropMessageContainer: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    borderRadius: 4,
    width: '80%',
  },
  cropMessageText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  changeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  changeImageText: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: '500',
    fontSize: 12,
  },
  placeholderContainer: {
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
  },
  formContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 6,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 4,
  },
  sizeInfoContainer: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  sizeInfoTitle: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
  },
  sizeInfoText: {
    fontSize: 14,
    color: '#4B5563',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20,
    paddingHorizontal: 16, // Agregamos padding horizontal aquí
  },
  buttonGroupContainer: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  optionButtonNew: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  optionTextNew: {
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
    marginLeft: 8,
  },
  buttonSeparator: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  // Mantenemos estos para compatibilidad con código que podría usarlos
  optionButton: {
    display: 'none',
  },
  optionText: {
    display: 'none',
  },
  optionIconContainer: {
    display: 'none',
  },
});

export default ImageUploaderModal;