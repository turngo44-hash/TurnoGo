import React from 'react';
import { View, Animated, TouchableWithoutFeedback, Image, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from './styles';

const Carousel = ({ photos, initialIndex, flatListRef, fadeAnim, likeAnimScale, showLikeAnimation, handleImagePress, handleImageLoad }) => {
  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

  return (
    <FlatList
      ref={flatListRef}
      data={photos}
      keyExtractor={(item, idx) => item.id?.toString() || idx.toString()}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={initialIndex}
      getItemLayout={(data, index) => ({ length: styles.image.width, offset: styles.image.width * index, index })}
      renderItem={({ item, index }) => (
        <View style={styles.imageWrapper}>
          <TouchableWithoutFeedback onPress={handleImagePress}>
            <Animated.Image
              source={{ uri: item?.uri }}
              style={[styles.image, { opacity: fadeAnim }]}
              resizeMode="contain"
              onLoad={handleImageLoad}
            />
          </TouchableWithoutFeedback>

          {/* precarga */}
          {index < photos.length - 1 && (
            <Image source={{ uri: photos[index + 1]?.uri }} style={styles.preloadImage} />
          )}
          {index > 0 && (
            <Image source={{ uri: photos[index - 1]?.uri }} style={styles.preloadImage} />
          )}

          {showLikeAnimation && (
            <Animated.View style={[styles.likeIconOverlay, { transform: [{ scale: likeAnimScale }] }]}>
              <FontAwesome name="heart" size={65} color="#E53E3E" />
            </Animated.View>
          )}
        </View>
      )}
    />
  );
};

export default Carousel;
