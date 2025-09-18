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
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { saveGalleryImage } from '../store/slices/gallerySlice';

const { width } = Dimensions.get('window');

/**
 * Componente único que maneja todo el proceso de subida de imágenes
 * con navegación interna entre pantallas.
 */
const ImageUploaderUnifiedModal = ({ 
  visible, 
  onClose, 
  onSave,
  professionalId,
  title = "Añadir a tu galería",
  aspectRatio = [4, 5],
  purpose = "gallery"
}) => {
  const dispatch = useDispatch();
  
  // Estados del componente
  const [currentStep, setCurrentStep] = useState('picker'); // 'picker' o 'details'
  const [image, setImage] = useState(null);
  const [imageTitle, setImageTitle] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Animaciones
  const slideAnimation = useState(new Animated.Value(0))[0];
  
  // Efecto para animar el cambio de paso
  useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: currentStep === 'picker' ? 0 : -width,
      duration: 300,
      useNativeDriver: true
    }).start();
  }, [currentStep]);

  // Resetear el estado cuando el modal se cierra
  useEffect(() => {
    if (!visible) {
      // Reseteo retrasado para que no se vea durante la animación de cierre
      setTimeout(() => {
        setCurrentStep('picker');
        setImage(null);
        setImageTitle('');
        setImageDescription('');
        setLoading(false);
      }, 300);
    }
  }, [visible]);
  
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

  // Ir a la pantalla de detalles
  const handleNext = () => {
    if (image) {
      setCurrentStep('details');
    } else {
      Alert.alert("Error", "Por favor selecciona una imagen primero.");
    }
  };

  // Volver a la pantalla de selección de imagen
  const handleBack = () => {
    setCurrentStep('picker');
  };

  // Publicar la imagen
  const handlePublish = () => {
    if (!imageTitle.trim()) {
      Alert.alert("Campo requerido", "Por favor, agrega un título para tu imagen.");
      return;
    }
    
    setLoading(true);
    
    // Verificamos la relación de aspecto y ajustamos si es necesario
    let finalWidth = image.width;
    let finalHeight = image.height;
    
    // Aseguramos que siempre usemos la proporción 4:5 (ancho:alto)
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
      uri: image.uri,
      width: finalWidth,
      height: finalHeight,
      type: image.type || 'image/jpeg',
      fileSize: image.fileSize,
      fileName: image.fileName || `image_${Date.now()}.jpg`,
      // Metadatos para mostrar en la galería
      title: imageTitle.trim(),
      description: imageDescription.trim(),
      // Fecha actual para mostrar en la galería
      fecha: new Date().toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short',
        year: 'numeric'
      }),
      purpose: purpose,
      aspectRatio: aspectRatio,
      // Flag para indicar si necesita recorte
      _needsCrop: image._needsCrop || false,
      // Inicializamos likes en 0
      likes: 0,
      // ID único para la imagen
      id: `img_${Date.now()}`,
      // Timestamp para ordenación
      timestamp: Date.now(),
      // Status de carga (útil para mostrar indicadores visuales)
      status: 'completed',
    };

    if (!professionalId) {
      Alert.alert(
        "Error",
        "No se pudo identificar el profesional. Inténtalo de nuevo.",
        [{ text: "OK" }]
      );
      handleClose();
      return;
    }

    // Despachamos la acción para guardar en Redux y AsyncStorage
    dispatch(saveGalleryImage({ 
      professionalId, 
      imageInfo: completeImageData 
    }))
    .unwrap()
    .then(() => {
      Alert.alert(
        "Imagen publicada",
        "Tu imagen se ha añadido correctamente a la galería",
        [{ text: "OK" }]
      );

      // Notificamos al componente padre si hay una función onSave
      if (onSave && typeof onSave === 'function') {
        onSave(completeImageData);
      }
      
      // Cerramos y limpiamos
      handleClose();
    })
    .catch((error) => {
      Alert.alert(
        "Error",
        "No se pudo guardar la imagen. Inténtalo de nuevo más tarde.",
        [{ text: "OK" }]
      );
      console.error("Error guardando imagen:", error);
      handleClose();
    });
  };
  
  // Cerrar todo y reiniciar el estado
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Contenedor con animación para ambas pantallas */}
        <Animated.View 
          style={[
            styles.screensContainer,
            { transform: [{ translateX: slideAnimation }] }
          ]}
        >
          {/* Pantalla 1: Selector de imagen */}
          <View style={styles.screen}>
            {/* Cabecera */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>{title}</Text>
              <TouchableOpacity 
                style={[styles.nextButton, !image && styles.disabledButton]} 
                onPress={handleNext}
                disabled={!image}
              >
                <Ionicons name="arrow-forward" size={22} color={!image ? "#9CA3AF" : "#fff"} />
                <Text style={[styles.nextButtonText, !image && styles.disabledButtonText]}>
                  Siguiente
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Vista previa de imagen */}
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
                          image._needsCrop && {
                            width: '100%',
                            height: width * (aspectRatio[1]/aspectRatio[0]),
                          }
                        ]} 
                        resizeMode={image._needsCrop ? "contain" : "cover"}
                      />
                      {image._needsCrop && (
                        <View style={styles.cropGuides}>
                          <View style={styles.cropGuideVertical} />
                          <View style={styles.cropGuideHorizontal} />
                          
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

              {/* Opciones de selección */}
              <View style={styles.optionsContainer}>
                <View style={styles.buttonGroupContainer}>
                  <TouchableOpacity 
                    style={styles.optionButton} 
                    onPress={takePhoto}
                  >
                    <Ionicons name="camera" size={22} color="#fff" />
                    <Text style={styles.optionText}>Tomar Foto</Text>
                  </TouchableOpacity>

                  <View style={styles.buttonSeparator} />

                  <TouchableOpacity 
                    style={styles.optionButton} 
                    onPress={pickImage}
                  >
                    <Ionicons name="images" size={22} color="#fff" />
                    <Text style={styles.optionText}>Galería</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>

          {/* Pantalla 2: Detalles de imagen */}
          <View style={styles.screen}>
            {/* Cabecera */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.closeButton} onPress={handleBack}>
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Detalles de imagen</Text>
              <TouchableOpacity 
                style={styles.publishButton} 
                onPress={handlePublish}
                disabled={loading}
              >
                <Ionicons name="cloud-upload-outline" size={20} color={loading ? "#9CA3AF" : "#fff"} />
                <Text style={styles.publishButtonText}>
                  {loading ? 'Publicando...' : 'Publicar'}
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Formulario */}
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
                      value={imageTitle}
                      onChangeText={setImageTitle}
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
                      value={imageDescription}
                      onChangeText={setImageDescription}
                      multiline
                      numberOfLines={4}
                      maxLength={200}
                      textAlignVertical="top"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                  <View style={styles.inputFooter}>
                    <Text style={styles.inputHelp}>Máximo 200 caracteres</Text>
                    <Text style={styles.characterCount}>{imageDescription.length}/200</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  screensContainer: {
    flex: 1,
    flexDirection: 'row',
    width: width * 2, // Ancho total = 2 pantallas
  },
  screen: {
    width: width, // Cada pantalla ocupa el ancho de la pantalla
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 12,
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
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
  },
  disabledButton: {
    backgroundColor: '#E5E7EB',
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 4,
  },
  disabledButtonText: {
    color: '#9CA3AF',
  },
  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
  },
  publishButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 4,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  previewContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  previewWrapper: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#f9fafb',
  },
  previewImage: {
    width: '100%',
    height: width, // Altura igual al ancho para crear un cuadrado
    backgroundColor: '#f9fafb',
  },
  cropGuides: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  cropGuideVertical: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  cropGuideHorizontal: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
    position: 'absolute',
  },
  cropMessageContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  cropMessageText: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#fff',
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  changeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  changeImageText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 4,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 40,
    width: '100%',
    height: width,
  },
  placeholderText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  optionsContainer: {
    padding: 16,
  },
  buttonGroupContainer: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    overflow: 'hidden',
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 8,
  },
  buttonSeparator: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  formContainer: {
    padding: 16,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  requiredMark: {
    color: '#EF4444',
  },
  textInputContainer: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  textInput: {
    height: 44,
    fontSize: 15,
    color: '#111827',
  },
  textAreaContainer: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 120,
  },
  textArea: {
    fontSize: 15,
    color: '#111827',
    padding: 10,
  },
  inputHelp: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  characterCount: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default ImageUploaderUnifiedModal;