import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useCountry } from '../contexts/CountryContext';

const CountryPicker = ({ 
  selectedCountry, 
  onCountrySelect, 
  visible, 
  onClose,
  style = {} 
}) => {
  const { countries, loading } = useCountry();
  const [searchText, setSearchText] = useState('');

  // Filtrar países por búsqueda
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchText.toLowerCase()) ||
    country.phoneCode.includes(searchText)
  );

  const handleCountrySelect = (country) => {
    onCountrySelect(country);
    onClose();
    setSearchText(''); // Limpiar búsqueda al seleccionar
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Selecciona tu país</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Buscador */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar país..."
            value={searchText}
            onChangeText={setSearchText}
            autoCapitalize="none"
          />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#DC2626" />
            <Text style={styles.loadingText}>Cargando países...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredCountries}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.countryOption,
                  selectedCountry?.id === item.id && styles.countryOptionSelected
                ]}
                onPress={() => handleCountrySelect(item)}
              >
                <View style={styles.countryInfo}>
                  <View style={styles.flagContainer}>
                    {item.flagUrl ? (
                      <Image 
                        source={{ uri: item.flagUrl }} 
                        style={styles.flagImage}
                        defaultSource={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==' }}
                      />
                    ) : (
                      <Text style={styles.flagEmoji}>{item.flag}</Text>
                    )}
                  </View>
                  <View style={styles.countryTextContainer}>
                    <Text style={[
                      styles.countryName,
                      selectedCountry?.id === item.id && styles.countryNameSelected
                    ]}>
                      {item.name}
                    </Text>
                    <Text style={[
                      styles.phoneCode,
                      selectedCountry?.id === item.id && styles.phoneCodeSelected
                    ]}>
                      {item.phoneCode}
                    </Text>
                  </View>
                </View>
                {selectedCountry?.id === item.id && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </Modal>
  );
};

const CountrySelector = ({ 
  selectedCountry, 
  onPress, 
  style = {},
  placeholder = "Selecciona tu país" 
}) => {
  const { loading } = useCountry();

  return (
    <TouchableOpacity
      style={[styles.selectorContainer, style]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <View style={styles.loadingSelector}>
          <ActivityIndicator size="small" color="#6B7280" />
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      ) : selectedCountry ? (
        <View style={styles.selectedCountryContainer}>
          <View style={styles.flagContainer}>
            {selectedCountry.flagUrl ? (
              <Image 
                source={{ uri: selectedCountry.flagUrl }} 
                style={styles.flagImage}
                defaultSource={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==' }}
              />
            ) : (
              <Text style={styles.flagEmoji}>{selectedCountry.flag}</Text>
            )}
          </View>
          <Text style={styles.selectedCountryText}>
            {selectedCountry.name}
          </Text>
          <Text style={styles.chevron}>▼</Text>
        </View>
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>{placeholder}</Text>
          <Text style={styles.chevron}>▼</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  countryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  countryOptionSelected: {
    backgroundColor: '#FEF2F2',
    borderBottomColor: '#FECACA',
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagContainer: {
    width: 32,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  flagImage: {
    width: 24,
    height: 18,
    borderRadius: 2,
  },
  flagEmoji: {
    fontSize: 20,
  },
  countryTextContainer: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 2,
  },
  countryNameSelected: {
    color: '#DC2626',
    fontWeight: '500',
  },
  phoneCode: {
    fontSize: 14,
    color: '#6B7280',
  },
  phoneCodeSelected: {
    color: '#DC2626',
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  selectorContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    minHeight: 48,
    justifyContent: 'center',
  },
  selectedCountryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedCountryText: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
    marginLeft: 8,
  },
  placeholderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placeholderText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  chevron: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
});

export { CountryPicker, CountrySelector };
