import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
  Image,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../constants/colors';

// Helper to check if two dates are the same day
const isSameDay = (date1, date2) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

const { width } = Dimensions.get('window');

const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const monthsOfYear = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function AppointmentsScreen() {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [calendarDays, setCalendarDays] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [viewMode, setViewMode] = useState('day'); // day, week, month
  const [zoomLevel, setZoomLevel] = useState(2); // 1: 60min, 2: 30min, 3: 15min
  
  const calendarAnimation = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const timelineScrollRef = useRef(null);
  const initialScale = useRef(1);
  const lastZoomChangeTime = useRef(0);
  const ZOOM_DEBOUNCE_TIME = 400; // Tiempo más largo entre cambios para evitar activaciones múltiples
  
  // Implementación simplificada del gesto de zoom
  const pinchGesture = Gesture.Pinch()
    .onBegin(() => {
      initialScale.current = 1;
    })
    .onChange((e) => {
      // Verificar si ha pasado suficiente tiempo desde el último cambio de zoom
      const now = Date.now();
      if (now - lastZoomChangeTime.current < ZOOM_DEBOUNCE_TIME) {
        return;
      }
      
      // Umbrales más pequeños para requerir menos movimiento del pellizco
      // Un cambio de solo 15% es suficiente para activar el zoom
      if (e.scale > 1.15 && zoomLevel < 3) {
        // Aumentar zoom (mostrar más detalle)
        setZoomLevel(prev => Math.min(prev + 1, 3));
        lastZoomChangeTime.current = now;
      } else if (e.scale < 0.85 && zoomLevel > 1) {
        // Reducir zoom (mostrar menos detalle)
        setZoomLevel(prev => Math.max(prev - 1, 1));
        lastZoomChangeTime.current = now;
      }
    });

  // Calculate position for the current time indicator
  const calculateCurrentTimePosition = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // If current time is outside working hours, return 0
    if (hours < 9 || hours >= 18) {
      return 0;
    }
    
    // Calculate position based on slot height and zoom level
    const hoursFromStart = hours - 9; // Working hours start at 9:00
    const minutesAsDecimal = minutes / 60;
    const totalHoursFromStart = hoursFromStart + minutesAsDecimal;
    
    // Define slots per hour based on zoom level
    const slotsPerHour = (() => {
      switch (zoomLevel) {
        case 1: return 1;  // 60min intervals
        case 2: return 2;  // 30min intervals
        case 3: return 4;  // 15min intervals
        default: return 4;
      }
    })();
    
    // Each slot is 30px height
    return totalHoursFromStart * slotsPerHour * 30;
  };
  
  // Generate calendar days for the current month
  useEffect(() => {
    generateCalendarDays();
  }, [selectedMonth, selectedYear]);
  
  // Fetch appointments for the selected date
  useEffect(() => {
    fetchAppointmentsForDate(selectedDate);
  }, [selectedDate]);
  
  // Load sample data for demonstration
  useEffect(() => {
    loadSampleAppointments();
  }, []);
  
  // Scroll to current time if viewing today
  useEffect(() => {
    if (
      timelineScrollRef.current && 
      isSameDay(selectedDate, new Date()) &&
      viewMode === 'day'
    ) {
      // Allow time for the layout to complete, then scroll
      setTimeout(() => {
        const scrollPosition = calculateCurrentTimePosition() - 100; // Scroll so current time is visible with some padding
        if (scrollPosition > 0) {
          timelineScrollRef.current.scrollTo({ y: scrollPosition, animated: true });
        }
      }, 500);
    }
  }, [selectedDate, viewMode]);
  
  // Animation for calendar expand/collapse
  useEffect(() => {
    Animated.timing(calendarAnimation, {
      toValue: isCalendarExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isCalendarExpanded]);
  
  const calendarHeight = calendarAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [110, 360],
  });
  
  // Load sample appointments
  const loadSampleAppointments = async () => {
    try {
      // Check if we have stored sample data
      const storedAppointments = await AsyncStorage.getItem('sampleAppointments');
      
      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
      } else {
        // Create sample appointments for demo
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        
        const sampleData = [
          {
            id: '1',
            clientName: 'Ana García',
            service: 'Corte de cabello',
            date: today,
            time: '10:15',
            duration: 45,
            price: 25.00,
            confirmed: true,
            professionalId: 'prof1',
            professionalName: 'Carlos Méndez',
            professionalImage: 'https://randomuser.me/api/portraits/men/32.jpg',
            notes: 'Cliente regular, prefiere corte degradado',
            status: 'confirmed',
          },
          {
            id: '2',
            clientName: 'Roberto Sánchez',
            service: 'Afeitado completo',
            date: today,
            time: '11:30',
            duration: 30,
            price: 18.00,
            confirmed: true,
            professionalId: 'prof2',
            professionalName: 'Laura Torres',
            professionalImage: 'https://randomuser.me/api/portraits/women/44.jpg',
            notes: '',
            status: 'confirmed',
          },
          {
            id: '3',
            clientName: 'Sofía Martínez',
            service: 'Coloración',
            date: tomorrow,
            time: '09:30',
            duration: 90,
            price: 65.00,
            confirmed: false,
            professionalId: 'prof1',
            professionalName: 'Carlos Méndez',
            professionalImage: 'https://randomuser.me/api/portraits/men/32.jpg',
            notes: 'Primera vez, quiere cambio de look radical',
            status: 'pending',
          },
        ];
        
        await AsyncStorage.setItem('sampleAppointments', JSON.stringify(sampleData));
        setAppointments(sampleData);
      }
    } catch (error) {
      console.error('Error loading sample appointments:', error);
    }
  };
  
  // Fetch appointments for a specific date
  const fetchAppointmentsForDate = (date) => {
    if (!appointments.length) return;
    
    // Filter appointments for the selected date
    const filteredAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate.getDate() === date.getDate() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getFullYear() === date.getFullYear()
      );
    });
    
    // Sort appointments by time
    filteredAppointments.sort((a, b) => {
      return a.time.localeCompare(b.time);
    });
    
    return filteredAppointments;
  };
  
  // Generate days for the calendar
  const generateCalendarDays = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
    
    const days = [];
    
    // Add days from previous month to fill the first week
    const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
    const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      const day = daysInPrevMonth - firstDayOfMonth + i + 1;
      days.push({
        day,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false,
        date: new Date(prevYear, prevMonth, day),
      });
    }
    
    // Add days for the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth, day);
      days.push({
        day,
        month: selectedMonth,
        year: selectedYear,
        isCurrentMonth: true,
        date,
        isToday: date.toDateString() === new Date().toDateString(),
        hasAppointments: appointments.some(appointment => {
          const appointmentDate = new Date(appointment.date);
          return appointmentDate.toDateString() === date.toDateString();
        }),
      });
    }
    
    // Add days from next month to complete the last week
    const nextMonth = selectedMonth === 11 ? 0 : selectedMonth + 1;
    const nextYear = selectedMonth === 11 ? selectedYear + 1 : selectedYear;
    const daysToAdd = 42 - days.length; // 6 weeks * 7 days = 42
    
    for (let day = 1; day <= daysToAdd; day++) {
      days.push({
        day,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
        date: new Date(nextYear, nextMonth, day),
      });
    }
    
    setCalendarDays(days);
    
    // Scroll to selected date in horizontal calendar
    if (scrollViewRef.current && viewMode === 'day') {
      const today = new Date();
      const currentDayIndex = days.findIndex(day => 
        day.isCurrentMonth && day.day === today.getDate()
      );
      
      if (currentDayIndex !== -1) {
        setTimeout(() => {
          scrollViewRef.current.scrollTo({
            x: (currentDayIndex - 2) * (width / 7),
            animated: true,
          });
        }, 100);
      }
    }
  };
  
  // Navigate to previous month
  const goToPrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };
  
  // Select a date
  const selectDate = (date) => {
    setSelectedDate(date);
    if (isCalendarExpanded) {
      setIsCalendarExpanded(false);
    }
  };
  
  // Toggle calendar view
  const toggleCalendarView = () => {
    setIsCalendarExpanded(!isCalendarExpanded);
  };
  
  // Format time (24h to 12h)
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    
    // Para las horas completas - formato simplificado (9AM)
    if (minutes === '00') {
      return `${formattedHour}${ampm}`;
    }
    
    // Para las medias horas - solo mostrar número con formato más sutil (30)
    if (minutes === '30') {
      return `·${minutes}`;
    }
    
    // Para los cuartos de hora - solo mostrar número con formato más sutil (15, 45)
    if (minutes === '15' || minutes === '45') {
      return `·${minutes}`;
    }
    
    // Formato completo para otros casos (aunque no deberían usarse)
    return `${formattedHour}:${minutes}`;
  };
  
  // Calculate end time
  const calculateEndTime = (startTime, durationMinutes) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0);
    
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    const endHours = endDate.getHours();
    const endMinutes = endDate.getMinutes();
    
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };
  
  // Create a new appointment
  const createNewAppointment = () => {
    // Navigate to appointment creation screen with selected date and time if available
    navigation.navigate('BookAppointment', { 
      selectedDate: selectedDate,
      selectedTime: selectedTimeSlot
    });
  };
  
  // Day view component for horizontal scrolling calendar
  const renderDayItem = ({ item, index }) => {
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
          {daysOfWeek[item.date.getDay()]}
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
  
  // Render calendar week header
  const renderWeekDaysHeader = () => (
    <View style={styles.weekDaysHeader}>
      {daysOfWeek.map((day, index) => (
        <Text key={index} style={styles.weekDayText}>{day}</Text>
      ))}
    </View>
  );
  
  // Render month view calendar
  const renderMonthCalendar = () => {
    const chunks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      chunks.push(calendarDays.slice(i, i + 7));
    }
    
    return (
      <View style={styles.monthCalendarContainer}>
        {renderWeekDaysHeader()}
        {chunks.map((week, weekIndex) => (
          <View key={`week-${weekIndex}`} style={styles.weekRow}>
            {week.map((day, dayIndex) => {
              const isSelected = selectedDate.toDateString() === day.date.toDateString();
              const isToday = day.isToday;
              
              return (
                <TouchableOpacity
                  key={`day-${weekIndex}-${dayIndex}`}
                  style={[
                    styles.calendarDay,
                    !day.isCurrentMonth && styles.otherMonthDay,
                    isSelected && styles.selectedDay,
                    isToday && styles.today,
                  ]}
                  onPress={() => selectDate(day.date)}
                >
                  <Text style={[
                    styles.calendarDayText,
                    !day.isCurrentMonth && styles.otherMonthDayText,
                    isSelected && styles.selectedDayText,
                    isToday && !isSelected && styles.todayText,
                  ]}>
                    {day.day}
                  </Text>
                  {day.hasAppointments && (
                    <View style={[
                      styles.appointmentIndicator,
                      isSelected && styles.selectedAppointmentIndicator,
                    ]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };
  
  // Render a time slot
  const renderTimeSlot = (time, isOccupied = false, appointment = null) => {
    const isSelected = selectedTimeSlot === time;
    
    if (isOccupied && appointment) {
      return (
        <TouchableOpacity 
          key={`appointment-${appointment.id}`}
          style={[
            styles.appointmentSlot,
            appointment.status === 'confirmed' ? styles.confirmedAppointment : styles.pendingAppointment,
          ]}
          onPress={() => {
            // Show appointment details
            navigation.navigate('AppointmentDetails', { appointment });
          }}
        >
          <View style={styles.appointmentHeader}>
            <Text style={styles.appointmentTime}>
              {formatTime(appointment.time)} - {formatTime(calculateEndTime(appointment.time, appointment.duration))}
            </Text>
            <View style={styles.appointmentStatus}>
              <View style={[
                styles.statusDot,
                { backgroundColor: appointment.status === 'confirmed' ? '#10B981' : '#FBBF24' }
              ]} />
              <Text style={styles.appointmentStatusText}>
                {appointment.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
              </Text>
            </View>
          </View>
          
          <View style={styles.appointmentBody}>
            <View style={styles.appointmentClientInfo}>
              <View style={styles.serviceInfo}>
                <Text style={styles.appointmentService}>{appointment.service}</Text>
                <Text style={styles.appointmentDuration}>
                  {appointment.duration} min · ${appointment.price.toFixed(2)}
                </Text>
              </View>
            </View>
            
            <View style={styles.appointmentProfessionalInfo}>
              <Image 
                source={{ uri: appointment.professionalImage }} 
                style={styles.professionalImage}
              />
              <Text style={styles.professionalName}>{appointment.professionalName}</Text>
            </View>
          </View>
          
          <View style={styles.appointmentActions}>
            <TouchableOpacity style={styles.appointmentActionButton}>
              <Ionicons name="chatbubble-outline" size={16} color="#6B7280" />
              <Text style={styles.appointmentActionText}>Mensaje</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.appointmentActionButton}>
              <Ionicons name="pencil-outline" size={16} color="#6B7280" />
              <Text style={styles.appointmentActionText}>Editar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.appointmentActionButton, styles.dangerAction]}>
              <Ionicons name="close-outline" size={16} color="#EF4444" />
              <Text style={[styles.appointmentActionText, styles.dangerActionText]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    }
    
    return null;
  };
  
  // Generate time slots from 9:00 to 18:00 based on zoom level
  const generateTimeSlots = () => {
    const slots = [];
    let interval;
    
    // Define interval based on zoom level
    switch (zoomLevel) {
      case 1: // Low detail - 60min intervals
        interval = 60;
        break;
      case 2: // Medium detail - 30min intervals
        interval = 30;
        break;
      case 3: // High detail - 15min intervals
        interval = 15;
        break;
      default:
        interval = 15;
    }
    
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        if (hour === 18 && minute > 0) continue; // End at 18:00
        
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };
  
  // Get all appointments that overlap with a specific time slot
  const getAppointmentsForTimeSlot = (timeSlot) => {
    const appointmentsForDate = fetchAppointmentsForDate(selectedDate);
    if (!appointmentsForDate) return [];
    
    return appointmentsForDate.filter(appointment => {
      // Get appointment start and end time
      const startTime = appointment.time;
      const [startHour, startMinute] = startTime.split(':').map(Number);
      
      const endTime = calculateEndTime(startTime, appointment.duration);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      
      // Convert current time slot to numbers for comparison
      const [slotHour, slotMinute] = timeSlot.split(':').map(Number);
      
      // Calculate total minutes for easy comparison
      const slotTotalMinutes = slotHour * 60 + slotMinute;
      const startTotalMinutes = startHour * 60 + startMinute;
      const endTotalMinutes = endHour * 60 + endMinute;
      
      // Check if this slot is within appointment time range
      return slotTotalMinutes >= startTotalMinutes && slotTotalMinutes < endTotalMinutes;
    });
  };
  
  // Calculate how many slots an appointment spans based on zoom level
  const getAppointmentDurationInSlots = (appointment) => {
    // Define slot duration in minutes based on zoom level
    const slotDuration = (() => {
      switch (zoomLevel) {
        case 1: return 60;  // 60min intervals
        case 2: return 30;  // 30min intervals
        case 3: return 15;  // 15min intervals
        default: return 15;
      }
    })();
    
    return Math.ceil(appointment.duration / slotDuration);
  };
  
  // Render appointments for the selected date in timeline view
  const renderAppointmentsForSelectedDate = () => {
    const timeSlots = generateTimeSlots();
    const appointmentsForDate = fetchAppointmentsForDate(selectedDate);
    
    if (!appointmentsForDate || appointmentsForDate.length === 0) {
      return (
        <View style={styles.noAppointmentsContainer}>
          <Ionicons name="calendar-outline" size={64} color="#D1D5DB" />
          <Text style={styles.noAppointmentsText}>No hay turnos para este día</Text>
          <Text style={styles.noAppointmentsSubText}>
            Programa un nuevo turno presionando el botón +
          </Text>
          <TouchableOpacity 
            style={styles.createAppointmentButton}
            onPress={createNewAppointment}
          >
            <Text style={styles.createAppointmentText}>Crear turno</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    // Create an array of rendered appointment blocks to avoid duplicates
    const renderedAppointments = new Set();
    
    return (
      // Usar solo el gesto de pellizco directamente para evitar conflictos
      <GestureDetector gesture={pinchGesture}>
        <ScrollView 
          ref={timelineScrollRef}
          style={styles.timelineContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          // Configuración para evitar el warning de VirtualizedList
          removeClippedSubviews={false}
          nestedScrollEnabled={true}
        >
        <View style={styles.timelineHeader}>
          <Text style={styles.timelineHeaderText}>Hora</Text>
          <Text style={styles.timelineHeaderText}>Agenda</Text>
          <View style={styles.zoomControls}>
            <TouchableOpacity
              style={[styles.zoomButton, zoomLevel === 1 ? styles.zoomButtonActive : null]}
              onPress={() => setZoomLevel(1)}
              disabled={zoomLevel === 1}
            >
              <Text style={styles.zoomButtonText}>1h</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.zoomButton, zoomLevel === 2 ? styles.zoomButtonActive : null]}
              onPress={() => setZoomLevel(2)}
              disabled={zoomLevel === 2}
            >
              <Text style={styles.zoomButtonText}>30m</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.zoomButton, zoomLevel === 3 ? styles.zoomButtonActive : null]}
              onPress={() => setZoomLevel(3)}
              disabled={zoomLevel === 3}
            >
              <Text style={styles.zoomButtonText}>15m</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.timelineContent}>
          {/* Left column: Time labels */}
          <View style={styles.timeLabelsColumn}>
            {timeSlots.map((slot, index) => {
              // Calcular altura según nivel de zoom (valores más precisos)
              const getSlotHeight = () => {
                switch (zoomLevel) {
                  case 1: return 120; // 1 slot por hora = 120px
                  case 2: return 60;  // 2 slots por hora = 60px cada uno
                  case 3: return 30;  // 4 slots por hora = 30px cada uno
                  default: return 30;
                }
              };
              
              // Determinar si se debe mostrar esta etiqueta basada en el nivel de zoom
              const shouldShowLabel = () => {
                const [hour, minute] = slot.split(':').map(Number);
                const isHourLabel = minute === 0;
                const isHalfHourLabel = minute === 30;
                const isQuarterHourLabel = minute === 15 || minute === 45;
                
                switch (zoomLevel) {
                  case 1: return isHourLabel; // Solo horas completas en zoom nivel 1
                  case 2: return isHourLabel || isHalfHourLabel; // Horas completas y medias en zoom nivel 2
                  case 3: return isHourLabel || isHalfHourLabel || isQuarterHourLabel; // Cada 15 minutos en zoom nivel 3
                  default: return minute % 15 === 0;
                }
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
                      isHalfHourLabel && styles.timeLabelTextMedium,
                      isQuarterHourLabel && styles.timeLabelTextSmall,
                      // Color más suave para todas las marcas de tiempo
                      { color: isFullHourLabel ? '#555555' : isHalfHourLabel ? '#888888' : '#aaaaaa' }
                    ]}
                    numberOfLines={1}
                  >
                    {formatTime(slot)}
                  </Text>
                </View>
              );
            })}
          </View>
          
          {/* Right column: Appointment slots */}
          <View style={styles.appointmentSlotsColumn}>
            {/* Hour divider lines */}
            {timeSlots.map((slot, index) => {
              // Calcular altura según nivel de zoom
              const getSlotHeight = () => {
                switch (zoomLevel) {
                  case 1: return 120; // 1 slot por hora = 120px
                  case 2: return 60;  // 2 slots por hora = 60px cada uno
                  case 3: return 30;  // 4 slots por hora = 30px cada uno
                  default: return 30;
                }
              };
              
              // Determinar si se debe mostrar esta línea divisoria
              const shouldShowDivider = () => {
                const [hour, minute] = slot.split(':').map(Number);
                const isHourDivider = minute === 0;
                const isHalfHourDivider = minute === 30;
                
                switch (zoomLevel) {
                  case 1: return isHourDivider; // Solo horas completas en zoom nivel 1
                  case 2: return isHourDivider || isHalfHourDivider; // Horas completas y medias en zoom nivel 2
                  case 3: return minute % 15 === 0; // Cada 15 minutos en zoom nivel 3
                  default: return minute % 15 === 0;
                }
              };
              
              // Determinar el estilo de la línea (más oscura para horas completas)
              const isFullHourDivider = slot.endsWith(':00');
              
              // Solo renderizar si debe mostrarse la línea
              if (!shouldShowDivider()) return null;
              
              return (
                <View 
                  key={`divider-${index}`} 
                  style={[
                    styles.hourDivider, 
                    { top: index * getSlotHeight() },
                    isFullHourDivider && styles.fullHourDivider
                  ]} 
                />
              );
            })}
            
            {/* Time slots */}
            {timeSlots.map((timeSlot, index) => {
              const appointments = getAppointmentsForTimeSlot(timeSlot);
              
              // Si no hay citas en este horario o ya se han renderizado todas
              if (appointments.length === 0 || 
                  appointments.every(apt => renderedAppointments.has(apt.id))) {
                return (
                  <TouchableOpacity 
                    key={`slot-${index}`} 
                    style={[
                      styles.timeSlot, 
                      index % 4 === 0 && styles.hourStartSlot
                    ]}
                    onPress={() => setSelectedTimeSlot(timeSlot)}
                  >
                    {/* Empty view for spacing */}
                  </TouchableOpacity>
                );
              }
              
              // Filtrar solo las citas no renderizadas aún
              const appointmentsToRender = appointments
                .filter(apt => !renderedAppointments.has(apt.id));
              
              // Si tenemos múltiples citas en el mismo horario
              if (appointmentsToRender.length > 0) {
                // Marcar estas citas como renderizadas
                appointmentsToRender.forEach(apt => renderedAppointments.add(apt.id));
                
                // Contenedor horizontal para múltiples citas
                return (
                  <ScrollView 
                    key={`slot-container-${index}`}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.multipleAppointmentsContainer}
                  >
                    {appointmentsToRender.map((appointment, aptIndex) => {
                      // Calcular slots que ocupa esta cita
                      const slotsCount = getAppointmentDurationInSlots(appointment);
                      
                      return (
                        <TouchableOpacity 
                          key={`apt-${appointment.id}`}
                          style={[
                            styles.appointmentBlock,
                            { 
                              height: slotsCount * 30, // Altura según duración
                              width: appointmentsToRender.length > 1 ? 150 : '100%' // Ancho fijo para múltiples citas
                            },
                            appointment.status === 'confirmed' ? styles.confirmedAppointment : styles.pendingAppointment,
                            index % 4 === 0 && styles.hourStartSlot,
                            aptIndex > 0 && styles.adjacentAppointment // Estilo especial para citas adicionales
                          ]}
                          onPress={() => navigation.navigate('AppointmentDetails', { appointment })}
                        >
                          <View style={styles.appointmentBlockHeader}>
                            <Text style={styles.appointmentTimeRange} numberOfLines={1}>
                              {formatTime(appointment.time)} - {formatTime(calculateEndTime(appointment.time, appointment.duration))}
                            </Text>
                            <View style={styles.appointmentStatus}>
                              <View style={[
                                styles.statusDot,
                                { backgroundColor: appointment.status === 'confirmed' ? '#10B981' : '#FBBF24' }
                              ]} />
                            </View>
                          </View>
                          
                          <Text style={styles.appointmentService} numberOfLines={1}>{appointment.service}</Text>
                          
                          <Text style={styles.appointmentClientName} numberOfLines={1}>{appointment.clientName}</Text>
                          
                          <View style={styles.appointmentProfessionalInfo}>
                            <Image 
                              source={{ uri: appointment.professionalImage }} 
                              style={styles.timelineProfessionalImage}
                            />
                            <Text style={styles.timelineProfessionalName} numberOfLines={1}>{appointment.professionalName}</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                );
              }
              
              // Empty slot
              return (
                <TouchableOpacity 
                  key={`slot-${index}`} 
                  style={[
                    styles.timeSlot, 
                    selectedTimeSlot === timeSlot && styles.selectedEmptySlot,
                    index % 4 === 0 && styles.hourStartSlot
                  ]}
                  onPress={() => {
                    setSelectedTimeSlot(timeSlot);
                    // Open booking screen with this time pre-selected
                    navigation.navigate('BookAppointment', { selectedTime: timeSlot, selectedDate: selectedDate });
                  }}
                />
              );
            })}
          </View>
        </View>
        
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
      </ScrollView>
      </GestureDetector>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Turnos</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={[styles.viewModeButton, viewMode === 'day' && styles.activeViewModeButton]} 
            onPress={() => setViewMode('day')}
          >
            <Text style={[styles.viewModeText, viewMode === 'day' && styles.activeViewModeText]}>Día</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.viewModeButton, viewMode === 'week' && styles.activeViewModeButton]} 
            onPress={() => setViewMode('week')}
          >
            <Text style={[styles.viewModeText, viewMode === 'week' && styles.activeViewModeText]}>Semana</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.viewModeButton, viewMode === 'month' && styles.activeViewModeButton]} 
            onPress={() => setViewMode('month')}
          >
            <Text style={[styles.viewModeText, viewMode === 'month' && styles.activeViewModeText]}>Mes</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Animated.View style={[styles.calendarContainer, { height: calendarHeight }]}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={toggleCalendarView} style={styles.monthYearContainer}>
            <Text style={styles.monthYearText}>
              {monthsOfYear[selectedMonth]} {selectedYear}
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
            <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
              <Ionicons name="chevron-forward" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        
        {isCalendarExpanded ? (
          renderMonthCalendar()
        ) : (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.daysScrollView}
            ref={scrollViewRef}
          >
            {calendarDays.filter(day => day.isCurrentMonth).map((day, index) => (
              <View key={`day-${index}`}>
                {renderDayItem({ item: day, index })}
              </View>
            ))}
          </ScrollView>
        )}
      </Animated.View>
      
      <View style={styles.appointmentsContainer}>
        <View style={styles.dateHeader}>
          <Text style={styles.selectedDateText}>
            {selectedDate.getDate()} {monthsOfYear[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </Text>
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeText}>
              {fetchAppointmentsForDate(selectedDate)?.length || 0} turnos
            </Text>
          </View>
        </View>
        
        {renderAppointmentsForSelectedDate()}
      </View>
      
      <TouchableOpacity
        style={styles.fabButton}
        onPress={createNewAppointment}
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerButtons: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  viewModeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activeViewModeButton: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  viewModeText: {
    fontSize: 13,
    color: '#6B7280',
  },
  activeViewModeText: {
    color: '#111827',
    fontWeight: '500',
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 8,
    overflow: 'hidden',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  monthYearContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthYearText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 4,
  },
  navigationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    padding: 4,
    marginLeft: 8,
  },
  daysScrollView: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  dayItem: {
    width: width / 7 - 8,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  selectedDayItem: {
    backgroundColor: colors.primary,
  },
  otherMonthDayItem: {
    opacity: 0.4,
  },
  todayDayItem: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  dayOfWeekText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  dayNumberText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  selectedDayText: {
    color: '#FFFFFF',
  },
  otherMonthDayText: {
    color: '#9CA3AF',
  },
  hasAppointmentsDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
  selectedDotColor: {
    backgroundColor: '#FFFFFF',
  },
  weekDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    width: width / 7,
    textAlign: 'center',
  },
  monthCalendarContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  calendarDay: {
    width: width / 7 - 10,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  otherMonthDay: {
    opacity: 0.4,
  },
  selectedDay: {
    backgroundColor: colors.primary,
  },
  today: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  calendarDayText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  todayText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  appointmentIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 2,
  },
  selectedAppointmentIndicator: {
    backgroundColor: '#FFFFFF',
  },
  appointmentsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  dateBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dateBadgeText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  timeSlotsList: {
    paddingBottom: 100,
  },
  appointmentSlot: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderLeftWidth: 4,
  },
  confirmedAppointment: {
    borderLeftColor: '#10B981',
  },
  pendingAppointment: {
    borderLeftColor: '#FBBF24',
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  appointmentTime: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  appointmentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  appointmentStatusText: {
    fontSize: 13,
    color: '#6B7280',
  },
  appointmentBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  appointmentClientInfo: {
    flex: 1,
  },
  serviceInfo: {
    marginBottom: 4,
  },
  appointmentService: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  appointmentDuration: {
    fontSize: 13,
    color: '#6B7280',
  },
  appointmentProfessionalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  professionalImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  professionalName: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  appointmentActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  appointmentActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  appointmentActionText: {
    marginLeft: 4,
    fontSize: 13,
    color: '#6B7280',
  },
  dangerAction: {
    marginLeft: 'auto',
  },
  dangerActionText: {
    color: '#EF4444',
  },
  noAppointmentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  noAppointmentsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 12,
    marginBottom: 8,
  },
  noAppointmentsSubText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  createAppointmentButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createAppointmentText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  fabButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Timeline view styles
  timelineContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
  },
  timelineHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  timelineHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  timelineContent: {
    flexDirection: 'row',
    flex: 1,
  },
  timeLabelsColumn: {
    width: 40, // Reducido aún más a 40px
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-end', // Alineamos a la derecha
    paddingRight: 6, // Pequeño padding derecho
    paddingTop: 4,
  },
  appointmentSlotsColumn: {
    flex: 1,
    position: 'relative',
  },
  timeLabel: {
    // El alto se ajusta dinámicamente en el componente
    height: 120, // Valor predeterminado, será ajustado en tiempo de ejecución
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 6,
  },
  timeLabelText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '400',
  },
  timeLabelTextSmall: {
    fontSize: 9,
    fontWeight: '300',
    color: '#9CA3AF',
  },
  timeSlot: {
    height: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  hourStartSlot: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  selectedEmptySlot: {
    backgroundColor: '#FEE2E2',
  },
  appointmentBlock: {
    position: 'absolute',
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 10,
  },
  appointmentBlockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  appointmentTimeRange: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  hourDivider: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#F3F4F6',
    zIndex: 5,
  },
  fullHourDivider: {
    backgroundColor: '#E5E7EB',
    height: 1,
  },
  currentTimeIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 20,
  },
  currentTimeIndicatorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginLeft: 54,
    marginRight: -6,
  },
  currentTimeIndicatorLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.primary,
    zIndex: 20,
  },
  timelineProfessionalImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 4,
  },
  timelineProfessionalName: {
    fontSize: 11,
    color: '#6B7280',
  },
  appointmentClientName: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 4,
  },
  zoomControls: {
    flexDirection: 'row',
    position: 'absolute',
    right: 10,
    alignItems: 'center',
  },
  zoomButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 4,
    backgroundColor: '#F3F4F6',
  },
  zoomButtonActive: {
    backgroundColor: colors.primary,
  },
  zoomButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
  },
  timeLabelText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#444444',
  },
  timeLabelTextMedium: {
    fontSize: 9,
    fontWeight: '400',
    color: '#777777',
  },
  timeLabelTextSmall: {
    fontSize: 8,
    fontWeight: '300',
    color: '#999999',
  },
  multipleAppointmentsContainer: {
    flexDirection: 'row',
    paddingRight: 10,
    alignItems: 'flex-start',
  },
  adjacentAppointment: {
    marginLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#ffffff',
  },
});
