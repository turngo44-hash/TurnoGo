import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/AppointmentCardStyles';

// Función para formatear la hora en formato 12h (para mostrar en las tarjetas)
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

const AppointmentCard = ({ appointment, onPress }) => {
  // Determinar si es una cita corta (15 min o menos)
  const isShortAppointment = appointment.duration <= 15;
  
  // Para citas cortas, simplificamos la información mostrada
  if (isShortAppointment) {
    // Extraer solo el primer nombre para citas cortas
    const firstName = appointment.clientName.split(' ')[0];
    
    return (
      <TouchableOpacity 
        style={[
          styles.appointmentCard, 
          styles.shortAppointmentCard,
          appointment.status === 'confirmed' ? styles.confirmedAppointment : styles.pendingAppointment
        ]}
        onPress={() => onPress(appointment)}
      >
        <View style={styles.gridCardContent}>
          <View style={styles.gridLeft}>
            <Text style={styles.shortClientName}>{firstName}</Text>
            <Text style={styles.shortTimeRange}>
              {formatTimeCard(appointment.time)}
            </Text>
          </View>
          <View style={styles.gridRight}>
            <Image source={{ uri: appointment.professionalImage }} style={styles.professionalImage} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  
  // Para citas normales, mostramos información completa
  return (
    <TouchableOpacity 
      style={[
        styles.appointmentCard, 
        appointment.status === 'confirmed' ? styles.confirmedAppointment : styles.pendingAppointment
      ]}
      onPress={() => onPress(appointment)}
    >
      <View style={styles.gridCardContent}>
        <View style={styles.gridLeft}>
          <Text style={styles.clientName} numberOfLines={1}>{appointment.clientName}</Text>
          <Text style={styles.timeRange} numberOfLines={1}>
            {formatTimeCard(appointment.time)} - {formatTimeCard(calculateEndTime(appointment.time, appointment.duration))}
          </Text>
          <Text style={styles.serviceText} numberOfLines={1}>{appointment.service}</Text>
        </View>
        <View style={styles.gridRight}>
          <Image source={{ uri: appointment.professionalImage }} style={styles.professionalImage} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const AppointmentsCardGrid = ({ appointments, navigation }) => {
  if (!appointments || appointments.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 16, color: '#6B7280', textAlign: 'center' }}>
          No hay citas programadas para este día
        </Text>
      </View>
    );
  }
  
  const handleAppointmentPress = (appointment) => {
    // Navegar a la pantalla de detalles
    navigation.navigate('AppointmentDetails', { appointment });
  };
  
  return (
    <View style={styles.appointmentCardsContainer}>
      {appointments.map((appointment) => (
        <AppointmentCard 
          key={appointment.id}
          appointment={appointment}
          onPress={handleAppointmentPress}
        />
      ))}
    </View>
  );
};

export default AppointmentsCardGrid;