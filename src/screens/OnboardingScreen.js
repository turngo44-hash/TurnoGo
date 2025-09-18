import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { completeOnboarding } from '../store/slices/appSlice';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }) {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Animaciones
  const firstTextAnim = useRef(new Animated.Value(0)).current;
  const firstTextY = useRef(new Animated.Value(0)).current;
  const welcomeLineAnim = useRef(new Animated.Value(0)).current; // "Te damos la bienvenida a"
  const appNameAnim = useRef(new Animated.Value(0)).current;     // "TurnGo"
  const subtitleAnim = useRef(new Animated.Value(0)).current;    // "Tu turno, cuando lo necesites"
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startSequence();
  }, []);

  const startSequence = () => {
    // Paso 1: Mostrar "Reservas que simplifican tu día" - más rápido
    Animated.timing(firstTextAnim, {
      toValue: 1,
      duration: 600, // Reducido de 800ms
      useNativeDriver: true,
    }).start(() => {
      // Tiempo más ágil
      setTimeout(() => {
        transformText();
      }, 800); // Reducido de 1000ms
    });
  };

  const transformText = () => {
    // Paso 1: El primer texto sube rápido y desaparece - más ágil
    Animated.sequence([
      Animated.timing(firstTextY, {
        toValue: -280,
        duration: 300, // Reducido de 350ms
        useNativeDriver: true,
      }),
      Animated.timing(firstTextAnim, {
        toValue: 0,
        duration: 120, // Reducido de 150ms
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Paso 2: Aparición secuencial más rápida
      setTimeout(() => {
        showWelcomeSequence();
      }, 30); // Reducido de 50ms
    });
  };

  const showWelcomeSequence = () => {
    // Aparición simultánea pero fluida - estilo TikTok
    Animated.parallel([
      // 1. "Te damos la bienvenida a" - entrada suave
      Animated.timing(welcomeLineAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // 2. "TurnGo" - aparición fluida al mismo tiempo
      Animated.timing(appNameAnim, {
        toValue: 1,
        duration: 700, // Ligeramente más lento para efecto escalonado sutil
        useNativeDriver: true,
      }),
      // 3. "Tu turno, cuando lo necesites" - cierre fluido
      Animated.timing(subtitleAnim, {
        toValue: 1,
        duration: 800, // Un poco más lento para el efecto cascada
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Pausa mínima antes del contenido final
      setTimeout(() => {
        showRestOfContent();
      }, 200); // Pausa corta para mejor fluidez
    });
  };

  const showRestOfContent = () => {
    // Mostrar logo, términos y botón de forma ágil
    Animated.timing(contentAnim, {
      toValue: 1,
      duration: 400, // Reducido de 600ms - más rápido
      useNativeDriver: true,
    }).start();
  };

  const handleAccept = () => {
    // Completar onboarding usando Redux - simple y directo
    dispatch(completeOnboarding());
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      
      {/* Contenido principal */}
      <View style={styles.welcomeContainer}>
        
        {/* Primer texto: "Reservas que simplifican tu día" */}
        <Animated.View
          style={[
            styles.firstTextContainer,
            {
              opacity: firstTextAnim,
              transform: [{ translateY: firstTextY }],
            },
          ]}>
          <Text style={styles.firstText}>Reservas que simplifican tu día</Text>
        </Animated.View>

        {/* Título principal que aparece en secuencia */}
        <View style={styles.titleContainer}>
          {/* "Te damos la bienvenida a" */}
          <Animated.View style={{ opacity: welcomeLineAnim }}>
            <Text style={styles.welcomeTitle}>Te damos la bienvenida a</Text>
          </Animated.View>
          
          {/* "TurnGo" */}
          <Animated.View style={{ opacity: appNameAnim }}>
            <Text style={styles.appName}>TurnGo</Text>
          </Animated.View>
          
          {/* "Tu turno, cuando lo necesites" */}
          <Animated.View style={{ opacity: subtitleAnim }}>
            <Text style={styles.subtitle}>Tu turno, cuando lo necesites</Text>
          </Animated.View>
        </View>

        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: contentAnim,
              transform: [
                {
                  scale: contentAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}>
          <View style={styles.logoWrapper}>
            <Image
              source={require('../../assets/logo1.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* Términos y condiciones */}
        <Animated.View
          style={[
            styles.termsContainer,
            {
              opacity: contentAnim,
            },
          ]}>
          <Text style={styles.termsText}>
            Acepto los términos del servicio de TurnGo, y autorizo que mis datos personales se recopilen y traten para fines y según los derechos descritos en la{' '}
            <Text style={styles.linkText}>Política de Privacidad</Text>
          </Text>
        </Animated.View>

        {/* Botón */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: contentAnim,
              transform: [
                {
                  translateY: contentAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            },
          ]}>
          <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
            <Text style={styles.acceptButtonText}>Aceptar y continuar</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 24,
    position: 'relative',
  },
  firstTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  firstText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 38,
    fontFamily: 'System',
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '400',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'System',
  },
  appName: {
    fontSize: 42,
    fontWeight: '900',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: -1,
    marginBottom: 12,
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666666',
    textAlign: 'center',
    fontFamily: 'System',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 24,
  },
  logo: {
    width: 80,
    height: 80,
    tintColor: '#DC2626',
  },
  termsContainer: {
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  termsText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'System',
  },
  linkText: {
    color: '#DC2626',
    fontWeight: '500',
  },
  buttonContainer: {
    paddingHorizontal: 8,
  },
  acceptButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'System',
  },
});
