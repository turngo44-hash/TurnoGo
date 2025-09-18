import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BusinessServices = () => {
  const [services, setServices] = useState([
    {
      id: '1',
      name: 'Corte de Cabello',
      description: 'Corte profesional adaptado a tu estilo',
      price: 25000,
      duration: 30,
      category: 'Cabello',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=200&fit=crop',
      isActive: true,
      bookings: 45,
    },
    {
      id: '2',
      name: 'Manicura Completa',
      description: 'Cuidado completo de uñas con esmaltado',
      price: 18000,
      duration: 45,
      category: 'Uñas',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&h=200&fit=crop',
      isActive: true,
      bookings: 32,
    },
    {
      id: '3',
      name: 'Pedicura Spa',
      description: 'Tratamiento relajante para pies',
      price: 22000,
      duration: 60,
      category: 'Uñas',
      image: 'https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=300&h=200&fit=crop',
      isActive: true,
      bookings: 28,
    },
    {
      id: '4',
      name: 'Tratamiento Facial',
      description: 'Limpieza profunda y hidratación',
      price: 45000,
      duration: 90,
      category: 'Facial',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
      isActive: true,
      bookings: 23,
    },
    {
      id: '5',
      name: 'Depilación Cejas',
      description: 'Perfilado y diseño de cejas',
      price: 12000,
      duration: 20,
      category: 'Depilación',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300&h=200&fit=crop',
      isActive: false,
      bookings: 15,
    },
  ]);

  const categories = ['Todos', 'Cabello', 'Uñas', 'Facial', 'Depilación'];
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredServices = selectedCategory === 'Todos' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  const toggleServiceStatus = (serviceId) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, isActive: !service.isActive }
        : service
    ));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  const renderCategoryFilter = () => (
    <View style={styles.categoryContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderServiceCard = (service) => (
    <View key={service.id} style={styles.serviceCard}>
      <Image source={{ uri: service.image }} style={styles.serviceImage} />
      
      <View style={styles.serviceContent}>
        <View style={styles.serviceHeader}>
          <View style={styles.serviceTitle}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{service.category}</Text>
            </View>
          </View>
          <Switch
            value={service.isActive}
            onValueChange={() => toggleServiceStatus(service.id)}
            trackColor={{ false: '#D1D5DB', true: '#8B5CF6' }}
            thumbColor={service.isActive ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>

        <Text style={styles.serviceDescription}>{service.description}</Text>

        <View style={styles.serviceDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="pricetag" size={16} color="#8B5CF6" />
            <Text style={styles.detailText}>{formatPrice(service.price)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time" size={16} color="#06B6D4" />
            <Text style={styles.detailText}>{formatDuration(service.duration)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="calendar" size={16} color="#10B981" />
            <Text style={styles.detailText}>{service.bookings} citas</Text>
          </View>
        </View>

        <View style={styles.serviceActions}>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={18} color="#6B7280" />
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.duplicateButton}>
            <Ionicons name="copy-outline" size={18} color="#8B5CF6" />
            <Text style={styles.duplicateButtonText}>Duplicar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderStats = () => {
    const totalServices = services.length;
    const activeServices = services.filter(s => s.isActive).length;
    const totalBookings = services.reduce((sum, s) => sum + s.bookings, 0);
    const averagePrice = services.reduce((sum, s) => sum + s.price, 0) / totalServices;

    return (
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalServices}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{activeServices}</Text>
          <Text style={styles.statLabel}>Activos</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalBookings}</Text>
          <Text style={styles.statLabel}>Citas</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{formatPrice(averagePrice)}</Text>
          <Text style={styles.statLabel}>Promedio</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Mis Servicios</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      {renderStats()}

      {/* Category Filter */}
      {renderCategoryFilter()}

      {/* Services List */}
      <View style={styles.servicesList}>
        {filteredServices.map(renderServiceCard)}
      </View>

      {filteredServices.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="cut-outline" size={48} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No hay servicios</Text>
          <Text style={styles.emptySubtitle}>
            {selectedCategory === 'Todos' 
              ? 'Agrega tu primer servicio para comenzar'
              : `No hay servicios en la categoría "${selectedCategory}"`
            }
          </Text>
          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.createButtonText}>Crear servicio</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryScroll: {
    paddingVertical: 4,
  },
  categoryButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryButtonActive: {
    backgroundColor: '#8B5CF6',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  servicesList: {
    gap: 16,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  serviceImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#F3F4F6',
  },
  serviceContent: {
    padding: 16,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceTitle: {
    flex: 1,
    marginRight: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  categoryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryBadgeText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  serviceDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginLeft: 6,
  },
  serviceActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    marginLeft: 6,
  },
  duplicateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    borderRadius: 8,
  },
  duplicateButtonText: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
    marginLeft: 6,
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
  bottomSpacing: {
    height: 20,
  },
});

export default BusinessServices;
