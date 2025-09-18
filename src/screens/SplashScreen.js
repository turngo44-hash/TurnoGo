import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.5);
  const borderAnim = new Animated.Value(0);
  const textAnim = new Animated.Value(0);

  useEffect(() => {
    // Secuencia de animaciones estilo TikTok
    Animated.sequence([
      // Primero aparece el logo con efecto bounce
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // Luego aparecen los bordes rojos
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Finalmente aparece el texto
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // El splash se oculta automáticamente desde RootNavigator
  }, [fadeAnim, scaleAnim, borderAnim, textAnim]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
      
      <Animated.View 
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Logo simple */}
        <Animated.View 
          style={[
            styles.logoWrapper,
            {
              opacity: borderAnim,
            }
          ]}
        >
          {/* Logo de TurnoGo */}
          <Image 
            source={require('../../assets/splash-icon.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>
        
        {/* Texto TurnoGo */}
        <Animated.View
          style={{
            opacity: textAnim,
            transform: [{
              translateY: textAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              })
            }]
          }}
        >
          <Text style={styles.brandText}>TurnoGo</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoImage: {
    width: 120,
    height: 120,
    tintColor: '#ffffff',
  },
  brandText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -2,
    fontFamily: 'System',
    textAlign: 'center',
    marginTop: 15,
    textShadowColor: '#DC2626',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
  },
});
