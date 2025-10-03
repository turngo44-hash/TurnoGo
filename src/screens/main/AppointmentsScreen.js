import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../constants/colors';
import { LocaleConfig, Calendar, CalendarProvider, WeekCalendar, ExpandableCalendar } from 'react-native-calendars';
import AppointmentTimelineCard from './components/AppointmentTimelineCard';

export default function AppointmentsScreen() {
// Component state, refs and constants
const navigation = useNavigation();
const [selectedDate, setSelectedDate] = useState(new Date());
const [appointments, setAppointments] = useState([]);
const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
const [viewMode, setViewMode] = useState('day');
const calendarAnimation = useRef(new Animated.Value(0)).current;
const chevronAnim = useRef(new Animated.Value(isCalendarExpanded ? 1 : 0)).current;
const dragStartY = useRef(null);
const timelineScrollRef = useRef(null);
const pinchGesture = Gesture.Pinch();
const headerHeightRef = useRef(60);
const [headerHeight, setHeaderHeight] = useState(60);
const [weekHeight, setWeekHeight] = useState(90);
const EXPANDED_CALENDAR_HEIGHT = 320;

  // Configure Spanish locale for react-native-calendars
  LocaleConfig.locales['es'] = {
    monthNames: ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],
    monthNamesShort: ['ene.','feb.','mar.','abr.','may.','jun.','jul.','ago.','sept.','oct.','nov.','dic.'],
    dayNames: ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'],
    dayNamesShort: ['dom.','lun.','mar.','mié.','jue.','vie.','sáb.'],
    today: "Hoy"
  };
  LocaleConfig.defaultLocale = 'es';

  // Ref to CalendarProvider (some APIs expose programmatic toggle)
  const calendarProviderRef = useRef(null);
  
  // Animate chevron rotation & scale when calendar expands/collapses
  useEffect(() => {
    Animated.timing(chevronAnim, {
      toValue: isCalendarExpanded ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [isCalendarExpanded]);

  // Build markedDates with multi-dot markers from appointments and selected date
  const markedDates = useMemo(() => {
    const markers = {};
    appointments.forEach((a) => {
      try {
        const dt = new Date(a.date);
        const key = dt.toISOString().slice(0,10);
        if (!markers[key]) markers[key] = { dots: [] };
        const color = a.status === 'confirmed' ? '#10B981' : (a.status === 'pending' ? '#FBBF24' : '#EF4444');
        markers[key].dots.push({ color });
      } catch (e) {}
    });
    const selKey = selectedDate.toISOString().slice(0,10);
    if (!markers[selKey]) markers[selKey] = {};
    markers[selKey].selected = true;
    markers[selKey].selectedColor = colors.primary;
    return markers;
  }, [appointments, selectedDate]);

  // Count appointments for selected date (badge in compact header)
  const appointmentCountForSelected = useMemo(() => {
    const key = selectedDate.toISOString().slice(0,10);
    return appointments.filter(a => {
      try { return new Date(a.date).toISOString().slice(0,10) === key; } catch (e) { return false; }
    }).length;
  }, [appointments, selectedDate]);

// Helper to check if two dates are the same day
const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

// Utility placeholders used by timeline rendering
const getSlotHeight = () => 30; // px per 15-min slot (approx)
const calculateCurrentTimePosition = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  if (hours < 9 || hours >= 18) return 0;
  const hoursFromStart = hours - 9;
  const minutesAsDecimal = minutes / 60;
  const totalHoursFromStart = hoursFromStart + minutesAsDecimal;
  const slotsPerHour = 4; // 15-min slots
  return totalHoursFromStart * slotsPerHour * getSlotHeight();
};
  
  // month/year derived from selectedDate when rendering header
  
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
  
  // expand/collapse animation removed
  
  // Load sample appointments
  const loadSampleAppointments = async () => {
    try {
      // Create sample appointments for demo with today's date (Wednesday)
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day
      
      // Create specific appointments for Wednesday as requested
      const sampleData = [
        {
          id: '1',
          clientName: 'Roberto Sánchez Mendoza',
          service: 'Corte y barba',
          date: today,
          time: '10:00', // 10:00 AM
          duration: 60, // 1 hour duration
          price: 25.00,
          confirmed: true,
          professionalId: 'prof1',
          professionalName: 'Carlos Méndez',
          professionalImage: 'https://randomuser.me/api/portraits/men/32.jpg',
          notes: 'Cliente regular, corte clásico con barba completa',
          status: 'confirmed',
        },
        {
          id: '2',
          clientName: 'Kevin Rodríguez',
          service: 'Afeitado rápido',
          date: today,
          time: '11:15', // 11:15 AM
          duration: 15, // 15 min duration
          price: 12.00,
          confirmed: true,
          professionalId: 'prof2',
          professionalName: 'Laura Torres',
          professionalImage: 'https://randomuser.me/api/portraits/women/44.jpg',
          notes: 'Solo afeitado rápido sin corte',
          status: 'confirmed',
        },
        {
          id: '3',
          clientName: 'Francisco Jiménez Vega',
          service: 'Corte completo + barba',
          date: today,
          time: '13:00', // 1:00 PM
          duration: 60, // 1 hour duration
          price: 35.00,
          confirmed: true,
          professionalId: 'prof1',
          professionalName: 'Carlos Méndez',
          professionalImage: 'https://randomuser.me/api/portraits/men/32.jpg',
          notes: 'Cliente nuevo, corte moderno con degradado y barba perfilada',
          status: 'confirmed',
        },
        {
          id: '4',
          clientName: 'Alejandro Ruiz',
          service: 'Barba y bigote',
          date: today,
          time: '13:00', // 1:00 PM (mismo horario)
          duration: 45, // 45 min duration
          price: 20.00,
          confirmed: false,
          professionalId: 'prof2',
          professionalName: 'Laura Torres',
          professionalImage: 'https://randomuser.me/api/portraits/women/44.jpg',
          notes: 'Arreglo de barba y bigote con recorte',
          status: 'pending',
        },
      ];
        
      // Store the appointments in AsyncStorage
      await AsyncStorage.setItem('sampleAppointments', JSON.stringify(sampleData));
      setAppointments(sampleData);
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
  
  // calendarDays generation removed; WeekCalendar handles week view.
  
  // Select a date
  const selectDate = (date) => {
    setSelectedDate(date);
    if (isCalendarExpanded) {
      setIsCalendarExpanded(false);
    }
  };
  
  // Toggle calendar expand/collapse con animaciones mejoradas
  const toggleCalendarView = () => {
    const newExpanded = !isCalendarExpanded;
    setIsCalendarExpanded(newExpanded);
    
    // Animar el chevron con bounce suave
    Animated.spring(chevronAnim, {
      toValue: newExpanded ? 1 : 0,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const collapsedHeight = headerHeight + weekHeight || 120;
  const expandedHeight = headerHeight + EXPANDED_CALENDAR_HEIGHT;

  const calendarHeight = calendarAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [collapsedHeight, expandedHeight],
  });

  // Gesture to drag down/up to expand/collapse
  const pan = Gesture.Pan()
    .onStart(() => {
      dragStartY.current = null;
    })
    .onUpdate((e) => {
      if (dragStartY.current === null) dragStartY.current = e.translationY;
      const dy = e.translationY - dragStartY.current;
      // if dragging down enough, expand; up enough, collapse
      if (dy > 60 && !isCalendarExpanded) {
        toggleCalendarView();
      } else if (dy < -60 && isCalendarExpanded) {
        toggleCalendarView();
      }
    });
  
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
  
  // Old horizontal day renderer removed; WeekCalendar provides day rendering.
  
  // Old week header removed; WeekCalendar handles headers and LocaleConfig sets language.
  
  // Month view removed: we always use WeekCalendar; month-grid logic deleted.
  
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
    // Use fixed 15-minute intervals, can be adjusted by zoomScale for visual sizing
    interval = 15;
    
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
  
  // Calculate how many slots an appointment spans
  const getAppointmentDurationInSlots = (appointment) => {
    // Using fixed 15-minute slot intervals for consistent timing
    const slotDuration = 15;
    
    return Math.ceil(appointment.duration / slotDuration);
  };
  
  // Render appointments for the selected date in timeline view
  const renderAppointmentsForSelectedDate = () => {
    const timeSlots = generateTimeSlots();
    const appointmentsForDate = fetchAppointmentsForDate(selectedDate);
    
    // Siempre mostraremos la plantilla de horas, incluso cuando no haya turnos
    // Solo cambiamos lo que se muestra en el área de turnos
    
    // Create an array of rendered appointment blocks to avoid duplicates
    const renderedAppointments = new Set();
    
    return (
      // Usar solo el gesto de pellizco directamente para evitar conflictos
      <GestureDetector gesture={pinchGesture}>
        <ScrollView 
          ref={timelineScrollRef}
          style={[styles.timelineContainer, { flex: 1 }]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 0 }}
          // Configuración para evitar el warning de VirtualizedList
          removeClippedSubviews={false}
          nestedScrollEnabled={true}
        >
        
        <View style={styles.timelineContent}>
          {/* Left column: Time labels */}
          <View style={styles.timeLabelsColumn}>
            {timeSlots.map((slot, index) => {
              // Usamos la función global getSlotHeight
              
              // Mostrar siempre todas las etiquetas de tiempo (horas, 15, 30, 45)
              const shouldShowLabel = () => {
                const [hour, minute] = slot.split(':').map(Number);
                // Siempre mostrar marcadores de tiempo en intervalos de 15 minutos
                return minute % 15 === 0; // Muestra todas las marcas (00, 15, 30, 45)
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
                      // Estilo más compacto, alineado a la línea superior
                      {
                        fontSize: isFullHourLabel ? 10 : 9, // Ajustado para el formato con a.m./p.m.
                        fontWeight: isFullHourLabel ? '500' : '400',
                        color: isFullHourLabel ? '#333333' : '#9CA3AF',
                        opacity: 1,
                        textAlign: 'right',
                        marginRight: isFullHourLabel ? 0 : 0, // Eliminado el margen para minutos
                        marginTop: 0, // Alineado exactamente con la línea superior
                        height: getSlotHeight() * 0.8, // Altura controlada para mejor alineación
                      }
                    ]}
                    numberOfLines={1}
                  >
                    {isFullHourLabel ? 
                      // Formato con horas y a.m./p.m. como solicitado
                      `${parseInt(slot.split(':')[0]) > 12 ? parseInt(slot.split(':')[0]) - 12 : parseInt(slot.split(':')[0])}${parseInt(slot.split(':')[0]) >= 12 ? 'p.m.' : 'a.m.'}` : 
                      slot.split(':')[1]} {/* Solo mostrar minutos para 15, 30, 45 */}
                  </Text>
                </View>
              );
            })}
          </View>
          
          {/* Right column: Appointment slots */}
          <View style={styles.appointmentSlotsColumn}>
            {/* Hour divider lines */}
            {timeSlots.map((slot, index) => {
              // Usamos la función global getSlotHeight
              
              // Siempre mostrar todas las líneas divisorias de 15 minutos
              const shouldShowDivider = () => {
                const [hour, minute] = slot.split(':').map(Number);
                // Siempre mostrar líneas cada 15 minutos para mayor fluidez visual
                return minute % 15 === 0;
              };
              
              // Determinar el estilo de la línea
              const isFullHourDivider = slot.endsWith(':00');
              const isHalfHourDivider = slot.endsWith(':30');
              const isQuarterHourDivider = slot.endsWith(':15') || slot.endsWith(':45');
              
              // Solo renderizar si debe mostrarse la línea
              if (!shouldShowDivider()) return null;
              
              // Configuración de estilo para líneas similar a Boosky
              let opacity = 1;
              let height = 1;
              let backgroundColor = '#E9EAEE';
              let borderStyle = 'solid'; // Líneas continuas como solicitado
              
              if (isFullHourDivider) {
                // Horas completas - estilo Boosky más limpio
                opacity = 1;
                height = 1;
                backgroundColor = '#DFE1E6'; // Gris medio como en Boosky
              } else if (isHalfHourDivider) {
                // Medias horas
                opacity = 0.9;
                height = 1;
                backgroundColor = '#E5E7EC'; // Gris un poco más claro
              } else if (isQuarterHourDivider) {
                // Cuartos de hora
                opacity = 0.7;
                height = 1; // Mismo grosor para todas las líneas como en Boosky
                backgroundColor = '#EBEDF2'; // Gris muy claro
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
                      zIndex: 10, // Z-index bajo para que las líneas estén detrás de las tarjetas
                      // Sin sombras para un aspecto más plano como en Boosky
                    },
                    isFullHourDivider && styles.fullHourDivider
                  ]} 
                />
              );
            })}
            
            {/* Time slots - solo para citas, sin slots vacíos que duplican líneas */}
            {timeSlots.map((timeSlot, index) => {
              const appointments = getAppointmentsForTimeSlot(timeSlot);
              
              // Si no hay citas en este horario, no renderizamos nada visual
              // Solo dejamos un receptor de toques invisible para la interactividad
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
                      backgroundColor: 'transparent' // Completamente transparente
                    }}
                    onPress={() => {
                      setSelectedTimeSlot(timeSlot);
                      // Abrir la pantalla para agendar un turno
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
                
                // Contenedor horizontal para múltiples citas
                return (
                  <React.Fragment key={`slot-block-${index}`}>
                    {appointmentsToRender.map((appointment, aptIndex) => {
                      // Calcular slots que ocupa esta cita
                      const slotsCount = getAppointmentDurationInSlots(appointment);
                      // Always reserve space for 2 columns so single appointments still take half-width
                      const columns = Math.max(2, appointmentsToRender.length);
                      const widthPercent = 100 / columns;
                      const leftPercent = aptIndex * widthPercent;

                      return (
                        <TouchableOpacity
                          key={`apt-${appointment.id}`}
                          style={{
                            height: slotsCount * getSlotHeight(),
                            position: 'absolute',
                            left: `${leftPercent}%`,
                            width: `${widthPercent}%`,
                            top: index * getSlotHeight(),
                            zIndex: 20,
                            paddingHorizontal: 6,
                            overflow: 'hidden', // asegurar que la tarjeta no sobresalga del área
                          }}
                          onPress={() => navigation.navigate('AppointmentDetails', { appointment })}
                          onLongPress={() => alert('Mantenga presionado para mover la cita')}
                        >
                          <AppointmentTimelineCard
                            appointment={appointment}
                            isShort={appointment.duration <= 15}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </React.Fragment>
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

  // Efecto para hacer scroll automático a la hora actual cuando se carga la pantalla
  // El efecto existente en líneas 135-150 ya maneja esto, así que no necesitamos uno nuevo

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']} >
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Header Boosky - Limpio y Simple */}
      <View style={styles.booskyHeader}>
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={toggleCalendarView}
        >
          <Text style={styles.dateText}>
            {selectedDate.toLocaleDateString('es-ES', { 
              weekday: 'short',
              day: 'numeric',
              month: 'short'
            }).replace(/\./g, '').toLowerCase()}
          </Text>
          <Animated.View style={[styles.chevron, { 
            transform: [{ rotate: chevronAnim.interpolate({ 
              inputRange: [0,1], 
              outputRange: ['0deg','180deg'] 
            }) }] 
          }]}>
            <Ionicons name="chevron-down" size={14} color="#666" />
          </Animated.View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={20} color="#333" />
          {appointmentCountForSelected > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>{appointmentCountForSelected}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Semana siempre visible */}
      <View style={styles.weekContainer}>
        <CalendarProvider
          date={selectedDate.toISOString().slice(0,10)}
          onDateChanged={(dateString) => {
            const [y, m, d] = dateString.split('-').map(Number);
            setSelectedDate(new Date(y, m - 1, d));
          }}
        >
          <WeekCalendar
            current={selectedDate.toISOString().slice(0,10)}
            onDayPress={(day) => {
              const [y, m, d] = day.dateString.split('-').map(Number);
              setSelectedDate(new Date(y, m - 1, d));
            }}
            markedDates={markedDates}
            markingType={'multi-dot'}
            firstDay={1}
            hideArrows={false}
            theme={{
              selectedDayBackgroundColor: '#007AFF',
              selectedDayTextColor: '#FFFFFF',
              todayTextColor: '#007AFF',
              dotColor: '#FF3B30',
              textDayFontWeight: '400',
              textDayHeaderFontWeight: '600',
              textDayHeaderFontSize: 13,
              textDayFontSize: 16,
              dayTextColor: '#1C1C1E',
              backgroundColor: '#FFFFFF',
              calendarBackground: '#FFFFFF',
              arrowColor: '#007AFF',
              disabledArrowColor: '#D1D1D6',
              'stylesheet.day.basic': {
                base: {
                  width: 32,
                  height: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                selected: {
                  backgroundColor: '#007AFF',
                  borderRadius: 16,
                },
                today: {
                  borderColor: '#007AFF',
                  borderWidth: 1,
                  borderRadius: 16,
                },
              },
            }}
            style={styles.weekCalendarStyle}
          />
        </CalendarProvider>
      </View>
      
      {/* Calendario expandido como overlay */}
      {isCalendarExpanded && (
        <Animated.View style={[styles.calendarOverlay, {
          opacity: isCalendarExpanded ? 1 : 0,
          transform: [{ scaleY: isCalendarExpanded ? 1 : 0.95 }]
        }]}>
          <CalendarProvider
            date={selectedDate.toISOString().slice(0,10)}
            onDateChanged={(dateString) => {
              const [y, m, d] = dateString.split('-').map(Number);
              setSelectedDate(new Date(y, m - 1, d));
            }}
          >
            <ExpandableCalendar
              current={selectedDate.toISOString().slice(0,10)}
              onDayPress={(day) => {
                const [y, m, d] = day.dateString.split('-').map(Number);
                setSelectedDate(new Date(y, m - 1, d));
              }}
              markedDates={markedDates}
              markingType={'multi-dot'}
              firstDay={1}
              hideArrows={true}
              hideKnob={true}
              hideHeader={true}
              initialPosition={ExpandableCalendar.positions.OPEN}
              theme={{
                selectedDayBackgroundColor: '#007AFF',
                selectedDayTextColor: '#FFFFFF',
                todayTextColor: '#007AFF',
                dotColor: '#FF3B30',
                textDayFontWeight: '400',
                textDayHeaderFontWeight: '600',
                textDayHeaderFontSize: 13,
                textDayFontSize: 16,
                dayTextColor: '#1C1C1E',
                backgroundColor: '#FFFFFF',
                calendarBackground: '#FFFFFF',
                textSectionTitleColor: '#8E8E93',
                'stylesheet.calendar.header': {
                  header: {
                    height: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                    marginTop: 0,
                    marginBottom: 0,
                  },
                  monthText: {
                    height: 0,
                    fontSize: 0,
                    color: 'transparent',
                  },
                  arrow: {
                    width: 0,
                    height: 0,
                  },
                },
                'stylesheet.day.basic': {
                  base: {
                    width: 32,
                    height: 32,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  selected: {
                    backgroundColor: '#007AFF',
                    borderRadius: 16,
                  },
                  today: {
                    borderColor: '#007AFF',
                    borderWidth: 1,
                    borderRadius: 16,
                  },
                },
              }}
            />
          </CalendarProvider>
        </Animated.View>
      )}      {/* Timeline */}
      <View style={styles.timelineContainer}>
        {renderAppointmentsForSelectedDate()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  fixedHeader: {
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
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

  // Removed old horizontal/month calendar styles that are no longer used.

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
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.04)',
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
  
  // Timeline view styles
  timelineContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginBottom: 0,
    marginTop: 0,
    minHeight: 300,
    width: '100%',
  },
  timeLabelsColumn: {
    width: 50,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-end',
    paddingRight: 8,
    paddingTop: 0,
  },
  timelineHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
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
    width: 48, // Reducido como solicitado
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-end',
    paddingRight: 5, // Margen derecho más pequeño
    paddingTop: 0,
    borderRightWidth: 1,
    borderRightColor: '#F0F0F5',
  },
  appointmentSlotsColumn: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#FFFFFF',
    paddingLeft: 4,
  },
  timeLabel: {
    // El alto se ajusta dinámicamente en el componente
    height: 120, // Valor predeterminado, será ajustado en tiempo de ejecución
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-end', // Alineación a la derecha
    paddingTop: 0, // Sin padding superior para que esté justo debajo de la línea
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
    backgroundColor: 'transparent', // Transparente para evitar duplicación visual
    transition: 'background-color 0.2s ease',
  },
  hourStartSlot: {
    // Eliminamos bordes que duplican las líneas divisorias
  },
  selectedEmptySlot: {
    backgroundColor: '#F9E6E6',
  },
  appointmentBlock: {
    position: 'absolute',
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 5,  // Aumentado para mayor prominencia
    zIndex: 20,    // Aumentado para asegurar que esté por encima de las líneas
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
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
    height: 1, // Grosor uniforme como en Boosky
    backgroundColor: '#E9EAEE', // Color base tipo Boosky
    zIndex: -1, // Valor negativo para asegurar que esté por debajo de todo
    // Líneas rectas sin bordes redondeados como en Boosky
    borderRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.02,
    shadowRadius: 1,
  },
  fullHourDivider: {
    backgroundColor: '#E0E0E5', // Color más elegante para horas completas
    height: 1.5, // Línea ligeramente más gruesa
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
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginLeft: 40,
    marginRight: -5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  currentTimeIndicatorLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: colors.primary,
    zIndex: 20,
    opacity: 0.8,
  },
  timelineProfessionalImage: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#F0F0F5',
  },
  timelineProfessionalName: {
    fontSize: 12,
    color: '#555555',
    fontWeight: '400',
    letterSpacing: 0.1,
  },
  appointmentClientName: {
    fontSize: 13,
    color: '#333333',
    fontWeight: '600',
    marginBottom: 5,
    letterSpacing: 0.2,
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
    fontSize: 11, // Reducido significativamente para mejor ajuste con zoom
    fontWeight: '500',
    color: '#333333',
    letterSpacing: 0,
    fontFamily: 'System',
    textAlign: 'right',
    padding: 0, // Eliminado el padding para ajuste más preciso
  },
  timeLabelTextMedium: {
    fontSize: 9, // Reducido para minutos
    fontWeight: '400',
    color: '#9CA3AF',
    letterSpacing: 0,
  },
  timeLabelTextSmall: {
    fontSize: 9, // Mismo tamaño para todas las marcas de minutos
    fontWeight: '400',
    color: '#9CA3AF',
    letterSpacing: 0.1,
  },
  multipleAppointmentsContainer: {
    // kept for compatibility; multiple appointments are now absolutely positioned
    paddingRight: 10,
    alignItems: 'flex-start',
  },
  adjacentAppointment: {
    marginLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#ffffff',
  },
  // ExpandableCalendar styling
  expandableCalendarStyle: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  calendarHeaderStyle: {
    backgroundColor: '#FFFFFF',
  },
  
  // === BOOSKY DESIGN STYLES ===
  booskyHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.33,
    borderBottomColor: '#C6C6C8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
    marginRight: 6,
    textTransform: 'capitalize',
    letterSpacing: -0.41,
  },
  chevron: {
    marginLeft: 2,
    opacity: 0.6,
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
    borderRadius: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  weekContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 0.33,
    borderBottomColor: '#C6C6C8',
  },
  weekCalendarStyle: {
    paddingHorizontal: 16,
  },
  calendarOverlay: {
    position: 'absolute',
    top: 112, // Justo debajo del header + week
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingBottom: 8,
  },
  timelineContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
});
