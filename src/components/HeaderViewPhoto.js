import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

const HeaderViewPhoto = ({ onClose, professional, currentPhoto, formatDate, onMore, styles }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
      <Ionicons name="close" size={28} color="#fff" />
    </TouchableOpacity>
    {professional && (
      <View style={styles.userInfo}>
        <Image 
          source={{ uri: professional.avatar || 'https://via.placeholder.com/40' }} 
          style={styles.userAvatar} 
        />
        <View style={styles.userTextInfo}>
          <Text style={styles.userName}>{professional.name}</Text>
          {currentPhoto?.createdAt && (
            <Text style={styles.dateText}>{formatDate(currentPhoto.createdAt)}</Text>
          )}
        </View>
      </View>
    )}
    <TouchableOpacity
      style={styles.moreButton}
      onPress={onMore}
      accessibilityLabel="Más opciones"
    >
      <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
    </TouchableOpacity>
  </View>
);

export default HeaderViewPhoto;
