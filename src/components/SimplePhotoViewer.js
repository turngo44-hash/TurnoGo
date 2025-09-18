/**
 * SimplePhotoViewer
 * - Swipe horizontal (paginated) between photos using FlatList
 * - Double-tap to like (shows animated heart)
 * - Header shows close button (left), centered index (e.g. 3/9), and more-options (right)
 * - Description supports "Ver más" expansion (does not grow upwards)
 * - Prefetches previous/next image for smoother transitions
 *
 * Notes: the more-options button currently shows a placeholder Alert; replace with
 * an ActionSheet or modal to add actions (Share, Save, Delete) if needed.
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Modal,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Animated,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Alert } from 'react-native';
import colors from '../constants/colors';

const { width, height } = Dimensions.get('window');

const SimplePhotoViewer = ({ photos = [], initialIndex = 0, visible = false, onClose = () => {}, professional = null }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [loadingImage, setLoadingImage] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [lastTapTime, setLastTapTime] = useState(0);
  const flatListRef = useRef(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const likeAnimScale = useRef(new Animated.Value(0)).current;
  // Viewability handler para actualizar el índice cuando la vista cambie
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      const visible = viewableItems[0];
      if (typeof visible.index === 'number' && visible.index !== currentIndex) {
        setCurrentIndex(visible.index);
        setLoadingImage(true);
        fadeAnim.setValue(0.3);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    }
  }).current;
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;
  
  useEffect(() => {
    // Reset state when modal becomes visible
    if (visible) {
      setCurrentIndex(initialIndex);
      setIsDescriptionExpanded(false);
      setLoadingImage(true);
      setIsLiked(false);
      // Asegurar que FlatList esté en el índice inicial solicitado
      setTimeout(() => {
        try {
          if (flatListRef && flatListRef.current) {
            flatListRef.current.scrollToIndex({ index: initialIndex, animated: false });
          }
        } catch (e) {
          // scrollToIndex puede fallar si el índice no está preparado; ignoramos
        }
      }, 50);
    }
  }, [visible, initialIndex]);

  // Current photo being displayed
  const currentPhoto = photos && photos.length > 0 ? photos[currentIndex] : null;
  
  // Handle image load completion
  const handleImageLoad = () => {
    setLoadingImage(false);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  // Navigation handlers mejorados
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      // Solo mostramos el indicador de carga si la imagen no está en caché
      const prevImageUri = photos[currentIndex - 1]?.uri;
      if (prevImageUri) {
        // En React Native no usamos Image de la misma forma que en web
        setLoadingImage(true);
      } else {
        setLoadingImage(false);
      }
      
      // Animación de fade para la nueva imagen
      fadeAnim.setValue(0.3);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      }).start();
    }
  };

  const handleNext = () => {
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(currentIndex + 1);
      // Solo mostramos el indicador de carga si la imagen no está en caché
      const nextImageUri = photos[currentIndex + 1]?.uri;
      if (nextImageUri) {
        // En React Native no usamos Image de la misma forma que en web
        setLoadingImage(true);
      } else {
        setLoadingImage(false);
      }
      
      // Animación de fade para la nueva imagen
      fadeAnim.setValue(0.3);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      }).start();
    }
  };

  // Toggle description expansion
  const toggleDescriptionExpand = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  // Toggle like
  const toggleLike = () => {
    setIsLiked(!isLiked);
  };
  
  // Handle double tap to like
  const handleImagePress = () => {
    const currentTime = new Date().getTime();
    const DOUBLE_TAP_DELAY = 300;
    
    if (currentTime - lastTapTime < DOUBLE_TAP_DELAY) {
      // Double tap detected
      setIsLiked(true);
      animateLikeIcon();
    } 
    
    setLastTapTime(currentTime);
  };
  
  // Animate the like icon on double-tap
  const animateLikeIcon = () => {
    setShowLikeAnimation(true);
    
    Animated.sequence([
      Animated.timing(likeAnimScale, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(likeAnimScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start(() => {
      // Hide animation after a delay
      setTimeout(() => {
        setShowLikeAnimation(false);
        likeAnimScale.setValue(0);
      }, 800);
    });
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calcula si la descripción requiere el botón "Ver más" (al estilo Facebook)
  const isDescriptionLong = currentPhoto?.description?.split('\n').length > 2 || 
                           (currentPhoto?.description?.length > 60) || false;

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          {/* professional header removed per request */}

          {/* Botón de 3 puntos (configuración) */}
          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => {
              // Placeholder: reemplazar por ActionSheet o menú real si se quiere
              Alert.alert('Más opciones', 'Abrir menú de opciones (placeholder)');
            }}
            accessibilityLabel="Más opciones"
          >
            <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
          </TouchableOpacity>

          {/* Contador en header centrado (ej. 5/8) */}
          {photos && photos.length > 0 && (
            <View style={styles.headerCenterIndex} pointerEvents="none">
              <View style={styles.centerIndexBubble}>
                <Text style={styles.centerIndexText}>{`${currentIndex + 1}/${photos.length}`}</Text>
              </View>
            </View>
          )}
        </View>
        
    {/* Image View con soporte para deslizar */}
    <View style={styles.imageContainer}>
          {loadingImage && (
            <ActivityIndicator size="large" color="#fff" style={styles.loader} />
          )}
          
          {/* FlatList paginada para swipe entre imágenes */}
          <FlatList
            ref={flatListRef}
            data={photos}
            keyExtractor={(item, idx) => item.id?.toString() || idx.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={initialIndex}
            getItemLayout={(data, index) => ({ length: width, offset: width * index, index })}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            renderItem={({ item, index }) => (
              <View style={styles.imageWrapper}>
                <TouchableWithoutFeedback onPress={handleImagePress}>
                  <Animated.Image
                    source={{ uri: item?.uri }}
                    style={[styles.image, { opacity: fadeAnim }]}
                    resizeMode="cover"
                    onLoad={handleImageLoad}
                  />
                </TouchableWithoutFeedback>

                {/* Precarga invisible */}
                {index < photos.length - 1 && (
                  <Image source={{ uri: photos[index + 1]?.uri }} style={styles.preloadImage} />
                )}
                {index > 0 && (
                  <Image source={{ uri: photos[index - 1]?.uri }} style={styles.preloadImage} />
                )}

                {/* Double-tap like animation overlay */}
                {showLikeAnimation && (
                  <Animated.View style={[
                    styles.likeIconOverlay,
                    { transform: [{ scale: likeAnimScale }] }
                  ]}>
                    <FontAwesome name="heart" size={65} color="#E53E3E" />
                  </Animated.View>
                )}
              </View>
            )}
          />
          
        </View>        {/* Info Panel */}
        <View style={styles.infoPanel}>
          {/* Título de la imagen */}
          {currentPhoto?.title && (
            <Text style={styles.photoTitle}>{currentPhoto.title}</Text>
          )}
          
          {/* Descripción con "Ver más" estilo Facebook */}
          {currentPhoto?.description && (
            <View style={styles.descriptionWrapper}>
              <Text numberOfLines={isDescriptionExpanded ? undefined : 2} style={styles.description}>
                {currentPhoto.description}
              </Text>
              
              {isDescriptionLong && (
                <TouchableOpacity 
                  onPress={toggleDescriptionExpand} 
                  style={styles.expandButton} 
                  activeOpacity={0.7}
                >
                  <Text style={styles.expandButtonText}>
                    {isDescriptionExpanded ? 'Ver menos' : 'Ver más'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          
          {/* Contador de Me Gusta */}
          <View style={styles.likesCounter}>
            <View style={styles.likesAvatarStack}>
              <View style={[styles.likeAvatar, styles.likeAvatar1]}>
                <Image source={{ uri: 'https://via.placeholder.com/20' }} style={styles.likeAvatarImage} />
              </View>
              {(currentPhoto?.likesCount > 1) && (
                <View style={[styles.likeAvatar, styles.likeAvatar2]}>
                  <Image source={{ uri: 'https://via.placeholder.com/20' }} style={styles.likeAvatarImage} />
                </View>
              )}
            </View>
            <Text style={styles.likesText}>
              {isLiked ? 'A ti' : 'A'} {currentPhoto?.firstLiker || 'María'} 
              {currentPhoto?.likesCount > 1 ? ` y ${currentPhoto.likesCount - 1} personas más` : ''} 
              {isLiked && currentPhoto?.likesCount > 0 ? ' también ' : ' '} 
              les gusta esto
            </Text>
          </View>
          
          {/* Barra de acciones (Me gusta y Comentar) */}
          <View style={styles.actionBarContainer}>
            <View style={styles.actionBar}>
              <TouchableOpacity style={styles.actionButton} onPress={toggleLike}>
                <Ionicons 
                  name={isLiked ? "heart" : "heart-outline"} 
                  size={20} 
                  color={isLiked ? "#E53E3E" : "#fff"} 
                />
                <Text style={styles.actionButtonText}>Me gusta</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbubble-outline" size={18} color="#fff" />
                <Text style={styles.actionButtonText}>Comentar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  closeButton: {
    padding: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 12,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  userTextInfo: {
    marginLeft: 10,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dateText: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 2,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    width: '100%', // Asegurar ancho completo
  },
  image: {
    width: width,
    height: width * 1.25, // Proporción 4:5 de Instagram
    maxHeight: height * 0.9, // Aumentado de 85% a 90% para usar más espacio vertical
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
  },
  // Estilos para deslizar entre fotos
  infoPanel: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: 15,
    paddingBottom: 30,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    maxHeight: height * 0.3, // Limitar la altura para que no ocupe demasiado espacio
  },
  descriptionWrapper: {
    marginBottom: 15,
  },
  photoTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#f0f0f0',
    fontSize: 13,
    lineHeight: 18,
  },
  expandButton: {
    marginTop: 4,
  },
  expandButtonText: {
    color: '#3897f0',
    fontSize: 12,
    fontWeight: '600',
  },
  // Se han eliminado los estilos de paginación
  // Facebook-style UI additions - tamaño reducido
  likesCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  likesAvatarStack: {
    flexDirection: 'row',
    marginRight: 8,
    width: 26,
    height: 16,
  },
  likeAvatar: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#000',
  },
  likeAvatar1: {
    zIndex: 2,
  },
  likeAvatar2: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  likeAvatarImage: {
    width: '100%',
    height: '100%',
  },
  likesText: {
    color: '#ddd',
    fontSize: 12,
  },
  // Action bar container - sin línea horizontal
  actionBarContainer: {
    paddingTop: 10,
    marginTop: 5,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '400',
  },
  // Double-tap like animation con soporte para deslizar
  imageWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: width * 1.25, // Proporción 4:5 de Instagram
    maxHeight: height * 0.9, // Aumentado para ocupar más espacio vertical
  },
  // Imagen invisible para precarga
  preloadImage: {
    width: 1,
    height: 1,
    opacity: 0,
    position: 'absolute',
  },
  likeIconOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  expandButtonText: {
    color: '#3897f0',
    fontSize: 12,
    fontWeight: '600',
  },
  // Botón de más opciones en header
  moreButton: {
    position: 'absolute',
    right: 12,
    top: 10,
    padding: 6,
  },
  // Contenedor para el contador centrado dentro del header
  headerCenterIndex: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 8,
    alignItems: 'center',
    zIndex: 20,
    justifyContent: 'center',
  },
  centerIndexBubble: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  centerIndexText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default SimplePhotoViewer;