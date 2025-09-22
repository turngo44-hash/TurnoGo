import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../../constants/colors';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Cambiamos a blanco puro
  },
  fixedHeader: {
    backgroundColor: '#FFFFFF',
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Eliminamos la línea inferior
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
    paddingBottom: 5, // Reducimos el padding inferior
    paddingTop: 5,
    overflow: 'visible',
    marginBottom: 0, // Quitamos el margen inferior
    // Eliminamos la línea horizontal
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
  todayButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  todayButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
  daysScrollView: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 12,
    paddingTop: 8,
    minHeight: 80,
    alignItems: 'center',
  },
  dayItem: {
    width: width / 7 - 8,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    marginBottom: 5,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedDayItem: {
    backgroundColor: colors.primary,
    height: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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
    paddingTop: 0, // Eliminamos el padding superior
    paddingBottom: 0, // Eliminamos todo el padding inferior
    width: '100%', // Aseguramos ancho completo
    backgroundColor: '#FFFFFF', // Fondo blanco
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
    bottom: 20, // Ajustamos para que esté más cerca del borde inferior
    right: 20,
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
    elevation: 5, // Mayor elevación para mejor efecto "flotante"
    zIndex: 1000, // Aseguramos que esté por encima de todo
  },
  
  // Timeline view styles
  timelineContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginBottom: 0, // Eliminamos el margen inferior
    minHeight: 300, // Altura mínima para asegurar visibilidad de contenido
    width: '100%',
    borderRadius: 0, // Quitamos los bordes redondeados
    // Quitamos todas las sombras para un diseño más limpio
    elevation: 0,
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
    position: 'relative',
    padding: 4, // Padding reducido para mayor compactación
    backgroundColor: '#FFFFFF',
    borderRadius: 6, // Bordes más suaves
    marginHorizontal: 2, // Margen horizontal reducido
    marginVertical: 0, // Sin margen vertical para alinear exactamente con las líneas
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2, // Elevación reducida
    zIndex: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    justifyContent: 'center', // Centrado vertical del contenido
    overflow: 'hidden', // Para evitar que el contenido se desborde
  },
  // Estilo especial para citas cortas (5-15 min)
  shortAppointment: {
    padding: 6, // Menos padding para optimizar espacio
  },
  // Estilo para el nombre del cliente en citas cortas
  shortAppointmentClientName: {
    fontSize: 12,
    fontWeight: '700', // Más destacado en las citas cortas
    marginBottom: 0,
  },
  appointmentBlockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  appointmentTimeRange: {
    fontSize: 11,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 2,
  },
  hourDivider: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1, // Grosor uniforme como en Boosky
    backgroundColor: '#E9EAEE', // Color base tipo Boosky
    zIndex: 2, // Específicamente bajo para evitar que cubra las interacciones
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
    color: '#111827',
    fontWeight: '700', // Más bold para destacar
    marginBottom: 2, // Margen reducido
    letterSpacing: 0.2,
    paddingTop: 2, // Un pequeño padding superior
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
    flexDirection: 'row',
    paddingHorizontal: 2,
    paddingVertical: 0, // Sin padding vertical para alinear con las líneas
    alignItems: 'flex-start',
    flexWrap: 'wrap', // Permitir que las tarjetas pasen a la siguiente fila
    justifyContent: 'space-between', // Distribuir el espacio entre las tarjetas
    position: 'absolute', // Posicionamiento absoluto para alinearse exactamente con las líneas
    minHeight: 30, // Altura mínima para asegurar visibilidad
    marginBottom: 0, // Sin margen inferior
    borderRadius: 0, // Sin bordes redondeados
    width: '100%', // Ancho completo
    zIndex: 20, // Alto z-index para estar por encima de otros elementos
  },
  adjacentAppointment: {
    marginLeft: 4,
    marginRight: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6', // Color azul similar al theme para mejor identificación
  },
  // Nuevos estilos para la versión compacta
  appointmentServiceCompact: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '400',
    marginTop: 0,
    marginBottom: 2,
  },
  shortAppointmentClientName: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 0,
  },
  statusDotCompact: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    top: 3,
    right: 3,
  },
});

export default styles;