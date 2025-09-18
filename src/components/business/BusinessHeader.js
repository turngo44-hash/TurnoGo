import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';

const { width } = Dimensions.get('window');

const BusinessHeader = ({ businessData, showAvatar = true }) => {
  return (
    <View style={styles.container}>
      {/* Cover Photo */}
      <View style={styles.coverPhotoContainer}>
        <Image
          source={{ 
            uri: businessData?.coverPhoto || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop'
          }}
          style={styles.coverPhoto}
        />
        <View style={styles.coverOverlay}>
          <TouchableOpacity style={styles.editCoverButton}>
            <Ionicons name="camera" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Section */}
      <View style={[styles.profileSection, !showAvatar && styles.profileSectionNoAvatar]}>
        {showAvatar && (
          <View style={styles.avatarContainer}>
            <Image
              source={{ 
                uri: businessData?.logo || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop'
              }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.businessInfo, !showAvatar && { marginTop: 0 }]}>
          <View style={styles.businessHeader}>
            <Text style={styles.businessName}>
              {businessData?.name || 'Mi Salón de Belleza'}
            </Text>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="create-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.businessCategory}>
            {businessData?.category || 'Salón de Belleza'}
          </Text>
          
          <Text style={styles.businessDescription}>
            {businessData?.description || 'Transformamos tu belleza con servicios profesionales y atención personalizada'}
          </Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>128</Text>
              <Text style={styles.statLabel}>Clientes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>456</Text>
              <Text style={styles.statLabel}>Citas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Años</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1.2k</Text>
              <Text style={styles.statLabel}>Seguidores</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  coverPhotoContainer: {
    position: 'relative',
    height: 200,
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
  },
  coverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.12)',
  justifyContent: 'flex-start',
  alignItems: 'flex-end',
  padding: 12,
  },
  editCoverButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 0,
  },
  profileSectionNoAvatar: {
    paddingTop: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: '#F3F4F6',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  backgroundColor: colors.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  businessInfo: {
    flex: 1,
    marginTop: 8,
  },
  businessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  editButton: {
    padding: 8,
  },
  businessCategory: {
    fontSize: 16,
  color: colors.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  businessDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
  },
});

export default BusinessHeader;
