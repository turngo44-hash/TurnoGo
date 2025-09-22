import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import AppointmentTimelineCard from './AppointmentTimelineCard';

const TimeSlots = ({ 
  timeSlots, 
  getAppointmentsForTimeSlot, 
  getSlotHeight, 
  getAppointmentDurationInSlots, 
  navigation, 
  selectedTimeSlot,
  selectedDate,
  setSelectedTimeSlot
}) => {
  // Set para controlar las citas ya renderizadas y evitar duplicados
  const renderedAppointments = new Set();

  return timeSlots.map((timeSlot, index) => {
    const appointments = getAppointmentsForTimeSlot(timeSlot);
    
    // Si no hay citas en este horario, solo creamos un área táctil invisible
    if (appointments.length === 0 || 
        appointments.every(apt => renderedAppointments.has(apt.id))) {
      return (
        <TouchableOpacity 
          key={`slot-${index}`} 
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: getSlotHeight(),
            top: index * getSlotHeight(),
            zIndex: 10,
            backgroundColor: selectedTimeSlot === timeSlot ? 'rgba(249, 230, 230, 0.3)' : 'transparent'
          }}
          onPress={() => {
            setSelectedTimeSlot(timeSlot);
            navigation.navigate('BookAppointment', { selectedTime: timeSlot, selectedDate: selectedDate });
          }}
        />
      );
    }
    
    // Filtrar solo las citas no renderizadas aún
    const appointmentsToRender = appointments.filter(apt => !renderedAppointments.has(apt.id));
    
    // Si no hay citas nuevas para renderizar, devolvemos solo el receptor de toques
    if (appointmentsToRender.length === 0) {
      return (
        <TouchableOpacity 
          key={`slot-${index}`} 
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: getSlotHeight(),
            top: index * getSlotHeight(),
            zIndex: 10,
            backgroundColor: selectedTimeSlot === timeSlot ? 'rgba(249, 230, 230, 0.3)' : 'transparent'
          }}
          onPress={() => {
            setSelectedTimeSlot(timeSlot);
            navigation.navigate('BookAppointment', { selectedTime: timeSlot, selectedDate: selectedDate });
          }}
        />
      );
    }
    
    // Marcar estas citas como renderizadas
    appointmentsToRender.forEach(apt => renderedAppointments.add(apt.id));
    
    // Renderizar las citas para este slot de tiempo
    return (
      <View key={`slot-container-${index}`}>
        {appointmentsToRender.map((appointment, aptIndex) => {
          const slotsCount = getAppointmentDurationInSlots(appointment);
          const isShort = appointment.duration <= 15;
          
          // Determinamos en qué columna colocar la cita (izquierda o derecha)
          // Las citas en posiciones pares van a la izquierda, las impares a la derecha
          const isLeftColumn = aptIndex % 2 === 0;
          
          return (
            <TouchableOpacity 
              key={`apt-${appointment.id}`}
              style={{
                position: 'absolute',
                left: isLeftColumn ? 4 : '50%', // Más pegado al borde izquierdo
                right: isLeftColumn ? '50%' : 4, // Más pegado al borde derecho
                width: '49%', // Aumentado para llenar mejor el espacio disponible
                height: slotsCount * getSlotHeight() - 4, // Ajustado para que no quede recortado
                top: index * getSlotHeight() + 2,
                zIndex: 100 + aptIndex, // z-index muy alto para asegurar que esté por encima de las líneas
                marginLeft: isLeftColumn ? 0 : 1, // Margen mínimo
                marginRight: isLeftColumn ? 1 : 0, // Margen mínimo
                backgroundColor: '#FFFFFF', // Fondo blanco para asegurar visibilidad
                borderRadius: 8, // Bordes redondeados consistentes
                elevation: 8, // Mayor elevación para asegurarse que esté por encima de líneas
              }}
              onPress={() => navigation.navigate('AppointmentDetails', { appointment })}
              onLongPress={() => {
                alert('Mantenga presionado para mover la cita');
              }}
            >
              <AppointmentTimelineCard 
                appointment={appointment} 
                isShort={isShort} 
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  });
};

export default TimeSlots;