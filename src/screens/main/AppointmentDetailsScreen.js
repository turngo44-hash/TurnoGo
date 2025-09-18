import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../constants/colors';

export default function AppointmentDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { appointment } = route.params;
  const [loading, setLoading] = useState(false);
  
  // Format time (24h to 12h)
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
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
  
  // Format the date for display
  const formatDate = (date) => {
    const appointmentDate = new Date(date);
    const day = appointmentDate.getDate();
    const month = appointmentDate.getMonth();
    const year = appointmentDate.getFullYear();
    
    const dayName = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][appointmentDate.getDay()];
    
    const monthNames = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    return `${dayName}, ${day} de ${monthNames[month]} ${year}`;
  };
  
  // Cancel appointment
  const handleCancelAppointment = async () => {
    Alert.alert(
      'Cancelar Turno',
      '¿Estás seguro de que deseas cancelar este turno?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Sí, Cancelar', 
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              // Get existing appointments
              const storedAppointmentsJSON = await AsyncStorage.getItem('sampleAppointments');
              if (storedAppointmentsJSON) {
                const storedAppointments = JSON.parse(storedAppointmentsJSON);
                
                // Filter out the canceled appointment
                const updatedAppointments = storedAppointments.filter(
                  appt => appt.id !== appointment.id
                );
                
                // Save updated appointments
                await AsyncStorage.setItem('sampleAppointments', JSON.stringify(updatedAppointments));
                
                // Navigate back to appointments screen
                navigation.navigate('Appointments');
              }
            } catch (error) {
              console.error('Error canceling appointment:', error);
              Alert.alert('Error', 'No se pudo cancelar el turno. Inténtalo nuevamente.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };
  
  // Reschedule appointment
  const handleRescheduleAppointment = () => {
    // Navigate to booking screen with pre-filled data
    navigation.navigate('BookAppointment', { 
      professional: {
        id: appointment.professionalId,
        name: appointment.professionalName,
        image: appointment.professionalImage,
      },
      isRescheduling: true,
      originalAppointmentId: appointment.id,
    });
  };
  
  // Message professional
  const handleMessageProfessional = () => {
    // Navigate to chat screen with professional
    // This would typically open your chat feature
    Alert.alert('Mensaje', `Enviar mensaje a ${appointment.professionalName}`);
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
        <Text style={styles.headerTitle}>Detalles del Turno</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.statusHeader}>
            <View style={styles.statusBadge}>
              <View 
                style={[
                  styles.statusDot, 
                  { backgroundColor: appointment.status === 'confirmed' ? '#10B981' : '#FBBF24' }
                ]} 
              />
              <Text style={styles.statusText}>
                {appointment.status === 'confirmed' ? 'Confirmado' : 'Pendiente de confirmación'}
              </Text>
            </View>
            <Text style={styles.appointmentIdText}>#{appointment.id.slice(-6)}</Text>
          </View>
          
          <View style={styles.appointmentDateTimeContainer}>
            <View style={styles.iconTextContainer}>
              <View style={styles.iconBackground}>
                <Ionicons name="calendar" size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.labelText}>Fecha</Text>
                <Text style={styles.valueText}>{formatDate(appointment.date)}</Text>
              </View>
            </View>
            
            <View style={styles.iconTextContainer}>
              <View style={styles.iconBackground}>
                <Ionicons name="time" size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.labelText}>Horario</Text>
                <Text style={styles.valueText}>
                  {formatTime(appointment.time)} - {formatTime(calculateEndTime(appointment.time, appointment.duration))}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.serviceContainer}>
            <Text style={styles.sectionTitle}>Servicio</Text>
            
            <View style={styles.serviceCard}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{appointment.service}</Text>
                <Text style={styles.serviceDetails}>
                  {appointment.duration} min · ${appointment.price.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.professionalContainer}>
            <Text style={styles.sectionTitle}>Profesional</Text>
            
            <View style={styles.professionalCard}>
              <Image 
                source={{ uri: appointment.professionalImage }} 
                style={styles.professionalImage} 
              />
              <View style={styles.professionalInfo}>
                <Text style={styles.professionalName}>{appointment.professionalName}</Text>
                <TouchableOpacity 
                  style={styles.messageProfessionalButton}
                  onPress={handleMessageProfessional}
                >
                  <Ionicons name="chatbubble-outline" size={14} color={colors.primary} />
                  <Text style={styles.messageProfessionalText}>Enviar mensaje</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          {appointment.notes && (
            <>
              <View style={styles.divider} />
              <View style={styles.notesContainer}>
                <Text style={styles.sectionTitle}>Notas</Text>
                <Text style={styles.notesText}>{appointment.notes}</Text>
              </View>
            </>
          )}
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.rescheduleButton} 
            onPress={handleRescheduleAppointment}
          >
            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            <Text style={styles.rescheduleButtonText}>Reprogramar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={handleCancelAppointment}
            disabled={loading}
          >
            <Ionicons name="close-outline" size={20} color="#FFFFFF" />
            <Text style={styles.cancelButtonText}>Cancelar turno</Text>
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  appointmentIdText: {
    fontSize: 14,
    color: '#6B7280',
  },
  appointmentDateTimeContainer: {
    marginBottom: 16,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBackground: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  labelText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  valueText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 16,
  },
  serviceContainer: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  serviceCard: {
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  serviceDetails: {
    fontSize: 13,
    color: '#6B7280',
  },
  professionalContainer: {
    marginBottom: 8,
  },
  professionalCard: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    alignItems: 'center',
  },
  professionalImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  professionalInfo: {
    flex: 1,
  },
  professionalName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  messageProfessionalButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageProfessionalText: {
    fontSize: 13,
    color: colors.primary,
    marginLeft: 4,
  },
  notesContainer: {
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  actionsContainer: {
    margin: 16,
    marginBottom: 32,
  },
  rescheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 12,
  },
  rescheduleButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
});
