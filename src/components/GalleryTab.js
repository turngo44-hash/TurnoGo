import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GalleryGrid from './GalleryGrid';

const { width } = Dimensions.get('window');

const GalleryTab = ({ photos = [], onPhotoPress, professional }) => {
  // Función para manejar la presión en una foto
  const handlePhotoPress = (photo, index) => {
    if (onPhotoPress) {
      onPhotoPress(photo, index);
    }
  };

  // Función para manejar el botón de agregar foto
  const handleAddPhoto = () => {
    // Placeholder - implementar lógica para agregar foto
    Alert.alert('Información', 'Agregar foto');
  };

  // Si no hay fotos, mostrar mensaje
  if (!photos || photos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="images-outline" size={60} color="#DDD" />
        <Text style={styles.emptyText}>No hay trabajos disponibles</Text>
        <TouchableOpacity 
          style={styles.addPhotoButton}
          onPress={handleAddPhoto}
        >
          <Text style={styles.addPhotoText}>Agregar fotos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GalleryGrid 
        photos={photos} 
        onPhotoPress={handlePhotoPress}
        handleAddPhoto={handleAddPhoto}
        professional={professional}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 2,
    paddingTop: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  addPhotoButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  addPhotoText: {
    color: '#FFF',
    fontWeight: '500',
  },
});

export default GalleryTab;