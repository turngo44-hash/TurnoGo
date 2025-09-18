import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SimplePhotoViewer from './SimplePhotoViewer';

const { width, height } = Dimensions.get('window');
const GRID_GAP = 0;
// Use percentage widths so items fill edge-to-edge exactly in three columns
const GRID_ITEM_PERCENT = '33.3333%';
// Compute approximate height from the width (4:5 portrait -> 1.25 ratio)
const GRID_ITEM_WIDTH = Math.floor(width / 3);
// Make items slightly taller than wide (Instagram portrait ~4:5 -> height = width * 1.25)
const GRID_ITEM_HEIGHT = Math.round(GRID_ITEM_WIDTH * 1.25);

const GalleryGrid = ({ photos, onPhotoPress, handleAddPhoto }) => {
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const openViewer = (index) => {
    setViewerIndex(index);
    setViewerVisible(true);
  };

  const closeViewer = () => setViewerVisible(false);

  const renderGridItem = (item, index) => {
    // Normal image tile
    return (
      <TouchableOpacity 
        key={`photo-${index}`} 
        style={styles.gridImageContainer} 
        activeOpacity={0.9}
        onPress={() => openViewer(index)}
      >
        <Image 
          source={{ uri: item.uri }} 
          style={styles.gridImage}
          resizeMethod="resize"
        />
        <View style={styles.gridItemOverlay}>
          <View style={styles.gridItemInfo}>
            <Text style={styles.gridItemTitle} numberOfLines={1}>{item.title || 'Trabajo'}</Text>
            <View style={styles.gridItemLikes}>
              <Ionicons name="heart" size={14} color="#FFFFFF" />
              <Text style={styles.gridItemLikesText}>{item.likes}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  // Calculamos cuántos elementos "fantasma" necesitamos para mantener la cuadrícula
  const getFooter = () => {
    const totalItems = (photos && photos.length) || 0;
    const remainder = totalItems % 3;

    if (remainder === 0) return null;

    // Render ghost tiles wrapped so they occupy the same percentage width
    const ghosts = [];
    for (let i = 0; i < (3 - remainder); i++) {
      ghosts.push(
        <View key={`ghost-${i}`} style={styles.gridWrapper}>
          <View style={[styles.gridImageContainer, { opacity: 0 }]} />
        </View>
      );
    }

    return <>{ghosts}</>;
  };
  
  const items = photos || [];

  return (
    <View style={styles.gridOuter}>
      <View style={styles.gridContainer}>
        {items.map((item, index) => {
          // If this is the last column, remove the right border so the outer border covers the edge
          const isLastCol = (index + 1) % 3 === 0;
          return (
            <View key={`gallery-item-${index}`} style={styles.gridWrapper}>
              {React.cloneElement(renderGridItem(item, index), {
                style: [
                  styles.gridImageContainer,
                  isLastCol && { borderRightWidth: 0 },
                ],
              })}
            </View>
          );
        })}

        {/* Footer ghost tiles to fill the last row */}
        {getFooter()}
      </View>
      {/* Using the simple photo viewer component to avoid architecture issues */}
      <SimplePhotoViewer photos={items} initialIndex={viewerIndex} visible={viewerVisible} onClose={closeViewer} />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
    marginBottom: GRID_GAP,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 0,
    marginHorizontal: 0,
  },
  gridOuter: {
    width: width,
    alignSelf: 'center',
    marginHorizontal: 0,
    paddingHorizontal: 0,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: '#e6e6e6',
    overflow: 'hidden',
  },
  gridWrapper: {
    width: GRID_ITEM_PERCENT,
    marginBottom: 0,
    marginRight: 0,
  },
  gridImageContainer: {
    width: '100%',
    height: GRID_ITEM_HEIGHT,
    marginBottom: 0,
    position: 'relative',
    borderRadius: 0,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#e6e6e6',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e6e6e6',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gridItemOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.28)',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  gridItemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridItemTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  gridItemLikes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridItemLikesText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 3,
    fontWeight: '500',
  },
  gridAddContainer: {
    width: '100%',
    height: GRID_ITEM_HEIGHT,
    marginBottom: GRID_GAP,
    borderRadius: 0,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridAddInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridAddLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '500',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  photoModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  photoModalHeader: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  photoModalCloseButton: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  photoIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoIndicatorText: {
    color: '#fff',
    fontSize: 14,
  },
  photoViewerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  photoViewerImage: {
    resizeMode: 'contain',
  },
});

export default GalleryGrid;