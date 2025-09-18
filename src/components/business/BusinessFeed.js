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

const { width } = Dimensions.get('window');
const postWidth = (width - 60) / 3; // 3 columns with margins

const BusinessFeed = ({ posts = [] }) => {
  const defaultPosts = [
    {
      id: '1',
      type: 'image',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=400&fit=crop',
      likes: 23,
      comments: 5,
      isVideo: false,
    },
    {
      id: '2',
      type: 'image',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop',
      likes: 45,
      comments: 12,
      isVideo: false,
    },
    {
      id: '3',
      type: 'video',
      image: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=400&h=400&fit=crop',
      likes: 67,
      comments: 8,
      isVideo: true,
    },
    {
      id: '4',
      type: 'image',
      image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=400&fit=crop',
      likes: 34,
      comments: 7,
      isVideo: false,
    },
    {
      id: '5',
      type: 'image',
      image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=400&fit=crop',
      likes: 89,
      comments: 15,
      isVideo: false,
    },
    {
      id: '6',
      type: 'image',
      image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=400&fit=crop',
      likes: 56,
      comments: 9,
      isVideo: false,
    },
  ];

  const allPosts = posts.length > 0 ? posts : defaultPosts;

  const renderPost = (post, index) => (
    <TouchableOpacity key={post.id} style={styles.postContainer}>
      <Image
        source={{ uri: post.image }}
        style={styles.postImage}
      />
      
      {/* Video indicator */}
      {post.isVideo && (
        <View style={styles.videoIndicator}>
          <Ionicons name="play" size={16} color="#FFFFFF" />
        </View>
      )}
      
      {/* Stats overlay */}
      <View style={styles.statsOverlay}>
        <View style={styles.statItem}>
          <Ionicons name="heart" size={14} color="#FFFFFF" />
          <Text style={styles.statText}>{post.likes}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="chatbubble" size={14} color="#FFFFFF" />
          <Text style={styles.statText}>{post.comments}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Mis Publicaciones</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={20} color="#8B5CF6" />
          <Text style={styles.addText}>Nueva</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.grid}>
        {allPosts.map(renderPost)}
      </View>
      
      {allPosts.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="camera-outline" size={48} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No hay publicaciones</Text>
          <Text style={styles.emptySubtitle}>
            Comparte fotos de tu trabajo para atraer más clientes
          </Text>
          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.createButtonText}>Crear primera publicación</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  addText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
    marginLeft: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  postContainer: {
    width: postWidth,
    height: postWidth,
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
  },
  videoIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 6,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BusinessFeed;
