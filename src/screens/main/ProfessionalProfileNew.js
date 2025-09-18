import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Animated,
  Platform,
  Dimensions,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Importar componentes
import ProfileHeader from '../../components/ProfileHeader';
import BookyStyleTabs from '../../components/BookyStyleTabs';
import GalleryTab from '../../components/GalleryTab';
import GalleryTabRedux from '../../components/GalleryTabRedux'; // Nueva versión con Redux
import InfoTab from '../../components/InfoTab';
import ServicesTab from '../../components/ServicesTab';
import ServicesTabNew from '../../components/ServicesTabNew';
import StoreTab from '../../components/StoreTab';
import StoreTabNew from '../../components/StoreTabNew';
import ImageUploaderReduxContainer from '../../components/ImageUploaderReduxContainer';

// Datos de ejemplo
import { professionalData } from '../../data/mockProfessionalData';

const { width } = Dimensions.get('window');

// Definimos las constantes de altura para la cabecera animada
const HEADER_HEIGHT = 300; // Altura total del header
const TAB_HEIGHT = 50;     // Altura de la barra de pestañas

const ProfessionalProfileNew = ({ route, initialTab = 'gallery' }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);
  const tabBarYRef = useRef(0);
  const tabBarHeightRef = useRef(0);
  const contentHeightRef = useRef(0);
  const scrollViewHeightRef = useRef(0);
  const extraSpaceTimeoutRef = useRef(null);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [addRequestCount, setAddRequestCount] = useState(0);
  const [extraBottomSpace, setExtraBottomSpace] = useState(0);
  const [imageUploaderVisible, setImageUploaderVisible] = useState(false);
  
  // Datos del profesional (de props o mock)
  const professional = route?.params?.professional || professionalData;
  
  // Si viene un parámetro específico para la pestaña, la activamos
  useEffect(() => {
    if (route?.params?.tab) {
      setActiveTab(route.params.tab);
    }
  }, [route?.params?.tab]);
  
  // Configuramos la navegación
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Lista de pestañas
  const tabs = [
    { id: 'gallery', title: 'Galería', icon: 'grid-outline' },
    { id: 'info', title: 'Info', icon: 'information-circle-outline' },
    { id: 'services', title: 'Servicios', icon: 'cut-outline' },
    { id: 'store', title: 'Tienda', icon: 'cart-outline' },
  ];

  // Maneja la pulsación de pestañas con scroll programático
  const handleTabPress = (id) => {
    setActiveTab(id);

    // Si no es la galería, subimos para que las pestañas queden debajo del header
    if (id !== 'gallery' && scrollRef.current) {
      // header is now rendered above the ScrollView (in-flow), so tabBarYRef is already relative to ScrollView
      let targetY = Math.max(0, tabBarYRef.current);
      // clamp to max scrollable offset so scrollTo works even on short content
      const contentH = contentHeightRef.current || 0;
      const viewportH = scrollViewHeightRef.current || 0;
      const maxScroll = Math.max(0, contentH - viewportH);
      if (targetY > maxScroll) {
        // Need extra bottom space so we can scroll to targetY — set a temporary spacer and then scroll
        const delta = targetY - maxScroll + 16; // a small buffer
        setExtraBottomSpace(delta);
        // wait a frame for layout to update then scroll
        setTimeout(() => {
          try {
            scrollRef.current && scrollRef.current.scrollTo({ y: targetY, animated: true });
          } catch (e) {}
        }, 100);
        // clear the extra space after a short delay to avoid permanent layout change
        if (extraSpaceTimeoutRef.current) clearTimeout(extraSpaceTimeoutRef.current);
        extraSpaceTimeoutRef.current = setTimeout(() => setExtraBottomSpace(0), 1100);
      } else {
        setExtraBottomSpace(0);
        try {
          scrollRef.current.scrollTo({ y: targetY, animated: true });
        } catch (e) {}
      }
    } else if (id === 'gallery' && scrollRef.current) {
      // Si selecciona Galería, regresamos a la posición inicial para mostrar la galería
      setExtraBottomSpace(0);
      try {
        scrollRef.current.scrollTo({ y: 0, animated: true });
      } catch (e) {
        // ignore
      }
    }
  };

  // (Sticky handled by ScrollView's stickyHeaderIndices for smoother native behavior)

  // Renderiza el contenido de la pestaña activa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'gallery':
  return <GalleryTab photos={professional.photos} professional={professional} />;
      case 'info':
        return <InfoTab professional={professional} />;
      case 'services':
        return <ServicesTabNew services={professional.services} />;
      case 'store':
        return <StoreTabNew products={professional.products} />;
      default:
  return <GalleryTab photos={professional.photos} professional={professional} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

  {/* Barra de navegación superior (in-flow, respects safe area) */}
  <View style={[styles.animatedHeader, { paddingTop: insets.top }]}>
        <View style={styles.headerTitleLeft}>
          <Text style={styles.headerTitleText}>{professional.name}</Text>
        </View>
  <View style={styles.headerActions}
  >
          {/* Instagram-like add images icon (rounded) */}
          <TouchableOpacity
            style={[styles.headerAddButton, styles.headerIconOffset]}
            onPress={() => {
              setActiveTab('gallery');
              // Abrimos el selector de imágenes mejorado
              setImageUploaderVisible(true);
              try { scrollRef.current && scrollRef.current.scrollTo({ y: 0, animated: true }); } catch (e) {}
            }}
          >
            <MaterialCommunityIcons name="camera-plus-outline" size={24} color="#111827" />
          </TouchableOpacity>

            <TouchableOpacity
              style={[styles.headerButton, styles.headerIconInline, styles.headerIconLarge]}
              onPress={() => navigation.navigate('ChatScreen', { professional: professional })}
            >
              <Ionicons name="chatbubble-outline" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerButton, styles.headerIconInline, styles.headerIconLarge]}
            >
              <Ionicons name="ellipsis-vertical" size={24} color="#000" />
            </TouchableOpacity>
        </View>
      </View>

      {/* Contenedor de Scroll principal */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        ref={scrollRef}
        contentContainerStyle={{}}
        stickyHeaderIndices={[1]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        onContentSizeChange={(w, h) => {
          contentHeightRef.current = h;
        }}
        onLayout={(e) => {
          scrollViewHeightRef.current = e.nativeEvent.layout.height;
        }}
      >
        {/* Header con información del profesional */}
        <ProfileHeader 
          professional={professional} 
          onPressEdit={() => {}}
        />

        {/* Pestañas fijas (no flotantes) */}
        {/* Tab bar placeholder and actual tab bar (sticky behavior) */}
        <View
          onLayout={(e) => {
            tabBarYRef.current = e.nativeEvent.layout.y;
            tabBarHeightRef.current = e.nativeEvent.layout.height;
          }}
        >
          <View style={styles.tabBar}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabButton,
                  activeTab === tab.id && styles.activeTabButton
                ]}
                onPress={() => handleTabPress(tab.id)}
              >
                  <Text style={[
                    styles.tabLabel, 
                    activeTab === tab.id && styles.activeTabLabel
                  ]}>
                    {tab.title}
                  </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* sticky is rendered outside the ScrollView for true fixed positioning */}

        {/* Contenido de la pestaña actual */}
        <View style={styles.tabContent}>
          {/* Pass addRequestCount to gallery so header button can trigger add flow */}
          {activeTab === 'gallery' ? (
            <GalleryTabRedux 
              photos={professional.photos} 
              professional={professional} 
              onAddPhoto={() => setImageUploaderVisible(true)}
              addRequestCount={addRequestCount} 
            />
          ) : (
            renderTabContent()
          )}
        </View>
        
        {/* Espacio de padding inferior */}
        <View style={{ height: extraBottomSpace }} />
        <View style={{ height: 24 }} />
      </Animated.ScrollView>
      {/* tabs now use ScrollView.stickyHeaderIndices for native sticky behavior */}
      
      {/* Modal para subir imágenes con Redux */}
      <ImageUploaderReduxContainer
        visible={imageUploaderVisible}
        onClose={() => setImageUploaderVisible(false)}
        onSave={() => {
          // Incrementamos el contador para que GalleryTab sepa que hay una nueva imagen
          setAddRequestCount(c => c + 1);
        }}
        title="Añadir a tu galería"
        aspectRatio={[4, 5]} // Relación de aspecto Instagram
        purpose="gallery"
        professionalId={professional?.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  animatedHeader: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 6,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    paddingVertical: 12,
    /* remove margin so header sits flush with content and avoid bezel effect */
    marginBottom: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  headerTitleLeft: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 4,
    marginLeft: 4,
    marginRight: 4,
  },
  headerIconInline: {
    marginLeft: 2,
    marginRight: 2,
    alignSelf: 'center',
  },
  headerIconOffset: {
    marginTop: -4,
  },
  headerIconLarge: {
    transform: [{ scale: 1.05 }],
  },
  headerAddButton: {
    borderRadius: 6,
    padding: 4,
    marginRight: 6,
    marginLeft: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 0,
    borderTopColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tabBarSticky: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 200,
    elevation: 6,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
  },
  tabLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  activeTabLabel: {
    color: '#2196F3',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 10,
    marginTop: 4,
    color: '#9CA3AF',
  },
  activeNavLabel: {
    color: '#2196F3',
  }
});

export default ProfessionalProfileNew;