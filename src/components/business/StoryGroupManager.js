import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const MAX_PHOTOS_PER_GROUP = 10;

const StoryGroupManager = ({ visible, onClose, onSave, existingGroup = null }) => {
  const [groupName, setGroupName] = useState(existingGroup ? existingGroup.title : '');
  const [selectedColor, setSelectedColor] = useState(existingGroup ? existingGroup.color : '#8B5CF6');
  const [selectedIcon, setSelectedIcon] = useState(existingGroup ? existingGroup.icon : 'images');
  const [photos, setPhotos] = useState(existingGroup ? existingGroup.photos || [] : []);

  const colorOptions = [
    '#8B5CF6', // Violeta
    '#06B6D4', // Azul
    '#10B981', // Verde
    '#EF4444', // Rojo
    '#F59E0B', // Naranja
    '#EC4899', // Rosa
    '#3B82F6', // Azul claro
    '#6366F1', // Indigo
  ];

  const iconOptions = [
    { name: 'images', label: 'Imágenes' },
    { name: 'cut', label: 'Cortes' },
    { name: 'color-palette', label: 'Color' },
    { name: 'brush', label: 'Peinados' },
    { name: 'gift', label: 'Ofertas' },
    { name: 'ribbon', label: 'Premios' },
    { name: 'star', label: 'Destacados' },
    { name: 'people', label: 'Equipo' },
    { name: 'heart', label: 'Favoritos' },
  ];

  const handlePickImage = async () => {
    if (photos.length >= MAX_PHOTOS_PER_GROUP) {
      Alert.alert(
        "Límite alcanzado", 
        `Sólo puedes agregar hasta ${MAX_PHOTOS_PER_GROUP} fotos por grupo de historias.`
      );
      return;
    }
    
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        "Permiso requerido", 
        "Necesitamos permisos para acceder a tu galería para seleccionar fotos."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const handleRemovePhoto = (index) => {
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);
  };

  const handleSave = () => {
    if (!groupName.trim()) {
      Alert.alert("Error", "Por favor ingresa un nombre para el grupo de historias");
      return;
    }

    if (photos.length === 0) {
      Alert.alert(
        "Sin fotos", 
        "No has agregado ninguna foto. ¿Quieres continuar de todos modos?",
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Continuar", 
            onPress: () => {
              const groupData = {
                id: existingGroup ? existingGroup.id : `group-${Date.now()}`,
                title: groupName,
                color: selectedColor,
                icon: selectedIcon,
                photos: photos,
                hasContent: photos.length > 0,
              };
              onSave(groupData);
              onClose();
            }
          }
        ]
      );
      return;
    }

    const groupData = {
      id: existingGroup ? existingGroup.id : `group-${Date.now()}`,
      title: groupName,
      color: selectedColor,
      icon: selectedIcon,
      photos: photos,
      hasContent: true,
    };
    
    onSave(groupData);
    onClose();
  };

  const renderPhotoItem = ({ item, index }) => (
    <View style={styles.photoItem}>
      <Image source={{ uri: item }} style={styles.photoThumbnail} />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemovePhoto(index)}
      >
        <Ionicons name="close-circle" size={24} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.title}>
            {existingGroup ? 'Editar grupo de historias' : 'Crear grupo de historias'}
          </Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Información del grupo</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nombre del grupo</Text>
            <TextInput
              style={styles.input}
              value={groupName}
              onChangeText={setGroupName}
              placeholder="Ej: Servicios, Trabajos, etc."
              maxLength={20}
            />
          </View>

          <Text style={styles.sectionTitle}>Color</Text>
          <View style={styles.colorOptions}>
            {colorOptions.map((color, index) => (
              <TouchableOpacity
                key={`color-${index}`}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColorOption
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>

          <Text style={styles.sectionTitle}>Icono</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconScroll}>
            {iconOptions.map((icon) => (
              <TouchableOpacity
                key={icon.name}
                style={[
                  styles.iconOption,
                  selectedIcon === icon.name && styles.selectedIconOption
                ]}
                onPress={() => setSelectedIcon(icon.name)}
              >
                <Ionicons name={icon.name} size={24} color={selectedColor} />
                <Text style={styles.iconLabel}>{icon.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.photoSection}>
            <View style={styles.photoSectionHeader}>
              <Text style={styles.sectionTitle}>Fotos</Text>
              <Text style={styles.photoCount}>
                {photos.length}/{MAX_PHOTOS_PER_GROUP}
              </Text>
            </View>
            
            <TouchableOpacity style={styles.addPhotoButton} onPress={handlePickImage}>
              <Ionicons name="add" size={24} color="#FFFFFF" />
              <Text style={styles.addPhotoText}>Añadir foto</Text>
            </TouchableOpacity>

            {photos.length > 0 && (
              <FlatList
                data={photos}
                renderItem={renderPhotoItem}
                keyExtractor={(_, index) => `photo-${index}`}
                numColumns={3}
                style={styles.photoGrid}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  saveButton: {
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  input: {
    fontSize: 16,
    color: '#111827',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 8,
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  iconScroll: {
    marginVertical: 8,
  },
  iconOption: {
    alignItems: 'center',
    marginRight: 16,
    padding: 8,
    borderRadius: 8,
    width: 80,
  },
  selectedIconOption: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  photoSection: {
    marginTop: 16,
  },
  photoSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  photoCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  addPhotoText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  photoGrid: {
    marginTop: 8,
  },
  photoItem: {
    width: '31%',
    aspectRatio: 1,
    margin: '1%',
    position: 'relative',
  },
  photoThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
});

export default StoryGroupManager;
