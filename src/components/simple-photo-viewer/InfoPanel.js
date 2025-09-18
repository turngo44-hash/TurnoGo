import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from './styles';
import { Ionicons } from '@expo/vector-icons';

const InfoPanel = ({ currentPhoto, isDescriptionExpanded, toggleDescriptionExpand, isDescriptionLong, isLiked, toggleLike }) => {
  return (
    <View style={styles.infoPanel}>
      {currentPhoto?.title && (
        <Text style={styles.photoTitle}>{currentPhoto.title}</Text>
      )}

      {currentPhoto?.description && (
        <View style={styles.descriptionWrapper}>
          <Text numberOfLines={isDescriptionExpanded ? undefined : 2} style={styles.description}>
            {currentPhoto.description}
          </Text>

          {isDescriptionLong && (
            <TouchableOpacity onPress={toggleDescriptionExpand} style={styles.expandButton} activeOpacity={0.7}>
              <Text style={styles.expandButtonText}>{isDescriptionExpanded ? 'Ver menos' : 'Ver más'}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

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
          {isLiked ? 'A ti' : 'A'} {currentPhoto?.firstLiker || 'María'} {currentPhoto?.likesCount > 1 ? ` y ${currentPhoto.likesCount - 1} personas más` : ''} {isLiked && currentPhoto?.likesCount > 0 ? ' también ' : ' '} les gusta esto
        </Text>
      </View>

      <View style={styles.actionBarContainer}>
        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.actionButton} onPress={toggleLike}>
            <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={20} color={isLiked ? '#E53E3E' : '#fff'} />
            <Text style={styles.actionButtonText}>Me gusta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={18} color="#fff" />
            <Text style={styles.actionButtonText}>Comentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default InfoPanel;
