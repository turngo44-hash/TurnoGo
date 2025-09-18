import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

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

// Datos de ejemplo para el perfil del profesional
const myProfile = {
  name: 'Alejandro Martínez',
  title: 'Estilista Senior',
  avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=400&h=400&auto=format&fit=crop',
  availability: true,
  bio: 'Especialista en cortes modernos con más de 8 años de experiencia en salones de primera categoría. Certificado en técnicas avanzadas de coloración y tratamientos capilares.',
  email: 'alejandro@turnogo.com',
  phone: '+1 (555) 123-4567',
  rating: 4.8,
  reviewCount: 87,
  services: [
    'Cortes modernos',
    'Coloración',
    'Tratamientos',
    'Peinados'
  ],
  schedule: [
    { day: 'Lunes', hours: '9:00 - 18:00' },
    { day: 'Martes', hours: '9:00 - 18:00' },
    { day: 'Miércoles', hours: '9:00 - 18:00' },
    { day: 'Jueves', hours: '9:00 - 18:00' },
    { day: 'Viernes', hours: '9:00 - 19:00' },
    { day: 'Sábado', hours: '10:00 - 16:00' },
    { day: 'Domingo', hours: 'Cerrado' },
  ],
  stats: {
    appointmentsToday: 5,
    appointmentsWeek: 24,
    totalCustomers: 142,
  },
  certifications: [
    'Técnico Superior en Estilismo',
    'Especialista en coloración Wella',
    'Certificado en cortes texturizados'
  ]
};

export default function MyProfessionalProfileScreen() {
  const navigation = useNavigation();
  const [isAvailable, setIsAvailable] = useState(myProfile.availability);
  
  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
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
          <Text style={styles.headerTitle}>Mi Perfil Profesional</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color={appColors.light} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Perfil principal */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Image 
              source={{ uri: myProfile.avatar }} 
              style={styles.avatar} 
            />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{myProfile.name}</Text>
              <Text style={styles.title}>{myProfile.title}</Text>
              
              <View style={styles.ratingContainer}>
                {Array(5).fill(0).map((_, i) => (
                  <Ionicons 
                    key={i}
                    name={i < Math.floor(myProfile.rating) ? "star" : (i < myProfile.rating ? "star-half" : "star-outline")}
                    size={16}
                    color="#F59E0B"
                    style={{ marginRight: 2 }}
                  />
                ))}
                <Text style={styles.ratingText}>
                  {myProfile.rating} ({myProfile.reviewCount} reseñas)
                </Text>
              </View>
            </View>
          </View>
          
          {/* Botón de disponibilidad */}
          <TouchableOpacity 
            style={[
              styles.availabilityButton,
              { backgroundColor: isAvailable ? '#22C55E' : appColors.primary }
            ]}
            onPress={toggleAvailability}
          >
            <MaterialIcons 
              name={isAvailable ? "check-circle" : "do-not-disturb-on"} 
              size={20} 
              color={appColors.light} 
            />
            <Text style={styles.availabilityText}>
              {isAvailable ? 'Disponible para citas' : 'No disponible para citas'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Estadísticas rápidas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{myProfile.stats.appointmentsToday}</Text>
            <Text style={styles.statLabel}>Citas hoy</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{myProfile.stats.appointmentsWeek}</Text>
            <Text style={styles.statLabel}>Esta semana</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{myProfile.stats.totalCustomers}</Text>
            <Text style={styles.statLabel}>Clientes</Text>
          </View>
        </View>
        
        {/* Biografía */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="person" size={22} color={appColors.secondary} />
            <Text style={styles.sectionTitle}>Biografía</Text>
          </View>
          <Text style={styles.bioText}>{myProfile.bio}</Text>
        </View>
        
        {/* Información de contacto */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="contact-phone" size={22} color={appColors.secondary} />
            <Text style={styles.sectionTitle}>Información de contacto</Text>
          </View>
          
          <View style={styles.contactItem}>
            <MaterialCommunityIcons name="email-outline" size={20} color={appColors.accent} />
            <Text style={styles.contactText}>{myProfile.email}</Text>
          </View>
          
          <View style={styles.contactItem}>
            <MaterialCommunityIcons name="phone-outline" size={20} color={appColors.accent} />
            <Text style={styles.contactText}>{myProfile.phone}</Text>
          </View>
        </View>
        
        {/* Servicios ofrecidos */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="design-services" size={22} color={appColors.secondary} />
            <Text style={styles.sectionTitle}>Servicios ofrecidos</Text>
            <TouchableOpacity style={styles.editButton}>
              <MaterialIcons name="edit" size={18} color={appColors.accent} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.servicesList}>
            {myProfile.services.map((service, index) => (
              <View key={index} style={styles.serviceTag}>
                <Text style={styles.serviceText}>{service}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Horario */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="clock-time-eight-outline" size={22} color={appColors.secondary} />
            <Text style={styles.sectionTitle}>Mi horario laboral</Text>
            <TouchableOpacity style={styles.editButton}>
              <MaterialIcons name="edit" size={18} color={appColors.accent} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.scheduleList}>
            {myProfile.schedule.map((day, index) => (
              <View key={index} style={styles.scheduleItem}>
                <Text style={styles.dayText}>{day.day}</Text>
                <Text 
                  style={[
                    styles.hoursText, 
                    day.hours === 'Cerrado' && styles.closedText
                  ]}
                >
                  {day.hours}
                </Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Certificaciones */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="certificate" size={22} color={appColors.secondary} />
            <Text style={styles.sectionTitle}>Certificaciones</Text>
          </View>
          
          <View style={styles.certificationsList}>
            {myProfile.certifications.map((cert, index) => (
              <View key={index} style={styles.certItem}>
                <MaterialIcons name="check-circle" size={18} color={appColors.primary} />
                <Text style={styles.certText}>{cert}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Botón de edición completa */}
        <TouchableOpacity style={styles.editProfileButton}>
          <MaterialIcons name="edit" size={20} color={appColors.light} />
          <Text style={styles.editProfileText}>Editar perfil completo</Text>
        </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.light,
  },
  settingsButton: {
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  profileSection: {
    backgroundColor: appColors.light,
    marginTop: -20,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: appColors.primary,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.dark,
  },
  title: {
    fontSize: 14,
    color: appColors.gray,
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 13,
    color: appColors.gray,
  },
  availabilityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  availabilityText: {
    color: appColors.light,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
  },
  statCard: {
    backgroundColor: appColors.light,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: (width - 48) / 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: appColors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: appColors.gray,
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: appColors.light,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.secondary,
    marginLeft: 8,
    flex: 1,
  },
  editButton: {
    padding: 4,
  },
  bioText: {
    fontSize: 14,
    color: appColors.secondary,
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactText: {
    marginLeft: 12,
    fontSize: 14,
    color: appColors.secondary,
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceTag: {
    backgroundColor: `${appColors.accent}15`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 13,
    fontWeight: '500',
    color: appColors.accent,
  },
  scheduleList: {
    marginTop: 4,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dayText: {
    fontSize: 14,
    color: appColors.secondary,
    fontWeight: '500',
  },
  hoursText: {
    fontSize: 14,
    color: appColors.secondary,
  },
  closedText: {
    color: appColors.primary,
  },
  certificationsList: {
    marginTop: 4,
  },
  certItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  certText: {
    marginLeft: 10,
    fontSize: 14,
    color: appColors.secondary,
  },
  editProfileButton: {
    backgroundColor: appColors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  editProfileText: {
    color: appColors.light,
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
});
