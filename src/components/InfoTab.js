import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons, Fontisto, Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const InfoTab = ({ professional = {} }) => {
  // Función para manejar la apertura de aplicaciones externas
  const handleOpenLink = (type, value) => {
    let url = '';
    
    switch (type) {
      case 'phone':
        url = `tel:${value}`;
        break;
      case 'whatsapp':
        // Formato internacional para WhatsApp: eliminar espacios, paréntesis, etc.
        const whatsappNumber = value.replace(/\s+/g, '').replace(/[()-]/g, '');
        url = `whatsapp://send?phone=${whatsappNumber}`;
        break;
      case 'email':
        url = `mailto:${value}`;
        break;
      case 'web':
        // Asegurarse de que la URL tenga el protocolo correcto
        if (!/^https?:\/\//i.test(value)) {
          url = `https://${value}`;
        } else {
          url = value;
        }
        break;
      case 'instagram':
        url = `instagram://user?username=${value}`;
        // Fallback para abrir en navegador si la app no está instalada
        Linking.canOpenURL(url).then(supported => {
          if (!supported) {
            url = `https://instagram.com/${value}`;
          }
          return Linking.openURL(url);
        }).catch(err => {
          // Fallback final a navegador
          Linking.openURL(`https://instagram.com/${value}`);
        });
        return;
      case 'facebook':
        // Primero intentamos abrir la app
        url = `fb://profile/${value}`;
        Linking.canOpenURL(url).then(supported => {
          if (!supported) {
            // Si no hay un ID numérico, asumimos que es un nombre de usuario
            if (isNaN(value)) {
              url = `https://facebook.com/${value}`;
            } else {
              url = `https://facebook.com/profile.php?id=${value}`;
            }
          }
          return Linking.openURL(url);
        }).catch(err => {
          // Fallback final
          Linking.openURL(`https://facebook.com/${value}`);
        });
        return;
      case 'tiktok':
        url = `tiktok://user/@${value}`;
        Linking.canOpenURL(url).then(supported => {
          if (!supported) {
            url = `https://www.tiktok.com/@${value}`;
          }
          return Linking.openURL(url);
        }).catch(err => {
          Linking.openURL(`https://www.tiktok.com/@${value}`);
        });
        return;
      default:
        return;
    }
    
    // Para los casos simples (teléfono), abrimos directamente
    Linking.openURL(url).catch(err => {
      console.error('Error abriendo enlace:', err);
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Contacto con diseño simple e iconos sociales integrados */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información de Contacto</Text>
        
        {/* Teléfono */}
        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => handleOpenLink('phone', professional.phone || '+1234567890')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#E53E3E' }]}>
            <Ionicons name="call" size={20} color="#fff" />
          </View>
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactLabel}>Teléfono</Text>
            <Text style={styles.contactValue}>{professional.phone || '+1 (234) 567-890'}</Text>
          </View>
          <View style={styles.chevronContainer}>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </View>
        </TouchableOpacity>
        
        {/* Página web */}
        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => handleOpenLink('web', professional.website || 'www.turnogo.com')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#8B5CF6' }]}>
            <Ionicons name="globe-outline" size={20} color="#fff" />
          </View>
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactLabel}>Página Web</Text>
            <Text style={styles.contactValue}>{professional.website || 'www.turnogo.com'}</Text>
          </View>
          <View style={styles.chevronContainer}>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </View>
        </TouchableOpacity>
        
        {/* Iconos sociales */}
        <View style={styles.socialCardsWrapper}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.socialList}
            data={[
              {
                id: 'whatsapp',
                name: 'WhatsApp',
                icon: 'whatsapp',
                iconType: 'fontawesome',
                username: professional.whatsapp || professional.phone || '+1234567890',
                colors: ['#25D366', '#128C7E'],
                handle: '',
              },
              {
                id: 'instagram',
                name: 'Instagram',
                icon: 'instagram',
                iconType: 'fontawesome',
                username: professional.instagram || 'turnogo',
                colors: ['#833AB4', '#C13584', '#E1306C'],
                handle: '@',
              },
              {
                id: 'facebook',
                name: 'Facebook',
                icon: 'facebook',
                iconType: 'fontawesome',
                username: professional.facebook || 'turnogo',
                colors: ['#1877F2', '#1465D1'],
                handle: '',
              },
              {
                id: 'tiktok',
                name: 'tiktok',
                icon: 'logo-tiktok',
                iconType: 'ionicons',
                username: professional.tiktok || 'turnogo',
                colors: ['#000000', '#EE1D52', '#69C9D0'],
                handle: '@',
              },
              {
                id: 'youtube',
                name: 'YouTube',
                icon: 'youtube',
                iconType: 'fontawesome',
                username: professional.youtube || 'turnogo',
                colors: ['#FF0000', '#CC0000'],
                handle: '',
              }
            ]}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.socialCard}
                onPress={() => handleOpenLink(item.id, item.username)}
                activeOpacity={0.85}
              >
                {/* Card con efecto glassmorphism */}
                <LinearGradient
                  colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                  style={styles.socialCardGradient}
                >
                  {/* Icono con gradiente */}
                  <LinearGradient
                    colors={item.colors}
                    style={styles.socialIconContainer}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    {item.iconType === 'ionicons' ? (
                      <Ionicons name={item.icon} size={24} color="#fff" />
                    ) : (
                      <FontAwesome5 name={item.icon} size={22} color="#fff" />
                    )}
                  </LinearGradient>
                  <Text style={styles.socialName}>{item.name}</Text>
                  <Text style={styles.socialUsername} numberOfLines={1}>
                    {item.handle}{item.username}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
      
      {/* Horario con visualización simplificada */}
      <View style={styles.sectionHorario}>
        <View style={styles.sectionTitleWithIcon}>
          <Ionicons name="time-outline" size={20} color="#3B82F6" />
          <Text style={styles.sectionTitle}>Horario Laboral</Text>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="pencil-outline" size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.scheduleSimpleContainer}>
          <View style={styles.scheduleHeader}>
            <Text style={styles.scheduleTitle}>Esta semana</Text>
            <View style={styles.scheduleStatus}>
              <View style={[styles.statusIndicator, { backgroundColor: '#10B981' }]} />
              <Text style={styles.statusText}>Abierto ahora</Text>
            </View>
          </View>
          
          <View style={styles.scheduleListContainer}>
            {(professional.schedule || [
              { day: 'Lunes', hours: '9:00 - 18:00', isOpen: true },
              { day: 'Martes', hours: '9:00 - 18:00', isOpen: true },
              { day: 'Miércoles', hours: '9:00 - 18:00', isOpen: true },
              { day: 'Jueves', hours: '9:00 - 18:00', isOpen: true },
              { day: 'Viernes', hours: '9:00 - 19:00', isOpen: true },
              { day: 'Sábado', hours: '10:00 - 16:00', isOpen: true },
              { day: 'Domingo', hours: 'Cerrado', isOpen: false }
            ]).map((dayInfo, index) => {
              const isOpen = dayInfo.isOpen !== false;
              const isCurrent = new Date().getDay() === index + 1; // +1 porque getDay() empieza desde 0 (Domingo)
              
              return (
                <View 
                  key={index}
                  style={[
                    styles.scheduleRowItem,
                    isCurrent && styles.currentDayRow
                  ]}
                >
                  <View style={styles.scheduleDayInfo}>
                    <Text style={[styles.scheduleDayName, isCurrent && styles.currentDayText]}>
                      {dayInfo.day}
                    </Text>
                    {isCurrent && <View style={styles.currentDayMark} />}
                  </View>
                  
                  <View style={styles.scheduleTimeInfo}>
                    <Text style={[styles.scheduleTime, !isOpen && styles.scheduleClosed]}>
                      {dayInfo.hours}
                    </Text>
                    <View style={[styles.statusDot, { backgroundColor: isOpen ? '#10B981' : '#EF4444' }]} />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
      
      {/* Información profesional mejorada con habilidades específicas */}
      <View style={styles.section}>
        <View style={styles.sectionTitleWithIcon}>
          <MaterialCommunityIcons name="badge-account-horizontal" size={20} color="#805AD5" />
          <Text style={styles.sectionTitle}>Perfil Profesional</Text>
        </View>
        
        {/* Panel de experiencia y especialidad con diseño de tarjetas */}
        <View style={styles.professionalInfoCards}>
          <View style={styles.infoCard}>
            <LinearGradient
              colors={['#EBF5FF', '#DBEAFE']}
              style={styles.infoCardGradient}
            >
              <View style={styles.infoCardHeader}>
                <Ionicons name="time-outline" size={22} color="#3B82F6" />
                <Text style={styles.infoCardTitle}>Experiencia</Text>
              </View>
              <Text style={styles.infoCardValue}>{professional.experience || '5 años'}</Text>
              <Text style={styles.infoCardDescription}>
                Profesional certificado con amplia trayectoria en el sector
              </Text>
            </LinearGradient>
          </View>
          
          <View style={styles.infoCard}>
            <LinearGradient
              colors={['#F5F3FF', '#EDE9FE']}
              style={styles.infoCardGradient}
            >
              <View style={styles.infoCardHeader}>
                <MaterialCommunityIcons name="certificate-outline" size={22} color="#8B5CF6" />
                <Text style={styles.infoCardTitle}>Especialidad</Text>
              </View>
              <Text style={styles.infoCardValue}>{professional.specialty || 'Barbero'}</Text>
              <Text style={styles.infoCardDescription}>
                Enfocado en las últimas tendencias y técnicas modernas
              </Text>
            </LinearGradient>
          </View>
        </View>
        
        {/* Habilidades y servicios con nuevo diseño */}
        <View style={styles.skillsContainer}>
          <View style={styles.skillsHeader}>
            <Text style={styles.skillsTitle}>Habilidades y Servicios</Text>
          </View>
          
          {/* Grid de habilidades con íconos personalizados */}
          <View style={styles.skillsGrid}>
            {/* Fila 1 */}
            <View style={styles.skillItemContainer}>
              <View style={[styles.skillIconContainer, { backgroundColor: '#DBEAFE' }]}>
                <FontAwesome5 name="cut" size={18} color="#3B82F6" />
              </View>
              <Text style={styles.skillItemTitle}>Cortes Clásicos</Text>
              <Text style={styles.skillItemDescription}>Especialista en cortes tradicionales y actuales</Text>
            </View>
            
            <View style={styles.skillItemContainer}>
              <View style={[styles.skillIconContainer, { backgroundColor: '#E0E7FF' }]}>
                <MaterialCommunityIcons name="hair-dryer" size={18} color="#6366F1" />
              </View>
              <Text style={styles.skillItemTitle}>Peinados</Text>
              <Text style={styles.skillItemDescription}>Estilos para eventos y uso diario</Text>
            </View>
            
            {/* Fila 2 */}
            <View style={styles.skillItemContainer}>
              <View style={[styles.skillIconContainer, { backgroundColor: '#ECFDF5' }]}>
                <FontAwesome5 name="user-graduate" size={18} color="#10B981" />
              </View>
              <Text style={styles.skillItemTitle}>Degradados</Text>
              <Text style={styles.skillItemDescription}>Fade, desvanecidos y técnicas modernas</Text>
            </View>
            
            <View style={styles.skillItemContainer}>
              <View style={[styles.skillIconContainer, { backgroundColor: '#FEF3C7' }]}>
                <MaterialCommunityIcons name="face-man-profile" size={18} color="#F59E0B" />
              </View>
              <Text style={styles.skillItemTitle}>Barbas</Text>
              <Text style={styles.skillItemDescription}>Perfilado y arreglo de barba y bigote</Text>
            </View>
            
            {/* Fila 3 */}
            <View style={styles.skillItemContainer}>
              <View style={[styles.skillIconContainer, { backgroundColor: '#FCE7F3' }]}>
                <MaterialCommunityIcons name="bottle-tonic" size={18} color="#EC4899" />
              </View>
              <Text style={styles.skillItemTitle}>Coloración</Text>
              <Text style={styles.skillItemDescription}>Tintes y técnicas de coloración</Text>
            </View>
            
            <View style={styles.skillItemContainer}>
              <View style={[styles.skillIconContainer, { backgroundColor: '#EFF6FF' }]}>
                <MaterialCommunityIcons name="face-woman-shimmer" size={18} color="#3B82F6" />
              </View>
              <Text style={styles.skillItemTitle}>Tratamientos</Text>
              <Text style={styles.skillItemDescription}>Hidratación y cuidados capilares</Text>
            </View>
          </View>
          
          {/* Insignias de certificaciones */}
          <View style={styles.certificationsContainer}>
            <Text style={styles.certificationsTitle}>Certificaciones</Text>
            <View style={styles.badgesContainer}>
              <View style={styles.certificationBadge}>
                <MaterialCommunityIcons name="certificate" size={16} color="#3B82F6" />
                <Text style={styles.certificationText}>Academia Pro-Hair</Text>
              </View>
              <View style={styles.certificationBadge}>
                <MaterialCommunityIcons name="certificate" size={16} color="#8B5CF6" />
                <Text style={styles.certificationText}>Master Barbering</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      
      {/* Nueva sección - Valoraciones y reseñas */}
      <View style={styles.sectionReviews}>
        <View style={styles.sectionTitleWithIcon}>
          <Ionicons name="star" size={20} color="#F59E0B" />
          <Text style={styles.sectionTitle}>Valoraciones y Reseñas</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>Ver todas</Text>
            <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.ratingContainer}>
          <View style={styles.ratingMain}>
            <Text style={styles.ratingNumber}>4.8</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map(star => (
                <Ionicons 
                  key={star}
                  name={star <= 4 ? "star" : (star <= 4.8 ? "star-half" : "star-outline")}
                  size={18} 
                  color="#F59E0B"
                  style={{ marginRight: 2 }}
                />
              ))}
            </View>
            <Text style={styles.totalReviews}>87 reseñas</Text>
          </View>
          
          <View style={styles.ratingBars}>
            {[5, 4, 3, 2, 1].map(rating => (
              <View key={rating} style={styles.ratingBarItem}>
                <Text style={styles.ratingBarLabel}>{rating}</Text>
                <View style={styles.ratingBarContainer}>
                  <View style={[
                    styles.ratingBarFill, 
                    { 
                      width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 7 : rating === 2 ? 2 : 1}%`,
                      backgroundColor: rating >= 4 ? '#10B981' : rating >= 3 ? '#F59E0B' : '#EF4444'
                    }
                  ]} />
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Nueva sección - Comentarios de clientes */}
      <View style={styles.sectionComments}>
        <View style={styles.sectionTitleWithIcon}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color="#3B82F6" />
          <Text style={styles.sectionTitle}>Comentarios de Clientes</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>Ver todos</Text>
            <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
          </TouchableOpacity>
        </View>
        
        {/* Lista de comentarios */}
        <FlatList
          data={[
            {
              id: '1',
              name: 'María González',
              avatar: 'https://i.pravatar.cc/150?img=32',
              date: '2 días',
              comment: 'Excelente servicio, muy profesional y puntual. Me encantó el resultado del corte y color.',
              replied: true,
              replyName: 'Ana López',
              replyText: 'Muchas gracias María, fue un placer atenderte. ¡Te esperamos pronto de nuevo!'
            },
            {
              id: '2',
              name: 'Carlos Mendoza',
              avatar: 'https://i.pravatar.cc/150?img=11',
              date: '1 semana',
              comment: 'Primera vez que vengo a este salón y quedé muy satisfecho. Recomendado 100%.',
              replied: false
            },
            {
              id: '3',
              name: 'Laura Pérez',
              avatar: 'https://i.pravatar.cc/150?img=29',
              date: '2 semanas',
              comment: 'Siempre vengo aquí para mis tratamientos, son los mejores de la ciudad.',
              replied: true,
              replyName: 'Ana López',
              replyText: '¡Gracias Laura por tu fidelidad! Nos alegra que estés contenta con nuestro trabajo.'
            }
          ]}
          renderItem={({item}) => (
            <View style={styles.commentCard}>
              <View style={styles.commentHeader}>
                <View style={styles.commentUserInfo}>
                  <Image 
                    source={{uri: item.avatar}} 
                    style={styles.commentAvatar} 
                  />
                  <View>
                    <Text style={styles.commentUserName}>{item.name}</Text>
                    <Text style={styles.commentDate}>{item.date}</Text>
                  </View>
                </View>
                
                <View style={styles.commentRating}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Ionicons 
                      key={star} 
                      name="star" 
                      size={12} 
                      color="#F59E0B" 
                      style={{marginHorizontal: 1}}
                    />
                  ))}
                </View>
              </View>
              
              <Text style={styles.commentText}>{item.comment}</Text>
              
              {item.replied ? (
                <View style={styles.replyContainer}>
                  <View style={styles.replyHeader}>
                    <Image 
                      source={professional.avatar ? {uri: professional.avatar} : require('../../assets/placeholder.jpeg')} 
                      style={styles.replyAvatar} 
                    />
                    <Text style={styles.replyName}>{item.replyName}</Text>
                    <Text style={styles.replyLabel}>Respuesta</Text>
                  </View>
                  <Text style={styles.replyText}>{item.replyText}</Text>
                </View>
              ) : (
                <TouchableOpacity style={styles.replyButton}>
                  <Ionicons name="chatbubble-outline" size={14} color="#3B82F6" style={{marginRight: 4}} />
                  <Text style={styles.replyButtonText}>Responder</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
        
        {/* Botón para añadir nuevo comentario */}
        <TouchableOpacity style={styles.addCommentButton}>
          <Ionicons name="add-circle-outline" size={18} color="#fff" style={{marginRight: 6}} />
          <Text style={styles.addCommentText}>Escribir un comentario</Text>
        </TouchableOpacity>
      </View>

      {/* Espacio adicional al final para scroll cómodo */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 8,
  },
  section: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  sectionContact: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  sectionSocial: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 8,
    paddingBottom: 12,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  sectionHorario: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    overflow: 'hidden',
  },
  sectionReviews: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
    flex: 1,
  },
  sectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sectionBadgeText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF5FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  addButtonText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewAllText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  // Social Media Horizontal Styles
  socialCardsWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  socialList: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  socialCard: {
    width: 75,
    height: 110,
    marginHorizontal: 6,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4.5,
    elevation: 3,
  },
  socialCardGradient: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    borderRadius: 12,
  },
  socialIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  socialName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
    textAlign: 'center',
  },
  socialUsername: {
    fontSize: 9,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 70,
  },
  // Estilos para sección de contacto
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  chevronContainer: {
    width: 30,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  // Estilos para los iconos sociales
  socialCardsWrapper: {
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  socialList: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  // Contact Items - Diseño neomórfico
  contactCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  contactCard: {
    width: '48%',
    height: 130,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  contactCardInner: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
    borderRadius: 16,
  },
  phoneCard: {
    backgroundColor: '#fef2f2',
  },
  whatsappCard: {
    backgroundColor: '#f0fdf4',
  },
  contactIconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainerNeo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4.5,
    elevation: 2,
  },
  actionIcon: {
    padding: 4,
  },
  contactTextContainer: {
    marginVertical: 10,
  },
  contactLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  contactHint: {
    fontSize: 11,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  emailButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  emailButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
  // Info Items
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: '#111827',
  },
  // Estilos simplificados para el horario
  scheduleSimpleContainer: {
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    padding: 12,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  scheduleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  scheduleStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  scheduleListContainer: {
    marginVertical: 4,
  },
  scheduleRowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  currentDayRow: {
    backgroundColor: 'rgba(219, 234, 254, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  scheduleDayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  scheduleDayName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  currentDayText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  currentDayMark: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3B82F6',
    marginLeft: 6,
  },
  scheduleTimeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleTime: {
    fontSize: 14,
    color: '#111827',
    marginRight: 6,
  },
  scheduleClosed: {
    color: '#EF4444',
    fontWeight: '500',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  
  // Reviews section
  ratingContainer: {
    flexDirection: 'row',
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  ratingMain: {
    width: '35%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  ratingNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  totalReviews: {
    fontSize: 12,
    color: '#6B7280',
  },
  ratingBars: {
    flex: 1,
    paddingLeft: 16,
    justifyContent: 'center',
  },
  ratingBarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingBarLabel: {
    fontSize: 12,
    width: 16,
    textAlign: 'center',
    marginRight: 8,
    color: '#6B7280',
  },
  ratingBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
  },
  ratingBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  // Estilos para sección de comentarios
  sectionComments: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  commentCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 12,
    marginBottom: 4,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  commentDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  commentRating: {
    flexDirection: 'row',
  },
  commentText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 10,
  },
  replyContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    marginLeft: 16,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  replyAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  replyName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginRight: 6,
  },
  replyLabel: {
    fontSize: 11,
    color: '#6B7280',
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  replyText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    marginTop: 6,
  },
  replyButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3B82F6',
  },
  addCommentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  addCommentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

// Estilos adicionales para las nuevas secciones
const additionalStyles = StyleSheet.create({
  expertiseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  expertiseCard: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4.5,
    elevation: 3,
  },
  expertiseGradient: {
    padding: 16,
    alignItems: 'center',
    height: 150,
    justifyContent: 'space-between',
  },
  expertiseIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  expertiseTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  expertiseValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  badgeContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  expertiseBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  certifiedBadge: {
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
  },
  badgeText: {
    color: '#3B82F6',
    fontSize: 11,
    fontWeight: '600',
  },
  certifiedText: {
    color: '#8B5CF6',
  },
  // Nuevos estilos para las tarjetas de información profesional
  professionalInfoCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  infoCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4.5,
    elevation: 3,
  },
  infoCardGradient: {
    padding: 16,
    height: 140,
    justifyContent: 'space-between',
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginLeft: 8,
  },
  infoCardValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  infoCardDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  
  // Estilos para la sección de habilidades
  skillsContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  skillsHeader: {
    marginBottom: 16,
  },
  skillsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  skillItemContainer: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  skillIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  skillItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  skillItemDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  
  // Certificaciones
  certificationsContainer: {
    marginTop: 8,
  },
  certificationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  certificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  certificationText: {
    fontSize: 12,
    color: '#4B5563',
    marginLeft: 4,
  },
  
  // Mantenemos estos por compatibilidad
  specialtiesContainer: {
    display: 'none',
  },
  specialtyCategory: {
    display: 'none',
  },
});

// Combinar estilos
Object.assign(styles, additionalStyles);

export default InfoTab;