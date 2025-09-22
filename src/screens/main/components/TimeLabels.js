import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles/AppointmentsScreenStyles';

const TimeLabels = ({ timeSlots, getSlotHeight }) => {
  return (
    <View style={styles.timeLabelsColumn}>
      {timeSlots.map((slot, index) => {
        // Mostrar siempre todas las etiquetas de tiempo (horas, 15, 30, 45)
        const shouldShowLabel = () => {
          const [hour, minute] = slot.split(':').map(Number);
          // Siempre mostrar marcadores de tiempo en intervalos de 15 minutos
          return minute % 15 === 0; // Muestra todas las marcas (00, 15, 30, 45)
        };
        
        // Determinar el tipo de etiqueta para estilizado diferencial
        const isFullHourLabel = slot.endsWith(':00');
        const isHalfHourLabel = slot.endsWith(':30');
        const isQuarterHourLabel = slot.endsWith(':15') || slot.endsWith(':45');
        
        // Solo renderizar si debe mostrarse la etiqueta
        if (!shouldShowLabel()) return null;
        
        return (
          <View 
            key={`time-${index}`} 
            style={[
              styles.timeLabel, 
              { height: getSlotHeight() }
            ]}
          >
            <Text 
              style={[
                styles.timeLabelText,
                // Estilo más compacto, alineado a la línea superior
                {
                  fontSize: isFullHourLabel ? 10 : 9, // Ajustado para el formato con a.m./p.m.
                  fontWeight: isFullHourLabel ? '500' : '400',
                  color: isFullHourLabel ? '#333333' : '#9CA3AF',
                  opacity: 1,
                  textAlign: 'right',
                  marginRight: isFullHourLabel ? 0 : 0, // Eliminado el margen para minutos
                  marginTop: 0, // Alineado exactamente con la línea superior
                  height: getSlotHeight() * 0.8, // Altura controlada para mejor alineación
                }
              ]}
              numberOfLines={1}
            >
              {isFullHourLabel ? 
                // Formato con horas y a.m./p.m. como solicitado
                `${parseInt(slot.split(':')[0]) > 12 ? parseInt(slot.split(':')[0]) - 12 : parseInt(slot.split(':')[0])}${parseInt(slot.split(':')[0]) >= 12 ? 'p.m.' : 'a.m.'}` : 
                slot.split(':')[1]} {/* Solo mostrar minutos para 15, 30, 45 */}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default TimeLabels;