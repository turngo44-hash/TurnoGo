import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styles from '../styles/AppointmentsScreenStyles';

const CalendarDay = ({ item, selectedDate, selectDate }) => {
  const isSelected = selectedDate.toDateString() === item.date.toDateString();
  const today = new Date();
  const isToday = item.date.toDateString() === today.toDateString();
  
  return (
    <TouchableOpacity
      style={[
        styles.dayItem,
        isSelected && styles.selectedDayItem,
        !item.isCurrentMonth && styles.otherMonthDayItem,
        isToday && !isSelected && styles.todayDayItem,
      ]}
      onPress={() => selectDate(item.date)}
    >
      <Text style={[
        styles.dayOfWeekText,
        isSelected && styles.selectedDayText,
        !item.isCurrentMonth && styles.otherMonthDayText,
      ]}>
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][item.date.getDay()]}
      </Text>
      <Text style={[
        styles.dayNumberText,
        isSelected && styles.selectedDayText,
        !item.isCurrentMonth && styles.otherMonthDayText,
      ]}>
        {item.day}
      </Text>
      {item.hasAppointments && (
        <View style={[styles.hasAppointmentsDot, isSelected && styles.selectedDotColor]} />
      )}
    </TouchableOpacity>
  );
};

export default CalendarDay;