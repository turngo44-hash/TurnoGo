import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

const { width } = Dimensions.get('window');

const ServicesTab = ({ services }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  const groupedServices = groupServicesByCategory(services);
  const categories = Object.keys(groupedServices);

  // Servicios filtrados por categoría seleccionada o todos
  const filteredServices = selectedCategory ? 
    groupedServices[selectedCategory] : 
    services;

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

  // Renderizar un servicio
  const renderService = ({ item }) => (
    <View style={styles.serviceCard}>
      <View style={styles.serviceHeader}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.servicePrice}>{item.price}</Text>
      </View>
      
      <View style={styles.serviceDetails}>
        <View style={styles.serviceTime}>
          <Ionicons name="time-outline" size={14} color="#666" />
          <Text style={styles.serviceTimeText}>{item.duration}</Text>
        </View>
        
        {item.description && (
          <Text style={styles.serviceDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
      
      <TouchableOpacity style={styles.bookButton}>
        <Text style={styles.bookButtonText}>Reservar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderCategories()}

      <FlatList
        data={filteredServices}
        keyExtractor={(item, index) => `service-${index}`}
        renderItem={renderService}
        contentContainerStyle={styles.servicesContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  selectedCategoryChip: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: '500',
  },
  servicesContainer: {
    padding: 16,
  },
  serviceCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  serviceDetails: {
    marginBottom: 12,
  },
  serviceTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  serviceTimeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  bookButton: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  }
});

export default ServicesTab;