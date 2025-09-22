import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import styles from '../styles/AppointmentsScreenStyles';
import AppointmentTimeSlot from './AppointmentTimeSlot';

const TimeSlotGrid = ({ 
  timeSlots, 
  getSlotHeight, 
  getAppointmentsForTimeSlot, 
  renderedAppointments, 
  selectedTimeSlot,
  navigation,
  selectedDate,
  setSelectedTimeSlot,
  formatTime,
  calculateEndTime,
  getAppointmentDurationInSlots
}) => {
  return (
    <View style={styles.appointmentSlotsColumn}>
      {/* Hour divider lines */}
      {timeSlots.map((slot, index) => {
        // Siempre mostrar todas las líneas divisorias de 15 minutos
        const shouldShowDivider = () => {
          const [hour, minute] = slot.split(':').map(Number);
          return minute % 15 === 0;
        };
        
        // Determinar el estilo de la línea
        const isFullHourDivider = slot.endsWith(':00');
        const isHalfHourDivider = slot.endsWith(':30');
        const isQuarterHourDivider = slot.endsWith(':15') || slot.endsWith(':45');
        
        if (!shouldShowDivider()) return null;
        
        // Configuración de estilo para líneas similar a Boosky
        let opacity = 1;
        let height = 1;
        let backgroundColor = '#E9EAEE';
        let borderStyle = 'solid';
        
        if (isFullHourDivider) {
          opacity = 1;
          height = 1;
          backgroundColor = '#DFE1E6';
        } else if (isHalfHourDivider) {
          opacity = 0.9;
          height = 1;
          backgroundColor = '#E5E7EC';
        } else if (isQuarterHourDivider) {
          opacity = 0.7;
          height = 1;
          backgroundColor = '#EBEDF2';
        }
        
        return (
          <View 
            key={`divider-${index}`} 
            style={[
              styles.hourDivider, 
              { 
                top: index * getSlotHeight(),
                opacity: opacity,
                height: height,
                backgroundColor: backgroundColor,
              },
              isFullHourDivider && styles.fullHourDivider
            ]} 
          />
        );
      })}
      
      {/* Time slots - solo para citas, sin slots vacíos que duplican líneas */}
      {timeSlots.map((timeSlot, index) => {
        const appointments = getAppointmentsForTimeSlot(timeSlot);
        
        // Si no hay citas en este horario, solo dejamos un receptor de toques invisible
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
        const appointmentsToRender = appointments
          .filter(apt => !renderedAppointments.has(apt.id));
        
        // Si tenemos múltiples citas en el mismo horario
        if (appointmentsToRender.length > 0) {
          // Marcar estas citas como renderizadas
          appointmentsToRender.forEach(apt => renderedAppointments.add(apt.id));
          
          return (
            <View 
              key={`slot-container-${index}`}
              style={[
                styles.multipleAppointmentsContainer,
                {
                  position: 'absolute',
                  top: index * getSlotHeight(),
                  left: 0,
                  right: 0,
                  zIndex: 30,
                }
              ]}
            >
              {appointmentsToRender.map((appointment, aptIndex) => {
                const slotsCount = getAppointmentDurationInSlots(appointment);
                const appointmentWidth = '48%';
                
                return (
                  <AppointmentTimeSlot
                    key={`apt-${appointment.id}`}
                    appointment={appointment}
                    index={index}
                    slotsCount={slotsCount}
                    appointmentWidth={appointmentWidth}
                    aptIndex={aptIndex}
                    formatTime={formatTime}
                    calculateEndTime={calculateEndTime}
                  />
                );
              })}
            </View>
          );
        }
        
        // Empty slot - sin elementos visuales que dupliquen líneas
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
      })}
    </View>
  );
};

export default TimeSlotGrid;