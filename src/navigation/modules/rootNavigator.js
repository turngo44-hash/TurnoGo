import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';

import { loadUserFromStorage } from '../../store/slices/authSlice';
import { loadAppConfig } from '../../store/slices/appSlice';

import OnboardingScreen from '../../screens/OnboardingScreen';
import AuthNavigator from './authNavigator';
import MainNavigator from './mainNavigator';
import SelectProfessionalScreen from '../../screens/SelectProfessionalScreen';
import SplashScreen from '../../screens/SplashScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const dispatch = useDispatch();
  const [showSplash, setShowSplash] = useState(true);
  
  // Estados de Redux
  const { isAuthenticated, isInitialized } = useSelector((state) => state.auth);
  const selectedProfessional = useSelector((state) => state.professional?.selected);
  const { hasSeenOnboarding, isAppReady } = useSelector((state) => state.app);

  useEffect(() => {
    // Cargar configuraciones iniciales
    const initializeApp = async () => {
      await Promise.all([
        dispatch(loadUserFromStorage()),
        dispatch(loadAppConfig()),
      ]);
      
      // Ocultar splash después de 2 segundos
      setTimeout(() => {
        setShowSplash(false);
      }, 2000);
    };

    initializeApp();
  }, [dispatch]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {showSplash ? (
        // Mostrar splash al inicio
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen}
        />
      ) : !hasSeenOnboarding ? (
        // Primera vez - Mostrar onboarding
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : isAuthenticated ? (
        // Usuario autenticado - mostrar selección de profesional si falta
        selectedProfessional ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="SelectProfessional" component={SelectProfessionalScreen} />
        )
      ) : (
        // Usuario no autenticado - Pantallas de auth
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}