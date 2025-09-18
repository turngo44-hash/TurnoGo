import React from "react";
import { View, Image, Dimensions } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get("window");

export default function CurvedImage({ source, height: containerHeight = 400 }) {
  const imageWidth = width * 0.85; 
  const imageHeight = height * 0.32; 
  
  return (
    <View style={{ 
      width, 
      height: containerHeight, 
      alignItems: 'center', 
      justifyContent: 'center',
      paddingHorizontal: 20,
    }}>
      {/* Contenedor moderno con bordes redondeados y gradiente */}
      <View style={{
        width: imageWidth,
        height: imageHeight,
        borderRadius: 40,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.15,
        shadowRadius: 30,
        elevation: 15,
        borderWidth: 2,
        borderColor: 'rgba(59, 130, 246, 0.1)',
        overflow: 'hidden',
      }}>
        {/* Fondo gradiente dinámico */}
        <LinearGradient
          colors={['rgba(59, 130, 246, 0.05)', 'rgba(147, 197, 253, 0.1)', 'rgba(255, 255, 255, 0.9)']}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        
        {/* Imagen optimizada */}
        <Image 
          source={source} 
          style={{
            width: imageWidth * 0.75,
            height: imageHeight * 0.75,
            zIndex: 2,
          }}
          resizeMode="contain"
        />
        
        {/* Efecto de brillo sutil */}
        <View style={{
          position: 'absolute',
          top: 20,
          left: 20,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          opacity: 0.6,
        }} />
      </View>
    </View>
  );
}
