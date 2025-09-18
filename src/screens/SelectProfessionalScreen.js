import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Dimensions, 
  Animated, 
  ActivityIndicator,
  TextInput, 
  Platform,
  StatusBar,
  Modal,
  Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { saveSelectedProfessional } from '../store/slices/professionalSlice';
import { Ionicons } from '@expo/vector-icons';
// Importamos colores, pero definimos nuestra propia paleta para esta pantalla
import colors from '../constants/colors';

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
import { LinearGradient } from 'expo-linear-gradient';

// Pantalla de selección de profesionales moderna
export default function SelectProfessionalScreen({ navigation }) {
  const dispatch = useDispatch();
  const [professionals, setProfessionals] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const authUser = useSelector((state) => state.auth.user);
  const windowWidth = Dimensions.get('window').width;
  const numColumns = 2;
  const itemSize = Math.floor((windowWidth - 48 - (numColumns - 1) * 16) / numColumns);
  
  // Animaciones - inicializamos con 0.5 para evitar que estén completamente transparentes
  const headerAnimation = useRef(new Animated.Value(0.5)).current;
  const fadeAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Establecemos valores iniciales para evitar transparencia
    fadeAnim.setValue(0.3);
    headerAnimation.setValue(0.3);
    
    // Animación de entrada con un pequeño retraso para asegurar que se ejecute
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(headerAnimation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        })
      ]).start();
    }, 100);
    
    let mounted = true;
    const loadProfessionals = async () => {
      setLoading(true);
      // limpiar lista previa para evitar duplicados visuales entre mocks y datos reales
      setProfessionals([]);
      try {
        const FirebaseAppService = require('../services/FirebaseAppService').default;
        if (authUser && authUser.uid) {
          const res = await FirebaseAppService.getProfessionalsByBusiness(authUser.uid);
          if (res.success && mounted) {
            if (res.data && res.data.length > 0) {
              setProfessionals(res.data);
              setLoading(false);
              return;
            }
          }
        }

        // Fallback a mocks si no hay datos reales
        if (mounted) {
          setProfessionals([
            { 
              id: 'p1', 
              name: 'María Gómez', 
              title: 'Estilista senior', 
              avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&h=300&auto=format&fit=crop',
              reviews: 124, // Número de citas atendidas
              specialty: 'cortes',
            },
            { 
              id: 'p2', 
              name: 'Carlos Ruiz', 
              title: 'Barbero principal', 
              avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=300&h=300&auto=format&fit=crop',
              reviews: 98,
              specialty: 'barbas',
            },
          ]);
          setLoading(false);
        }
      } catch (error) {
        console.warn('Error cargando profesionales:', error);
        if (mounted) {
          setProfessionals([
            { 
              id: 'p1', 
              name: 'María Gómez', 
              title: 'Estilista senior', 
              avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&h=300&auto=format&fit=crop',
              reviews: 124, // Número de citas atendidas
              specialty: 'cortes',
            },
          ]);
          setLoading(false);
        }
      }
    };

    loadProfessionals();
    return () => { mounted = false; };
  }, [authUser]);

  const select = async (prof) => {
    try {
      // Guardamos el profesional antes de la animación
      await dispatch(saveSelectedProfessional(prof));
      
      // Animación de salida y navegación
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        navigation.replace('Main'); // Redirige a la app principal
      });
    } catch (error) {
      console.error("Error al seleccionar profesional:", error);
      // En caso de error, navegamos directamente
      navigation.replace('Main');
    }
  };

  // Simplemente devolvemos todos los profesionales ya que no tenemos filtros
  const filtered = useMemo(() => {
    return professionals;
  }, [professionals]);
  
  const avatarColor = useCallback((name) => {
    // Genera color basado en el tema de la app
    const colors = [
      '#EF4444', // primary
      '#FB923C', // accent
      '#8B5CF6', // purple
      '#3B82F6', // blue
      '#10B981', // green
    ];
    
    // Asigna un color basado en la primera letra del nombre
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }, []);

  // Helper para renderizar cada tarjeta de profesional (separado para mantener JSX limpio)
  const renderProfessionalItem = ({ item }) => {
    const isSelected = selectedId === item.id;
    const scale = new Animated.Value(1);
    const onPressIn = () => Animated.spring(scale, { toValue: 0.98, useNativeDriver: true }).start();
    const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

    return (
      <AnimatedTouchable
        style={[
          styles.profileCard,
          { 
            width: itemSize,
            transform: [{ scale }],
          },
          isSelected && styles.selectedProfileCard
        ]}
        onPress={() => setSelectedId(item.id)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.85}
      >
        {isSelected && (
          <View style={styles.selectedOverlay}>
            <Ionicons name="checkmark-circle" size={26} color="#fff" />
          </View>
        )}
        
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.avatar }} style={styles.profileAvatar} />
        </View>
        
        <View style={styles.profileContent}>
          <Text style={styles.profileName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.profileRole} numberOfLines={1}>{item.title}</Text>
          
          <View style={styles.profileStats}>
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <Text style={styles.profileStatText}>{item.reviews} citas</Text>
          </View>
        </View>
      </AnimatedTouchable>
    );
  };

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
  const AnimatedView = Animated.createAnimatedComponent(View);

  const headerTranslate = headerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 0],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={appColors.primary} />
      

      
      {/* Header con animación - Ocupando todo el espacio superior */}
      <AnimatedView 
        style={[
          styles.header, 
          { transform: [{ translateY: headerTranslate }], opacity: headerAnimation }
        ]}
      >
        <LinearGradient
          colors={[appColors.primary, appColors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerTextContainer}>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar" size={18} color="#fff" />
              <Text style={styles.dateText}>{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
            </View>
            <Text style={styles.headerTitle}>Equipo de profesionales</Text>
            <Text style={styles.headerSubtitle}>
              Gestiona y visualiza a tu equipo de trabajo
            </Text>
          </View>
        </LinearGradient>
      </AnimatedView>
      


      
      {/* Lista de profesionales */}
      <Animated.View style={{ flex: 1, opacity: 1 }}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={appColors.primary} />
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            numColumns={numColumns}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={renderProfessionalItem}
          />
        )}
      </Animated.View>

      <View style={styles.bottomBar} pointerEvents={selectedId ? 'auto' : 'none'}>
        <TouchableOpacity
          style={[styles.confirmButton, !selectedId && { backgroundColor: '#E2E8F0' }]}
          onPress={() => {
            if (!selectedId) return;
            const prof = professionals.find(p => p.id === selectedId);
            select(prof);
          }}
          activeOpacity={0.8}
        >
          <Ionicons 
            name="log-in-outline" 
            size={20} 
            color={selectedId ? appColors.light : appColors.gray} 
            style={{ marginRight: 8 }} 
          />
          <Text style={[styles.confirmText, !selectedId && { color: appColors.gray }]}>
            Iniciar sesión con este perfil
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: appColors.background },
  header: { 
    paddingTop: 0,
    height: Platform.OS === 'ios' ? 140 : 120,
  },
  headerTextContainer: { 
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
  },

  headerGradient: { 
    width: '100%', 
    height: '100%',
    alignItems: 'center', 
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 45 : 24,
    paddingBottom: 20,
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: appColors.light,
    marginBottom: 8,
  },
  headerSubtitle: { 
    fontSize: 15, 
    color: 'rgba(255,255,255,0.9)', 
    paddingHorizontal: 16, 
    textAlign: 'center' 
  },
  
  // Lista
  listContainer: { padding: 16, paddingTop: 24 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 20 },
  
  // Tarjetas de perfil
  profileCard: { 
    borderRadius: 16, 
    backgroundColor: appColors.light, 
    shadowColor: appColors.dark, 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    elevation: 4, 
    overflow: 'hidden',
    padding: 16,
    alignItems: 'center'
  },
  selectedProfileCard: { 
    borderWidth: 2, 
    borderColor: appColors.primary,
    backgroundColor: 'rgba(229, 62, 62, 0.05)'
  },
  selectedOverlay: { 
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: appColors.primary,
    borderRadius: 15,
    padding: 2,
    zIndex: 10
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    shadowColor: appColors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: appColors.light,
    borderWidth: 2,
    borderColor: 'rgba(229, 62, 62, 0.15)', // Un borde sutil con el color primario
  },
  profileAvatar: { 
    width: 76, 
    height: 76, 
    borderRadius: 38
  },
  profileContent: { 
    alignItems: 'center',
    width: '100%'
  },
  profileName: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: appColors.dark,
    marginBottom: 4,
    textAlign: 'center'
  },
  profileRole: { 
    fontSize: 14, 
    color: appColors.gray, 
    marginBottom: 8,
    textAlign: 'center'
  },

  profileStats: { 
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: appColors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  profileStatText: { 
    fontSize: 12, 
    fontWeight: '500', 
    color: appColors.gray, 
    marginLeft: 6 
  },
  
  // Botón inferior
  bottomBar: { 
    position: 'absolute', 
    left: 0, 
    right: 0, 
    bottom: 16, 
    paddingHorizontal: 16, 
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  confirmButton: { 
    backgroundColor: appColors.secondary,
    flexDirection: 'row',
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: appColors.dark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5
  },
  confirmText: { 
    color: appColors.light, 
    fontWeight: '600', 
    fontSize: 16 
  },

});
