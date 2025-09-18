import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  TextInput,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Mock professionals data - in production this would come from props or redux
const mockProfessionals = [
  { 
    id: 'p1', 
    name: 'Ana López', 
    role: 'Estilista Senior', 
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop', 
    likes: 120,
    available: true
  },
  { 
    id: 'p2', 
    name: 'Carlos Méndez', 
    role: 'Colorista', 
    avatar: 'https://images.unsplash.com/photo-1545996124-1f7d2f0d1b3b?w=200&h=200&fit=crop', 
    likes: 90,
    available: true
  },
  { 
    id: 'p3', 
    name: 'Lucía Fernández', 
    role: 'Manicurista', 
    avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&h=200&fit=crop', 
    likes: 210,
    available: false
  },
  { 
    id: 'p4', 
    name: 'Miguel Ruiz', 
    role: 'Barbero', 
    avatar: 'https://images.unsplash.com/photo-1545996124-1f7d2f0d1b3b?w=200&h=200&fit=crop', 
    likes: 48,
    available: true
  },
  { 
    id: 'p5', 
    name: 'Sophia Martínez', 
    role: 'Estilista Junior', 
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop', 
    likes: 62,
    available: true
  },
  { 
    id: 'p6', 
    name: 'David Torres', 
    role: 'Maquillador', 
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop', 
    likes: 185,
    available: true
  },
];

const CARD_MARGIN = 16;
const CARD_WIDTH = width - 40; // Full width card with padding

const ProfessionalCard = ({ item, index }) => {
  const navigation = useNavigation();
  const scaleAnim = new Animated.Value(1);
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('ProfessionalProfile', { professional: item })}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.cardHeader}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={styles.headerRight}>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.role}>{item.role}</Text>
            </View>
            <View style={styles.likeContainer}>
              <Ionicons name="heart" size={16} color="#FF4B55" style={styles.likeIcon} />
              <Text style={styles.likeCount}>{item.likes} likes</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.cardFooter}>
          <View style={styles.availabilityContainer}>
            <View style={[styles.statusDot, item.available ? styles.availableDot : styles.unavailableDot]} />
            <Text style={[styles.availabilityText, !item.available && styles.unavailableText]}>
              {item.available ? 'Disponible hoy' : 'No disponible'}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={() => navigation.navigate('BookAppointment', { professional: item })}
          >
            <Text style={styles.bookButtonText}>Reservar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const BusinessProfessionals = ({ professionals = mockProfessionals }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(professionals);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      filterByCategory(selectedFilter);
    } else {
      const filtered = professionals.filter(
        (item) => 
          item.name.toLowerCase().includes(text.toLowerCase()) ||
          item.role.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const filterByCategory = (category) => {
    setSelectedFilter(category);
    let filtered;
    
    switch(category) {
      case 'available':
        filtered = professionals.filter(item => item.available);
        break;
      case 'all':
      default:
        filtered = professionals;
    }
    
    // Also apply search query if exists
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(
        (item) => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredData(filtered);
  };
  
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Header with search */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar profesionales..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>
      
      {/* Filter tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterTab, selectedFilter === 'all' && styles.activeFilterTab]}
          onPress={() => filterByCategory('all')}
        >
          <Text style={[styles.filterText, selectedFilter === 'all' && styles.activeFilterText]}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, selectedFilter === 'available' && styles.activeFilterTab]}
          onPress={() => filterByCategory('available')}
        >
          <Text style={[styles.filterText, selectedFilter === 'available' && styles.activeFilterText]}>Disponibles</Text>
        </TouchableOpacity>
      </View>
      
      {/* Professionals list */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => <ProfessionalCard item={item} index={index} />}
        ItemSeparatorComponent={() => <View style={{ height: CARD_MARGIN }} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="person-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No se encontraron profesionales</Text>
            <Text style={styles.emptyDesc}>Intenta con otra búsqueda o filtro</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingVertical: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#F3F4F6',
  },
  activeFilterTab: {
    backgroundColor: '#111827',
  },
  filterText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100, // Extra padding at bottom for safe area
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F1F1',
  },
  cardHeader: {
    flexDirection: 'row',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
  },
  headerRight: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  role: {
    fontSize: 14,
    color: '#4B5563',
  },
  ratingContainer: {
    marginTop: 5,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  likeIcon: {
    marginRight: 4,
  },
  likeCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  availableDot: {
    backgroundColor: '#10B981',
  },
  unavailableDot: {
    backgroundColor: '#EF4444',
  },
  availabilityText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  unavailableText: {
    color: '#EF4444',
  },
  bookButton: {
    backgroundColor: '#111827',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  bookButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  emptyDesc: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },

});

export default BusinessProfessionals;
