import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const chartWidth = width - 80;

const BusinessAnalytics = () => {
  const stats = [
    {
      id: 'appointments',
      title: 'Citas Mensuales',
      value: '87',
      change: '+12%',
      isPositive: true,
      icon: 'calendar',
      color: '#8B5CF6',
    },
    {
      id: 'revenue',
      title: 'Ingresos',
      value: '$2.450.000',
      change: '+8%',
      isPositive: true,
      icon: 'card',
      color: '#10B981',
    },
    {
      id: 'clients',
      title: 'Clientes Nuevos',
      value: '23',
      change: '+15%',
      isPositive: true,
      icon: 'people',
      color: '#06B6D4',
    },
    {
      id: 'rating',
      title: 'Calificación',
      value: '4.8',
      change: '+0.2',
      isPositive: true,
      icon: 'star',
      color: '#F59E0B',
    },
  ];

  const weeklyData = [
    { day: 'Lun', appointments: 12, revenue: 480000 },
    { day: 'Mar', appointments: 15, revenue: 520000 },
    { day: 'Mié', appointments: 18, revenue: 690000 },
    { day: 'Jue', appointments: 14, revenue: 380000 },
    { day: 'Vie', appointments: 22, revenue: 780000 },
    { day: 'Sáb', appointments: 25, revenue: 890000 },
    { day: 'Dom', appointments: 8, revenue: 280000 },
  ];

  const topServices = [
    { name: 'Corte de Cabello', bookings: 45, percentage: 35, color: '#8B5CF6' },
    { name: 'Manicura', bookings: 32, percentage: 25, color: '#10B981' },
    { name: 'Pedicura', bookings: 28, percentage: 22, color: '#06B6D4' },
    { name: 'Tratamiento Facial', bookings: 23, percentage: 18, color: '#F59E0B' },
  ];

  const maxAppointments = Math.max(...weeklyData.map(d => d.appointments));

  const renderStatCard = (stat) => (
    <View key={stat.id} style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
        <Ionicons name={stat.icon} size={24} color={stat.color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statTitle}>{stat.title}</Text>
        <Text style={styles.statValue}>{stat.value}</Text>
        <View style={styles.statChange}>
          <Ionicons 
            name={stat.isPositive ? 'trending-up' : 'trending-down'} 
            size={14} 
            color={stat.isPositive ? '#10B981' : '#EF4444'} 
          />
          <Text style={[
            styles.statChangeText,
            { color: stat.isPositive ? '#10B981' : '#EF4444' }
          ]}>
            {stat.change} vs mes anterior
          </Text>
        </View>
      </View>
    </View>
  );

  const renderWeeklyChart = () => (
    <View style={styles.chartCard}>
      <Text style={styles.cardTitle}>Citas esta Semana</Text>
      <View style={styles.chart}>
        {weeklyData.map((data, index) => (
          <View key={index} style={styles.chartColumn}>
            <View style={styles.chartBar}>
              <View 
                style={[
                  styles.chartBarFill,
                  { 
                    height: `${(data.appointments / maxAppointments) * 100}%`,
                    backgroundColor: '#8B5CF6'
                  }
                ]} 
              />
            </View>
            <Text style={styles.chartLabel}>{data.day}</Text>
            <Text style={styles.chartValue}>{data.appointments}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderTopServices = () => (
    <View style={styles.servicesCard}>
      <Text style={styles.cardTitle}>Servicios Más Populares</Text>
      {topServices.map((service, index) => (
        <View key={index} style={styles.serviceItem}>
          <View style={styles.serviceLeft}>
            <View style={[styles.serviceIndicator, { backgroundColor: service.color }]} />
            <Text style={styles.serviceName}>{service.name}</Text>
          </View>
          <View style={styles.serviceRight}>
            <Text style={styles.serviceBookings}>{service.bookings} citas</Text>
            <Text style={styles.servicePercentage}>{service.percentage}%</Text>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Stats Overview */}
      <Text style={styles.sectionTitle}>Resumen del Mes</Text>
      <View style={styles.statsGrid}>
        {stats.map(renderStatCard)}
      </View>

      {/* Weekly Chart */}
      {renderWeeklyChart()}

      {/* Top Services */}
      {renderTopServices()}

      {/* Recent Activity */}
      <View style={styles.activityCard}>
        <Text style={styles.cardTitle}>Actividad Reciente</Text>
        
        {[
          {
            icon: 'person-add',
            color: '#10B981',
            text: 'Nuevo cliente registrado',
            time: 'Hace 2 horas',
          },
          {
            icon: 'calendar',
            color: '#8B5CF6',
            text: 'Cita agendada para mañana',
            time: 'Hace 3 horas',
          },
          {
            icon: 'star',
            color: '#F59E0B',
            text: 'Nueva reseña de 5 estrellas',
            time: 'Hace 5 horas',
          },
          {
            icon: 'card',
            color: '#06B6D4',
            text: 'Pago recibido',
            time: 'Hace 1 día',
          },
        ].map((activity, index) => (
          <View key={index} style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: `${activity.color}20` }]}>
              <Ionicons name={activity.icon} size={16} color={activity.color} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>{activity.text}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statContent: {
    gap: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statChangeText: {
    fontSize: 11,
    marginLeft: 4,
    fontWeight: '500',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  chartColumn: {
    alignItems: 'center',
    flex: 1,
  },
  chartBar: {
    width: 24,
    height: 80,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 12,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  chartValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  servicesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  serviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  serviceName: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  serviceRight: {
    alignItems: 'flex-end',
  },
  serviceBookings: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  servicePercentage: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: 'bold',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default BusinessAnalytics;
