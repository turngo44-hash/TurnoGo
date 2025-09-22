import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../styles/AppointmentCardStyles';

// Función para formatear la hora en formato 12h
const formatTimeCard = (time) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  
  return `${formattedHour}:${minutes} ${ampm}`;
};

// Función para calcular la hora de finalización
const calculateEndTime = (startTime, durationMinutes) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0);
  
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
  const endHours = endDate.getHours();
  const endMinutes = endDate.getMinutes();
  
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
};

// Componente de tarjeta de cita para la vista de línea de tiempo
const AppointmentTimelineCard = ({ appointment, isShort = false }) => {
  // Determinar si es una cita corta (15 min o menos)
  const isShortAppointment = isShort || appointment.duration <= 15;
  
  // Generar el rango de tiempo para mostrar
  const timeRange = `${formatTimeCard(appointment.time)} - ${formatTimeCard(calculateEndTime(appointment.time, appointment.duration))}`;
  
  if (isShortAppointment) {
    // Extraer solo el primer nombre para citas cortas
    const firstName = appointment.clientName.split(' ')[0];
    
    return (
      <View style={[
        styles.timelineCard,
        styles.shortTimelineCard,
        appointment.status === 'confirmed' ? styles.confirmedAppointment : styles.pendingAppointment,
      ]}>
        <Text style={styles.shortClientName} numberOfLines={1}>{firstName}</Text>
        <Text style={styles.shortTimeRange} numberOfLines={1}>{timeRange}</Text>
      </View>
    );
  }
  
  return (
    <View style={[
      styles.timelineCard,
      appointment.status === 'confirmed' ? styles.confirmedAppointment : styles.pendingAppointment,
    ]}>
      <Text style={styles.clientName} numberOfLines={1}>{appointment.clientName}</Text>
      <Text style={styles.timeRange} numberOfLines={1}>{timeRange}</Text>
      <Text style={styles.serviceText} numberOfLines={1}>{appointment.service}</Text>
      
      <View style={styles.appointmentFooter}>
        <View style={[
          styles.statusDot, 
          { backgroundColor: appointment.status === 'confirmed' ? '#10B981' : '#FBBF24' }
        ]} />
      </View>
    </View>
  );
};

export default AppointmentTimelineCard;