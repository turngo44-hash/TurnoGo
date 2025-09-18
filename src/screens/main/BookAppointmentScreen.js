import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../constants/colors';

const services = [
  { id: 's1', name: 'Corte de cabello', price: 25.00, duration: 45 },
  { id: 's2', name: 'Afeitado completo', price: 18.00, duration: 30 },
  { id: 's3', name: 'Coloración', price: 65.00, duration: 90 },
  { id: 's4', name: 'Peinado', price: 35.00, duration: 60 },
  { id: 's5', name: 'Barba y bigote', price: 20.00, duration: 30 },
  { id: 's6', name: 'Tratamiento capilar', price: 45.00, duration: 60 },
];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '14:00', '14:30', '15:00',
  '15:30', '16:00', '16:30', '17:00', '17:30', '18:00',
];

export default function BookAppointmentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get route params
  const initialProfessional = route.params?.professional;
  const initialDate = route.params?.selectedDate ? new Date(route.params.selectedDate) : new Date();
  const initialTime = route.params?.selectedTime;
  
  const [date, setDate] = useState(initialDate);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(initialTime || null);
  const [selectedProfessional, setSelectedProfessional] = useState(initialProfessional || null);
  const [notes, setNotes] = useState('');
  const [existingAppointments, setExistingAppointments] = useState([]);
  
  // Sample professionals data for selection
  const [professionals, setProfessionals] = useState([
    {
      id: 'prof1',
      name: 'Carlos Méndez',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      specialty: 'Estilista Senior',
      rating: 4.8,
      reviews: 124,
    },
    {
      id: 'prof2',
      name: 'Laura Torres',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      specialty: 'Colorista',
      rating: 4.9,
      reviews: 89,
    },
    {
      id: 'prof3',
      name: 'Miguel Sánchez',
      image: 'https://randomuser.me/api/portraits/men/85.jpg',
      specialty: 'Barbero',
      rating: 4.7,
      reviews: 56,
    },
  ]);
  
  // Format the date for display
  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    
    const monthNames = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    return `${day} de ${monthNames[month]} ${year}`;
  };
  
  // Format time (24h to 12h)
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };
  
  // Check if time slot is available
  const isTimeSlotAvailable = (timeSlot) => {
    // Check if there's an existing appointment at this time slot
    return !existingAppointments.some(appointment => 
      appointment.time === timeSlot &&
      appointment.date.toDateString() === date.toDateString()
    );
  };
  
  // Load existing appointments
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const storedAppointments = await AsyncStorage.getItem('sampleAppointments');
        if (storedAppointments) {
          const appointments = JSON.parse(storedAppointments);
          setExistingAppointments(appointments.map(appt => ({
            ...appt,
            date: new Date(appt.date),
          })));
        }
      } catch (error) {
        console.error('Error loading appointments:', error);
      }
    };
    
    loadAppointments();
  }, []);
  
  // Go to previous day
  const goToPreviousDay = () => {
    const previousDay = new Date(date);
    previousDay.setDate(date.getDate() - 1);
    setDate(previousDay);
  };
  
  // Go to next day
  const goToNextDay = () => {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    setDate(nextDay);
  };
  
  // Handle booking confirmation
  const handleBookAppointment = async () => {
    if (!selectedService || !selectedTimeSlot || !selectedProfessional) {
      Alert.alert('Información incompleta', 'Por favor selecciona un servicio, un horario y un profesional.');
      return;
    }
    
    // Create new appointment object
    const newAppointment = {
      id: `appt-${Date.now()}`,
      service: selectedService.name,
      date: date,
      time: selectedTimeSlot,
      duration: selectedService.duration,
      price: selectedService.price,
      professionalId: selectedProfessional.id,
      professionalName: selectedProfessional.name,
      professionalImage: selectedProfessional.image,
      clientName: 'Tu nombre', // Would come from user profile in a real app
      notes: notes,
      status: 'pending',
      confirmed: false,
    };
    
    try {
      // Get existing appointments
      const storedAppointmentsJSON = await AsyncStorage.getItem('sampleAppointments');
      const storedAppointments = storedAppointmentsJSON ? JSON.parse(storedAppointmentsJSON) : [];
      
      // Add the new appointment
      const updatedAppointments = [...storedAppointments, newAppointment];
      
      // Save updated appointments
      await AsyncStorage.setItem('sampleAppointments', JSON.stringify(updatedAppointments));
      
      // Show success message
      Alert.alert(
        'Turno Agendado',
        'Tu turno ha sido agendado exitosamente.',
        [{ text: 'OK', onPress: () => navigation.navigate('Appointments') }]
      );
    } catch (error) {
      console.error('Error saving appointment:', error);
      Alert.alert('Error', 'No se pudo guardar el turno. Inténtalo nuevamente.');
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agendar Turno</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fecha</Text>
          <View style={styles.dateSelector}>
            <TouchableOpacity 
              style={styles.dateArrow} 
              onPress={goToPreviousDay}
            >
              <Ionicons name="chevron-back" size={24} color="#111827" />
            </TouchableOpacity>
            
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{formatDate(date)}</Text>
              <Text style={styles.dayText}>
                {['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][date.getDay()]}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.dateArrow} 
              onPress={goToNextDay}
            >
              <Ionicons name="chevron-forward" size={24} color="#111827" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Servicio</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesContainer}
          >
            {services.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.serviceCard,
                  selectedService?.id === service.id && styles.selectedServiceCard,
                ]}
                onPress={() => setSelectedService(service)}
              >
                <Text style={[
                  styles.serviceName,
                  selectedService?.id === service.id && styles.selectedServiceText,
                ]}>
                  {service.name}
                </Text>
                <Text style={[
                  styles.serviceDetails,
                  selectedService?.id === service.id && styles.selectedServiceText,
                ]}>
                  ${service.price.toFixed(2)} · {service.duration} min
                </Text>
                {selectedService?.id === service.id && (
                  <View style={styles.selectedIndicator}>
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horario Disponible</Text>
          <View style={styles.timeSlotGrid}>
            {timeSlots.map((slot) => {
              const isAvailable = isTimeSlotAvailable(slot);
              return (
                <TouchableOpacity
                  key={slot}
                  style={[
                    styles.timeSlot,
                    !isAvailable && styles.unavailableTimeSlot,
                    selectedTimeSlot === slot && styles.selectedTimeSlot,
                  ]}
                  onPress={() => isAvailable && setSelectedTimeSlot(slot)}
                  disabled={!isAvailable}
                >
                  <Text style={[
                    styles.timeSlotText,
                    !isAvailable && styles.unavailableTimeSlotText,
                    selectedTimeSlot === slot && styles.selectedTimeSlotText,
                  ]}>
                    {formatTime(slot)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profesional</Text>
          <View style={styles.professionalsContainer}>
            {professionals.map((professional) => (
              <TouchableOpacity
                key={professional.id}
                style={[
                  styles.professionalCard,
                  selectedProfessional?.id === professional.id && styles.selectedProfessionalCard,
                ]}
                onPress={() => setSelectedProfessional(professional)}
              >
                <Image source={{ uri: professional.image }} style={styles.professionalImage} />
                <View style={styles.professionalInfo}>
                  <Text style={styles.professionalName}>{professional.name}</Text>
                  <Text style={styles.professionalSpecialty}>{professional.specialty}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#FBBF24" />
                    <Text style={styles.ratingText}>{professional.rating}</Text>
                    <Text style={styles.reviewsText}>({professional.reviews})</Text>
                  </View>
                </View>
                {selectedProfessional?.id === professional.id && (
                  <View style={styles.professionalSelectedIndicator}>
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notas (opcional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Agrega información adicional para el profesional..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        <View style={styles.summarySection}>
          <Text style={styles.summarySectionTitle}>Resumen</Text>
          
          {selectedService && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Servicio:</Text>
              <Text style={styles.summaryValue}>{selectedService.name}</Text>
            </View>
          )}
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Fecha:</Text>
            <Text style={styles.summaryValue}>{formatDate(date)}</Text>
          </View>
          
          {selectedTimeSlot && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Hora:</Text>
              <Text style={styles.summaryValue}>{formatTime(selectedTimeSlot)}</Text>
            </View>
          )}
          
          {selectedProfessional && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Profesional:</Text>
              <Text style={styles.summaryValue}>{selectedProfessional.name}</Text>
            </View>
          )}
          
          {selectedService && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Duración:</Text>
              <Text style={styles.summaryValue}>{selectedService.duration} min</Text>
            </View>
          )}
          
          {selectedService && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Precio:</Text>
              <Text style={styles.summaryValue}>${selectedService.price.toFixed(2)}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.bookButton,
              (!selectedService || !selectedTimeSlot || !selectedProfessional) && styles.disabledButton
            ]}
            onPress={handleBookAppointment}
            disabled={!selectedService || !selectedTimeSlot || !selectedProfessional}
          >
            <Text style={styles.bookButtonText}>Confirmar Turno</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  scrollContent: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateArrow: {
    padding: 8,
  },
  dateContainer: {
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  dayText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  servicesContainer: {
    paddingRight: 16,
  },
  serviceCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginRight: 12,
    minWidth: 140,
    position: 'relative',
  },
  selectedServiceCard: {
    backgroundColor: colors.primary,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  serviceDetails: {
    fontSize: 13,
    color: '#6B7280',
  },
  selectedServiceText: {
    color: '#FFFFFF',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeSlotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlot: {
    width: '31%',
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  unavailableTimeSlot: {
    backgroundColor: '#E5E7EB',
  },
  selectedTimeSlot: {
    backgroundColor: colors.primary,
  },
  timeSlotText: {
    fontSize: 14,
    color: '#111827',
  },
  unavailableTimeSlotText: {
    color: '#9CA3AF',
  },
  selectedTimeSlotText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  professionalsContainer: {
    marginBottom: 8,
  },
  professionalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginBottom: 12,
    position: 'relative',
  },
  selectedProfessionalCard: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: '#FFFFFF',
  },
  professionalImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  professionalInfo: {
    marginLeft: 12,
    flex: 1,
  },
  professionalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  professionalSpecialty: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    marginLeft: 4,
    marginRight: 2,
  },
  reviewsText: {
    fontSize: 13,
    color: '#6B7280',
  },
  professionalSelectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  notesInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    height: 100,
    fontSize: 15,
    color: '#111827',
  },
  summarySection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    marginBottom: 24,
  },
  summarySectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  summaryLabel: {
    fontSize: 15,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  bookButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
