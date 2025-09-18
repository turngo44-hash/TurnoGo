import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Dimensions, 
  StatusBar,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { saveSelectedProfessional } from '../store/slices/professionalSlice';

// Paleta de colores moderna rojo-azul
const appColors = {
  primary: '#E53E3E',       // Rojo primario
  secondary: '#2D3748',     // Azul oscuro
  dark: '#1A202C',          // Negro
  light: '#FFFFFF',         // Blanco
  background: '#F7FAFC',    // Gris claro para fondos
  gray: '#A0AEC0',          // Gris medio para textos secundarios
  accent: '#3182CE',        // Azul brillante para acentos
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

export default function ProfessionalsListScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [professionals, setProfessionals] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    // Mock: perfiles profesionales para la selección
    setProfessionals([
      { 
        id: 'p1', 
        name: 'María Gómez', 
        title: 'Estilista senior', 
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&h=300&auto=format&fit=crop',
        reviews: 124,
        specialty: 'cortes',
        rating: 4.8,
        appointmentsToday: 3,
        availability: true,
        services: ['Cortes', 'Peinados', 'Tintes'],
      },
      { 
        id: 'p2', 
        name: 'Carlos Ruiz', 
        title: 'Barbero principal', 
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=300&h=300&auto=format&fit=crop',
        reviews: 98,
        specialty: 'barbas',
        rating: 4.6,
        appointmentsToday: 5,
        availability: true,
        services: ['Cortes', 'Barbería', 'Afeitado'],
      },
      { 
        id: 'p3', 
        name: 'Lucía Pérez', 
        title: 'Colorista', 
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&h=300&auto=format&fit=crop',
        reviews: 86,
        specialty: 'tintes',
        rating: 4.9,
        appointmentsToday: 2,
        availability: false,
        services: ['Coloración', 'Mechas', 'Tratamientos'],
      },
      { 
        id: 'p4', 
        name: 'Andrés Mora', 
        title: 'Supervisor', 
        avatar: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=300&h=300&auto=format&fit=crop',
        reviews: 112,
        specialty: 'cortes',
        rating: 4.7,
        appointmentsToday: 4,
        availability: true,
        services: ['Cortes', 'Asesoramiento', 'Gestión'],
      },
    ]);
  }, []);

  const handleSelectProfessional = (professional) => {
    setSelectedId(professional.id);
    dispatch(saveSelectedProfessional(professional));
    navigation.navigate('ProfessionalProfile', { professionalId: professional.id });
  };

  const renderProfessionalCard = ({ item }) => {
    const isSelected = selectedId === item.id;
    return (
      <TouchableOpacity
        style={[
          styles.card, 
          isSelected && styles.selectedCard
        ]}
        onPress={() => handleSelectProfessional(item)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: item.avatar }} 
              style={styles.avatar} 
            />
            {item.availability ? (
              <View style={styles.availabilityDot}>
                <MaterialIcons name="circle" size={14} color="#22C55E" />
              </View>
            ) : (
              <View style={styles.availabilityDot}>
                <MaterialIcons name="circle" size={14} color="#EF4444" />
              </View>
            )}
          </View>
          
          <View style={styles.headerRight}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
            <TouchableOpacity style={styles.moreButton}>
              <Ionicons name="ellipsis-vertical" size={20} color={appColors.secondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.title}>{item.title}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="calendar-check-outline" size={18} color={appColors.accent} />
              <Text style={styles.statText}>{item.appointmentsToday} hoy</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="clock-outline" size={18} color={appColors.accent} />
              <Text style={styles.statText}>
                {item.availability ? 'Disponible' : 'No disponible'}
              </Text>
            </View>
          </View>

          <View style={styles.servicesContainer}>
            {item.services.map((service, index) => (
              <View key={index} style={styles.serviceTag}>
                <Text style={styles.serviceText}>{service}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.viewProfileButton}
          onPress={() => handleSelectProfessional(item)}
        >
          <Text style={styles.viewProfileText}>Ver Perfil</Text>
          <MaterialIcons name="arrow-forward-ios" size={14} color={appColors.light} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={appColors.secondary}
      />
      
      {/* Header */}
      <LinearGradient
        colors={[appColors.secondary, appColors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={appColors.light} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profesionales</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={24} color={appColors.light} />
          </TouchableOpacity>
        </View>

        <View style={styles.headerGuide}>
          <MaterialIcons name="info-outline" size={20} color={appColors.light} />
          <Text style={styles.headerGuideText}>Selecciona un profesional para ver más detalles</Text>
        </View>
      </LinearGradient>

      {/* Lista de Profesionales */}
      <FlatList
        data={professionals}
        renderItem={renderProfessionalCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: appColors.light,
  },
  filterButton: {
    padding: 8,
  },
  headerGuide: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginTop: 16,
    padding: 10,
    borderRadius: 8,
  },
  headerGuideText: {
    color: appColors.light,
    marginLeft: 8,
    fontWeight: '500',
    fontSize: 14,
  },
  listContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: appColors.light,
    borderRadius: 16,
    marginBottom: 20,
    paddingTop: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    alignSelf: 'center',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: appColors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: appColors.primary,
  },
  availabilityDot: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    backgroundColor: appColors.light,
    borderRadius: 10,
    padding: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEFCE8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  ratingText: {
    color: '#B45309',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 13,
  },
  moreButton: {
    padding: 5,
  },
  cardBody: {
    paddingTop: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.dark,
  },
  title: {
    fontSize: 14,
    color: appColors.gray,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 13,
    color: appColors.secondary,
    marginLeft: 5,
    fontWeight: '500',
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  serviceTag: {
    backgroundColor: `${appColors.accent}15`,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 12,
    fontWeight: '500',
    color: appColors.accent,
  },
  viewProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.primary,
    paddingVertical: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginHorizontal: -16,
    marginTop: 8,
  },
  viewProfileText: {
    color: appColors.light,
    fontWeight: 'bold',
    marginRight: 5,
  },
});
