import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;
const FEATURED_CARD_WIDTH = width * 0.75;

const ServicesTabNew = ({ services }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const scrollRef = useRef(null);

  // Agrupar servicios por categoría
  const groupServicesByCategory = (services = []) => {
    const map = {};
    services.forEach(s => {
      const cat = s.category || 'General';
      if (!map[cat]) map[cat] = [];
      map[cat].push(s);
    });
    return map;
  };

  // Encontrar servicios con descuento (simulado para el ejemplo)
  const getDiscountedServices = (services) => {
    // En un caso real, estos vendrían marcados en los datos
    return services.filter((_, index) => index % 3 === 0);
  };

  const groupedServices = groupServicesByCategory(services);
  const categories = Object.keys(groupedServices);
  const discountedServices = getDiscountedServices(services);

  // Abrir modal con detalle del servicio
  const handleServicePress = (service) => {
    setSelectedService(service);
    setModalVisible(true);
  };

  // Renderizar las categorías horizontalmente
  const renderCategories = () => (
    <View style={styles.categoriesContainer}>
      <TouchableOpacity 
        style={[
          styles.categoryChip,
          !selectedCategory && styles.selectedCategoryChip
        ]}
        onPress={() => setSelectedCategory(null)}
      >
        <Text style={[
          styles.categoryText,
          !selectedCategory && styles.selectedCategoryText
        ]}>
          Todos
        </Text>
      </TouchableOpacity>
      
      {categories.map(category => (
        <TouchableOpacity 
          key={category}
          style={[
            styles.categoryChip,
            selectedCategory === category && styles.selectedCategoryChip
          ]}
          onPress={() => setSelectedCategory(category)}
        >
          <Text style={[
            styles.categoryText,
            selectedCategory === category && styles.selectedCategoryText
          ]}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Renderizar un servicio destacado/con descuento
  const renderFeaturedService = ({ item }) => (
    <TouchableOpacity 
      style={styles.featuredCard}
      onPress={() => handleServicePress(item)}
      activeOpacity={0.9}
    >
      <View style={styles.featuredImageContainer}>
        {/* Aquí iría la imagen del servicio, usando una placeholder por ahora */}
        <Image 
          source={{ uri: `https://source.unsplash.com/random/400x400/?${item.category?.toLowerCase() || 'haircut'}` }}
          style={styles.featuredImage}
          resizeMode="cover"
        />
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-15%</Text>
        </View>
      </View>
      <View style={styles.featuredCardContent}>
        <Text style={styles.featuredServiceName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.serviceInfoRow}>
          <View style={styles.serviceTime}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.serviceTimeText}>{item.duration}</Text>
          </View>
          <Text style={styles.servicePrice}>
            <Text style={styles.originalPrice}>{parseInt(item.price) + 10}€</Text> {item.price}
          </Text>
        </View>
        <Text style={styles.serviceDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Renderizar un servicio regular en grid
  const renderServiceCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.serviceCard}
      onPress={() => handleServicePress(item)}
      activeOpacity={0.9}
    >
      <Image 
        source={{ uri: `https://source.unsplash.com/random/300x300/?${item.category?.toLowerCase() || 'haircut'}` }}
        style={styles.serviceImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.serviceName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.serviceInfoRow}>
          <Text style={styles.servicePrice}>{item.price}</Text>
          <View style={styles.serviceTime}>
            <Ionicons name="time-outline" size={12} color="#666" />
            <Text style={styles.serviceTimeText}>{item.duration}</Text>
          </View>
        </View>
        <Text style={styles.serviceDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Modal de detalle del servicio
  const renderServiceDetailModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
          
          {selectedService && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Image 
                source={{ uri: `https://source.unsplash.com/random/600x400/?${selectedService.category?.toLowerCase() || 'haircut'}` }}
                style={styles.modalImage}
                resizeMode="cover"
              />
              
              <View style={styles.modalBody}>
                <Text style={styles.modalTitle}>{selectedService.name}</Text>
                
                <View style={styles.serviceMetaInfo}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={16} color="#3B82F6" />
                    <Text style={styles.metaText}>{selectedService.duration}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <MaterialIcons name="category" size={16} color="#8B5CF6" />
                    <Text style={styles.metaText}>{selectedService.category}</Text>
                  </View>
                </View>
                
                <Text style={styles.priceLabel}>Precio</Text>
                <Text style={styles.modalPrice}>{selectedService.price}</Text>
                
                <Text style={styles.descriptionLabel}>Descripción</Text>
                <Text style={styles.modalDescription}>{selectedService.description}</Text>
                
                {/* Aquí podrías añadir más información como técnica usada, productos, etc */}
                
                <TouchableOpacity style={styles.bookButton}>
                  <Text style={styles.bookButtonText}>Reservar Ahora</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

  // Filtramos por categoría si hay una seleccionada
  const filteredCategories = selectedCategory ? 
    [selectedCategory] : 
    categories;

  return (
    <View style={styles.container}>
      {/* Filtro de categorías */}
      {renderCategories()}

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        ref={scrollRef}
      >
        {/* Sección de descuentos/destacados */}
        {discountedServices.length > 0 && !selectedCategory && (
          <View style={styles.featuredSection}>
            <Text style={styles.sectionTitle}>Descuentos Especiales</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={discountedServices}
              keyExtractor={(item, index) => `featured-${index}`}
              renderItem={renderFeaturedService}
              contentContainerStyle={styles.featuredList}
              snapToInterval={FEATURED_CARD_WIDTH + 16}
              decelerationRate="fast"
              pagingEnabled
            />
          </View>
        )}

        {/* Secciones por categoría */}
        {filteredCategories.map(category => (
          <View key={category} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>{category}</Text>
            </View>
            
            <View style={styles.servicesGrid}>
              {groupedServices[category].map((service, index) => (
                <View key={`service-${category}-${index}`} style={styles.gridItem}>
                  {renderServiceCard({item: service})}
                </View>
              ))}
            </View>
          </View>
        ))}
        
        {/* Espaciado final */}
        <View style={{height: 30}} />
      </ScrollView>

      {/* Modal de detalle del servicio */}
      {renderServiceDetailModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContainer: {
    flex: 1,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  selectedCategoryChip: {
    backgroundColor: '#3B82F6',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: '500',
  },
  // Estilos para sección de destacados
  featuredSection: {
    paddingVertical: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  featuredList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  featuredCard: {
    width: FEATURED_CARD_WIDTH,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    overflow: 'hidden',
  },
  featuredImageContainer: {
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  featuredCardContent: {
    padding: 12,
  },
  featuredServiceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  serviceInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  serviceTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceTimeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B82F6',
  },
  originalPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginRight: 4,
  },
  serviceDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  // Estilos para secciones de categoría
  categorySection: {
    paddingTop: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  gridItem: {
    width: '50%',
    padding: 4,
  },
  serviceCard: {
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContent: {
    padding: 10,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 6,
    zIndex: 10,
  },
  modalImage: {
    width: '100%',
    height: 240,
  },
  modalBody: {
    padding: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  serviceMetaInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  metaText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 6,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  modalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: 16,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  modalDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 24,
  },
  bookButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ServicesTabNew;