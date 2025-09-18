import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Componente ImageEditorScreen
 * Editor de título y descripción de imagen estilo Instagram
 */
const ImageEditorScreen = ({
  visible,
  onClose,
  onSave,
  imageData,
}) => {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  // Monitorear cambios en los estados clave con efecto
  useEffect(() => {
    console.log('[ImageEditor] Estado actual:', { 
      visible, 
      hasImageData: imageData ? true : false,
      imageURI: imageData?.uri || 'undefined'
    });
    
    if (visible && !imageData) {
      console.error('[ImageEditor] ADVERTENCIA: Componente visible pero sin datos de imagen');
    }
  }, [visible, imageData]);
  
  // Reset de los campos cuando cambian los datos de imagen
  useEffect(() => {
    if (imageData && visible) {
      setTitle('');
      setDescription('');
    }
  }, [imageData, visible]);

  // No hay imagen para editar o componente no visible
  if (!visible) {
    return null;
  }
  
  // Si es visible pero no hay datos de imagen, mostramos un mensaje de error
  if (!imageData) {
    console.error('[ImageEditor] Error: No hay objeto de datos de imagen');
    
    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={false}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={28} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Error</Text>
            <View style={{width: 40}} />
          </View>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
            <Text style={{fontSize: 16, textAlign: 'center', marginBottom: 20}}>
              No se ha podido cargar la imagen seleccionada. El objeto de imagen es nulo.
            </Text>
            <TouchableOpacity 
              style={{backgroundColor: '#0095F6', padding: 12, borderRadius: 8}}
              onPress={onClose}
            >
              <Text style={{color: '#fff', fontWeight: '600'}}>Volver a intentar</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
  
  // Verificamos específicamente si hay URI
  if (!imageData.uri) {
    console.error('[ImageEditor] Error: Objeto de imagen sin URI válida:', imageData);
    
    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={false}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={28} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Error</Text>
            <View style={{width: 40}} />
          </View>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
            <Text style={{fontSize: 16, textAlign: 'center', marginBottom: 20}}>
              La imagen seleccionada no tiene una URI válida. Detalles del error:
            </Text>
            <Text style={{fontSize: 14, textAlign: 'left', marginBottom: 20, width: '100%'}}>
              1. La imagen seleccionada no se transfirió correctamente{'\n'}
              2. La aplicación no tiene permisos para acceder a esta imagen{'\n'}
              3. El archivo de imagen está dañado o no es compatible{'\n'}
              4. La imagen proviene de la cámara y no se procesó correctamente{'\n'}
            </Text>
            <TouchableOpacity 
              style={{backgroundColor: '#0095F6', padding: 12, borderRadius: 8}}
              onPress={onClose}
            >
              <Text style={{color: '#fff', fontWeight: '600'}}>Volver a intentar</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa un título para tu imagen');
      return;
    }

    // Verificar una vez más que tenemos datos de imagen válidos
    if (!imageData || !imageData.uri) {
      console.error('[ImageEditor] Error al guardar: datos de imagen inválidos');
      Alert.alert('Error', 'No se pueden guardar los datos de la imagen porque no son válidos');
      return;
    }

    setSaving(true);
    
    // Preparamos los datos completos con la información de la imagen y los metadatos
    const completeImageData = {
      // Crear un objeto nuevo con los datos básicos garantizados
      id: imageData.id || `image_${Date.now()}`,
      uri: imageData.uri,
      width: imageData.width || 800,
      height: imageData.height || 1000,
      // Añadir metadatos del formulario
      title: title.trim(),
      description: description.trim(),
      timestamp: Date.now(),
      fecha: new Date().toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short',
        year: 'numeric'
      }),
      likes: 0,
      id: `img_${Date.now()}`,
      status: 'completed'
    };
    
    // Enviamos los datos al componente padre
    if (onSave && typeof onSave === 'function') {
      onSave(completeImageData);
    }
    
    // Limpiamos los campos y cerramos
    resetAndClose();
  };

  const resetAndClose = () => {
    setTitle('');
    setDescription('');
    setSaving(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={resetAndClose}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardView}
        >
          {/* Header con X y botón Guardar */}
          <View style={[styles.header, { paddingTop: insets.top > 0 ? 0 : 16 }]}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={resetAndClose}
            >
              <Ionicons name="close" size={28} color="#000" />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Nueva publicación</Text>
            
            <TouchableOpacity 
              style={[styles.saveButton, !title.trim() && styles.saveButtonDisabled]} 
              onPress={handleSave}
              disabled={saving || !title.trim()}
            >
              {saving ? (
                <Text style={styles.saveButtonText}>Guardando...</Text>
              ) : (
                <Text style={[styles.saveButtonText, !title.trim() && styles.saveButtonTextDisabled]}>
                  Compartir
                </Text>
              )}
            </TouchableOpacity>
          </View>
          
          {/* Usamos View en lugar de ScrollView para evitar el anidamiento con FlatList */}
          <View 
            style={styles.scrollView}
          >
            <View style={styles.content}>
              {/* Sección de imagen y título */}
              <View style={styles.imageSection}>
                {/* Miniatura de la imagen */}
                <View style={styles.imageThumbnailContainer}>
                  <Image 
                    source={{ uri: imageData.uri }} 
                    style={styles.imageThumbnail}
                    resizeMode="cover"
                  />
                </View>
                
                {/* Input para título */}
                <View style={styles.titleInputContainer}>
                  <TextInput
                    style={styles.titleInput}
                    placeholder="Escribe un título..."
                    placeholderTextColor="#A3A3A3"
                    value={title}
                    onChangeText={setTitle}
                    maxLength={100}
                    multiline={false}
                    returnKeyType="next"
                  />
                </View>
              </View>
              
              {/* Separador */}
              <View style={styles.separator} />
              
              {/* Sección de descripción */}
              <View style={styles.descriptionSection}>
                <TextInput
                  style={styles.descriptionInput}
                  placeholder="Escribe una descripción..."
                  placeholderTextColor="#A3A3A3"
                  value={description}
                  onChangeText={setDescription}
                  multiline={true}
                  textAlignVertical="top"
                  maxLength={2000}
                />
              </View>
              
              {/* Contador de caracteres para descripción */}
              <Text style={styles.characterCount}>
                {description.length}/2000
              </Text>
              
              {/* Vista previa de la imagen en tamaño grande */}
              <View style={styles.previewSection}>
                <Text style={styles.previewTitle}>Vista previa</Text>
                <View style={styles.imagePreviewContainer}>
                  <Image 
                    source={{ uri: imageData.uri }} 
                    style={styles.imagePreview}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
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
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0095F6',
  },
  saveButtonTextDisabled: {
    color: '#0095F6',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  content: {
    flex: 1,
  },
  imageSection: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  imageThumbnailContainer: {
    width: 60,
    height: 60,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
  },
  imageThumbnail: {
    width: '100%',
    height: '100%',
  },
  titleInputContainer: {
    flex: 1,
    marginLeft: 12,
  },
  titleInput: {
    fontSize: 16,
    color: '#262626',
    padding: 0,
    minHeight: 40,
  },
  separator: {
    height: 0.5,
    backgroundColor: '#DBDBDB',
    marginHorizontal: 16,
  },
  descriptionSection: {
    padding: 16,
    minHeight: 100,
  },
  descriptionInput: {
    fontSize: 16,
    color: '#262626',
    padding: 0,
    minHeight: 100,
  },
  characterCount: {
    fontSize: 12,
    color: '#8E8E8E',
    textAlign: 'right',
    marginRight: 16,
    marginTop: -8,
    marginBottom: 16,
  },
  previewSection: {
    padding: 16,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 12,
  },
  imagePreviewContainer: {
    aspectRatio: 4/5,
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
});

export default ImageEditorScreen;