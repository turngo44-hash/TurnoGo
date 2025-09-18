import React, { useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import store from './src/store/store';
import RootNavigator from './src/navigation/RootNavigator';
import FirebaseAuthService from './src/services/FirebaseAuthService';

// Componente interno para manejar Firebase listener
function AppWithFirebase() {
  const dispatch = useDispatch();
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  useEffect(() => {
    // Esperar un momento antes de configurar Firebase
    const initFirebase = async () => {
      try {
        // Configurar listener de autenticación de Firebase
        const unsubscribe = FirebaseAuthService.onAuthStateChange((user) => {
          if (user) {
            // Usuario autenticado - actualizar store
            dispatch({
              type: 'auth/setUser',
              payload: user
            });
          } else {
            // Usuario no autenticado - limpiar store
            dispatch({
              type: 'auth/clearUser'
            });
          }
        });

        setIsFirebaseReady(true);

        // Cleanup del listener
        return () => unsubscribe();
      } catch (error) {
        console.error('Error inicializando Firebase:', error);
        setIsFirebaseReady(true); // Continuar aunque haya error
      }
    };

    // Dar tiempo para que Firebase se inicialice completamente
    const timeout = setTimeout(() => {
      initFirebase();
    }, 100);

    return () => clearTimeout(timeout);
  }, [dispatch]);

  if (!isFirebaseReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );
  }

  return (
    <>
      <RootNavigator />
      <StatusBar style="auto" />
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppWithFirebase />
      </NavigationContainer>
    </Provider>
  );
}
