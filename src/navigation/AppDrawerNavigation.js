import React from 'react';
import { Platform } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainNavigator from './MainNavigator';
import ProfessionalsListScreen from '../screens/ProfessionalsListScreen';
import ServicesInfoScreen from '../screens/ServicesInfoScreen';
import MyProfessionalProfileScreen from '../screens/MyProfessionalProfileScreen';

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

const Stack = createNativeStackNavigator();

export default function AppDrawerNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="MainApp" 
        component={MainNavigator} 
      />
      <Stack.Screen 
        name="ProfessionalsList" 
        component={ProfessionalsListScreen} 
      />
      <Stack.Screen 
        name="ServicesInfo" 
        component={ServicesInfoScreen} 
      />
      <Stack.Screen 
        name="MyProfessionalProfile" 
        component={MyProfessionalProfileScreen} 
      />
    </Stack.Navigator>
  );
}
