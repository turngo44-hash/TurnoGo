import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StoryGroupManager from './StoryGroupManager';



const { width } = Dimensions.get('window');
const storyWidth = 80;
const storyMargin = 12;
const MAX_STORY_GROUPS = 4;
const STORAGE_KEY = 'STORY_GROUPS_DATA';

const BusinessStories = () => {
  // Mock de grupos de historias iniciales para demostración
  const initialGroups = [
    {
      id: 'cortes',
      title: 'Cortes',
      icon: 'cut',
      color: '#8B5CF6',
      hasContent: true,
      photos: [
        'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1590540179852-2110a54f813a?w=600&h=600&fit=crop',
      ]
    },
    {
      id: 'color',
      title: 'Color',
      icon: 'color-palette',
      color: '#06B6D4',
      hasContent: true,
      photos: [
        'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&h=600&fit=crop',
      ]
    }
  ];

  const [storyGroups, setStoryGroups] = useState(initialGroups);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showStoryModal, setShowStoryModal] = useState(false);

  // Cargar grupos de historias guardados
  useEffect(() => {
    loadStoredGroups();
  }, []);

  const loadStoredGroups = async () => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        setStoryGroups(JSON.parse(storedData));
      }
    } catch (error) {
      console.log('Error al cargar grupos de historias:', error);
    }
  };

  const saveStoryGroups = async (groups) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
      setStoryGroups(groups);
    } catch (error) {
      console.log('Error al guardar grupos de historias:', error);
      // Actualizamos el estado de todas formas en caso de error
      setStoryGroups(groups);
    }
  };

  const handleAddStoryGroup = () => {
    if (storyGroups.length >= MAX_STORY_GROUPS) {
      Alert.alert(
        "Límite alcanzado", 
        `Solo puedes crear hasta ${MAX_STORY_GROUPS} grupos de historias.`
      );
      return;
    }
    setEditingGroup(null);
    setShowCreateModal(true);
  };

  const handleEditStoryGroup = (group) => {
    setEditingGroup(group);
    setShowCreateModal(true);
  };

  const handleSaveStoryGroup = (groupData) => {
    let updatedGroups;

    if (editingGroup) {
      // Editar grupo existente
      updatedGroups = storyGroups.map(group => 
        group.id === groupData.id ? groupData : group
      );
    } else {
      // Crear nuevo grupo
      updatedGroups = [...storyGroups, groupData];
    }

    setStoryGroups(updatedGroups);
    saveStoryGroups(updatedGroups);
  };

  const handleDeleteStoryGroup = (groupId) => {
    Alert.alert(
      "Eliminar grupo",
      "¿Estás seguro que quieres eliminar este grupo de historias?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: () => {
            const updatedGroups = storyGroups.filter(group => group.id !== groupId);
            setStoryGroups(updatedGroups);
            saveStoryGroups(updatedGroups);
          }
        }
      ]
    );
  };

  const handleOpenStory = (story) => {
    setSelectedStory(story);
    setCurrentPhotoIndex(0);
    setShowStoryModal(true);
  };

  const handleNextPhoto = () => {
    if (selectedStory && selectedStory.photos && currentPhotoIndex < selectedStory.photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    } else {
      setShowStoryModal(false);
    }
  };

  const handlePrevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  const renderStory = (story, index) => (
    <TouchableOpacity 
      key={story.id} 
      style={styles.storyContainer}
      onPress={() => {
        if (story.isAddButton) {
          handleAddStoryGroup();
        } else if (story.photos && story.photos.length > 0) {
          handleOpenStory(story);
        } else {
          handleEditStoryGroup(story);
        }
      }}
      onLongPress={() => {
        if (!story.isAddButton) {
          handleDeleteStoryGroup(story.id);
        }
      }}
    >
      <View style={[
        styles.storyCircle, 
        { 
          backgroundColor: story.color,
          borderColor: story.hasContent ? story.color : '#E5E7EB',
          borderWidth: story.hasContent ? 3 : 2,
        }
      ]}>
        <View style={[
          styles.storyInner,
          { backgroundColor: story.isAddButton ? '#F9FAFB' : '#FFFFFF' }
        ]}>
          {story.thumbnailPhoto ? (
            <Image 
              source={{ uri: story.thumbnailPhoto }} 
              style={styles.storyThumbnail} 
            />
          ) : (
            <Ionicons 
              name={story.icon} 
              size={24} 
              color={story.isAddButton ? '#6B7280' : story.color} 
            />
          )}
        </View>
        {story.hasContent && (
          <View style={[styles.hasContentIndicator, { backgroundColor: story.color }]} />
        )}
      </View>
      <Text style={styles.storyTitle} numberOfLines={1}>
        {story.title}
      </Text>
    </TouchableOpacity>
  );

  // Siempre mostrar el botón de añadir al final de la lista, si hay espacio
  const displayStories = [...storyGroups];
  
  if (storyGroups.length < MAX_STORY_GROUPS) {
    displayStories.push({
      id: 'add',
      title: 'Crear',
      icon: 'add',
      color: '#6B7280',
      isAddButton: true,
      hasContent: false,
    });
  }

  // Asignar la primera foto como thumbnail para cada grupo
  const processedStories = displayStories.map(story => {
    if (story.photos && story.photos.length > 0 && !story.isAddButton) {
      return {
        ...story,
        thumbnailPhoto: story.photos[0],
        hasContent: true,
      };
    }
    return story;
  });

  return (
    <View style={styles.container}>
      {/* Listado de grupos de historias */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {processedStories.map(renderStory)}
      </ScrollView>

      {/* Modal para crear/editar grupos */}
      <StoryGroupManager
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleSaveStoryGroup}
        existingGroup={editingGroup}
      />

      {/* Modal para visualizar fotos de historias */}
      {selectedStory && (
        <Modal
          visible={showStoryModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowStoryModal(false)}
        >
          <View style={styles.storyModalContainer}>
            <View style={styles.storyModalHeader}>
              <View style={styles.storyModalUser}>
                <View style={[styles.storyModalUserAvatar, { backgroundColor: selectedStory.color }]}>
                  <Ionicons name={selectedStory.icon} size={16} color="#FFFFFF" />
                </View>
                <Text style={styles.storyModalUserName}>{selectedStory.title}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowStoryModal(false)}>
                <Ionicons name="close" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Barra de progreso */}
            <View style={styles.progressContainer}>
              {selectedStory.photos && selectedStory.photos.map((_, index) => (
                <View 
                  key={`progress-${index}`} 
                  style={[
                    styles.progressBar, 
                    index <= currentPhotoIndex ? styles.progressActive : styles.progressInactive
                  ]} 
                />
              ))}
            </View>

            {/* Contenido de la historia */}
            <TouchableOpacity 
              style={styles.storyContent}
              activeOpacity={1}
              onPress={handleNextPhoto}
            >
              {selectedStory.photos && selectedStory.photos[currentPhotoIndex] && (
                <Image
                  source={{ uri: selectedStory.photos[currentPhotoIndex] }}
                  style={styles.storyImage}
                  resizeMode="contain"
                />
              )}

              {/* Controles de navegación para fotos */}
              <View style={styles.storyNavigation}>
                <TouchableOpacity 
                  style={[styles.storyNavButton, styles.storyNavLeft]}
                  onPress={handlePrevPhoto}
                  disabled={currentPhotoIndex === 0}
                >
                  <View style={currentPhotoIndex === 0 ? styles.disabledButton : null} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.storyNavButton, styles.storyNavRight]}
                  onPress={handleNextPhoto}
                >
                  <View />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  storyContainer: {
    alignItems: 'center',
    marginRight: storyMargin,
    width: storyWidth,
  },
  storyCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  storyInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Para recortar la imagen al círculo
  },
  storyThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  hasContentIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyTitle: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
    textAlign: 'center',
  },
  
  // Estilos para el modal de historias
  storyModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  storyModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40,
  },
  storyModalUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storyModalUserAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  storyModalUserName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 2,
    borderRadius: 1,
    marginHorizontal: 2,
  },
  progressActive: {
    backgroundColor: '#FFFFFF',
  },
  progressInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  storyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  storyNavigation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  storyNavButton: {
    flex: 1,
    height: '100%',
  },
  storyNavLeft: {
    flex: 1,
  },
  storyNavRight: {
    flex: 1,
  },
  disabledButton: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  }
});

export default BusinessStories;
