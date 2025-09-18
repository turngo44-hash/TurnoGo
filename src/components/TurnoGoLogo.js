import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const TurnoGoLogo = ({ size = 'medium', style = {} }) => {
  const sizes = {
    small: { fontSize: 18, height: 30 },
    medium: { fontSize: 28, height: 45 },
    large: { fontSize: 36, height: 60 },
    xl: { fontSize: 48, height: 80 }
  };

  const currentSize = sizes[size];

  return (
    <View style={[styles.container, { height: currentSize.height }, style]}>
      {/* Versión 1: Estilo Netflix Simple */}
      <Text style={[styles.logoText, { fontSize: currentSize.fontSize }]}>
        TurnoGo
      </Text>
    </View>
  );
};

// Versión con gradiente (más moderna)
export const TurnoGoLogoGradient = ({ size = 'medium', style = {} }) => {
  const sizes = {
    small: { fontSize: 18, height: 30 },
    medium: { fontSize: 28, height: 45 },
    large: { fontSize: 36, height: 60 },
    xl: { fontSize: 48, height: 80 }
  };

  const currentSize = sizes[size];

  return (
    <View style={[styles.container, { height: currentSize.height }, style]}>
      <LinearGradient
        colors={['#DC2626', '#B91C1C', '#991B1B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        <Text style={[styles.logoTextGradient, { fontSize: currentSize.fontSize }]}>
          TurnoGo
        </Text>
      </LinearGradient>
    </View>
  );
};

// Versión con icono + texto
export const TurnoGoLogoWithIcon = ({ size = 'medium', style = {} }) => {
  const sizes = {
    small: { fontSize: 18, iconSize: 20, height: 30 },
    medium: { fontSize: 28, iconSize: 32, height: 45 },
    large: { fontSize: 36, iconSize: 42, height: 60 },
    xl: { fontSize: 48, iconSize: 56, height: 80 }
  };

  const currentSize = sizes[size];

  return (
    <View style={[styles.containerRow, { height: currentSize.height }, style]}>
      {/* Icono circular rojo */}
      <View style={[styles.iconContainer, { width: currentSize.iconSize, height: currentSize.iconSize }]}>
        <Text style={[styles.iconText, { fontSize: currentSize.iconSize * 0.6 }]}>T</Text>
      </View>
      <Text style={[styles.logoText, { fontSize: currentSize.fontSize, marginLeft: 8 }]}>
        urnoGo
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontFamily: 'System', // En producción usar fuente personalizada
    fontWeight: '900', // Black
    color: '#DC2626',
    letterSpacing: -1,
    textShadowColor: 'rgba(220, 38, 38, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  gradientContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoTextGradient: {
    fontFamily: 'System',
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  iconContainer: {
    backgroundColor: '#DC2626',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
});

export default TurnoGoLogo;
