import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BusinessCategoryService from '../services/BusinessCategoryService';

// Componente selector compacto de categoría
export const CategorySelector = ({ selectedCategory, onPress, style, placeholder = "Selecciona categoría" }) => {
  return (
    <TouchableOpacity style={[styles.selectorContainer, style]} onPress={onPress}>
      <View style={styles.selectorContent}>
        <View style={styles.leftContent}>
          <Text style={styles.selectorEmoji}>🏢</Text>
          {selectedCategory ? (
            <Text style={styles.selectorText} numberOfLines={1}>
              {selectedCategory.name}
            </Text>
          ) : (
            <Text style={styles.selectorPlaceholder} numberOfLines={1}>
              {placeholder}
            </Text>
          )}
        </View>
        <Ionicons name="chevron-down" size={16} color="#6B7280" />
      </View>
    </TouchableOpacity>
  );
};

// Componente modal de selección de categorías
export const CategoryPicker = ({ selectedCategory, onCategorySelect, visible, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (visible) {
      loadCategories();
    }
  }, [visible]);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await BusinessCategoryService.getActiveCategories();
      
      if (result.success) {
        setCategories(result.categories);
      } else {
        setError(result.error || 'Error cargando categorías');
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category) => {
    onCategorySelect(category);
    onClose();
  };

  const renderCategoryItem = ({ item }) => {
    const isSelected = selectedCategory?.id === item.id;
    
    return (
      <TouchableOpacity 
        style={[
          styles.categoryItem,
          isSelected && styles.categoryItemSelected
        ]}
        onPress={() => handleCategorySelect(item)}
      >
        <View style={styles.categoryItemLeft}>
          <View style={styles.categoryIcon}>
            <Text style={styles.categoryEmoji}>🏢</Text>
          </View>
          <View style={styles.categoryInfo}>
            <Text style={[
              styles.categoryName,
              isSelected && styles.categoryNameSelected
            ]}>
              {item.name}
            </Text>
            {item.description && (
              <Text style={[
                styles.categoryDescription,
                isSelected && styles.categoryDescriptionSelected
              ]} numberOfLines={2}>
                {item.description}
              </Text>
            )}
          </View>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color="#DC2626" />
        )}
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#DC2626" />
          <Text style={styles.loadingText}>Cargando categorías...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadCategories}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (categories.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="business" size={48} color="#9CA3AF" />
          <Text style={styles.emptyText}>No hay categorías disponibles</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        style={styles.categoryList}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Header del modal */}
        <View style={styles.modalHeader}>
          <View style={styles.modalHeaderLeft}>
            <Text style={styles.modalTitle}>Selecciona tu categoría</Text>
            <Text style={styles.modalSubtitle}>
              {categories.length} categorías disponibles
            </Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Contenido del modal */}
        <View style={styles.modalContent}>
          {renderContent()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Estilos del selector compacto
  selectorContainer: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 50, // Altura fija consistente con inputs
    justifyContent: 'center',
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Distribuir espacio entre contenido y chevron
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectorEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  selectorText: {
    fontSize: 16, // Tamaño consistente con inputs
    fontWeight: '400', // Peso normal como inputs
    color: '#1F2937',
    textAlign: 'left', // Alineación izquierda
  },
  selectorPlaceholder: {
    fontSize: 16, // Tamaño consistente con inputs
    color: '#9CA3AF',
    textAlign: 'left', // Alineación izquierda
    textAlign: 'center',
  },

  // Estilos del modal
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
  },
  modalHeaderLeft: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Estilos de la lista
  categoryList: {
    flex: 1,
    paddingVertical: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryItemSelected: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  categoryItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  categoryNameSelected: {
    color: '#DC2626',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  categoryDescriptionSelected: {
    color: '#7F1D1D',
  },
  separator: {
    height: 12,
  },

  // Estilos de estados
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
