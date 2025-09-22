import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../../constants/colors';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
// Ancho disponible para las tarjetas en grid: pantalla menos padding horizontal del contenedor
const CONTAINER_PADDING_HORIZONTAL = 16; // appointmentCardsContainer paddingHorizontal * 2
const INTER_COLUMN_GAP = 12; // gap between two columns
const AVAILABLE_WIDTH = width - CONTAINER_PADDING_HORIZONTAL - INTER_COLUMN_GAP;
const COLUMN_WIDTH = Math.floor(AVAILABLE_WIDTH / 2);
const TIMELINE_CARD_WIDTH = COLUMN_WIDTH - CARD_MARGIN; // ancho final para cada tarjeta

export default StyleSheet.create({
  timelineCard: {
    width: '100%', // Ocupa todo el ancho del contenedor padre (que ya está dividido)
    marginHorizontal: 2, // Reducido para mayor ancho de tarjeta
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,  // Elevación aumentada para asegurar que esté por encima de las líneas
    borderLeftWidth: 4,
    padding: 10,
    paddingHorizontal: 12,
    minHeight: 0, // no forzar minHeight para que respete la altura del contenedor padre
    height: '100%', // ocupar la altura que le dé el wrapper absoluto
    overflow: 'hidden',
    zIndex: 200,  // z-index muy alto para asegurar que esté por encima de las líneas
  },
  confirmedAppointment: {
    borderLeftColor: '#10B981',
  },
  pendingAppointment: {
    borderLeftColor: '#FBBF24',
  },
  cardContent: {
    padding: 12,
  },
  clientName: {
    fontSize: 14, // Ajustado para mejor encaje
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4, // Más espacio entre elementos
  },
  timeRange: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 4,
  },
  serviceText: {
    fontSize: 13, // Tamaño suficientemente grande para ser legible
    color: '#4B5563',
    marginBottom: 4, // Más espacio entre elementos
  },
  appointmentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  professionalName: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981', // Default: green for confirmed
  },
  // Estilos específicos para tarjetas pequeñas (15 min)
  shortTimelineCard: {
    height: '100%', // usar la altura del wrapper (para respetar slotsCount * slotHeight)
    paddingVertical: 6,
    paddingHorizontal: 10,
    justifyContent: 'center', // Centrar contenido verticalmente
    alignItems: 'flex-start', // Alinear texto a la izquierda
    borderRadius: 8, // Bordes más redondeados
    elevation: 9,  // Elevación extra para tarjetas cortas
    zIndex: 210, // z-index mucho mayor para asegurar visibilidad
  },
  shortClientName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
    color: '#111827',
    textAlign: 'left', // Alinear a la izquierda en tarjetas cortas
  },
  shortTimeRange: {
    fontSize: 13,
    marginBottom: 0,
    color: '#4B5563',
    textAlign: 'left', // Alinear a la izquierda en tarjetas cortas
    fontWeight: '600', // Un poco más de peso para mejor legibilidad
  }
  ,
  // Estilos para grid de tarjetas (AppointmentsCardGrid)
  appointmentCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: CONTAINER_PADDING_HORIZONTAL / 2,
    paddingTop: 8,
  },
  appointmentCard: {
    width: '48%', // Usar porcentaje para mejor comportamiento responsivo
    marginBottom: 12,
    marginRight: INTER_COLUMN_GAP / 2,
    marginLeft: INTER_COLUMN_GAP / 2,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 6,
    padding: 10,
  },
  shortAppointmentCard: {
    minHeight: 48,
    justifyContent: 'center',
  },
  gridCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gridLeft: {
    flex: 1,
    paddingRight: 8,
    alignItems: 'flex-start',
  },
  gridRight: {
    width: 44,
    alignItems: 'center',
  },
  professionalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  professionalImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  appointmentService: {
    fontSize: 13,
    color: '#374151',
  },
  appointmentDuration: {
    fontSize: 12,
    color: '#6B7280',
  },
});