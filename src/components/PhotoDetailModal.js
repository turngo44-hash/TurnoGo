import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  StatusBar,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const PhotoDetailModal = ({ visible, photo, onClose }) => {
  const [liked, setLiked] = useState(false);
  const photoLikes = photo?.likes || 0;
  const [likeCount, setLikeCount] = useState(photoLikes);

  // Maneja el like de la foto
  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  if (!photo) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{photo.title || "Foto"}</Text>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-social-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: photo.uri }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.detailsContainer}>
            {/* Título y descripción */}
            <Text style={styles.title}>{photo.title || "Sin título"}</Text>
            
            {photo.description && (
              <Text style={styles.description}>{photo.description}</Text>
            )}
            
            {/* Fecha y estadísticas */}
            <View style={styles.statsContainer}>
              <View style={styles.dateContainer}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.dateText}>{photo.fecha || "Sin fecha"}</Text>
              </View>
              
              <View style={styles.likesContainer}>
                <TouchableOpacity 
                  style={styles.likeButton}
                  onPress={handleLike}
                >
                  <Ionicons 
                    name={liked ? "heart" : "heart-outline"} 
                    size={22} 
                    color={liked ? "#E74C3C" : "#666"} 
                  />
                </TouchableOpacity>
                <Text style={styles.likesText}>{likeCount}</Text>
              </View>
            </View>
            
            {/* Acciones adicionales */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-social-outline" size={22} color="#3B82F6" />
                <Text style={styles.actionText}>Compartir</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="download-outline" size={22} color="#3B82F6" />
                <Text style={styles.actionText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  shareButton: {
    padding: 8,
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageContainer: {
    width: width,
    height: width * 1.25, // Proporción 4:5
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: height * 0.4, // Para asegurar que haya suficiente espacio
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 6,
    color: '#666',
    fontSize: 14,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    padding: 5,
  },
  likesText: {
    marginLeft: 4,
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  actionText: {
    marginLeft: 5,
    color: '#3B82F6',
    fontWeight: '600',
  },
});

export default PhotoDetailModal;