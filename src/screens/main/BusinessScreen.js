import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

// Components
import BusinessTabs from '../../components/business/BusinessTabs';
// Mantenemos el import de BusinessAnalytics aunque no lo usemos por ahora
import BusinessAnalytics from '../../components/business/BusinessAnalytics';
import BusinessProfessionalsInfo from '../../components/business/BusinessProfessionalsInfo';

// Constants
import colors from '../../constants/colors';

export default function BusinessScreen() {
  // Ya no necesitamos el estado activeTab porque siempre mostramos Mi Negocio
  
  // Mock business data - en producción vendría de Redux/Context
  const businessData = {
    name: 'Salón de Belleza Luna',
    category: 'Salón de Belleza & Spa',
    description: 'Transformamos tu belleza con servicios profesionales y atención personalizada',
    logo: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop',
    coverPhoto: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=400&fit=crop',
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      {/* Mantenemos el componente BusinessTabs vacío para preservar el layout */}
      <BusinessTabs />
      
      {/* Mostramos directamente el contenido de Mi Negocio */}
      <View style={styles.contentContainer}>
        <BusinessProfessionalsInfo businessData={businessData} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    flex: 1,
  },
});
