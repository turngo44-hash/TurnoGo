import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';
import { Alert } from 'react-native';

const Header = ({ onClose, professional, currentPhoto, currentIndex, total }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Ionicons name="close" size={28} color="#fff" />
      </TouchableOpacity>

      {professional && (
        <View style={styles.userInfo}>
          <Image source={{ uri: professional.avatar || 'https://via.placeholder.com/40' }} style={styles.userAvatar} />
          <View style={styles.userTextInfo}>
            <Text style={styles.userName}>{professional.name}</Text>
            {currentPhoto?.createdAt && (
              <Text style={styles.dateText}>{new Date(currentPhoto.createdAt).toLocaleDateString()}</Text>
            )}
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => Alert.alert('Más opciones', 'Abrir menú de opciones (placeholder)')}
        accessibilityLabel="Más opciones"
      >
        <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
      </TouchableOpacity>

      {/* centered index */}
      {typeof total === 'number' && (
        <View style={styles.headerCenterIndex} pointerEvents="none">
          <View style={styles.centerIndexBubble}>
            <Text style={styles.centerIndexText}>{`${currentIndex + 1}/${total}`}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default Header;
