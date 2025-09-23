import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CalendarBody, CalendarContainer, CalendarHeader } from '@howljs/calendar-kit';

const MyCalendar = () => {
  return (
    <View style={styles.container}>
      <CalendarContainer>
        <CalendarHeader />
        <CalendarBody />
      </CalendarContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default MyCalendar;
