import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { loadGalleryImages, setCurrentProfessionalId } from '../store/slices/gallerySlice';
import SimplePhotoViewer from './SimplePhotoViewer';

const { width } = Dimensions.get('window');
const numColumns = 3;
const tileSize = width / numColumns;
const tileMargin = 1;
// Relación de aspecto 4:5 (formato Instagram)
const aspectRatio = 5/4; // Alto / Ancho = 1.25
const calculatedWidth = tileSize - (tileMargin * 2);
const calculatedHeight = calculatedWidth * aspectRatio;

const GalleryTabRedux = ({ 
  professional, 
  photos = [], 
  onPhotoPress, 
  onAddPhoto,
  addRequestCount = 0 
}) => {
  const dispatch = useDispatch();
  const { images, isLoading, error, currentProfessionalId } = useSelector(state => state.gallery);
  const [refreshing, setRefreshing] = useState(false);
  const professionalId = professional?.id;
  
  // Estado para el visor de fotos
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  
  // Cargamos las imágenes al montar el componente
  useEffect(() => {
    if (professionalId) {
      dispatch(setCurrentProfessionalId(professionalId));
      loadGalleryData();
    }
  }, [professionalId]);

  // Recargamos las imágenes cuando cambie el contador de solicitudes
  useEffect(() => {
    if (addRequestCount > 0 && professionalId) {
      loadGalleryData();
    }
  }, [addRequestCount]);

  // Función para cargar imágenes desde Redux
  const loadGalleryData = () => {
    if (professionalId) {
      dispatch(loadGalleryImages(professionalId));
    }
  };

  // Función para refrescar la galería
  const handleRefresh = () => {
    setRefreshing(true);
    loadGalleryData();
    setRefreshing(false);
  };

  // Nos aseguramos de que las fotos sean arrays
  const safeImages = Array.isArray(images) ? images : [];
  const safePhotos = Array.isArray(photos) ? photos : [];
  
  // Combinamos fotos de Redux con fotos recibidas como prop
  const allPhotos = [...safeImages, ...safePhotos]
    .filter(photo => photo && photo.uri) // Aseguramos que cada foto tiene URI
    .filter((photo, index, self) => 
      index === self.findIndex((p) => p.id === photo.id)
    );

  // Ordenamos las fotos por fecha (las más recientes primero)
  const sortedPhotos = [...allPhotos].sort((a, b) => {
    // Usamos timestamp si está disponible, o convertimos fecha a timestamp
    const timestampA = a.timestamp || (a.fecha ? new Date(a.fecha).getTime() : Date.now());
    const timestampB = b.timestamp || (b.fecha ? new Date(b.fecha).getTime() : Date.now());
    return timestampB - timestampA;
  });

  const renderPhoto = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.photoItem}
        onPress={() => {
          // Abrimos el visor de fotos original
          setViewerIndex(index);
          setViewerVisible(true);
          
          // También llamamos al evento onPhotoPress si existe (para compatibilidad)
          if (onPhotoPress) {
            onPhotoPress(item, index);
          }
        }}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: item.uri }}
          style={styles.photo}
          resizeMode="cover"
        />
        
        {/* Indicador de likes */}
        {item.likes > 0 && (
          <View style={styles.likesContainer}>
            <Ionicons name="heart" size={12} color="#fff" />
            <Text style={styles.likesText}>{item.likes}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Determinamos si tenemos imágenes para mostrar
  const hasPhotos = sortedPhotos && sortedPhotos.length > 0;

  return (
    <View style={styles.container}>
      {isLoading && !refreshing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            No se pudieron cargar las imágenes. Inténtalo de nuevo.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadGalleryData}
          >
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {!hasPhotos && !isLoading ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="images-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No hay fotos en la galería</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={onAddPhoto}
          >
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Añadir Foto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={sortedPhotos}
          renderItem={renderPhoto}
          keyExtractor={(item) => item.id?.toString()}
          numColumns={numColumns}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#3B82F6"]}
            />
          }
        />
      )}
      
      {/* Visor de fotos original */}
      <SimplePhotoViewer
        photos={sortedPhotos}
        initialIndex={viewerIndex}
        visible={viewerVisible}
        onClose={() => setViewerVisible(false)}
        professional={professional}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  photoItem: {
    width: calculatedWidth,
    height: calculatedHeight,
    margin: tileMargin,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 1,
  },
  likesContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesText: {
    color: '#fff',
    fontSize: 10,
    marginLeft: 2,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 15,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#3B82F6',
    borderRadius: 20,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 5,
  },
});

export default GalleryTabRedux;