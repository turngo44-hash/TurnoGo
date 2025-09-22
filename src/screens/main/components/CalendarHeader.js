import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/AppointmentsScreenStyles';
import colors from '../../../constants/colors';

const CalendarHeader = ({ 
  selectedDate, 
  isCalendarExpanded, 
  toggleCalendarView, 
  goToPrevMonth, 
  goToToday,
  formatSelectedDate
}) => {
  return (
    <View style={styles.calendarHeader}>
      <TouchableOpacity onPress={toggleCalendarView} style={styles.monthYearContainer}>
        <Text style={styles.monthYearText}>
          {formatSelectedDate(selectedDate)}
        </Text>
        <Ionicons 
          name={isCalendarExpanded ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={colors.text} 
        />
      </TouchableOpacity>
      
      <View style={styles.navigationButtons}>
        <TouchableOpacity onPress={goToPrevMonth} style={styles.navButton}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={goToToday} style={[styles.navButton, styles.todayButton]}>
          <Text style={styles.todayButtonText}>Hoy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CalendarHeader;