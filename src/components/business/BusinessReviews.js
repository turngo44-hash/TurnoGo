import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BusinessReviews = () => {
  const reviews = [
    {
      id: '1',
      user: 'María González',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop',
      rating: 5,
      date: '2024-08-15',
      comment: 'Excelente servicio! El personal es muy profesional y el lugar está muy limpio. Mi corte quedó perfecto.',
      likes: 12,
      service: 'Corte de Cabello',
    },
    {
      id: '2',
      user: 'Ana Rodríguez',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      rating: 5,
      date: '2024-08-10',
      comment: 'La manicura estuvo increíble, muy detallada y con productos de excelente calidad. Totalmente recomendado.',
      likes: 8,
      service: 'Manicura',
    },
    {
      id: '3',
      user: 'Carmen López',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      rating: 4,
      date: '2024-08-05',
      comment: 'Muy buen servicio, aunque tuve que esperar un poco. El resultado final valió la pena.',
      likes: 5,
      service: 'Tratamiento Facial',
    },
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={14}
        color={index < rating ? '#F59E0B' : '#D1D5DB'}
      />
    ));
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const reviewDate = new Date(date);
    const diffTime = Math.abs(now - reviewDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return `Hace ${Math.floor(diffDays / 30)} meses`;
  };

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Rating Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.ratingContainer}>
          <Text style={styles.averageRating}>{averageRating.toFixed(1)}</Text>
          <View style={styles.starsContainer}>
            {renderStars(Math.round(averageRating))}
          </View>
          <Text style={styles.totalReviews}>({totalReviews} reseñas)</Text>
        </View>
        
        <TouchableOpacity style={styles.addReviewButton}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addReviewText}>Escribir reseña</Text>
        </TouchableOpacity>
      </View>

      {/* Rating Breakdown */}
      <View style={styles.breakdownCard}>
        <Text style={styles.sectionTitle}>Calificaciones</Text>
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = reviews.filter(r => r.rating === stars).length;
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
          
          return (
            <View key={stars} style={styles.breakdownRow}>
              <View style={styles.breakdownLeft}>
                <Text style={styles.breakdownStars}>{stars}</Text>
                <Ionicons name="star" size={12} color="#F59E0B" />
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${percentage}%` }]} />
              </View>
              <Text style={styles.breakdownCount}>({count})</Text>
            </View>
          );
        })}
      </View>

      {/* Reviews List */}
      <View style={styles.reviewsCard}>
        <Text style={styles.sectionTitle}>Reseñas de Clientes</Text>
        
        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Image source={{ uri: review.avatar }} style={styles.userAvatar} />
              <View style={styles.reviewMeta}>
                <Text style={styles.userName}>{review.user}</Text>
                <View style={styles.reviewInfo}>
                  <View style={styles.reviewStars}>
                    {renderStars(review.rating)}
                  </View>
                  <Text style={styles.reviewDate}>{getTimeAgo(review.date)}</Text>
                </View>
                <Text style={styles.serviceName}>{review.service}</Text>
              </View>
              <TouchableOpacity style={styles.moreButton}>
                <Ionicons name="ellipsis-horizontal" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.reviewComment}>{review.comment}</Text>
            
            <View style={styles.reviewFooter}>
              <TouchableOpacity style={styles.likeButton}>
                <Ionicons name="heart-outline" size={16} color="#6B7280" />
                <Text style={styles.likeCount}>{review.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.replyButton}>
                <Ionicons name="chatbubble-outline" size={16} color="#6B7280" />
                <Text style={styles.replyText}>Responder</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        <TouchableOpacity style={styles.loadMoreButton}>
          <Text style={styles.loadMoreText}>Ver más reseñas</Text>
          <Ionicons name="chevron-down" size={16} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 20,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  ratingContainer: {
    alignItems: 'center',
  },
  averageRating: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  totalReviews: {
    fontSize: 12,
    color: '#6B7280',
  },
  addReviewButton: {
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addReviewText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  breakdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 30,
  },
  breakdownStars: {
    fontSize: 12,
    color: '#374151',
    marginRight: 4,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    marginHorizontal: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 3,
  },
  breakdownCount: {
    fontSize: 12,
    color: '#6B7280',
    width: 25,
    textAlign: 'right',
  },
  reviewsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  reviewItem: {
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewMeta: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  reviewInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  reviewStars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  serviceName: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  moreButton: {
    padding: 4,
  },
  reviewComment: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  likeCount: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
  },
  loadMoreText: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
    marginRight: 4,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default BusinessReviews;
