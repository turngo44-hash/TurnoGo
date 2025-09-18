import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Logo estilo Netflix - Cuadrado y compacto
const TurnoGoNetflixLogo = ({ size = 'medium', style = {} }) => {
  const sizes = {
    small: { 
      width: 60, 
      height: 60, 
      fontSize: 12,
      borderRadius: 4
    },
    medium: { 
      width: 80, 
      height: 80, 
      fontSize: 16,
      borderRadius: 6
    },
    large: { 
      width: 100, 
      height: 100, 
      fontSize: 20,
      borderRadius: 8
    },
    xl: { 
      width: 120, 
      height: 120, 
      fontSize: 24,
      borderRadius: 10
    }
  };

  const currentSize = sizes[size];

  return (
    <LinearGradient
      colors={['#E50914', '#B81D24', '#8B0000']} // Colores exactos de Netflix
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.netflixContainer,
        {
          width: currentSize.width,
          height: currentSize.height,
          borderRadius: currentSize.borderRadius,
        },
        style
      ]}
    >
      <Text style={[styles.netflixText, { fontSize: currentSize.fontSize }]}>
        TurnoGo
      </Text>
    </LinearGradient>
  );
};

// Versión con solo "TG" para espacios pequeños
export const TurnoGoNetflixMini = ({ size = 'medium', style = {} }) => {
  const sizes = {
    small: { width: 40, height: 40, fontSize: 16 },
    medium: { width: 50, height: 50, fontSize: 20 },
    large: { width: 60, height: 60, fontSize: 24 },
  };

  const currentSize = sizes[size];

  return (
    <LinearGradient
      colors={['#E50914', '#B81D24', '#8B0000']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.netflixContainer,
        {
          width: currentSize.width,
          height: currentSize.height,
          borderRadius: 4,
        },
        style
      ]}
    >
      <Text style={[styles.netflixTextBold, { fontSize: currentSize.fontSize }]}>
        TG
      </Text>
    </LinearGradient>
  );
};

// Versión horizontal para headers
export const TurnoGoNetflixHorizontal = ({ width = 120, height = 40, style = {} }) => {
  return (
    <LinearGradient
      colors={['#E50914', '#B81D24', '#8B0000']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.netflixContainer,
        {
          width: width,
          height: height,
          borderRadius: 6,
        },
        style
      ]}
    >
      <Text style={[styles.netflixText, { fontSize: height * 0.4 }]}>
        TurnoGo
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  netflixContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  netflixText: {
    fontFamily: 'System',
    fontWeight: '800', // Extra Bold
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: undefined, // Permite que el texto se centre mejor
  },
  netflixTextBold: {
    fontFamily: 'System',
    fontWeight: '900', // Black
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
  },
});

export default TurnoGoNetflixLogo;
