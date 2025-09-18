import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Modal,
  FlatList,
  TouchableOpacity,
  Pressable,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
  Platform,
  ScrollView,
  PanResponder,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

const { width, height } = Dimensions.get('window');

const PhotoViewer = ({ photos = [], initialIndex = 0, visible = false, onClose = () => {}, professional = null }) => {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex || 0);
  const [selectedPhoto, setSelectedPhoto] = useState(photos && photos[initialIndex] ? photos[initialIndex] : null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [likedPhotos, setLikedPhotos] = useState({});
  const [imageSizes, setImageSizes] = useState({}); // store intrinsic + scaled sizes per image id
  const [loadingMap, setLoadingMap] = useState({}); // per-image loading flag
  const imageOpacityRefs = useRef({}); // per-image Animated.Value for fade-in
  const [descOverflowMap, setDescOverflowMap] = useState({});
  // DEV flag to force long description for testing. Set to false for production.
  const DEV_FORCE_LONG_DESC = true;

  const listRef = useRef(null);

  // Animated values
  const panY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const modalScale = useRef(new Animated.Value(1)).current;

  // last tap detection for double-tap
  const lastTapRef = useRef(0);
  const panelAnim = useRef(new Animated.Value(0)).current; // 0 closed, 1 open

  useEffect(() => {
    if (visible) {
      // reset animation values
      opacity.setValue(1);
      modalScale.setValue(1);
      panY.setValue(0);
      translateX.setValue(0);
      setIsDescriptionExpanded(false);
      setSelectedIndex(initialIndex || 0);
      setSelectedPhoto((photos && photos[initialIndex]) || photos[0] || null);

      // ensure FlatList scrolls to the right index after a short delay to avoid layout issues
      setTimeout(() => {
        if (listRef.current && typeof listRef.current.scrollToIndex === 'function') {
          try {
            listRef.current.scrollToIndex({ index: initialIndex || 0, animated: false });
          } catch (e) {
            // ignore out of range errors
          }
        }
      }, 50);

      // pre-measure all images to have sizes available for centering
      photos && photos.forEach(p => {
        if (p && p.uri && p.id) measureImage(p.uri, p.id);
      });
      // initialize loading map and opacity refs for fade-in
      if (photos && photos.length) {
        const init = {};
        photos.forEach(p => {
          if (p && p.id) {
            init[p.id] = true;
            if (!imageOpacityRefs.current[p.id]) imageOpacityRefs.current[p.id] = new Animated.Value(0);
          }
        });
        setLoadingMap(prev => ({ ...init, ...prev }));
      }
    }
  }, [visible, initialIndex, photos]);

  // helper: measure an image and compute scaled height for container width
  const measureImage = (uri, id) => {
    if (!uri || !id) return;
    // avoid re-measuring
    if (imageSizes[id]) return;
    Image.getSize(
      uri,
      (intrinsicW, intrinsicH) => {
        if (!intrinsicW || !intrinsicH) return;
        const scaledHeight = Math.round((width / intrinsicW) * intrinsicH);
        setImageSizes(prev => ({ ...prev, [id]: { intrinsicW, intrinsicH, scaledHeight } }));
      },
      () => {
        // ignore failure
      }
    );
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > 20 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx) * 1.5;
      },
      onPanResponderMove: (evt, gestureState) => {
        // swipe from left edge to go back
        if (gestureState.moveX < 60 && gestureState.dx > 0) {
          translateX.setValue(Math.min(gestureState.dx, width));
          opacity.setValue(1 - (gestureState.dx / width) * 0.6);
          return;
        }

        if (Math.abs(gestureState.dy) > 10) {
          panY.setValue(gestureState.dy);
          const newOpacity = 1 - (Math.abs(gestureState.dy) / 500);
          opacity.setValue(Math.max(newOpacity, 0.5));
          const newScale = 1 - (Math.abs(gestureState.dy) / 1000);
          modalScale.setValue(Math.max(newScale, 0.9));
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        // horizontal edge swipe to close
        if (gestureState.moveX < 60 && gestureState.dx > 100) {
          Animated.parallel([
            Animated.timing(translateX, { toValue: width, duration: 200, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
          ]).start(() => {
            handleClose();
            setTimeout(() => {
              translateX.setValue(0);
              opacity.setValue(1);
              modalScale.setValue(1);
              panY.setValue(0);
            }, 100);
          });
          return;
        }

        // vertical swipe to close
        if (Math.abs(gestureState.dy) > 100) {
          Animated.parallel([
            Animated.timing(panY, { toValue: gestureState.dy > 0 ? 1000 : -1000, duration: 300, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
          ]).start(() => {
            handleClose();
            setTimeout(() => {
              panY.setValue(0);
              opacity.setValue(1);
              modalScale.setValue(1);
              translateX.setValue(0);
            }, 100);
          });
        } else {
          Animated.parallel([
            Animated.spring(panY, { toValue: 0, useNativeDriver: true }),
            Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
            Animated.spring(opacity, { toValue: 1, useNativeDriver: true }),
            Animated.spring(modalScale, { toValue: 1, useNativeDriver: true }),
          ]).start();
        }
      },
    })
  ).current;

  const handleClose = () => {
    onClose && onClose();
  };

  const handleDoubleTap = (photoId) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // double tap -> like
      setLikedPhotos(prev => ({ ...prev, [photoId]: !prev[photoId] }));
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  const toggleDescriptionExpansion = () => setIsDescriptionExpanded(v => !v);

  const expandPanel = (expand) => {
    setIsDescriptionExpanded(expand);
    Animated.timing(panelAnim, { toValue: expand ? 1 : 0, duration: 260, useNativeDriver: true }).start();
  };

  const handleLikePhoto = (photoId) => {
    setLikedPhotos(prev => {
      const next = { ...prev };
      if (next[photoId]) delete next[photoId]; else next[photoId] = true;
      return next;
    });
  };

  return (
    <Modal visible={visible} transparent={false} animationType="none" statusBarTranslucent>
      <StatusBar barStyle="light-content" backgroundColor="black" translucent />

      <View style={styles.photoModalContainer}>
        {/* compute displayedText once so both static and expanded panels render the same content */}
        {/* (fallback to empty string when no selectedPhoto) */}
        {(() => {
          // no-op wrapper so displayedText is available in JSX scope via closure
          return null;
        })()}
        {selectedPhoto && (
          <Animated.View
            style={[
              styles.photoModalContent,
              {
                opacity: opacity,
                transform: [
                  { translateY: panY },
                  { translateX: translateX },
                  { scale: modalScale },
                ],
              },
            ]}
            {...panResponder.panHandlers}
          >
            <View style={[styles.photoInfoHeader, styles.photoInfoHeaderTop]}>
              <TouchableOpacity style={styles.photoModalCloseButton} onPress={() => {
                Animated.parallel([
                  Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
                  Animated.timing(modalScale, { toValue: 0.8, duration: 200, useNativeDriver: true }),
                ]).start(() => handleClose());
              }}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <View style={styles.photoIndicator}>
                <Text style={styles.photoIndicatorText}>{selectedIndex + 1}/{photos.length}</Text>
              </View>

              <TouchableOpacity style={styles.photoModalOptionsButton}>
                <Ionicons name="ellipsis-horizontal" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

      {/* Keep the image container height static (don't animate 'height' with native driver).
        The panel animation is handled by `animatedInfoPanel` (translateY) and the overlay opacity.
      */}
      <Animated.View style={[styles.photoImageFixedContainer, isDescriptionExpanded && styles.photoImageContainerCollapsed]}>
              <FlatList
                ref={listRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                data={photos}
                keyExtractor={item => item.id}
                initialScrollIndex={initialIndex}
                getItemLayout={(data, index) => ({ length: width, offset: width * index, index })}
                onMomentumScrollEnd={(event) => {
                  const idx = Math.floor(event.nativeEvent.contentOffset.x / width);
                  if (idx >= 0 && idx < photos.length) {
                    setSelectedIndex(idx);
                    setSelectedPhoto(photos[idx]);
                  }
                }}
                renderItem={({ item }) => {
                  // ensure we have measured this image
                  measureImage(item.uri, item.id);
                  const meta = imageSizes[item.id];
                  const scaledH = meta ? meta.scaledHeight : undefined;

                  // If we know scaledH and it's less than screen height, center vertically.
                  const isMeasured = typeof scaledH !== 'undefined';
                  const shouldCenter = !isMeasured ? true : (scaledH < height);

                  const wrapperStyle = [
                    styles.photoViewerContainer,
                    { height },
                    shouldCenter ? { justifyContent: 'center' } : { justifyContent: 'flex-start' },
                  ];

                  const imageStyle = isMeasured ? { width: width, height: scaledH || height } : { width: width, height: height };

                  const isLoading = loadingMap[item.id];
                  const imgOpacity = imageOpacityRefs.current[item.id] || new Animated.Value(0);

                  const onImageLoad = () => {
                    // animate opacity
                    Animated.timing(imgOpacity, { toValue: 1, duration: 220, useNativeDriver: true }).start();
                    setLoadingMap(prev => ({ ...prev, [item.id]: false }));
                  };

                  return (
                    <Pressable key={item.id} style={wrapperStyle} onPress={() => handleDoubleTap(item.id)} android_ripple={null}>
                      {isLoading && (
                        <ActivityIndicator size="large" color="#ffffff" style={{ position: 'absolute', top: height / 2 - 20, left: width / 2 - 20, zIndex: 5 }} />
                      )}
                      <Animated.Image
                        source={{ uri: item.uri }}
                        style={[styles.photoViewerImage, imageStyle, { opacity: imgOpacity }]}
                        resizeMode="contain"
                        onLoad={onImageLoad}
                      />
                    </Pressable>
                  );
                }}
              />
            </Animated.View>

            {/* overlay shown when panel expanded; tapping it collapses the panel */}
            <Animated.View pointerEvents={isDescriptionExpanded ? 'auto' : 'none'} style={[styles.overlay, { opacity: panelAnim.interpolate({ inputRange: [0,1], outputRange: [0, 0.6] }) }]}>
              {isDescriptionExpanded && (
                <Pressable style={StyleSheet.absoluteFill} onPress={() => expandPanel(false)} />
              )}
            </Animated.View>

            <Animated.View style={[styles.animatedInfoPanel, { transform: [{ translateY: panelAnim.interpolate({ inputRange: [0,1], outputRange: [height * 0.6, 0] }) }] }] }>
              <ScrollView style={[styles.facebookStyleInfoPanel, isDescriptionExpanded && styles.facebookStyleInfoPanelExpanded]} contentContainerStyle={styles.fbContentContainer}>
              <View style={styles.fbTitleContainer}>
                <Text style={styles.fbPhotoTitle}>{selectedPhoto.title}</Text>
                <Text style={styles.fbDateText}>{selectedPhoto.fecha}</Text>
              </View>

              {/* Use the same displayedText as the static panel (including DEV injection) */}
              <Text style={styles.fbPhotoDescription} numberOfLines={isDescriptionExpanded ? undefined : 2}>{(() => {
                const base = selectedPhoto.description || '';
                return (DEV_FORCE_LONG_DESC && (!base || base.length < 120)) ? base + '\n\n' + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(8) : base;
              })()}</Text>
              <TouchableOpacity onPress={() => expandPanel(!isDescriptionExpanded)}>
                <Text style={styles.fbShowMoreText}>{isDescriptionExpanded ? 'Ver menos' : 'Ver más'}</Text>
              </TouchableOpacity>

              <View style={styles.fbLikesContainer}>
                <View style={styles.fbLikeIconContainer}>
                  <Ionicons name="thumbs-up" size={16} color="#FFFFFF" style={styles.fbLikeIcon} />
                </View>
                <Text style={styles.fbLikesText}>A {likedPhotos[selectedPhoto.id] ? 'ti' : (professional ? professional.name : 'este profesional')} y {selectedPhoto.likes} personas más les gusta esto</Text>
              </View>

              <View style={styles.fbActionButtonsContainer}>
                <TouchableOpacity style={styles.fbActionButton} onPress={() => handleLikePhoto(selectedPhoto.id)}>
                  <Ionicons name={likedPhotos[selectedPhoto.id] ? 'thumbs-up' : 'thumbs-up-outline'} size={18} color={likedPhotos[selectedPhoto.id] ? colors.primary : '#FFFFFF'} />
                  <Text style={[styles.fbActionButtonText, likedPhotos[selectedPhoto.id] && { color: colors.primary }]}>Me gusta</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.fbActionButton}>
                  <Ionicons name="chatbubble-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.fbActionButtonText}>Comentar</Text>
                </TouchableOpacity>
              </View>

              <View style={{ height: 10 }} />
              </ScrollView>
            </Animated.View>

            {/* Static info panel below the image (always visible, collapsed) */}
            <View style={styles.staticInfoPanel}>
              <View style={styles.fbTitleContainer}>
                <Text style={styles.fbPhotoTitle}>{selectedPhoto?.title}</Text>
                <Text style={styles.fbDateText}>{selectedPhoto?.fecha}</Text>
              </View>

              {/* Description: detect if it overflows 2 lines and show 'Ver más' below only when needed */}
              {
                // Prepare the displayed description text once so the onTextLayout and the render
                // use exactly the same string (important for reliable overflow detection).
              }
              {(() => {
                if (!selectedPhoto) return null;
                const base = selectedPhoto.description || '';
                const displayedText = (DEV_FORCE_LONG_DESC && (!base || base.length < 120))
                  ? base + '\n\n' + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(8)
                  : base;

                // Visible truncated text (what the user sees)
                // We'll measure the full text in a hidden Text element to reliably detect overflow
                const key = (selectedPhoto && (typeof selectedPhoto.id !== 'undefined' ? selectedPhoto.id : '__no_id__'));
                const handleMeasureLayout = (e) => {
                  const linesArray = e?.nativeEvent?.lines;
                  let isOverflow = false;
                  if (Array.isArray(linesArray)) {
                    isOverflow = linesArray.length > 2;
                  } else {
                    isOverflow = displayedText.length > 140;
                  }
                  setDescOverflowMap(prev => ({ ...prev, [key]: isOverflow }));
                };

                return (
                  <>
                    <Text style={styles.fbPhotoDescription} numberOfLines={2}>{displayedText}</Text>
                    {/* Hidden measuring text: same content, no numberOfLines, invisible but laid out so onTextLayout fires */}
                    <Text style={[styles.fbPhotoDescription, styles.hiddenMeasureText]} onTextLayout={handleMeasureLayout}>{displayedText}</Text>
                  </>
                );
              })()}

              <View style={{height:8}} />

              <View style={styles.fbLikesContainer}>
                <View style={styles.fbLikeIconContainer}>
                  <Ionicons name="thumbs-up" size={16} color="#FFFFFF" style={styles.fbLikeIcon} />
                </View>
                <Text style={styles.fbLikesText}>A {likedPhotos[selectedPhoto?.id] ? 'ti' : (professional ? professional.name : 'este profesional')} y {selectedPhoto?.likes} personas más les gusta esto</Text>
              </View>

              {/* Show 'Ver más' directly under the description only when it actually overflows */}
              {((selectedPhoto && typeof selectedPhoto.id !== 'undefined' && descOverflowMap[selectedPhoto.id]) || descOverflowMap['__no_id__']) && (
                <TouchableOpacity onPress={() => expandPanel(true)}>
                  <Text style={styles.fbShowMoreText}>Ver más</Text>
                </TouchableOpacity>
              )}

              <View style={styles.fbActionButtonsContainer}>
                <TouchableOpacity style={styles.fbActionButton} onPress={() => handleLikePhoto(selectedPhoto?.id)}>
                  <Ionicons name={likedPhotos[selectedPhoto?.id] ? 'thumbs-up' : 'thumbs-up-outline'} size={18} color={likedPhotos[selectedPhoto?.id] ? colors.primary : '#FFFFFF'} />
                  <Text style={[styles.fbActionButtonText, likedPhotos[selectedPhoto?.id] && { color: colors.primary }]}>Me gusta</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.fbActionButton}>
                  <Ionicons name="chatbubble-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.fbActionButtonText}>Comentar</Text>
                </TouchableOpacity>

                {/* Removed duplicate 'Ver más' here so the show-more button appears only below the description text */}
              </View>
            </View>
          </Animated.View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  photoModalContainer: {
    flex: 1,
    backgroundColor: '#000000',
    position: 'relative',
  },
  photoModalContent: {
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
  },
  photoInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    zIndex: 10,
  },
  photoInfoHeaderTop: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  photoModalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  photoModalOptionsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  photoIndicator: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  photoIndicatorText: { color: '#FFFFFF', fontSize: 12, fontWeight: '500' },
  photoImageFixedContainer: {
    // occupy full available vertical space so each page equals viewport height
    flex: 1,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  photoImageContainerCollapsed: {
    height: width * 0.4,
  },
  photoViewerContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    margin: 0,
  },
  photoViewerImage: {
    resizeMode: 'contain',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    zIndex: 8,
  },
  animatedInfoPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9,
  },
  collapsedBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 11,
  },
  collapsedBarContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1024, alignSelf: 'center' },
  collapsedTitle: { color: '#fff', fontSize: 14, fontWeight: '600', flex: 1, marginRight: 8 },
  collapsedMeta: { flexDirection: 'row', alignItems: 'center' },
  collapsedMetaText: { color: '#fff', marginLeft: 6, fontSize: 13 },
  staticInfoPanel: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 18,
    backgroundColor: '#000000',
  },
  facebookStyleInfoPanel: {
    backgroundColor: '#000000',
    padding: 12,
    paddingBottom: 8,
    maxHeight: width * 0.7,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  facebookStyleInfoPanelExpanded: {
    maxHeight: undefined,
    top: width * 0.4 + (Platform.OS === 'ios' ? 80 : 60),
  },
  fbContentContainer: { flexGrow: 1, justifyContent: 'flex-start', paddingBottom: 8 },
  fbTitleContainer: { marginBottom: 4 },
  fbPhotoTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 2 },
  fbDateText: { color: '#CCCCCC', fontSize: 12, marginBottom: 6 },
  fbPhotoDescription: { color: '#FFFFFF', fontSize: 14, lineHeight: 18, marginBottom: 4 },
  hiddenMeasureText: {
    position: 'absolute',
    opacity: 0,
    left: 0,
    right: 0,
    // keep it out of normal layout flow
    height: 0,
    overflow: 'hidden',
  },
  fbShowMoreText: { color: '#CCC', fontSize: 14, marginBottom: 10 },
  fbLikesContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, paddingBottom: 6 },
  fbLikeIconContainer: { backgroundColor: colors.primary, width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  fbLikeIcon: { marginTop: 1 },
  fbLikesText: { color: '#FFFFFF', fontSize: 13 },
  fbActionButtonsContainer: { flexDirection: 'row', justifyContent: 'flex-start', paddingVertical: 4, marginBottom: 4 },
  fbActionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 4, paddingHorizontal: 16, marginRight: 12 },
  fbActionButtonText: { color: '#FFFFFF', fontSize: 13, marginLeft: 6, fontWeight: '500' },
});

export default PhotoViewer;
