import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { saveGalleryImage } from '../store/slices/gallerySlice';

import ImagePickerCustom from './ImagePickerCustom';
import ImageEditorScreen from './ImageEditorScreen';

/**
 * Componente contenedor para el flujo completo de selección y edición de imágenes
 * Estilo Instagram con integración a Redux
 */
const InstagramStyleImagePicker = ({ visible, onClose, professionalId, ...props }) => {
  const dispatch = useDispatch();
  const { currentProfessionalId } = useSelector(state => state.gallery);
  
  // ID del profesional, ya sea pasado como prop o tomado de Redux
  const activeId = professionalId || currentProfessionalId;

  // Estados para controlar el flujo de la interfaz
  const [step, setStep] = useState('picker'); // 'picker' o 'editor'
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Refs para controlar los cambios de estado y evitar actualizaciones durante desmontaje
  const isMounted = useRef(true);
  
  useEffect(() => {
    // Marcar el componente como montado
    isMounted.current = true;
    
    // Limpiar cuando el componente se desmonte
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Monitorear cambios en los estados clave
  useEffect(() => {
    console.log('[InstagramStyleImagePicker] Estado actual:', { 
      visible, 
      step, 
      selectedImage: selectedImage ? 'presente' : 'null' 
    });
    
    // Reiniciar el estado si el componente se oculta
    if (!visible && step !== 'picker') {
      console.log('[InstagramStyleImagePicker] Componente ocultado, reiniciando estado');
      if (isMounted.current) {
        setStep('picker');
        setSelectedImage(null);
      }
    }
  }, [visible, step, selectedImage]);

  // Maneja el cambio al editor después de seleccionar una imagen
  const handleImageSelected = useCallback((imageInfo) => {
    console.log('[InstagramPicker] Imagen seleccionada recibida:', imageInfo);
    
    if (!imageInfo || !imageInfo.uri) {
      console.error('[InstagramPicker] Error: Imagen seleccionada inválida');
      Alert.alert('Error', 'La imagen seleccionada no es válida.');
      return;
    }
    
    if (!isMounted.current) {
      console.warn('[InstagramPicker] Componente desmontado, no actualizando estado');
      return;
    }
    
    // Preparar una copia limpia de la imagen para evitar problemas de referencia
    const imageToSave = {
      id: imageInfo.id,
      uri: imageInfo.uri,
      width: imageInfo.width || 800,
      height: imageInfo.height || 1000,
      // Añadir timestamp para debugging y para evitar problemas de caché
      _timestamp: Date.now()
    };
    
    // Actualizar en una única operación para mantener consistencia
    console.log('[InstagramPicker] Actualizando estado: imagen y paso');
    
    // Primero actualizar la imagen
    setSelectedImage(imageToSave);
    
    // Luego cambiar al paso de edición
    setStep('editor');
  }, []);

  // Maneja la acción de guardar la imagen editada
  const handleSaveImage = (completeImageInfo) => {
    if (!activeId) {
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
      professionalId: activeId, 
      imageInfo: completeImageInfo 
    }))
    .unwrap()
    .then(() => {
      Alert.alert(
        "Imagen publicada",
        "Tu imagen se ha añadido correctamente a la galería",
        [{ text: "OK" }]
      );

      // Notificamos al componente padre si hay una función onSave
      if (props.onSave && typeof props.onSave === 'function') {
        props.onSave(completeImageInfo);
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

  // Cierra el componente y reinicia los estados
  const handleClose = useCallback(() => {
    console.log('[InstagramStyleImagePicker] Cerrando componente...');
    
    // Verificar que el componente sigue montado antes de actualizar estado
    if (isMounted.current) {
      // Primero reiniciar los estados internos
      setSelectedImage(null);
      setStep('picker');
      
      // Luego notificar al componente padre que debe cerrar
      console.log('[InstagramStyleImagePicker] Llamando a onClose');
      onClose();
    }
  }, [onClose]);

  // Renderizado condicional para mejorar el rendimiento
  // Solo renderizamos el componente activo según el paso actual
  const renderCurrentStep = () => {
    if (!visible) {
      console.log('[InstagramStyleImagePicker] No visible, no renderizar');
      return null; // No renderizar nada si el componente no es visible
    }
    
    // Validar y mejorar la visibilidad del componente actual
    const isPickerVisible = visible && step === 'picker';
    const isEditorVisible = visible && step === 'editor';
    
    console.log('[InstagramStyleImagePicker] Estado de renderizado:', {
      isPickerVisible,
      isEditorVisible,
      hasSelectedImage: selectedImage ? true : false
    });
    
    // Renderizar ambos componentes pero controlar la visibilidad internamente
    return (
      <>
        <ImagePickerCustom
          visible={isPickerVisible}
          onClose={handleClose}
          onSelectImage={handleImageSelected}
          aspectRatio={[4, 5]} // Relación Instagram
        />
        
        <ImageEditorScreen
          visible={isEditorVisible}
          onClose={handleClose}
          onSave={handleSaveImage}
          imageData={selectedImage}
        />
      </>
    );
  };
  
  return renderCurrentStep();
};

export default InstagramStyleImagePicker;