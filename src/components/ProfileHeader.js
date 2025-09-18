import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ProfileHeader = ({ professional, onPressEdit, showEditButton = true }) => {
  const [showFullBio, setShowFullBio] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);

  return (
    <>
    <View style={styles.headerContainer}>
      {/* Nuevo diseño sin imagen de portada */}
      <View style={styles.profileDetailsRow}>
        {/* Avatar a la izquierda */}
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: professional.avatar }}
            style={styles.avatar}
          />
          
          {showEditButton && (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={onPressEdit}
            >
              <Ionicons name="pencil" size={16} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Información del profesional */}
        <View style={styles.infoContainer}>
          {/* Mostrar profesión como título principal (sin repetir nombre) */}
          <Text style={styles.roleMain}>{professional.role}</Text>

          {/* Dirección opcional (si no la quieres aquí, estará vacía) */}
          {professional.address && (
            <Text style={styles.address} numberOfLines={2}>
              {professional.address}
            </Text>
          )}

          {/* Badges/mini información: rating, experience (si existen) */}
          <View style={styles.badgesRow}>
            {professional.rating !== undefined && (
              <View style={styles.badgeRowItem}>
                <Text style={styles.badgeText}>★ {professional.rating}</Text>
              </View>
            )}
            {professional.experienceYears !== undefined && (
              <View style={styles.badgeRowItem}>
                <Text style={styles.badgeText}>{professional.experienceYears} años</Text>
              </View>
            )}
            {/* servicios count removed from badges; shown in stats below */}
            {professional.responseTime && (
              <View style={styles.badgeRowItem}>
                <Text style={styles.badgeText}>Responde: {professional.responseTime}</Text>
              </View>
            )}
          </View>

          {/* topServices removed from header (gallery shows images) */}

          {/* Stats: Servicios / Clientes / Me gusta - show under the address/profession */}
          <View style={[styles.statsRow, styles.statsRowCentered]}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{professional.services?.length ?? professional.posts}</Text>
              <Text style={styles.statLabel}>Servicios</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{professional.clients || professional.seguidores}</Text>
              <Text style={styles.statLabel}>Clientes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{professional.likes}</Text>
              <Text style={styles.statLabel}>Me gusta</Text>
            </View>
          </View>

        </View>

        {/* Inline actions (QR / Share) - larger and spaced for touch */}
        <View style={styles.headerActionsInline}>
          <TouchableOpacity
            style={[styles.iconButtonLarge, { marginTop: -6 }]}
            onPress={() => setQrVisible(true)}
            accessibilityLabel="Mostrar QR"
          >
            <Ionicons name="qr-code-outline" size={30} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButtonLarge, { marginTop: -2 }]}
            onPress={async () => {
              const url = professional.shareUrl || professional.website || '';
              try {
                if (!url) return;
                const message = `${professional.name} te invita a ver su perfil profesional. Agenda tu turno y descubre sus servicios: ${url}`;
                await Share.share({ message });
              } catch (e) {
                // ignore
              }
            }}
            accessibilityLabel="Compartir"
          >
            <Ionicons name="share-social-outline" size={30} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>
      
      {professional.bio && (
        <View>
          <Text style={styles.bio} numberOfLines={showFullBio ? undefined : 3}>
            {professional.bio}
          </Text>
          <TouchableOpacity onPress={() => setShowFullBio(!showFullBio)}>
            <Text style={styles.toggleBioText}>{showFullBio ? 'Ver menos' : 'Ver más'}</Text>
          </TouchableOpacity>
          {/* (stats moved into the info column above) */}
      </View>
  )}

  </View>

  <Modal
      visible={qrVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={() => setQrVisible(false)}
    >
      <View style={styles.qrModalContainer}>
        <TouchableOpacity style={styles.qrClose} onPress={() => setQrVisible(false)}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>

        <View style={styles.qrContent}>
          <Text style={styles.qrTitle}>Mostrar código QR</Text>
          {/* Render QR using Google Chart API as image source */}
          <Image
            source={{ uri: `https://chart.googleapis.com/chart?cht=qr&chs=400x400&chl=${encodeURIComponent(professional.shareUrl || professional.website || '')}` }}
            style={styles.qrImage}
            resizeMode="contain"
          />

          <TouchableOpacity
            style={styles.qrShareButton}
            onPress={async () => {
              const url = professional.shareUrl || professional.website || '';
              try {
                if (!url) return;
                const message = `${professional.name} comparte su perfil contigo. Agenda tu turno: ${url}`;
                await Share.share({ message });
              } catch (e) {}
            }}
          >
            <Text style={styles.qrShareText}>Compartir enlace</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  profileDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#f0f0f0',
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#2196F3',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  role: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  roleMain: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },


  iconButtonLarge: {
    padding: 6,           // keep small touch area
    marginBottom: 6,      // reduce vertical gap
    backgroundColor: 'transparent', // remove boxed background
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  address: {
    fontSize: 14,
    color: '#444',
    marginTop: 6,
  },
  badgesRow: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  badgeRowItem: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 12,
    color: '#444',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 8,
    paddingBottom: 0,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
  },
  statsRowCentered: {
    justifyContent: 'center',
  },
  statItem: {
    marginRight: 18,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  bio: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
  },
  toggleBioText: {
    marginTop: 6,
    color: '#2196F3',
    fontSize: 13,
    fontWeight: '500',
  },
  headerActionsInline: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 8,
  },
  iconButton: {
    padding: 8,
    marginBottom: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
  },
  qrModalContainer: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrClose: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  qrContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  qrTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  qrImage: {
    width: Math.min(360, width - 40),
    height: Math.min(360, width - 40),
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  qrShareButton: {
    marginTop: 20,
    backgroundColor: '#2563EB',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  qrShareText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ProfileHeader;