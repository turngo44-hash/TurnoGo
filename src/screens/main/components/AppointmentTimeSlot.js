import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/AppointmentsScreenStyles';

const AppointmentTimeSlot = ({ 
  appointment, 
  index, 
  slotsCount, 
  appointmentWidth,
  aptIndex,
  formatTime, 
  calculateEndTime 
}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      key={`apt-${appointment.id}`}
      style={[
        styles.appointmentBlock,
        { 
          height: slotsCount * 30,
          width: appointmentWidth,
          paddingTop: 0,
          paddingBottom: 0,
          paddingHorizontal: 6,
        },
        appointment.status === 'confirmed' ? styles.confirmedAppointment : styles.pendingAppointment,
        index % 4 === 0 && styles.hourStartSlot,
        aptIndex > 0 && styles.adjacentAppointment,
        appointment.duration <= 15 && styles.shortAppointment
      ]}
      onPress={() => navigation.navigate('AppointmentDetails', { appointment })}
    >
      {/* Nombre del cliente primero */}
      <Text style={[
        styles.appointmentClientName, 
        appointment.duration <= 15 && styles.shortAppointmentClientName
      ]} numberOfLines={1}>
        {appointment.clientName}
      </Text>
      
      {/* Rango de horas debajo */}
      <Text style={styles.appointmentTimeRange} numberOfLines={1}>
        {formatTime(appointment.time)} - {formatTime(calculateEndTime(appointment.time, appointment.duration))}
      </Text>
      
      {/* Solo mostramos el servicio si la cita es de más de 15 minutos */}
      {appointment.duration > 15 && (
        <Text style={styles.appointmentServiceCompact} numberOfLines={1}>{appointment.service}</Text>
      )}
      
      {/* Indicador de estado (punto de color) */}
      <View style={[
        styles.statusDotCompact,
        { backgroundColor: appointment.status === 'confirmed' ? '#10B981' : '#FBBF24' }
      ]} />
    </TouchableOpacity>
  );
};

export default AppointmentTimeSlot;