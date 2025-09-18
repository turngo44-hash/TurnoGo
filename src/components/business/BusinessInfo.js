import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BusinessInfo = () => {
  const businessHours = [
    { day: 'Lunes', hours: '9:00 AM - 7:00 PM', isOpen: true },
    { day: 'Martes', hours: '9:00 AM - 7:00 PM', isOpen: true },
    { day: 'Miércoles', hours: '9:00 AM - 7:00 PM', isOpen: true },
    { day: 'Jueves', hours: '9:00 AM - 7:00 PM', isOpen: true },
    { day: 'Viernes', hours: '9:00 AM - 8:00 PM', isOpen: true },
    { day: 'Sábado', hours: '8:00 AM - 6:00 PM', isOpen: true },
    { day: 'Domingo', hours: 'Cerrado', isOpen: false },
  ];

  const contactInfo = [
    { icon: 'call', label: 'Teléfono', value: '+57 300 123 4567', action: 'call' },
    { icon: 'mail', label: 'Email', value: 'info@misalon.com', action: 'email' },
    { icon: 'location', label: 'Dirección', value: 'Calle 123 #45-67, Bogotá', action: 'map' },
    { icon: 'globe', label: 'Sitio Web', value: 'www.misalon.com', action: 'web' },
  ];

  const renderInfoCard = (title, children, icon) => (
    <View style={styles.infoCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Ionicons name={icon} size={20} color="#8B5CF6" />
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="create-outline" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Business Hours */}
      {renderInfoCard('Horarios de Atención', (
        <View style={styles.hoursContainer}>
          {businessHours.map((schedule, index) => (
            <View key={index} style={styles.scheduleRow}>
              <Text style={styles.dayText}>{schedule.day}</Text>
              <Text style={[
                styles.hoursText,
                !schedule.isOpen && styles.closedText
              ]}>
                {schedule.hours}
              </Text>
            </View>
          ))}
        </View>
      ), 'time')}

      {/* Contact Information */}
      {renderInfoCard('Información de Contacto', (
        <View style={styles.contactContainer}>
          {contactInfo.map((contact, index) => (
            <TouchableOpacity key={index} style={styles.contactRow}>
              <View style={styles.contactLeft}>
                <View style={styles.contactIcon}>
                  <Ionicons name={contact.icon} size={18} color="#8B5CF6" />
                </View>
                <View>
                  <Text style={styles.contactLabel}>{contact.label}</Text>
                  <Text style={styles.contactValue}>{contact.value}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
            </TouchableOpacity>
          ))}
        </View>
      ), 'information-circle')}

      {/* Services Summary */}
      {renderInfoCard('Servicios Principales', (
        <View style={styles.servicesContainer}>
          {[
            { name: 'Corte de Cabello', price: '$25.000', duration: '30 min' },
            { name: 'Manicura', price: '$18.000', duration: '45 min' },
            { name: 'Pedicura', price: '$22.000', duration: '60 min' },
            { name: 'Tratamiento Facial', price: '$45.000', duration: '90 min' },
          ].map((service, index) => (
            <View key={index} style={styles.serviceRow}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDuration}>{service.duration}</Text>
              </View>
              <Text style={styles.servicePrice}>{service.price}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>Ver todos los servicios</Text>
            <Ionicons name="arrow-forward" size={16} color="#8B5CF6" />
          </TouchableOpacity>
        </View>
      ), 'cut')}

      {/* Business Description */}
      {renderInfoCard('Acerca del Negocio', (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            Con más de 3 años de experiencia, nuestro salón se especializa en brindar 
            servicios de belleza de alta calidad. Contamos con un equipo de profesionales 
            capacitados y utilizamos productos premium para garantizar los mejores resultados.
          </Text>
          <View style={styles.tagsContainer}>
            {['Profesional', 'Productos Premium', 'Atención Personalizada', 'Higiene'].map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      ), 'information')}

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 20,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  hoursContainer: {
    gap: 12,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  hoursText: {
    fontSize: 14,
    color: '#6B7280',
  },
  closedText: {
    color: '#EF4444',
    fontWeight: '500',
  },
  contactContainer: {
    gap: 16,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  servicesContainer: {
    gap: 12,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    marginBottom: 2,
  },
  serviceDuration: {
    fontSize: 12,
    color: '#6B7280',
  },
  servicePrice: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: 'bold',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  viewAllText: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
    marginRight: 4,
  },
  descriptionContainer: {
    gap: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default BusinessInfo;
