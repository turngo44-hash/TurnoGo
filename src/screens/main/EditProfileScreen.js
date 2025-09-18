import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import colors from '../../constants/colors';
import { StatusBar } from 'expo-status-bar';

// Componente para cada campo editable
const EditField = ({ label, value, onChangeText, placeholder, multiline, keyboardType, maxLength }) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      style={[styles.fieldInput, multiline && styles.fieldInputMultiline]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      multiline={multiline}
      keyboardType={keyboardType || 'default'}
      maxLength={maxLength}
    />
  </View>
);

// Componente para selector de opciones
const OptionSelector = ({ label, options, selectedValue, onSelect }) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.optionsContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.optionButton,
            selectedValue === option.value && styles.optionButtonSelected
          ]}
          onPress={() => onSelect(option.value)}
        >
          <Text
            style={[
              styles.optionText,
              selectedValue === option.value && styles.optionTextSelected
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

// Componente para cada campo de red social
const SocialMediaField = ({ platform, icon, color, value, onChangeText }) => (
  <View style={styles.socialFieldContainer}>
    <View style={[styles.socialIconContainer, { backgroundColor: `rgba(${color}, 0.1)` }]}>
      <FontAwesome5 name={icon} size={18} color={`rgb(${color})`} />
    </View>
    <TextInput
      style={styles.socialInput}
      value={value}
      onChangeText={onChangeText}
      placeholder={`Usuario de ${platform}`}
      placeholderTextColor="#9CA3AF"
    />
  </View>
);

const EditProfileScreen = ({ route, navigation }) => {
  // Si el profesional viene por parámetro, lo usamos; de lo contrario usamos un mock vacío
  const initialProfessional = route?.params?.professional || {
    name: '',
    role: '',
    bio: '',
    avatar: 'https://via.placeholder.com/200',
    coverImage: 'https://via.placeholder.com/800x400',
    email: '',
    telefono: '',
    website: '',
    socialMedia: {},
    services: [],
    products: []
  };

  const [professional, setProfessional] = useState(initialProfessional);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [savingChanges, setSavingChanges] = useState(false);
  const [activeSection, setActiveSection] = useState('general');

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Editar Perfil Profesional',
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
      },
      headerStyle: {
        backgroundColor: '#ffffff',
        elevation: 2,
        shadowOpacity: 0.2,
      },
      headerTintColor: '#000',
      headerRight: () => (
        <TouchableOpacity 
          style={{ paddingHorizontal: 12, paddingVertical: 6 }} 
          onPress={handleSaveChanges}
          disabled={savingChanges}
        >
          {savingChanges ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={{ color: colors.primary, fontWeight: '600' }}>Guardar</Text>
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, professional, savingChanges]);

  // Función para manejar cambios en campos simples
  const handleChange = (field, value) => {
    setProfessional({
      ...professional,
      [field]: value
    });
  };

  // Función para manejar cambios en redes sociales
  const handleSocialChange = (platform, value) => {
    setProfessional({
      ...professional,
      socialMedia: {
        ...professional.socialMedia,
        [platform]: value
      }
    });
  };

  // Función para cargar una nueva imagen de perfil
  const handlePickImage = async (type) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos permisos para acceder a la galería.');
      return;
    }

    try {
      setImageUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === 'avatar' ? [1, 1] : [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfessional({
          ...professional,
          [type]: result.assets[0].uri
        });
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la imagen.');
      console.error(error);
    } finally {
      setImageUploading(false);
    }
  };

  // Función para guardar los cambios
  const handleSaveChanges = () => {
    setSavingChanges(true);
    
    // Simulamos una llamada a API
    setTimeout(() => {
      setSavingChanges(false);
      Alert.alert(
        'Cambios guardados',
        'Los cambios en tu perfil han sido guardados correctamente.',
        [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]
      );
    }, 1500);
  };

  // Renderizado de la sección General
  const renderGeneralSection = () => (
    <View style={styles.sectionContainer}>
      <EditField
        label="Nombre completo"
        value={professional.name}
        onChangeText={(text) => handleChange('name', text)}
        placeholder="Ingresa tu nombre completo"
      />
      
      <EditField
        label="Rol profesional"
        value={professional.role}
        onChangeText={(text) => handleChange('role', text)}
        placeholder="Ej. Estilista Senior & Colorista"
      />
      
      <EditField
        label="Biografía profesional"
        value={professional.bio}
        onChangeText={(text) => handleChange('bio', text)}
        placeholder="Escribe una breve descripción sobre ti y tu experiencia..."
        multiline={true}
        maxLength={250}
      />
      
      <OptionSelector
        label="Estado de disponibilidad"
        options={[
          { label: 'Disponible', value: 'available' },
          { label: 'Ocupado', value: 'busy' },
          { label: 'No disponible', value: 'unavailable' }
        ]}
        selectedValue={professional.availability || 'available'}
        onSelect={(value) => handleChange('availability', value)}
      />
      
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Visibilidad del perfil</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Perfil público</Text>
          <Switch
            value={professional.isPublic !== false}
            onValueChange={(value) => handleChange('isPublic', value)}
            trackColor={{ false: '#E5E7EB', true: '#EF4444' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>
    </View>
  );

  // Renderizado de la sección Contacto
  const renderContactSection = () => (
    <View style={styles.sectionContainer}>
      <EditField
        label="Teléfono"
        value={professional.telefono}
        onChangeText={(text) => handleChange('telefono', text)}
        placeholder="Número de teléfono"
        keyboardType="phone-pad"
      />
      
      <EditField
        label="Correo electrónico"
        value={professional.email}
        onChangeText={(text) => handleChange('email', text)}
        placeholder="Correo electrónico profesional"
        keyboardType="email-address"
      />
      
      <EditField
        label="Sitio web"
        value={professional.website}
        onChangeText={(text) => handleChange('website', text)}
        placeholder="URL de tu sitio web"
        keyboardType="url"
      />
      
      <Text style={styles.sectionSubtitle}>Redes sociales</Text>
      
      <SocialMediaField
        platform="Instagram"
        icon="instagram"
        color="225, 48, 108"
        value={professional.socialMedia?.instagram || ''}
        onChangeText={(text) => handleSocialChange('instagram', text)}
      />
      
      <SocialMediaField
        platform="Facebook"
        icon="facebook"
        color="59, 89, 152"
        value={professional.socialMedia?.facebook || ''}
        onChangeText={(text) => handleSocialChange('facebook', text)}
      />
      
      <SocialMediaField
        platform="WhatsApp"
        icon="whatsapp"
        color="37, 211, 102"
        value={professional.socialMedia?.whatsapp || ''}
        onChangeText={(text) => handleSocialChange('whatsapp', text)}
      />
      
      <SocialMediaField
        platform="TikTok"
        icon="tiktok"
        color="0, 0, 0"
        value={professional.socialMedia?.tiktok || ''}
        onChangeText={(text) => handleSocialChange('tiktok', text)}
      />
    </View>
  );

  // Renderizado de la sección Horarios
  const renderScheduleSection = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionInfo}>
        Define tus horas de trabajo para cada día de la semana. Los clientes solo podrán reservar dentro de estos horarios.
      </Text>
      
      {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day, index) => (
        <View key={index} style={styles.scheduleRow}>
          <Text style={styles.dayLabel}>{day}</Text>
          <View style={styles.scheduleControls}>
            <View style={styles.timeControl}>
              <Text style={styles.timeLabel}>Apertura</Text>
              <TouchableOpacity style={styles.timeSelector}>
                <Text style={styles.timeValue}>09:00</Text>
                <Ionicons name="chevron-down" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <View style={styles.timeSeparator}>
              <Text style={styles.timeSeparatorText}>a</Text>
            </View>
            <View style={styles.timeControl}>
              <Text style={styles.timeLabel}>Cierre</Text>
              <TouchableOpacity style={styles.timeSelector}>
                <Text style={styles.timeValue}>18:00</Text>
                <Ionicons name="chevron-down" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <View style={styles.dayToggle}>
              <Switch
                value={index < 6} // Solo domingo cerrado por defecto
                trackColor={{ false: '#E5E7EB', true: '#EF4444' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>
      ))}
      
      <TouchableOpacity style={styles.addBreakButton}>
        <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
        <Text style={styles.addBreakText}>Agregar horario de descanso</Text>
      </TouchableOpacity>
    </View>
  );

  // Componente principal
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Imágenes del perfil */}
          <View style={styles.imagesSection}>
            <View style={styles.coverContainer}>
              {imageUploading && <ActivityIndicator style={styles.uploadingIndicator} size="large" color="#FFFFFF" />}
              <Image source={{ uri: professional.coverImage }} style={styles.coverImage} />
              <TouchableOpacity
                style={styles.editCoverButton}
                onPress={() => handlePickImage('coverImage')}
              >
                <Ionicons name="camera" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.avatarEditContainer}>
              <Image source={{ uri: professional.avatar }} style={styles.avatarImage} />
              <TouchableOpacity
                style={styles.editAvatarButton}
                onPress={() => handlePickImage('avatar')}
              >
                <Ionicons name="camera" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Menú de secciones */}
          <View style={styles.sectionTabs}>
            <TouchableOpacity
              style={[styles.sectionTab, activeSection === 'general' && styles.sectionTabActive]}
              onPress={() => setActiveSection('general')}
            >
              <Text style={[styles.sectionTabText, activeSection === 'general' && styles.sectionTabTextActive]}>
                General
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.sectionTab, activeSection === 'contact' && styles.sectionTabActive]}
              onPress={() => setActiveSection('contact')}
            >
              <Text style={[styles.sectionTabText, activeSection === 'contact' && styles.sectionTabTextActive]}>
                Contacto
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.sectionTab, activeSection === 'schedule' && styles.sectionTabActive]}
              onPress={() => setActiveSection('schedule')}
            >
              <Text style={[styles.sectionTabText, activeSection === 'schedule' && styles.sectionTabTextActive]}>
                Horarios
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Contenido según la sección activa */}
          {activeSection === 'general' && renderGeneralSection()}
          {activeSection === 'contact' && renderContactSection()}
          {activeSection === 'schedule' && renderScheduleSection()}
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveChanges}
              disabled={savingChanges}
            >
              {savingChanges ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Guardar cambios</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  imagesSection: {
    position: 'relative',
    marginBottom: 60,
  },
  coverContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  uploadingIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  editCoverButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEditContainer: {
    position: 'absolute',
    bottom: -50,
    left: '50%',
    transform: [{ translateX: -50 }],
    alignItems: 'center',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  sectionTabs: {
    flexDirection: 'row',
    marginVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  sectionTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  sectionTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  sectionTabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  sectionContainer: {
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2.5,
    elevation: 2,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionInfo: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 6,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  fieldInputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 15,
    color: '#1F2937',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
    marginBottom: 8,
  },
  optionButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: '#4B5563',
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  socialFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  socialIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  socialInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1F2937',
  },
  scheduleRow: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  scheduleControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeControl: {
    width: '35%',
  },
  timeLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  timeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  timeValue: {
    fontSize: 14,
    color: '#1F2937',
  },
  timeSeparator: {
    width: '10%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  timeSeparatorText: {
    color: '#6B7280',
  },
  dayToggle: {
    width: '20%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: 8,
  },
  addBreakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  addBreakText: {
    marginLeft: 8,
    color: colors.primary,
    fontWeight: '500',
  },
  buttonContainer: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditProfileScreen;