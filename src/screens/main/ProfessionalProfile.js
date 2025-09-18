import React, { useState, useRef, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
  Alert,
  StatusBar,
  Animated,
  Platform,
  Modal,
  SafeAreaView,
  Linking,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import colors from '../../constants/colors';

const { width } = Dimensions.get('window');
// Definimos las constantes de altura para la cabecera animada
const HEADER_MAX_HEIGHT = 260;  // Altura máxima del header
const HEADER_MIN_HEIGHT = 60;   // Altura mínima del header al hacer scroll
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

// Mock professional data
const mock = {
  id: 'p1',
  name: 'Ana López Ramírez',
  username: '@ana.styles',
  role: 'Estilista Senior & Colorista',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
  likes: 1240,
  seguidores: 980,
  posts: 24,
  bio: 'Especialista en cortes modernos y coloración personalizada. 10 años de experiencia en salones premium. ✨ Citas disponibles de martes a sábado.',
  website: 'turnogo.com/booking/ana',
  telefono: '+34 612 345 678',
  email: 'ana@turnogo.com',
  disponibilidad: 'Martes a Sábado',
  especialidades: ['Cortes modernos', 'Coloración', 'Peinados de evento'],
  socialMedia: {
    whatsapp: '+34612345678',
    instagram: 'ana.styles',
    facebook: 'AnaLopezEstilista',
    tiktok: 'ana.styles'
  },
  services: [
    { name: 'Corte de Dama', price: '35€', duration: '45 min' },
    { name: 'Coloración', price: '65€', duration: '120 min' },
    { name: 'Balayage', price: '120€', duration: '180 min' },
    { name: 'Tratamiento Capilar', price: '45€', duration: '60 min' },
    { name: 'Peinado para Eventos', price: '55€', duration: '60 min' }
  ],
  products: [
    {
      id: 'prod1',
      name: 'Champú de Keratina',
      price: '18€',
      description: 'Champú profesional con keratina para reparar cabello dañado',
      image: 'https://images.unsplash.com/photo-1617391258031-f8d80b22fb37?w=500&h=500&fit=crop',
      category: 'Cuidado Capilar',
      stock: 15,
      rating: 4.8
    },
    {
      id: 'prod2',
      name: 'Acondicionador Hidratante',
      price: '21€',
      description: 'Acondicionador intensivo para cabello seco y quebradizo',
      image: 'https://images.unsplash.com/photo-1616740244090-224e74401de2?w=500&h=500&fit=crop',
      category: 'Cuidado Capilar',
      stock: 12,
      rating: 4.7
    },
    {
      id: 'prod3',
      name: 'Mascarilla Capilar Repair',
      price: '25€',
      description: 'Tratamiento intensivo semanal para cabello muy dañado',
      image: 'https://images.unsplash.com/photo-1618599538774-0245df7f53d7?w=500&h=500&fit=crop',
      category: 'Tratamientos',
      stock: 8,
      rating: 4.9
    },
    {
      id: 'prod4',
      name: 'Aceite de Argán',
      price: '32€',
      description: 'Aceite natural para dar brillo y proteger las puntas',
      image: 'https://images.unsplash.com/photo-1617391258028-f4763bcabac7?w=500&h=500&fit=crop',
      category: 'Cuidado Capilar',
      stock: 6,
      rating: 4.6
    },
    {
      id: 'prod5',
      name: 'Brocha profesional para tinte',
      price: '9€',
      description: 'Brocha ergonómica para aplicación de tintes',
      image: 'https://images.unsplash.com/photo-1630826028319-41cb9585b89a?w=500&h=500&fit=crop',
      category: 'Accesorios',
      stock: 20,
      rating: 4.4
    },
    {
      id: 'prod6',
      name: 'Protector térmico',
      price: '16€',
      description: 'Spray protector para uso antes del secador o plancha',
      image: 'https://images.unsplash.com/photo-1631469197814-6abc5f6a5b30?w=500&h=500&fit=crop',
      category: 'Styling',
      stock: 14,
      rating: 4.7
    },
  ],
  stories: [
    'https://images.unsplash.com/photo-1524504388940-b1c1140f3f95a?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1520975911209-2c1140f3f95a?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d2dd?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=400&h=400&fit=crop',
  ],
  highlights: [
    { title: 'Cortes', image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=400&fit=crop' },
    { title: 'Color', image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=400&fit=crop' },
    { title: 'Peinados', image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=400&fit=crop' },
    { title: 'Productos', image: 'https://images.unsplash.com/photo-1631730359585-5d3a1ea044c3?w=400&h=400&fit=crop' },
  ],
  photos: [
    { 
      id: 'img1',
      uri: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=600&fit=crop',
      title: 'Coloración personalizada',
      description: 'Técnica de balayage con tonos cobrizos adaptados al tono de piel',
      fecha: '15 ago 2024',
      likes: 124
    },
    { 
      id: 'img2',
      uri: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&h=600&fit=crop',
      title: 'Manicura premium',
      description: 'Diseño exclusivo con acabado gel de larga duración',
      fecha: '12 ago 2024',
      likes: 98
    },
    { 
      id: 'img3',
      uri: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&h=600&fit=crop',
      title: 'Corte bob asimétrico',
      description: 'Estilo moderno con capas texturizadas para mayor volumen',
      fecha: '8 ago 2024',
      likes: 156
    },
    { 
      id: 'img4',
      uri: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=600&fit=crop',
      title: 'Peinado para eventos',
      description: 'Recogido elegante con accesorios para ocasiones especiales',
      fecha: '2 ago 2024',
      likes: 87
    },
    { 
      id: 'img5',
      uri: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&h=600&fit=crop',
      title: 'Tratamiento hidratante',
      description: 'Mascarilla de keratina para cabello dañado por coloración',
      fecha: '28 jul 2024',
      likes: 62
    },
    { 
      id: 'img6',
      uri: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&h=600&fit=crop',
      title: 'Mechas balayage',
      description: 'Técnica natural de aclarado para un efecto de luz sin raíces marcadas',
      fecha: '25 jul 2024',
      likes: 143
    },
    { 
      id: 'img7',
      uri: 'https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=600&h=600&fit=crop',
      title: 'Corte pixie',
      description: 'Estilo corto y versátil con flequillo lateral texturizado',
      fecha: '20 jul 2024',
      likes: 78
    },
    { 
      id: 'img8',
      uri: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&h=600&fit=crop',
      title: 'Ondas playeras',
      description: 'Peinado casual con ondas naturales y textura suave',
      fecha: '15 jul 2024',
      likes: 91
    },
    { 
      id: 'img9',
      uri: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=600&fit=crop',
      title: 'Tinte fantasy',
      description: 'Color fantasía en tonos pasteles con técnica de decoloración suave',
      fecha: '10 jul 2024',
      likes: 115
    },
  ],
};

// Main component 
export default function ProfessionalProfile({ route }) { 
  // Si estamos en la tab, no tendremos route.params, así que usamos directamente el mock
  const professional = route?.params?.professional || mock;
  
  // Garantizamos que siempre tenemos fotos del mock para mostrar
  const photos = mock.photos;
  
  // Agrupar servicios por categoría: si cada servicio tiene .category lo usamos,
  // si no intentamos inferir por palabras clave y si no, los ponemos en 'General'.
  const inferCategoryFromName = (name) => {
    if (!name) return null;
    const n = name.toLowerCase();
    if (n.match(/barber|barba|afeitado|corte/)) return 'Barbería';
    if (n.match(/uña|manicur|pedicur|uñ/)) return 'Belleza';
    if (n.match(/color|balayage|tinte|mechas|coloración/)) return 'Coloración';
    if (n.match(/tratamiento|mascarilla|hidrat/)) return 'Tratamientos';
    if (n.match(/peinad|peinado|recogid/)) return 'Peinados';
    return null;
  };

  const groupServicesByCategory = (services = []) => {
    const map = {};
    services.forEach(s => {
      const cat = s.category || inferCategoryFromName(s.name) || 'General';
      if (!map[cat]) map[cat] = [];
      map[cat].push(s);
    });
    return map;
  };
  
  // Función para obtener el icono apropiado para cada categoría de servicios
  const getServiceCategoryIcon = (category) => {
    const iconSize = 20;
    const iconColor = colors.primary;
    
    // Asignar icono según categoría
    switch (category.toLowerCase()) {
      case 'barbería':
        return <MaterialCommunityIcons name="face-man" size={iconSize} color={iconColor} style={styles.categoryIcon} />;
      case 'corte':
      case 'cortes':
        return <Ionicons name="cut-outline" size={iconSize} color={iconColor} style={styles.categoryIcon} />;
      case 'color':
      case 'coloración':
        return <MaterialCommunityIcons name="palette-outline" size={iconSize} color={iconColor} style={styles.categoryIcon} />;
      case 'tratamiento':
      case 'tratamientos':
        return <MaterialCommunityIcons name="hair-dryer-outline" size={iconSize} color={iconColor} style={styles.categoryIcon} />;
      case 'peinado':
      case 'peinados':
        return <Ionicons name="brush-outline" size={iconSize} color={iconColor} style={styles.categoryIcon} />;
      case 'masaje':
      case 'masajes':
        return <MaterialCommunityIcons name="hand-peace" size={iconSize} color={iconColor} style={styles.categoryIcon} />;
      case 'belleza':
      case 'manicura':
      case 'uñas':
        return <MaterialCommunityIcons name="nail" size={iconSize} color={iconColor} style={styles.categoryIcon} />;
      case 'maquillaje':
        return <MaterialCommunityIcons name="face-woman" size={iconSize} color={iconColor} style={styles.categoryIcon} />;
      case 'facial':
      case 'faciales':
        return <MaterialCommunityIcons name="face-woman-outline" size={iconSize} color={iconColor} style={styles.categoryIcon} />;
      case 'depilación':
        return <MaterialCommunityIcons name="hair-dryer" size={iconSize} color={iconColor} style={styles.categoryIcon} />;
      case 'general':
      default:
        return <Ionicons name="star-outline" size={iconSize} color={iconColor} style={styles.categoryIcon} />;
    }
  };

  const groupedServices = groupServicesByCategory(professional.services || []);
    
  const highlights = Array.isArray(professional.highlights) ? professional.highlights : [];
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('grid');

  // Usar la cabecera normal de la navegación en lugar de construir una a mano
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Perfil Profesional',
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
      },
      headerStyle: {
        backgroundColor: '#ffffff',
        elevation: 1,
        shadowOpacity: 0.1,
      },
      headerTintColor: '#000',
      headerRight: () => (
        <View style={{ flexDirection: 'row', marginRight: 6, alignItems: 'center', height: 44 }}>
          <TouchableOpacity style={{ paddingVertical: 10, paddingHorizontal: 8, marginRight: 6, justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.navigate('ChatScreen', { professional: mock })}>
            <Ionicons name="chatbubble-outline" size={22} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={{ paddingVertical: 10, paddingHorizontal: 8, justifyContent: 'center', alignItems: 'center' }} onPress={handleOptionsPress}>
            <Ionicons name="ellipsis-vertical" size={22} color="#000" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, professional]);
  
  // Estado para el visor de imágenes mejorado
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [likedPhotos, setLikedPhotos] = useState({});
  
  // Referencias y animaciones
  const scrollY = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const modalScale = useRef(new Animated.Value(1)).current;
  
  // Si estamos en el tab, no necesitamos el botón de regreso
  const isInTab = navigation.getState().routes.find(route => route.name === 'ProfessionalView');

  // Animation values
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });
  
  // Mantenemos el perfil siempre visible (valor constante en 1)
  const profileOpacity = 1;

  // Fixed header opacity (appears when scrolling)
  const navOpacity = scrollY.interpolate({
    inputRange: [HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleOptionsPress = () => {
    Alert.alert(
      professional.name,
      undefined,
      [
        { text: 'Compartir perfil', onPress: () => {} },
        { text: 'Copiar URL del perfil', onPress: () => {} },
        { text: 'Añadir a favoritos', onPress: () => {} },
        { text: 'Reportar', style: 'destructive', onPress: () => {} },
        { text: 'Cancelar', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  // Eliminamos la función renderStory ya que no se utiliza

  const renderHighlight = ({ item }) => (
    <View style={styles.highlightContainer}>
      <View style={styles.highlightImageContainer}>
        <Image source={{ uri: item.image }} style={styles.highlightImage} />
      </View>
      <Text style={styles.highlightTitle} numberOfLines={1}>{item.title}</Text>
    </View>
  );
  
  // Manejador de gestos para el modal de fotos
  const panResponder = useRef(
    require('react-native').PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Solo permitir deslizamiento vertical significativo
        return Math.abs(gestureState.dy) > 20 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx) * 1.5;
      },
      onPanResponderMove: (evt, gestureState) => {
        // Deslizamiento desde el borde izquierdo
        if (gestureState.moveX < 60 && gestureState.dx > 0) {
          translateX.setValue(Math.min(gestureState.dx, 250));
          opacity.setValue(1 - (gestureState.dx / 250) * 0.6);
          return;
        }
        
        // Deslizamiento vertical (arriba o abajo)
        if (Math.abs(gestureState.dy) > 10) {
          panY.setValue(gestureState.dy);
          
          // Reducir opacidad y escala mientras se desliza
          const newOpacity = 1 - (Math.abs(gestureState.dy) / 500);
          opacity.setValue(Math.max(newOpacity, 0.5));
          
          const newScale = 1 - (Math.abs(gestureState.dy) / 1000);
          modalScale.setValue(Math.max(newScale, 0.9));
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        // Deslizamiento horizontal desde el borde
        if (gestureState.moveX < 60 && gestureState.dx > 100) {
          // Completar animación de deslizamiento
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: width,
              duration: 200,
              useNativeDriver: true
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true
            })
          ]).start(() => {
            // Cerrar modal
            setPhotoModalVisible(false);
            // Resetear valores después de que el modal se cierre completamente
            setTimeout(() => {
              translateX.setValue(0);
              opacity.setValue(1);
              modalScale.setValue(1);
              panY.setValue(0);
            }, 100);
          });
          return;
        }
        
        // Deslizamiento vertical
        if (Math.abs(gestureState.dy) > 100) {
          // Completar animación de deslizamiento
          Animated.parallel([
            Animated.timing(panY, {
              toValue: gestureState.dy > 0 ? 1000 : -1000,
              duration: 300,
              useNativeDriver: true
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true
            })
          ]).start(() => {
            // Cerrar modal
            setPhotoModalVisible(false);
            // Resetear valores después de que el modal se cierre completamente
            setTimeout(() => {
              panY.setValue(0);
              opacity.setValue(1);
              modalScale.setValue(1);
              translateX.setValue(0);
            }, 100);
          });
        } else {
          // Si no hay suficiente deslizamiento, volver a la posición inicial
          Animated.parallel([
            Animated.spring(panY, {
              toValue: 0,
              useNativeDriver: true
            }),
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true
            }),
            Animated.spring(opacity, {
              toValue: 1,
              useNativeDriver: true
            }),
            Animated.spring(modalScale, {
              toValue: 1,
              useNativeDriver: true
            })
          ]).start();
        }
      }
    })
  ).current;

  // Función para abrir el modal de foto con la nueva UI
  // Variable para manejar el doble tap y el estado expandido de la descripción
  const lastTapRef = useRef(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  
  const handleOpenPhoto = (photo, index) => {
    // Primero establecemos la foto seleccionada
    setSelectedPhoto(photo);
    // Reiniciar el estado de expansión de descripción
    setIsDescriptionExpanded(false);
    // Reiniciar los valores de animación
    opacity.setValue(1);
    modalScale.setValue(1);
    panY.setValue(0);
    translateX.setValue(0);
    // Ahora mostramos el modal
    setPhotoModalVisible(true);
  };

  // Handler para el botón flotante de agregar foto (placeholder)
  const handleAddPhoto = () => {
    Alert.alert('Agregar imagen', 'Aquí puedes implementar la subida o publicación de una nueva imagen.');
  };
  
  // Función para manejar el doble tap en la imagen
  const handleDoubleTap = (photoId) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Es un doble tap, dar like a la foto
      handleLikePhoto(photoId);
      
      // Reset del tiempo para evitar triple tap
      lastTapRef.current = 0;
    } else {
      // Primer tap
      lastTapRef.current = now;
    }
  };
  
  // Función para alternar la expansión de la descripción
  const toggleDescriptionExpansion = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };
  
  // Función para dar like a una foto
  const handleLikePhoto = (photoId) => {
    setLikedPhotos(prev => {
      const newLikedPhotos = { ...prev };
      if (newLikedPhotos[photoId]) {
        delete newLikedPhotos[photoId];
      } else {
        newLikedPhotos[photoId] = true;
      }
      return newLikedPhotos;
    });
  };
  
  // Render tabs
  const renderTabContent = () => {
    switch(activeTab) {
      case 'grid':
        // Verificamos si tenemos fotos válidas
        if (!photos || photos.length === 0) {
          return (
            <View style={styles.noContentContainer}>
              <MaterialCommunityIcons name="image-off" size={56} color="#9CA3AF" />
              <Text style={styles.noContentTitle}>Sin trabajos disponibles</Text>
              <Text style={styles.noContentDesc}>Aquí se mostrarán los trabajos del profesional</Text>
            </View>
          );
        }
        
        // Mostramos las fotos organizadas en filas de 3
        // Añadimos una celda inicial tipo "Agregar" (como crear historia) que dispara handleAddPhoto
        const totalItems = photos.length + 1; // +1 por la celda "Agregar"
        const remainder = totalItems % 3;

        return (
          <View style={styles.gridWrap}>
            {/* Celda para agregar (primera posición) */}
            <TouchableOpacity
              style={styles.gridAddContainer}
              activeOpacity={0.8}
              onPress={handleAddPhoto}
            >
              <View style={styles.gridAddInner}>
                <Ionicons name="add" size={28} color={colors.primary} />
                <Text style={styles.gridAddLabel}>Agregar</Text>
              </View>
            </TouchableOpacity>

            {photos.map((photo, idx) => (
              <TouchableOpacity 
                key={`photo-${idx}`} 
                style={styles.gridImageContainer} 
                activeOpacity={0.9}
                onPress={() => handleOpenPhoto(photo, idx)}
              >
                <Image 
                  source={{ uri: photo.uri }} 
                  style={styles.gridImage}
                  resizeMethod="resize"
                />
                <View style={styles.gridItemOverlay}>
                  <View style={styles.gridItemLikes}>
                    <Ionicons name="thumbs-up" size={14} color="#FFFFFF" />
                    <Text style={styles.gridItemLikesText}>{photo.likes}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {/* Añadimos elementos fantasma para mantener el layout en la última fila */}
            {remainder === 1 && (
              <>
                <View style={[styles.gridImageContainer, {opacity: 0}]} />
                <View style={[styles.gridImageContainer, {opacity: 0}]} />
              </>
            )}
            {remainder === 2 && (
              <View style={[styles.gridImageContainer, {opacity: 0}]} />
            )}
          </View>
        );
      case 'info':
        return (
          <View style={styles.infoTabContainer}>
            {/* Servicios agrupados por categoría - Nuevo diseño moderno */}
            <View style={styles.infoSection}>
              <View style={styles.servicesTitleContainer}>
                <Text style={styles.sectionTitle}>Servicios</Text>
                <TouchableOpacity onPress={() => Alert.alert('Reservar', 'Reservar un turno con este profesional')}>
                  <View style={styles.reserveButton}>
                    <Text style={styles.reserveButtonText}>Reservar</Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFF" />
                  </View>
                </TouchableOpacity>
              </View>
              
              {Object.keys(groupedServices).length === 0 && (
                <View style={styles.emptyServicesContainer}>
                  <Ionicons name="cut-outline" size={40} color="#9CA3AF" />
                  <Text style={styles.emptyServicesText}>No hay servicios publicados.</Text>
                </View>
              )}
              
              {Object.keys(groupedServices).map((category, catIndex) => (
                <View key={`cat-${category}`} style={styles.serviceCategoryBlock}>
                  <View style={styles.categoryHeaderContainer}>
                    {getServiceCategoryIcon(category)}
                    <Text style={styles.serviceCategoryTitle}>{category}</Text>
                  </View>
                  
                  <View style={styles.servicesContainer}>
                    {groupedServices[category].map((service, idx) => (
                      <TouchableOpacity 
                        key={`service-${category}-${idx}`} 
                        style={[
                          styles.serviceCard,
                          idx === groupedServices[category].length - 1 && styles.serviceCardLast
                        ]}
                        onPress={() => Alert.alert('Servicio', `Detalles del servicio: ${service.name}`)}
                      >
                        <View style={styles.serviceContent}>
                          <View style={styles.serviceHeader}>
                            <Text style={styles.serviceName}>{service.name}</Text>
                            <Text style={styles.servicePrice}>{service.price}</Text>
                          </View>
                          <View style={styles.serviceDetails}>
                            <View style={styles.serviceDetail}>
                              <Ionicons name="time-outline" size={14} color="#6B7280" />
                              <Text style={styles.serviceDuration}>{service.duration}</Text>
                            </View>
                            {service.description && (
                              <Text style={styles.serviceDescription} numberOfLines={2}>
                                {service.description}
                              </Text>
                            )}
                          </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" style={styles.serviceArrow} />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </View>
            
            {/* Se eliminaron Disponibilidad y botones de acción por petición del usuario */}
          </View>
        );
      case 'marketplace':
        return (
          <View style={styles.marketplaceContainer}>
            <View style={styles.marketplaceHeader}>
              <Text style={styles.marketplaceTitle}>Productos de venta</Text>
              <Text style={styles.marketplaceSubtitle}>Productos profesionales seleccionados</Text>
            </View>
            
            {/* Filtros por categoría */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesScrollView}
              contentContainerStyle={styles.categoriesContainer}
            >
              {['Todos', 'Cuidado Capilar', 'Tratamientos', 'Styling', 'Accesorios'].map((category, idx) => (
                <TouchableOpacity 
                  key={`cat-${idx}`} 
                  style={styles.categoryPill}
                  onPress={() => Alert.alert('Filtro', `Filtrar por ${category}`)}
                >
                  <Text style={styles.categoryPillText}>{category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {/* Lista de productos */}
            <View style={styles.productsGrid}>
              {(professional.products || []).map((product, idx) => (
                <TouchableOpacity 
                  key={`product-${product.id}`}
                  style={styles.productCard}
                  onPress={() => Alert.alert('Producto', `Ver detalles de ${product.name}`)}
                >
                  <Image 
                    source={{ uri: product.image }} 
                    style={styles.productImage}
                  />
                  <View style={styles.productInfo}>
                    <Text style={styles.productCategory}>{product.category}</Text>
                    <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                    <View style={styles.productPriceRow}>
                      <Text style={styles.productPrice}>{product.price}</Text>
                      
                      <View style={styles.productRating}>
                        <Ionicons name="star" size={12} color="#F59E0B" />
                        <Text style={styles.productRatingText}>{product.rating}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.addToCartButton}
                    onPress={() => Alert.alert('Añadir al carrito', `${product.name} añadido al carrito`)}
                  >
                    <Ionicons name="add" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => Alert.alert('Ver más', 'Ver catálogo completo de productos')}
            >
              <Text style={styles.viewAllButtonText}>Ver todos los productos</Text>
              <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  // Modal de visor de imágenes con gestos y animaciones - estilo Facebook
  const renderPhotoModal = () => (
    <Modal
      visible={photoModalVisible}
      transparent={false}
      animationType="none"
      onRequestClose={() => {
        const closeWithAnimation = () => {
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true
            }),
            Animated.timing(modalScale, {
              toValue: 0.8,
              duration: 200,
              useNativeDriver: true
            })
          ]).start(() => {
            setPhotoModalVisible(false);
            // Resetear valores
            setTimeout(() => {
              opacity.setValue(1);
              modalScale.setValue(1);
              panY.setValue(0);
              translateX.setValue(0);
            }, 100);
          });
        };
        closeWithAnimation();
      }}
      statusBarTranslucent
    >
      <StatusBar barStyle="light-content" backgroundColor="black" translucent />
      
      <View style={styles.photoModalContainer}>
        {selectedPhoto && (
          <Animated.View 
            style={[
              styles.photoModalContent,
              { 
                opacity: opacity,
                transform: [
                  { translateY: panY },
                  { translateX: translateX },
                  { scale: modalScale }
                ]
              }
            ]}
            {...panResponder.panHandlers}
          >
            {/* Barra superior de navegación */}
            <View style={[styles.photoInfoHeader, styles.photoInfoHeaderTop]}>
              <TouchableOpacity 
                style={styles.photoModalCloseButton} 
                onPress={() => {
                  // Animación de cierre
                  Animated.parallel([
                    Animated.timing(opacity, {
                      toValue: 0,
                      duration: 200,
                      useNativeDriver: true
                    }),
                    Animated.timing(modalScale, {
                      toValue: 0.8,
                      duration: 200,
                      useNativeDriver: true
                    })
                  ]).start(() => {
                    setPhotoModalVisible(false);
                    // Resetear valores
                    setTimeout(() => {
                      opacity.setValue(1);
                      modalScale.setValue(1);
                      panY.setValue(0);
                      translateX.setValue(0);
                    }, 100);
                  });
                }}
              >
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              
              <View style={styles.photoIndicator}>
                <Text style={styles.photoIndicatorText}>
                  {photos.findIndex(p => p.id === selectedPhoto.id) + 1}/{photos.length}
                </Text>
              </View>
              
              <TouchableOpacity style={styles.photoModalOptionsButton}>
                <Ionicons name="ellipsis-horizontal" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            {/* Contenedor de imagen fija */}
            <View style={[styles.photoImageFixedContainer, isDescriptionExpanded && styles.photoImageContainerCollapsed]}>
              <FlatList
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                data={photos}
                keyExtractor={item => item.id}
                initialScrollIndex={photos.findIndex(p => p.id === selectedPhoto.id)}
                getItemLayout={(data, index) => ({
                  length: width,
                  offset: width * index,
                  index,
                })}
                onMomentumScrollEnd={(event) => {
                  const index = Math.floor(event.nativeEvent.contentOffset.x / width);
                  if (index >= 0 && index < photos.length) {
                    setSelectedPhoto(photos[index]);
                  }
                }}
                renderItem={({item}) => (
                  <TouchableOpacity 
                    style={styles.photoViewerContainer}
                    activeOpacity={0.9}
                    onPress={() => handleDoubleTap(item.id)}
                  >
                    <Image 
                      source={{ uri: item.uri }} 
                      style={styles.photoViewerImage} 
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                )}
              />
            </View>
            
            {/* Panel de información estilo Facebook - scrolleable independientemente */}
            <ScrollView 
              style={[
                styles.facebookStyleInfoPanel,
                isDescriptionExpanded && styles.facebookStyleInfoPanelExpanded
              ]}
              contentContainerStyle={styles.fbContentContainer}
            >
              {/* Título y fecha */}
              <View style={styles.fbTitleContainer}>
                <Text style={styles.fbPhotoTitle}>{selectedPhoto.title}</Text>
                <Text style={styles.fbDateText}>{selectedPhoto.fecha}</Text>
              </View>
              
              {/* Descripción con ver más si es larga */}
              <Text 
                style={styles.fbPhotoDescription} 
                numberOfLines={isDescriptionExpanded ? undefined : 2}
              >
                {selectedPhoto.description}
              </Text>
              <TouchableOpacity onPress={toggleDescriptionExpansion}>
                <Text style={styles.fbShowMoreText}>
                  {isDescriptionExpanded ? "Ver menos" : "Ver más"}
                </Text>
              </TouchableOpacity>
              
              {/* Contador de likes */}
              <View style={styles.fbLikesContainer}>
                <View style={styles.fbLikeIconContainer}>
                  <Ionicons 
                    name="thumbs-up" 
                    size={16} 
                    color="#FFFFFF" 
                    style={styles.fbLikeIcon}
                  />
                </View>
                <Text style={styles.fbLikesText}>
                  A {likedPhotos[selectedPhoto.id] ? 'ti' : professional.name} y {selectedPhoto.likes} personas más les gusta esto
                </Text>
              </View>
              
              {/* Botones de acción */}
              <View style={styles.fbActionButtonsContainer}>
                <TouchableOpacity 
                  style={styles.fbActionButton}
                  onPress={() => handleLikePhoto(selectedPhoto.id)}
                >
                  <Ionicons 
                    name={likedPhotos[selectedPhoto.id] ? "thumbs-up" : "thumbs-up-outline"} 
                    size={18} 
                    color={likedPhotos[selectedPhoto.id] ? colors.primary : "#FFFFFF"} 
                  />
                  <Text 
                    style={[
                      styles.fbActionButtonText, 
                      likedPhotos[selectedPhoto.id] && {color: colors.primary}
                    ]}
                  >
                    Me gusta
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.fbActionButton}>
                  <Ionicons name="chatbubble-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.fbActionButtonText}>Comentar</Text>
                </TouchableOpacity>
              </View>
              
              {/* Espacio adicional al final */}
              <View style={{height: 10}} />
            </ScrollView>
          </Animated.View>
        )}
      </View>
    </Modal>
  );
  
  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {/* Se eliminó el overlay blanco superior para evitar tapar contenido */}
      {renderPhotoModal()}

      {/* Usar el header nativo del navigator (se muestra mediante navigation.setOptions) */}

      {/* Main scrollable content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header gestionado por la navegación */}
        <View style={styles.header}>
          <View style={[
            styles.profileContainer,
            { paddingTop: Platform.OS === 'ios' ? 12 : (StatusBar.currentHeight ? StatusBar.currentHeight + 6 : 28) }
          ]}>
          {/* Perfil optimizado */}
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <Image source={{ uri: professional.avatar }} style={styles.avatar} />
              <View style={styles.profileHeaderInfo}>
                <Text style={styles.name}>{professional.name}</Text>
                <Text style={styles.role}>{professional.role}</Text>
                
                <View style={styles.statsRow}>
                    <View style={styles.statColumn}>
                      <Text style={styles.statNumber}>{professional.posts}</Text>
                      <Text style={styles.statLabelSmall}>Trabajos</Text>
                    </View>
                    <View style={styles.statColumn}>
                      <Text style={styles.statNumber}>{professional.seguidores}</Text>
                      <Text style={styles.statLabelSmall}>Seguidores</Text>
                    </View>
                </View>
              </View>
            </View>
          </View>
          
          {/* Sobre mí */}
          <View style={styles.bioSection}>
            <Text style={styles.sectionTitle}>Sobre mí</Text>
            <Text style={styles.bio}>{professional.bio}</Text>
          </View>
            
          {/* Información de contacto */}
          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>Contacto</Text>
            <View style={styles.contactGrid}>
              {professional.telefono && (
                <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL(`tel:${professional.telefono}`)}>
                  <View style={styles.contactIconContainer}>
                    <Ionicons name="call" size={20} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.contactCardLabel}>Teléfono</Text>
                    <Text style={styles.contactCardValue}>{professional.telefono}</Text>
                  </View>
                </TouchableOpacity>
              )}
              
              {professional.email && (
                <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL(`mailto:${professional.email}`)}>
                  <View style={styles.contactIconContainer}>
                    <Ionicons name="mail" size={20} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.contactCardLabel}>Email</Text>
                    <Text style={styles.contactCardValue}>{professional.email}</Text>
                  </View>
                </TouchableOpacity>
              )}
              
              {professional.website && (
                <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL(professional.website.startsWith('http') ? professional.website : `https://${professional.website}`)}>
                  <View style={styles.contactIconContainer}>
                    <Ionicons name="globe" size={20} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.contactCardLabel}>Web</Text>
                    <Text style={styles.contactCardValue}>{professional.website}</Text>
                  </View>
                </TouchableOpacity>
              )}
              
              {/* Redes Sociales en la sección de contacto sin título */}
              {professional.socialMedia && (
                <>
                  <View style={{marginTop: 16}} />
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.socialGrid}
                  >
                    {professional.socialMedia?.whatsapp && (
                      <TouchableOpacity 
                        style={styles.socialCard}
                        onPress={() => Linking.openURL(`whatsapp://send?phone=${professional.socialMedia.whatsapp}`)}
                      >
                        <View style={[styles.socialIconContainer, {backgroundColor: 'rgba(37, 211, 102, 0.1)'}]}>
                          <FontAwesome5 name="whatsapp" size={22} color="#25D366" />
                        </View>
                        <Text style={styles.socialName}>WhatsApp</Text>
                      </TouchableOpacity>
                    )}
                    
                    {professional.socialMedia?.instagram && (
                      <TouchableOpacity 
                        style={styles.socialCard}
                        onPress={() => Linking.openURL(`https://instagram.com/${professional.socialMedia.instagram}`)}
                      >
                        <View style={[styles.socialIconContainer, {backgroundColor: 'rgba(225, 48, 108, 0.1)'}]}>
                          <FontAwesome5 name="instagram" size={22} color="#E1306C" />
                        </View>
                        <Text style={styles.socialName}>Instagram</Text>
                      </TouchableOpacity>
                    )}
                    
                    {professional.socialMedia?.facebook && (
                      <TouchableOpacity 
                        style={styles.socialCard}
                        onPress={() => Linking.openURL(`https://facebook.com/${professional.socialMedia.facebook}`)}
                      >
                        <View style={[styles.socialIconContainer, {backgroundColor: 'rgba(59, 89, 152, 0.1)'}]}>
                          <FontAwesome5 name="facebook" size={22} color="#3b5998" />
                        </View>
                        <Text style={styles.socialName}>Facebook</Text>
                      </TouchableOpacity>
                    )}
                    
                    {professional.socialMedia?.tiktok && (
                      <TouchableOpacity 
                        style={styles.socialCard}
                        onPress={() => Linking.openURL(`https://tiktok.com/@${professional.socialMedia.tiktok}`)}
                      >
                        <View style={[styles.socialIconContainer, {backgroundColor: 'rgba(0, 0, 0, 0.05)'}]}>
                          <FontAwesome5 name="tiktok" size={22} color="#000000" />
                        </View>
                        <Text style={styles.socialName}>TikTok</Text>
                      </TouchableOpacity>
                    )}
                  </ScrollView>
                </>
              )}
            </View>
          </View>
          
          {/* Se han eliminado los botones de Seguir y Compartir para la versión de administrador */}
          </View>
        </View>
        
        {/* Content tabs - Estilo rediseñado */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'grid' && styles.activeTabButton]}
            onPress={() => setActiveTab('grid')}
          >
            <Ionicons name="grid-outline" size={20} color={activeTab === 'grid' ? colors.primary : '#9CA3AF'} />
            <Text style={[styles.tabLabel, activeTab === 'grid' && styles.activeTabLabel]}>
              Galería
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'info' && styles.activeTabButton]}
            onPress={() => setActiveTab('info')}
          >
            <Ionicons name="information-circle-outline" size={20} color={activeTab === 'info' ? colors.primary : '#9CA3AF'} />
            <Text style={[styles.tabLabel, activeTab === 'info' && styles.activeTabLabel]}>
              Info
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'marketplace' && styles.activeTabButton]}
            onPress={() => setActiveTab('marketplace')}
          >
            <Ionicons name="cart-outline" size={20} color={activeTab === 'marketplace' ? colors.primary : '#9CA3AF'} />
            <Text style={[styles.tabLabel, activeTab === 'marketplace' && styles.activeTabLabel]}>
              Tienda
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Tab content */}
        <View style={styles.tabContent}>
          {renderTabContent()}
        </View>
        
        {/* Add padding at bottom for safe scroll area */}
        <View style={styles.bottomPadding} />
        {/* Floating Add Image button (visible only in Galería) */}
        {/* FAB removed: we now use the in-grid "Agregar" tile */}
      </ScrollView>
    </View>
  );
}

const AVATAR_SIZE = 86;
const HIGHLIGHT_SIZE = 72;
const GRID_GAP = 1;
const GRID_ITEM = width / 3 - 2;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingTop: 0,
    paddingBottom: 8,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    marginBottom: 10,
  },
  profileContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 6 : 6,
  },
  // topBar removed: using navigation header
  navHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_MIN_HEIGHT,
    backgroundColor: '#FFFFFF',
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 2,
  },
  navBackButton: {
    padding: 8,
  },
  navTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginHorizontal: 15,
  },
  navOptionButton: {
    padding: 8,
  },
  profileInfo: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 20,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
  },
  profileStats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
  },
  statLabel: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 1,
  },
  bioContainer: {
    paddingHorizontal: 15,
    paddingTop: 5,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  role: {
    fontSize: 13,
    color: '#636366',
    marginTop: 1,
  },
  bio: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 19,
    color: '#1C1C1E',
  },
  website: {
    marginTop: 3,
    fontSize: 14,
    color: '#007AFF',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 5,
  },
  followButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingVertical: 7,
    alignItems: 'center',
    marginRight: 8,
  },
  followButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  messageButton: {
    flex: 1,
    backgroundColor: '#EFEFEF',
    borderRadius: 6,
    paddingVertical: 7,
    alignItems: 'center',
    marginRight: 8,
  },
  messageButtonText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 14,
  },
  bookingButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bookingButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: 0.3,
    fontSize: 14,
  },
  highlightsContainer: {
    marginTop: 15,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  highlightContainer: {
    alignItems: 'center',
    marginRight: 15,
    width: HIGHLIGHT_SIZE,
  },
  highlightImageContainer: {
    width: HIGHLIGHT_SIZE,
    height: HIGHLIGHT_SIZE,
    borderRadius: HIGHLIGHT_SIZE / 2,
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
    padding: 3,
    overflow: 'hidden',
  },
  highlightImage: {
    width: '100%',
    height: '100%',
    borderRadius: HIGHLIGHT_SIZE / 2 - 4,
    backgroundColor: '#F2F2F7',
  },
  highlightTitle: {
    fontSize: 12,
    color: '#3C3C43',
    marginTop: 4,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    height: 48,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tabContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gridWrap: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 0,
    justifyContent: 'space-between',
  },
  gridImageContainer: {
    width: width / 3 - 2,
    height: width / 3 - 2,
    margin: 1,
    backgroundColor: '#F2F2F7',
    overflow: 'hidden',
  },
  gridAddContainer: {
    width: width / 3 - 2,
    height: width / 3 - 2,
    margin: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridAddInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridAddLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#374151',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: '#f0f0f0', // Color de fondo mientras carga la imagen
  },
  bottomPadding: {
    height: 36,
  },
  storyItem: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    marginRight: 15,
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  storyBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 45,
  },
  noContentContainer: {
    flex: 1,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noContentTitle: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: '700',
    color: '#3C3C43',
  },
  noContentDesc: {
    marginTop: 8,
    fontSize: 14,
    color: '#8A8A8E',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  noStoriesText: {
    fontSize: 14,
    color: '#8A8A8E',
    marginLeft: 15,
    paddingVertical: 20,
  },
  // Estilos para el modal de foto
  photoModalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  photoModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
    paddingHorizontal: 16,
  },
  photoModalBackButton: {
    padding: 8,
  },
  photoModalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  photoAuthorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  photoAuthorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  photoAuthorInfo: {
    flex: 1,
  },
  photoAuthorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  photoAuthorLocation: {
    fontSize: 12,
    color: '#8E8E93',
  },
  photoAuthorMoreButton: {
    padding: 8,
  },
  photoModalImage: {
    width: '100%',
    height: width,
    backgroundColor: '#F2F2F7',
  },
  photoActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  photoActionsLeft: {
    flexDirection: 'row',
  },
  photoActionButton: {
    marginRight: 16,
  },
  photoStatsContainer: {
    paddingHorizontal: 16,
  },
  photoLikes: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  photoDate: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 6,
  },
  photoCaptionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  photoCaption: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 19,
  },
  photoCaptionName: {
    fontWeight: '600',
  },
  photoCommentsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  photoCommentsCount: {
    fontSize: 14,
    color: '#8E8E93',
    marginVertical: 6,
  },
  photoComment: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  photoCommentText: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
  },
  photoCommentName: {
    fontWeight: '600',
  },
  photoCommentLike: {
    padding: 4,
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
  },
  addCommentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
  },
  addCommentPlaceholder: {
    fontSize: 14,
    color: '#8E8E93',
  },
  
  // Estilos para el grid item overlay
  gridItemOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 6,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  gridItemLikes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridItemLikesText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },

  // Floating action button removed: using in-grid add tile instead
  
  // Nuevo visor de fotos con gestos - estilo Facebook
  photoModalContainer: {
    flex: 1,
    backgroundColor: '#000000',
    flexDirection: 'column',
    position: 'relative',
    margin: 0,
    padding: 0,
  },
  photoModalContent: {
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
    justifyContent: 'space-between',
  },
  photoInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    zIndex: 10,
  },
  photoInfoHeaderTop: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  photoModalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  photoModalOptionsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  photoIndicator: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  photoIndicatorText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  photoImageFixedContainer: {
    height: width,
    backgroundColor: 'transparent',
    marginTop: Platform.OS === 'ios' ? 100 : 80,
    overflow: 'hidden',
    flex: 1,
    justifyContent: 'center',
  },
  photoImageContainerCollapsed: {
    height: width * 0.4, // Al expandir la descripción, reducimos el tamaño de la imagen
  },
  photoViewerContainer: {
    width: width,
    height: width,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    margin: 0,
  },
  photoViewerImage: {
    width: width,
    height: width,
    resizeMode: 'contain',
  },
  // Estilos para el panel de información estilo Facebook
  facebookStyleInfoPanel: {
    backgroundColor: '#000000',
    padding: 12,
    paddingBottom: 8,
    maxHeight: width * 0.7,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  facebookStyleInfoPanelExpanded: {
    maxHeight: undefined,
    top: width * 0.4 + (Platform.OS === 'ios' ? 80 : 60), // Ajustar a la altura de la imagen colapsada
  },
  fbContentContainer: {
    flexGrow: 1, 
    justifyContent: 'flex-start',
    paddingBottom: 8,
  },
  fbTitleContainer: {
    marginBottom: 4,
  },
  fbPhotoTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  fbDateText: {
    color: '#CCCCCC',
    fontSize: 12,
    marginBottom: 6,
  },
  fbPhotoDescription: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 4,
  },
  fbShowMoreText: {
    color: '#CCC',
    fontSize: 14,
    marginBottom: 10,
  },
  fbLikesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 6,
  },
  fbLikeIconContainer: {
    backgroundColor: colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  fbLikeIcon: {
    marginTop: 1,
  },
  fbLikesText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  photoLikeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },
  // Nuevos estilos para Facebook
  fbActionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 4,
    marginBottom: 4,
  },
  fbActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  fbActionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    marginLeft: 6,
    fontWeight: '500',
  },
  fbAdditionalInfo: {
    marginTop: 10,
  },
  fbInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  fbInfoText: {
    color: '#CCCCCC',
    fontSize: 13,
    marginLeft: 8,
  },
  // Viejos estilos que mantenemos por compatibilidad
  bookNowButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  bookNowButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  pagerIndicator: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 3,
  },
  pagerDotActive: {
    backgroundColor: colors.primary,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  
  // Estilos para los botones de acción
  actionButtonIcon: {
    marginRight: 8,
  },
  bookingButton: {
    flex: 1.5,
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  bookingButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  likeButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  likeButtonText: {
    color: '#111111',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 4,
  },
  
  // Estilos para la pestaña Info
  infoTabContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  infoSection: {
    marginBottom: 24,
  },
  // Section title has been unified with sectionTitle style
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specialtyChip: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  specialtyText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  infoIcon: {
    marginRight: 10,
  },
  availabilityText: {
    fontSize: 16,
    color: '#1F2937',
  },
  // Estilos para servicios - Diseño moderno
  servicesTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reserveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  reserveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    marginRight: 6,
  },
  emptyServicesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  emptyServicesText: {
    color: '#6B7280',
    fontSize: 16,
    marginTop: 12,
  },
  serviceCategoryBlock: {
    marginTop: 20,
    marginBottom: 16,
  },
  categoryHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    marginRight: 8,
  },
  serviceCategoryTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  servicesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  serviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  serviceCardLast: {
    borderBottomWidth: 0,
  },
  serviceContent: {
    flex: 1,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 8,
  },
  serviceDetails: {
    flexDirection: 'column',
  },
  serviceDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  serviceDuration: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  serviceArrow: {
    marginLeft: 10,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
  },
  contactButtonIcon: {
    marginRight: 8,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Estilos para la pestaña Calendario
  calendarTabContainer: {
    padding: 16,
  },
  calendarHeader: {
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  calendarMonth: {
    fontSize: 16,
    color: '#6B7280',
  },
  calendarContent: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  calendarDays: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  calendarDayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  calendarGrid: {
    marginBottom: 8,
  },
  calendarWeek: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  calendarDate: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 2,
  },
  calendarDateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  calendarDateTextDisabled: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  calendarDateTextToday: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  calendarDateAvailable: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  calendarDateBooked: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  calendarDateUnavailable: {
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
  },
  calendarDateDisabled: {
    backgroundColor: 'transparent',
  },
  calendarDateToday: {
    backgroundColor: colors.primary,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  checkAvailabilityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
  },
  checkAvailabilityButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  
  // Nuevos estilos para la sección de información de contacto
  contactItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactItemText: {
    fontSize: 15,
    color: '#1F2937',
    marginLeft: 8,
  },
  
  // Estilos para redes sociales
  socialMediaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  socialMediaButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  // Estilos para botones de acción en info
  actionButtonsSection: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  addImageButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  editProfileButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  
  // Estilos para la navegación
  navButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    padding: 8,
    marginRight: 5,
  },
  
  // Estilos para la información de contacto en la cabecera
  contactInfoContainer: {
    marginTop: 16,
    marginBottom: 18,
  },
  contactInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingVertical: 6,
  },
  contactInfoText: {
    fontSize: 16,
    color: '#222222',
    marginLeft: 12,
    fontWeight: '500',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'flex-start',
  },
  socialIconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  chatButton: {
    padding: 8,
    marginRight: 5,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Nuevos estilos para rediseño
  profileCard: {
    padding: 16,
    paddingTop: 6,
    marginTop: 2,
    marginBottom: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  profileHeaderInfo: {
    flex: 1,
    paddingTop: 2,
    marginLeft: 12,
  },
  
  // Estilos para estadísticas
  statsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  statColumn: {
    alignItems: 'flex-start',
    marginRight: 18,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  statLabelSmall: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  
  // Estilos para la sección de bio
  bioSection: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 10,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  
  // Estilos para la sección de contacto
  contactSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    marginBottom: 4,
  },
  contactGrid: {
    marginBottom: 8,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactCardLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 1,
  },
  contactCardValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  
  // Estilos para la sección de redes sociales
  socialSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    marginBottom: 4,
  },
  socialGrid: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  // Estilos para iconos sociales pequeños en el perfil
  socialIconsRow: {
    marginTop: 6,
    maxHeight: 58,
  },
  socialIconsContent: {
    paddingRight: 10,
  },
  socialCardSmall: {
    marginRight: 12,
    alignItems: 'center',
    width: 48,
  },
  socialIconContainerSmall: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
  },
  socialNameSmall: {
    fontSize: 10,
    color: '#111827',
    textAlign: 'center',
  },
  
  // Estilos para redes sociales originales
  socialCard: {
    marginRight: 20,
    alignItems: 'center',
  },
  socialIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  socialName: {
    fontSize: 11,
    color: '#111827',
    textAlign: 'center',
  },
  
  // Estilos para los tabs
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginTop: 0,
    marginBottom: 8,
    marginHorizontal: 16,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  tabLabel: {
    marginLeft: 6,
    fontSize: 14,
    color: '#6B7280',
  },
  activeTabLabel: {
    color: colors.primary,
    fontWeight: '600',
  },
  
  // Estilos para los botones de acción
  followButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    marginRight: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 6,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    marginLeft: 8,
  },
  shareButtonText: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 6,
  },

  // Estilos para la pestaña Marketplace (Tienda)
  marketplaceContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  marketplaceHeader: {
    marginBottom: 16,
  },
  marketplaceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  marketplaceSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  categoriesScrollView: {
    marginBottom: 12,
  },
  categoriesContainer: {
    paddingVertical: 8,
    paddingRight: 8,
  },
  categoryPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryPillText: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '500',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  productInfo: {
    padding: 12,
  },
  productCategory: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    height: 40,
  },
  productPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  productRatingText: {
    fontSize: 11,
    color: '#D97706',
    fontWeight: '600',
    marginLeft: 2,
  },
  addToCartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  viewAllButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});
