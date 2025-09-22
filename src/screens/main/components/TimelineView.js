import React from 'react';
import { View } from 'react-native';
import TimeLabels from './TimeLabels';
import TimeSlotGrid from './TimeSlotGrid';
import styles from '../styles/AppointmentsScreenStyles';

const TimelineView = ({
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
  getAppointmentDurationInSlots,
  isSameDay,
  calculateCurrentTimePosition
}) => {
  return (
    <View style={styles.timelineContent}>
      {/* Left column: Time labels */}
      <TimeLabels 
        timeSlots={timeSlots} 
        getSlotHeight={getSlotHeight} 
      />
      
      {/* Right column: Appointment slots */}
      <TimeSlotGrid 
        timeSlots={timeSlots}
        getSlotHeight={getSlotHeight}
        getAppointmentsForTimeSlot={getAppointmentsForTimeSlot}
        renderedAppointments={renderedAppointments}
        selectedTimeSlot={selectedTimeSlot}
        navigation={navigation}
        selectedDate={selectedDate}
        setSelectedTimeSlot={setSelectedTimeSlot}
        formatTime={formatTime}
        calculateEndTime={calculateEndTime}
        getAppointmentDurationInSlots={getAppointmentDurationInSlots}
      />
      
      {/* Current time indicator */}
      {isSameDay(selectedDate, new Date()) && (
        <View style={[
          styles.currentTimeIndicator, 
          { top: calculateCurrentTimePosition() }
        ]}>
          <View style={styles.currentTimeIndicatorDot} />
          <View style={styles.currentTimeIndicatorLine} />
        </View>
      )}
    </View>
  );
};

export default TimelineView;