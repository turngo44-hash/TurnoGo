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
  FlatList,
  Dimensions,
  Alert,
  StatusBar,
  SafeAreaView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width,  height} = Dimensions.get('window');

/**
 * Componente ImagePickerCustom
 * Selector de imágenes estilo Instagram con visor 4:5 y galería en la parte inferior
 */
const ImagePickerCustom = ({ 
  visible, 
  onClose, 
  onSelectImage,
  aspectRatio = [4, 5] 
}) => {
  const insets = useSafeAreaInsets();
  const [photos, setPhotos] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  // Calcular dimensiones del visor de imagen con proporción 4:5
  // Añadimos márgenes laterales para que no ocupe toda la pantalla
  const SIDE_MARGIN = 16; // Margen a cada lado (32px en total)
  const viewerWidth = width - (SIDE_MARGIN * 2);
  const viewerHeight = (viewerWidth * aspectRatio[1]) / aspectRatio[0]; // Alto = Ancho * (5/4)

  // Solicitar permisos al montar el componente
  useEffect(() => {
    (async () => {
      if (visible) {
        await getPermissionsAndLoadPhotos();
      }
    })();
  }, [visible]);

  // Solicitar permisos y cargar fotos
  const getPermissionsAndLoadPhotos = async () => {
    try {
      setLoading(true);
      console.log('[ImagePicker] Solicitando permisos de Media Library...');
      
      // Esto es un problema común en Android: necesitamos forzar una solicitud explícita
      // en lugar de solo verificar, para asegurarnos de que el usuario vea el diálogo
      const { status } = await MediaLibrary.requestPermissionsAsync();
      console.log(`[ImagePicker] Estado de permisos: ${status}`);
      
      if (status === 'granted') {
        setHasPermission(true);
        await loadPhotosFromGallery();
      } else {
        setHasPermission(false);
        console.log('[ImagePicker] Permisos denegados por el usuario');
        Alert.alert(
          'Permisos denegados',
          'Necesitamos acceso a tu galería para seleccionar imágenes. Por favor, ve a Configuración y permite el acceso a Fotos para esta aplicación.',
          [
            { text: 'OK' },
            { 
              text: 'Reintentar', 
              onPress: () => getPermissionsAndLoadPhotos() 
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
      Alert.alert(
        'Error de permisos',
        'Ocurrió un error al solicitar permisos: ' + error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Cargar fotos de la galería del dispositivo
  const loadPhotosFromGallery = async () => {
    try {
      console.log('[ImagePicker] Intentando cargar fotos...');
      
      // Primero comprobamos que los permisos están realmente concedidos
      const permissionInfo = await MediaLibrary.getPermissionsAsync();
      console.log(`[ImagePicker] Estado de permisos actual: ${permissionInfo.status}`);
      
      if (!permissionInfo.granted) {
        console.log('[ImagePicker] No hay permisos previos, solicitando nuevamente...');
        // Si los permisos no están concedidos, los solicitamos explícitamente
        const { status } = await MediaLibrary.requestPermissionsAsync();
        console.log(`[ImagePicker] Resultado de solicitud: ${status}`);
        
        if (status !== 'granted') {
          setHasPermission(false);
          Alert.alert(
            'Permisos denegados',
            'Sin permisos para acceder a tu galería, no podemos mostrar tus fotos. Por favor, ve a Configuración y permite el acceso a Fotos.'
          );
          return;
        }
      }
      
      try {
        // Intentamos obtener todas las fotos sin filtros primero para ver si funciona
        console.log('[ImagePicker] Intentando obtener todos los assets...');
        const result = await MediaLibrary.getAssetsAsync({
          mediaType: 'photo',
          first: 50,
        });
        
        console.log(`[ImagePicker] Assets encontrados: ${result.assets?.length || 0}`);
        
        // Verificamos si tenemos resultados
        if (result.assets && result.assets.length > 0) {
          // Añadimos un item especial para la cámara al principio
          const photosWithCamera = [
            { id: 'camera', uri: 'camera' },
            ...result.assets.map(asset => ({ 
              id: asset.id, 
              uri: asset.uri,
              width: asset.width || 800,
              height: asset.height || 1000
            }))
          ];
          
          setPhotos(photosWithCamera);
          
          // Seleccionamos automáticamente la primera foto real (no la cámara)
          setSelectedImage({
            id: result.assets[0].id,
            uri: result.assets[0].uri,
            width: result.assets[0].width || 800,
            height: result.assets[0].height || 1000
          });
          
          console.log('[ImagePicker] Fotos cargadas correctamente');
          return;
        } else {
          console.log('[ImagePicker] No se encontraron fotos en el primer intento');
        }
      } catch (innerError) {
        console.error('[ImagePicker] Error al cargar fotos (primer intento):', innerError);
      }
      
      // Si llegamos aquí, el primer intento falló, intentamos con más opciones
      try {
        console.log('[ImagePicker] Intentando cargar fotos con opciones más específicas...');
        
        // Intentamos ahora con opciones específicas
        const { assets } = await MediaLibrary.getAssetsAsync({
          mediaType: 'photo',
          first: 20,
          sortBy: ['default']
        });
        
        console.log(`[ImagePicker] Segundo intento: ${assets?.length || 0} fotos`);
        
        if (!assets || assets.length === 0) {
          console.log('[ImagePicker] No se encontraron fotos en el segundo intento');
          Alert.alert(
            'No hay fotos',
            'No se encontraron fotos en tu galería. Por favor, toma una foto con la cámara o comprueba los permisos de la aplicación.'
          );
          
          // Aún así mostraremos al menos la opción de cámara
          setPhotos([{ id: 'camera', uri: 'camera' }]);
          return;
        }
        
        // Añadimos un item especial para la cámara al principio
        const photosWithCamera = [
          { id: 'camera', uri: 'camera' },
          ...assets.map(asset => ({ 
            id: asset.id, 
            uri: asset.uri,
            width: asset.width || 800,
            height: asset.height || 1000
          }))
        ];
        
        setPhotos(photosWithCamera);
        
        // Seleccionamos automáticamente la primera foto real (no la cámara)
        setSelectedImage({
          id: assets[0].id,
          uri: assets[0].uri,
          width: assets[0].width || 800,
          height: assets[0].height || 1000
        });
      } catch (finalError) {
        console.error('[ImagePicker] Error final al cargar fotos:', finalError);
        Alert.alert(
          'Error al cargar fotos',
          'Hubo un problema al acceder a tu galería de fotos. Por favor, intenta usar la cámara.'
        );
        
        // Al menos mostramos la opción de cámara
        setPhotos([{ id: 'camera', uri: 'camera' }]);
      }
    } catch (error) {
      console.error('Error al cargar fotos:', error);
      Alert.alert('Error', 'No se pudieron cargar las fotos de la galería.');
    }
  };

  // Abrir la cámara para tomar una foto
  const handleOpenCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a la cámara.');
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: aspectRatio,
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const capturedImage = result.assets[0];
        const newImage = {
          id: 'captured_' + Date.now(),
          uri: capturedImage.uri,
          width: capturedImage.width,
          height: capturedImage.height
        };
        
        setSelectedImage(newImage);
        
        // Refrescar la galería para que aparezca la nueva foto
        loadPhotosFromGallery();
      }
    } catch (error) {
      console.error('Error al abrir cámara:', error);
      Alert.alert('Error', 'No se pudo iniciar la cámara.');
    }
  };

  // Manejar la selección de una foto
  const handleSelectPhoto = (item) => {
    if (item.id === 'camera') {
      handleOpenCamera();
      return;
    }

    console.log('[ImagePicker] Foto seleccionada:', item);
    setSelectedImage(item);
  };

  // Pasar la imagen seleccionada al componente padre para ir a la pantalla de edición
  const handleNext = () => {
    console.log('[ImagePicker] Intentando avanzar a la pantalla de edición...');
    
    if (selectedImage && selectedImage.id !== 'camera') {
      console.log('[ImagePicker] Imagen seleccionada:', selectedImage);
      
      // Verificar que la URI existe y es una cadena
      if (!selectedImage.uri || typeof selectedImage.uri !== 'string') {
        console.error('[ImagePicker] Error: URI inválida:', selectedImage.uri);
        Alert.alert('Error', 'La imagen seleccionada no tiene una URI válida. Por favor, selecciona otra imagen.');
        return;
      }
      
      // Verificamos que la imagen tenga URI antes de continuar
      if (!selectedImage.uri) {
        Alert.alert('Error', 'La imagen seleccionada no es válida. Por favor, selecciona otra.');
        return;
      }
      
      // Asegurarnos de que la URI sea accesible probando con file:// o content://
      // para imágenes que podrían venir de la cámara
      let uriToUse = selectedImage.uri;
      if (Platform.OS === 'android' && !uriToUse.startsWith('file://') && !uriToUse.startsWith('content://')) {
        console.log('[ImagePicker] Corrigiendo URI para Android:', uriToUse);
        // Si la URI no tiene un esquema reconocido, intentamos añadir file://
        uriToUse = `file://${uriToUse}`;
      }
      
      // Crear una copia limpia con todas las propiedades necesarias
      // Esto asegura que no haya problemas de referencia o propiedades faltantes
      const imageWithAspect = {
        id: selectedImage.id || `image_${Date.now()}`,
        uri: uriToUse,
        width: selectedImage.width || 800,
        height: selectedImage.height || 1000,
        aspectRatio: aspectRatio,
        targetAspect: aspectRatio[1] / aspectRatio[0], // 5/4 = 1.25
        // Añadir timestamp único para debugging y evitar problemas de caché
        _timestamp: Date.now(),
        // Indicar si viene de la cámara y si ha sido previamente visualizada
        fromCamera: selectedImage.fromCamera || false,
        previewLoaded: true
      };
      
      console.log('[ImagePicker] Llamando a onSelectImage con:', imageWithAspect);
      
      // Notificamos al componente padre (sin cerrar aún, solo para cambiar de pantalla)
      // El componente padre (InstagramStyleImagePicker) se encargará de mostrar la pantalla de edición
      if (onSelectImage && typeof onSelectImage === 'function') {
        onSelectImage(imageWithAspect);
      } else {
        console.error('[ImagePicker] Error: onSelectImage no es una función válida');
        Alert.alert('Error', 'Ha ocurrido un error en la aplicación.');
      }
    } else {
      Alert.alert('Error', 'Por favor selecciona una imagen primero.');
    }
  };

  // Cerrar el selector y limpiar estados
  const handleClose = () => {
    setSelectedImage(null);
    setPhotos([]);
    onClose();
  };

  // Renderizar cada item de la galería
  const renderPhotoItem = ({ item }) => {
    const isCamera = item.id === 'camera';
    const isSelected = !isCamera && selectedImage && item.id === selectedImage.id;
    
    // Depuración de URIs inválidas
    if (!isCamera && (!item.uri || typeof item.uri !== 'string')) {
      console.log(`[ImagePicker] Error: URI inválida para item ${item.id}`, item);
      return null; // No renderizamos items con URIs inválidas
    }
    
    return (
      <TouchableOpacity
        style={[
          styles.photoItem,
          isSelected && styles.selectedPhotoItem
        ]}
        onPress={() => handleSelectPhoto(item)}
        activeOpacity={0.8}
      >
        {isCamera ? (
          <View style={styles.cameraItem}>
            <Ionicons name="camera" size={28} color="#fff" />
          </View>
        ) : (
          <>
            <Image 
              source={{ uri: item.uri }} 
              style={styles.photoThumb} 
              resizeMode="cover"
              onError={(e) => console.log(`[ImagePicker] Error cargando imagen: ${item.id}`, e.nativeEvent.error)}
            />
            {isSelected && (
              <View style={styles.selectedOverlay}>
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </View>
              </View>
            )}
          </>
        )}
      </TouchableOpacity>
    );
  };

  // Si no es visible, no renderizamos nada
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={styles.container}>
        {/* Header con X y botón Siguiente */}
        <View style={[styles.header, { paddingTop: insets.top > 0 ? 0 : 16 }]}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={handleClose}
          >
            <Ionicons name="close" size={28} color="#000" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Nueva publicación</Text>
          
          <TouchableOpacity 
            style={[
              styles.nextButton,
              !selectedImage && styles.nextButtonDisabled
            ]} 
            onPress={handleNext}
            disabled={!selectedImage || selectedImage.id === 'camera'}
          >
            <Text style={[
              styles.nextButtonText,
              !selectedImage && styles.nextButtonTextDisabled
            ]}>
              Siguiente
            </Text>
          </TouchableOpacity>
        </View>

        {/* Visor principal de imagen con proporción 4:5 */}
        <View style={[
          styles.imageViewer, 
          { 
            width: viewerWidth, 
            height: viewerHeight,
            marginHorizontal: SIDE_MARGIN
          }
        ]}>
          {loading ? (
            <ActivityIndicator size="large" color="#0095F6" />
          ) : selectedImage ? (
            <>
              <Image 
                source={{ uri: selectedImage.uri }} 
                style={styles.selectedImage}
                resizeMode="cover"
                onError={(e) => {
                  console.error('[ImagePicker] Error cargando imagen en visor:', e.nativeEvent.error);
                  Alert.alert('Error', 'No se pudo cargar la imagen seleccionada. Por favor, selecciona otra.');
                }}
              />
              <Text style={styles.debugInfo}>
                {selectedImage.width ? `${selectedImage.width}x${selectedImage.height}` : ''}
              </Text>
            </>
          ) : (
            <View style={styles.noImageSelected}>
              <Ionicons name="images-outline" size={60} color="#ccc" />
              <Text style={styles.noImageText}>Selecciona una imagen</Text>
            </View>
          )}
          
          {/* Marco para indicar la proporción 4:5 */}
          <View style={styles.aspectRatioFrame} />
        </View>        
        
        {/* Galería de imágenes */}
        <View style={styles.galleryContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0095F6" />
              <Text style={styles.loadingText}>Cargando fotos...</Text>
            </View>
          ) : !hasPermission ? (
            <View style={styles.permissionContainer}>
              <Ionicons name="lock-closed" size={40} color="#999" />
              <Text style={styles.permissionText}>
                Se requiere acceso a la galería
              </Text>
              <TouchableOpacity 
                style={styles.permissionButton}
                onPress={getPermissionsAndLoadPhotos}
              >
                <Text style={styles.permissionButtonText}>
                  Solicitar permiso
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={photos}
              renderItem={renderPhotoItem}
              keyExtractor={item => item.id}
              numColumns={4} // Cambiado a 4 columnas como solicitaste
              showsVerticalScrollIndicator={false}
              initialNumToRender={16} // Optimizado para 4 columnas
              maxToRenderPerBatch={16}
              windowSize={5} // Optimización de rendimiento
              removeClippedSubviews={true} // Importante para mejorar rendimiento
              getItemLayout={(data, index) => ({
                length: width / 4, // Actualizado para 4 columnas
                offset: (width / 4) * Math.floor(index / 4),
                index
              })}
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DBDBDB',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#262626',
  },
  closeButton: {
    padding: 4,
  },
  nextButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0095F6',
  },
  nextButtonTextDisabled: {
    color: '#0095F6',
  },
  imageViewer: {
    marginVertical: 8,
    borderRadius: 4,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  debugInfo: {
    position: 'absolute', 
    top: 5, 
    right: 5, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    color: '#fff', 
    fontSize: 10,
    padding: 3,
    borderRadius: 4
  },
  aspectRatioFrame: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
  },
  noImageSelected: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    color: '#ccc',
    marginTop: 10,
  },
  galleryContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  photoItem: {
    width: width / 4,
    height: width / 4,
    padding: 1,
  },
  photoThumb: {
    width: '100%',
    height: '100%',
  },
  selectedPhotoItem: {
    opacity: 0.7,
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0095F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraItem: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0095F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#999',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  permissionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#0095F6',
    borderRadius: 4,
  },
  permissionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ImagePickerCustom;