import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import colors from '../../constants/colors';

const BusinessTabs = ({ activeTab, onTabChange }) => {
  // Ahora ya no tenemos pestañas
  const tabs = [];

  return (
    <View style={styles.container}>
      {/* Eliminamos el ScrollView ya que no hay pestañas */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    width: '100%',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginHorizontal: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    flex: 1,
    justifyContent: 'center',
  },
  activeTab: {
  backgroundColor: colors.primary,
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  tabTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabTitle: {
    color: '#FFFFFF',
  },
});

export default BusinessTabs;
