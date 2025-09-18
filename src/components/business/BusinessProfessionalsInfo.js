import React, { useState, useRef, useCallback } from 'react';
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
  StatusBar,
  Platform,
  ScrollView,
  Linking,
  ToastAndroid,
  Alert,
  Clipboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BusinessHeader from './BusinessHeader';
import BusinessStories from './BusinessStories';

const { width } = Dimensions.get('window');

// Usar la paleta de colores de la aplicación
import colors from '../../constants/colors';

const appColors = {
  primary: colors.primary,    // '#EF4444'
  secondary: colors.text,     // '#111827'
  dark: colors.text,          // '#111827'
  light: colors.background,   // '#FFFFFF'
  background: colors.surface, // '#F9FAFB'
  gray: colors.muted,         // '#6B7280'
  accent: colors.accent,      // '#FB923C'
};

// Mock professionals data
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
];

// Business Info Mock Data
const businessHours = [
  { day: 'Lunes', hours: '9:00 AM - 7:00 PM', isOpen: true },
  { day: 'Martes', hours: '9:00 AM - 7:00 PM', isOpen: true },
  { day: 'Miércoles', hours: '9:00 AM - 7:00 PM', isOpen: true },
  { day: 'Jueves', hours: '9:00 AM - 7:00 PM', isOpen: true },
  { day: 'Viernes', hours: '9:00 AM - 8:00 PM', isOpen: true },
  { day: 'Sábado', hours: '8:00 AM - 6:00 PM', isOpen: true },
  { day: 'Domingo', hours: 'Cerrado', isOpen: false },
];

const contactInfo = [
  { icon: 'call', label: 'Teléfono', value: '+57 300 123 4567', action: 'call', copyable: true },
  { icon: 'logo-whatsapp', label: 'WhatsApp', value: '+57 300 123 4567', action: 'whatsapp', copyable: true },
  { icon: 'mail', label: 'Email', value: 'info@misalon.com', action: 'email', copyable: true },
  { icon: 'location', label: 'Dirección', value: 'Calle 123 #45-67, Bogotá', action: 'map', copyable: true },
];

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
  }
];

const ProfessionalCard = ({ item }) => {
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
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.cardContent}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.role}>{item.role}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const InfoSection = ({ title, icon, children }) => (
  <View style={styles.infoSection}>
    <View style={styles.infoSectionHeader}>
      <Ionicons name={icon} size={18} color={colors.primary} />
      <Text style={styles.infoSectionTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

// Función para renderizar estrellas
const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, index) => (
    <Ionicons
      key={index}
      name={index < rating ? "star" : "star-outline"}
      size={14}
      color={index < rating ? "#F59E0B" : "#D1D5DB"}
    />
  ));
};

const BusinessProfessionalsInfo = ({ businessData }) => {
  const [professionals] = useState(mockProfessionals);
  const navigation = useNavigation();
  
  // Referencias para las secciones
  const scrollViewRef = useRef(null);
  
  // Estado para la pestaña activa
  const [activeSection, setActiveSection] = useState('professionals');
  
  // Función para manejar las acciones de contacto
  const handleContactAction = (type, value) => {
    switch (type) {
      case 'call':
        Linking.openURL(`tel:${value}`);
        break;
      case 'whatsapp':
        // Formatear el número para WhatsApp (eliminar espacios y +)
        const whatsappNumber = value.replace(/\s+/g, '').replace('+', '');
        const message = encodeURIComponent('Hola, estoy interesado en sus servicios...');
        Linking.openURL(`https://wa.me/${whatsappNumber}?text=${message}`);
        break;
      case 'email':
        Linking.openURL(`mailto:${value}?subject=Consulta%20de%20Servicios`);
        break;
      case 'map':
        // Abrir la ubicación en el navegador utilizando Google Maps
        const encodedAddress = encodeURIComponent(value);
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`);
        break;
      default:
        break;
    }
  };
  
  // Función para copiar al portapapeles
  const copyToClipboard = (value) => {
    Clipboard.setString(value);
    
    // Mostrar mensaje de confirmación según la plataforma
    if (Platform.OS === 'android') {
      ToastAndroid.show('Copiado al portapapeles', ToastAndroid.SHORT);
    } else {
      Alert.alert('Copiado', 'Texto copiado al portapapeles');
    }
  };
  
  // Estado para guardar las posiciones Y de cada sección
  const [sectionPositions, setSectionPositions] = React.useState({
    professionals: 0,
    hours: 0,
    contact: 0,
    services: 0,
    reviews: 0
  });
  
  // Función para capturar la posición de una sección cuando se renderiza
  const handleLayout = (section) => (event) => {
    const { y } = event.nativeEvent.layout;
    setSectionPositions(prev => ({
      ...prev,
      [section]: y
    }));
  };
  
  // Función para scrollear a una sección
  const scrollToSection = (sectionName) => {
    setActiveSection(sectionName);
    
    // Obtener la posición Y guardada para esta sección
    const yPosition = sectionPositions[sectionName];
    
    // Scroll a la sección
    if (scrollViewRef.current && yPosition !== undefined) {
      scrollViewRef.current.scrollTo({ 
        y: yPosition - 70, 
        animated: true 
      });
    }
  };
  
  // Detectar sección visible durante scroll
  const handleScroll = useCallback((event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    
    // Calcular qué sección está más cerca de la parte superior visible
    const visiblePosition = scrollPosition + 100; // offset para mejor UX
    
    let closestSection = 'professionals';
    let minDistance = Infinity;
    
    Object.entries(sectionPositions).forEach(([section, position]) => {
      if (position !== undefined) {
        const distance = Math.abs(position - visiblePosition);
        if (distance < minDistance) {
          minDistance = distance;
          closestSection = section;
        }
      }
    });
    
    if (activeSection !== closestSection) {
      setActiveSection(closestSection);
    }
  }, [activeSection, sectionPositions]);

  return (
    <View style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false} 
        onScroll={handleScroll}
        scrollEventThrottle={16}
        stickyHeaderIndices={[2]} // El índice 2 corresponde a las pestañas después del Header y Stories
      >
        {/* Header del negocio */}
        <BusinessHeader businessData={businessData} showAvatar={false} />
        
        {/* Stories/Highlights */}
        <BusinessStories />
        
        {/* Pestañas flotantes - este componente se quedará fijo */}
        <View style={styles.stickyTabsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 8,
              alignItems: 'center',
            }}
          >
            <TouchableOpacity 
              style={[styles.tabButton, activeSection === 'professionals' && styles.activeTabButton]} 
              onPress={() => scrollToSection('professionals')}
            >
              <Ionicons 
                name="people-outline" 
                size={16} 
                color={activeSection === 'professionals' ? '#FFFFFF' : '#64748B'} 
                style={{marginRight: 6}}
              />
              <Text style={[styles.tabText, activeSection === 'professionals' && styles.activeTabText]}>Profesionales</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabButton, activeSection === 'hours' && styles.activeTabButton]} 
              onPress={() => scrollToSection('hours')}
            >
              <Ionicons 
                name="time-outline" 
                size={16} 
                color={activeSection === 'hours' ? '#FFFFFF' : '#64748B'} 
                style={{marginRight: 6}}
              />
              <Text style={[styles.tabText, activeSection === 'hours' && styles.activeTabText]}>Horarios</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabButton, activeSection === 'contact' && styles.activeTabButton]} 
              onPress={() => scrollToSection('contact')}
            >
              <Ionicons 
                name="call-outline" 
                size={16} 
                color={activeSection === 'contact' ? '#FFFFFF' : '#64748B'} 
                style={{marginRight: 6}}
              />
              <Text style={[styles.tabText, activeSection === 'contact' && styles.activeTabText]}>Contacto</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabButton, activeSection === 'services' && styles.activeTabButton]} 
              onPress={() => scrollToSection('services')}
            >
              <Ionicons 
                name="pricetag-outline" 
                size={16} 
                color={activeSection === 'services' ? '#FFFFFF' : '#64748B'} 
                style={{marginRight: 6}}
              />
              <Text style={[styles.tabText, activeSection === 'services' && styles.activeTabText]}>Servicios</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabButton, activeSection === 'reviews' && styles.activeTabButton]} 
              onPress={() => scrollToSection('reviews')}
            >
              <Ionicons 
                name="star-outline" 
                size={16} 
                color={activeSection === 'reviews' ? '#FFFFFF' : '#64748B'} 
                style={{marginRight: 6}}
              />
              <Text style={[styles.tabText, activeSection === 'reviews' && styles.activeTabText]}>Reseñas</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        
        {/* Contenedor principal unificado */}
        <View style={styles.sectionContainer}>
          {/* Sección Profesionales */}
          <View style={styles.section} onLayout={handleLayout('professionals')}>
            <InfoSection title="Profesionales" icon="people-outline">
              <View style={styles.professionalGrid}>
                {professionals.map((professional) => (
                  <View key={professional.id} style={styles.professionalColumn}>
                    <ProfessionalCard item={professional} />
                  </View>
                ))}
              </View>
            </InfoSection>
          </View>
          
          {/* Sección Horarios */}
          <View style={styles.section} onLayout={handleLayout('hours')}>
            <InfoSection title="Horario de Atención" icon="time-outline">
              <View style={styles.scheduleContainer}>
                {businessHours.map((schedule, index) => (
                  <View key={index} style={styles.scheduleRow}>
                    <Text style={styles.dayText}>{schedule.day}</Text>
                    <Text style={[
                      styles.hoursText,
                      !schedule.isOpen && styles.closedText
                    ]}>
                      {schedule.hours}
                    </Text>
                  </View>
                ))}
              </View>
            </InfoSection>
          </View>
          
          {/* Sección Contacto */}
          <View style={styles.section} onLayout={handleLayout('contact')}>
            <InfoSection title="Contacto" icon="call-outline">
              <View style={styles.contactContainer}>
                {contactInfo.map((contact, index) => (
                  <View key={index} style={styles.contactRow}>
                    <TouchableOpacity 
                      style={styles.contactIcon}
                      onPress={() => handleContactAction(contact.action, contact.value)}
                    >
                      <Ionicons name={contact.icon} size={18} color={colors.primary} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={{flex: 1}}
                      onPress={() => contact.copyable && copyToClipboard(contact.value)}
                    >
                      <View>
                        <Text style={styles.contactLabel}>{contact.label}</Text>
                        <Text style={styles.contactValue}>{contact.value}</Text>
                        
                        {/* Añadir botón "Cómo llegar" para la dirección */}
                        {contact.action === 'map' && (
                          <TouchableOpacity 
                            style={styles.directionsButton}
                            onPress={() => handleContactAction('map', contact.value)}
                          >
                            <Ionicons name="navigate-outline" size={14} color="#FFFFFF" style={{marginRight: 4}} />
                            <Text style={styles.directionsButtonText}>Cómo llegar</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </TouchableOpacity>
                    
                    {/* Icono para indicar que se puede copiar */}
                    {contact.copyable && (
                      <TouchableOpacity 
                        style={styles.copyButton}
                        onPress={() => copyToClipboard(contact.value)}
                      >
                        <Ionicons name="copy-outline" size={16} color={colors.muted} />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            </InfoSection>
          </View>
          
          {/* Sección Servicios */}
          <View style={styles.section} onLayout={handleLayout('services')}>
            <InfoSection title="Servicios Populares" icon="pricetag-outline">
              <View style={styles.servicesContainer}>
                {[
                  { name: 'Corte de Cabello', price: '$25.000', duration: '30 min' },
                  { name: 'Manicura', price: '$18.000', duration: '45 min' },
                  { name: 'Pedicura', price: '$22.000', duration: '60 min' },
                ].map((service, index) => (
                  <View key={index} style={styles.serviceRow}>
                    <View style={styles.serviceInfo}>
                      <Text style={styles.serviceName}>{service.name}</Text>
                      <Text style={styles.serviceDuration}>{service.duration}</Text>
                    </View>
                    <Text style={styles.servicePrice}>{service.price}</Text>
                  </View>
                ))}
                <TouchableOpacity style={styles.viewAllServices}>
                  <Text style={styles.viewAllServicesText}>Ver todos los servicios</Text>
                  <Ionicons name="chevron-forward" size={14} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </InfoSection>
          </View>
          
          {/* Sección Reseñas - Rediseñada */}
          <View style={styles.section} onLayout={handleLayout('reviews')}>
            <InfoSection title="Reseñas y Opiniones" icon="star-outline">
              <View style={styles.reviewsContainer}>
                {/* Resumen de calificaciones */}
                <View style={styles.ratingSummary}>
                  <View style={styles.ratingCircle}>
                    <Text style={styles.ratingNumber}>4.8</Text>
                  </View>
                  <View style={styles.ratingDetails}>
                    <View style={styles.starsRow}>
                      {renderStars(5)}
                    </View>
                    <Text style={styles.totalReviews}>Basado en {reviews.length} reseñas</Text>
                  </View>
                </View>
                
                {/* Lista de reseñas */}
                <View style={styles.reviewsList}>
                  {reviews.slice(0, 1).map(review => (
                    <View key={review.id} style={styles.reviewCard}>
                      <View style={styles.reviewHeader}>
                        <Image source={{ uri: review.avatar }} style={styles.reviewerAvatar} />
                        <View style={styles.reviewerInfo}>
                          <Text style={styles.reviewerName}>{review.user}</Text>
                          <View style={styles.reviewMeta}>
                            <View style={styles.reviewStars}>{renderStars(review.rating)}</View>
                            <Text style={styles.reviewService}>{review.service}</Text>
                          </View>
                        </View>
                      </View>
                      <Text style={styles.reviewComment}>{review.comment}</Text>
                    </View>
                  ))}
                </View>
                
                <TouchableOpacity 
                  style={styles.viewAllReviewsButton}
                  onPress={() => navigation.navigate('BusinessReviews')}
                >
                  <Text style={styles.viewAllReviewsText}>Ver todas las reseñas</Text>
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </InfoSection>
          </View>
        </View>
        {/* Espacio al final para el scroll */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  // Contenedor para las pestañas sticky
  stickyTabsContainer: {
    backgroundColor: colors.background,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    zIndex: 10,
    elevation: 3, // Sombra en Android
    shadowColor: "#000", // Sombra en iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    justifyContent: 'center', // Centra verticalmente
  },
  // Contenido del scroll
  scrollContent: {
    paddingTop: 0,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10, // Aumentamos el padding vertical
    paddingHorizontal: 18, // Aumentamos el padding horizontal
    marginRight: 12, // Más espacio entre pestañas
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    shadowColor: "#000", // Añadimos sombra sutil
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1, // Sombra sutil en Android
  },
  activeTabButton: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '700', // Hacemos el texto activo un poco más bold
  },
  sectionContainer: {
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: appColors.light,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    shadowColor: appColors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  section: {
    marginBottom: 20,
  },
  professionalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  professionalColumn: {
    width: '48%',
    marginBottom: 12,
  },
  card: {
    backgroundColor: appColors.light,
    borderRadius: 12,
    padding: 12,
    shadowColor: appColors.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    alignItems: 'center',
    height: 170,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: `rgba(${parseInt(colors.primary.slice(1, 3), 16)}, ${parseInt(colors.primary.slice(3, 5), 16)}, ${parseInt(colors.primary.slice(5, 7), 16)}, 0.15)`,
  },
  cardContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.dark,
    textAlign: 'center',
    marginBottom: 4,
  },
  role: {
    fontSize: 13,
    color: appColors.gray,
    textAlign: 'center',
  },
  
  // Info Section Styles
  infoSection: {
    marginBottom: 22,
  },
  infoSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoSectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: appColors.secondary,
    marginLeft: 8,
  },
  
  // Schedule Styles
  scheduleContainer: {
    backgroundColor: 'rgba(249, 250, 251, 0.4)',
    borderRadius: 8,
    padding: 10,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: appColors.secondary,
  },
  hoursText: {
    fontSize: 14,
    color: appColors.gray,
  },
  closedText: {
    color: appColors.primary,
  },
  
  // Contact Styles
  contactContainer: {
    backgroundColor: 'rgba(249, 250, 251, 0.4)',
    borderRadius: 8,
    padding: 10,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contactIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `rgba(${parseInt(colors.primary.slice(1, 3), 16)}, ${parseInt(colors.primary.slice(3, 5), 16)}, ${parseInt(colors.primary.slice(5, 7), 16)}, 0.12)`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  contactLabel: {
    fontSize: 12,
    color: appColors.gray,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '500',
    color: appColors.secondary,
    marginBottom: 4,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  directionsButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  copyButton: {
    padding: 8,
    marginLeft: 4,
  },
  
  // Services Styles
  servicesContainer: {
    backgroundColor: 'rgba(249, 250, 251, 0.4)',
    borderRadius: 8,
    padding: 10,
  },
  
  // Reviews Styles - Rediseñados
  reviewsContainer: {
    backgroundColor: 'rgba(249, 250, 251, 0.5)',
    borderRadius: 12,
    padding: 16,
  },
  ratingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 231, 235, 0.8)',
  },
  ratingCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  ratingNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ratingDetails: {
    flex: 1,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  totalReviews: {
    fontSize: 13,
    color: colors.muted,
  },
  reviewsList: {
    marginBottom: 16,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'rgba(229, 231, 235, 0.6)',
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  reviewStars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  reviewService: {
    fontSize: 12,
    color: colors.muted,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  reviewComment: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  viewAllReviewsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  viewAllReviewsText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '500',
    color: appColors.secondary,
    marginBottom: 2,
  },
  serviceDuration: {
    fontSize: 12,
    color: appColors.gray,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  viewAllServices: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 8,
  },
  viewAllServicesText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginRight: 4,
  },
  bottomSpacing: {
    height: 140,
  },
});

export default BusinessProfessionalsInfo;
