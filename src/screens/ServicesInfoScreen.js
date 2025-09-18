import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar, 
  Platform,
  Image,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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

// Datos de servicios de ejemplo
const services = [
  {
    id: 's1',
    name: 'Corte de Cabello',
    description: 'Corte y estilizado según la preferencia del cliente. Incluye lavado y secado básico.',
    duration: 30,
    price: 25,
    image: 'https://images.unsplash.com/photo-1562004760-aceed7bb0fe3?w=500&h=300&auto=format&fit=crop',
    category: 'Cabello',
  },
  {
    id: 's2',
    name: 'Coloración Completa',
    description: 'Aplicación profesional de color en todo el cabello. Incluye lavado y secado.',
    duration: 120,
    price: 65,
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=500&h=300&auto=format&fit=crop',
    category: 'Cabello',
  },
  {
    id: 's3',
    name: 'Corte y Afeitado',
    description: 'Servicio completo de barbería incluye corte de cabello y afeitado tradicional con navaja.',
    duration: 60,
    price: 40,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&h=300&auto=format&fit=crop',
    category: 'Barbería',
  },
  {
    id: 's4',
    name: 'Manicure',
    description: 'Tratamiento completo para manos que incluye limado, cutículas y esmalte.',
    duration: 45,
    price: 30,
    image: 'https://images.unsplash.com/photo-1610992464675-36dd54b3a86d?w=500&h=300&auto=format&fit=crop',
    category: 'Uñas',
  },
];

export default function ServicesInfoScreen() {
  const navigation = useNavigation();
  
  const renderServiceCard = (service) => {
    return (
      <TouchableOpacity 
        key={service.id}
        style={styles.serviceCard}
      >
        <Image
          source={{ uri: service.image }}
          style={styles.serviceImage}
          resizeMode="cover"
        />
        
        <View style={styles.serviceContent}>
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{service.category}</Text>
            </View>
          </View>
          
          <Text style={styles.serviceDescription}>{service.description}</Text>
          
          <View style={styles.serviceFooter}>
            <View style={styles.serviceMetadata}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color={appColors.accent} />
                <Text style={styles.metaText}>{service.duration} min</Text>
              </View>
              <View style={styles.metaItem}>
                <MaterialIcons name="attach-money" size={16} color={appColors.accent} />
                <Text style={styles.metaText}>${service.price}</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.infoButton}>
              <Text style={styles.infoButtonText}>Más info</Text>
              <MaterialIcons name="arrow-forward-ios" size={12} color={appColors.primary} />
            </TouchableOpacity>
          </View>
        </View>
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
          <Text style={styles.headerTitle}>Servicios</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={24} color={appColors.light} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Total Servicios</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Categorías</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>$15-80</Text>
            <Text style={styles.statLabel}>Rango precios</Text>
          </View>
        </View>
      </LinearGradient>
      
      {/* Guía de información */}
      <View style={styles.infoGuide}>
        <MaterialIcons name="lightbulb-outline" size={20} color={appColors.primary} />
        <Text style={styles.infoGuideText}>
          Esta información es utilizada por los profesionales para agendar citas
        </Text>
      </View>
      
      {/* Lista de Servicios */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {services.map(service => renderServiceCard(service))}
      </ScrollView>
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.light,
  },
  statLabel: {
    fontSize: 12,
    color: appColors.light + 'CC',
    marginTop: 4,
  },
  statDivider: {
    height: 30,
    width: 1,
    backgroundColor: appColors.light + '40',
  },
  infoGuide: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.light,
    margin: 16,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  infoGuideText: {
    color: appColors.secondary,
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  serviceCard: {
    backgroundColor: appColors.light,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  serviceImage: {
    width: '100%',
    height: 150,
  },
  serviceContent: {
    padding: 16,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.dark,
    flex: 1,
  },
  categoryTag: {
    backgroundColor: appColors.accent + '20',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginLeft: 8,
  },
  categoryText: {
    fontSize: 12,
    color: appColors.accent,
    fontWeight: '500',
  },
  serviceDescription: {
    fontSize: 14,
    color: appColors.gray,
    lineHeight: 20,
    marginBottom: 16,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceMetadata: {
    flexDirection: 'row',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    color: appColors.secondary,
    fontWeight: '500',
    marginLeft: 4,
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: appColors.primary,
    borderRadius: 20,
  },
  infoButtonText: {
    fontSize: 12,
    color: appColors.primary,
    fontWeight: '500',
    marginRight: 4,
  },
});
