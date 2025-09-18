import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText, Rect } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Logo SVG estilo Netflix/moderno
export const TurnoGoLogoSVG = ({ width: logoWidth = 200, height: logoHeight = 60 }) => {
  return (
    <Svg width={logoWidth} height={logoHeight} viewBox={`0 0 ${logoWidth} ${logoHeight}`}>
      <Defs>
        <LinearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#DC2626" />
          <Stop offset="50%" stopColor="#B91C1C" />
          <Stop offset="100%" stopColor="#991B1B" />
        </LinearGradient>
      </Defs>
      
      {/* Fondo opcional */}
      <Rect 
        x="0" 
        y="0" 
        width={logoWidth} 
        height={logoHeight} 
        fill="transparent" 
        rx="8" 
      />
      
      {/* Texto principal */}
      <SvgText
        x={logoWidth / 2}
        y={logoHeight / 2 + 8}
        fontSize="32"
        fontWeight="900"
        fill="url(#redGradient)"
        textAnchor="middle"
        fontFamily="Arial Black, sans-serif"
      >
        TurnoGo
      </SvgText>
    </Svg>
  );
};

// Versión con fondo tipo Netflix
export const TurnoGoLogoNetflixStyle = ({ width: logoWidth = 200, height: logoHeight = 60 }) => {
  return (
    <Svg width={logoWidth} height={logoHeight} viewBox={`0 0 ${logoWidth} ${logoHeight}`}>
      <Defs>
        <LinearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#1F2937" />
          <Stop offset="100%" stopColor="#111827" />
        </LinearGradient>
      </Defs>
      
      {/* Fondo oscuro */}
      <Rect 
        x="0" 
        y="0" 
        width={logoWidth} 
        height={logoHeight} 
        fill="url(#bgGradient)" 
        rx="8" 
      />
      
      {/* Texto blanco */}
      <SvgText
        x={logoWidth / 2}
        y={logoHeight / 2 + 8}
        fontSize="28"
        fontWeight="900"
        fill="#FFFFFF"
        textAnchor="middle"
        fontFamily="Arial Black, sans-serif"
      >
        TurnoGo
      </SvgText>
    </Svg>
  );
};

export default TurnoGoLogoSVG;
