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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

const { width, height } = Dimensions.get('window');

const SimplePhotoViewer = ({ photos = [], initialIndex = 0, visible = false, onClose = () => {}, professional = null }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [loadingImage, setLoadingImage] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Reset state when modal becomes visible
    if (visible) {
      setCurrentIndex(initialIndex);
      setIsDescriptionExpanded(false);
      setLoadingImage(true);
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

  // Navigation handlers
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setLoadingImage(true);
      fadeAnim.setValue(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setLoadingImage(true);
      fadeAnim.setValue(0);
    }
  };

  // Toggle description expansion
  const toggleDescriptionExpand = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  // Check if description is long enough to need "Ver más" button
  const isDescriptionLong = (currentPhoto && currentPhoto.description && currentPhoto.description.length > 100) || false;

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
          {professional && (
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{professional.name}</Text>
            </View>
          )}
        </View>
        
        {/* Image View */}
        <View style={styles.imageContainer}>
          {loadingImage && (
            <ActivityIndicator size="large" color="#fff" style={styles.loader} />
          )}
          
          <Animated.Image
            source={{ uri: currentPhoto?.uri }}
            style={[
              styles.image,
              { opacity: fadeAnim }
            ]}
            resizeMode="contain"
            onLoad={handleImageLoad}
          />
          
          {/* Navigation Arrows */}
          {currentIndex > 0 && (
            <TouchableOpacity style={[styles.navButton, styles.leftNav]} onPress={handlePrev}>
              <Ionicons name="chevron-back" size={32} color="#fff" />
            </TouchableOpacity>
          )}
          
          {currentIndex < photos.length - 1 && (
            <TouchableOpacity style={[styles.navButton, styles.rightNav]} onPress={handleNext}>
              <Ionicons name="chevron-forward" size={32} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Info Panel */}
        <View style={styles.infoPanel}>
          <View style={styles.actionBar}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="heart-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.descriptionContainer}>
            {currentPhoto?.title && (
              <Text style={styles.photoTitle}>{currentPhoto.title}</Text>
            )}
            
            {currentPhoto?.description && (
              <View>
                <Text style={styles.description} numberOfLines={isDescriptionExpanded ? undefined : 3}>
                  {currentPhoto.description}
                </Text>
                
                {isDescriptionLong && (
                  <TouchableOpacity onPress={toggleDescriptionExpand} style={styles.expandButton}>
                    <Text style={styles.expandButtonText}>
                      {isDescriptionExpanded ? 'Ver menos' : 'Ver más'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </ScrollView>
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
    padding: 15,
    zIndex: 10,
  },
  closeButton: {
    padding: 5,
  },
  userInfo: {
    marginLeft: 15,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height * 0.7,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
  },
  navButton: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 10,
  },
  leftNav: {
    left: 10,
  },
  rightNav: {
    right: 10,
  },
  infoPanel: {
    backgroundColor: '#000',
    padding: 15,
    paddingBottom: 30,
  },
  actionBar: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  actionButton: {
    marginRight: 20,
  },
  descriptionContainer: {
    maxHeight: 120,
  },
  photoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  expandButton: {
    marginTop: 5,
  },
  expandButtonText: {
    color: '#3897f0',
    fontWeight: '600',
  },
});

export default SimplePhotoViewer;