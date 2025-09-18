import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import colors from '../constants/colors';
import Divider from './Divider';

const { width } = Dimensions.get('window');

const BookyStyleTabs = ({ 
  tabs, 
  activeTab, 
  onTabPress,
  scrollY = new Animated.Value(0),
  headerHeight = 300,
}) => {
  // Calculamos la posición de las pestañas basada en el scroll
  const tabPosition = scrollY.interpolate({
    inputRange: [0, headerHeight - 50],
    outputRange: [headerHeight - 50, 0], // De abajo del header a arriba (en la parte superior)
    extrapolate: 'clamp'
  });
  
  // Opacidad del fondo de las pestañas
  const tabBackgroundOpacity = scrollY.interpolate({
    inputRange: [headerHeight - 100, headerHeight - 50],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });
  
  return (
    <Animated.View 
      style={[
        styles.tabsContainer,
        {
          transform: [{ translateY: tabPosition }],
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
        }
      ]}
    >
      <Animated.View
        style={[
          styles.tabsBackground,
          { opacity: tabBackgroundOpacity }
        ]}
      />
      
      <View style={styles.tabsContent}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab
            ]}
            onPress={() => onTabPress(tab.id)}
          >
            <Text 
              style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <Divider style={styles.tabDivider} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    width: '100%',
    height: 50,
  },
  tabsBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '100%',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    flexDirection: 'row',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabDivider: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#EAEAEA',
    marginVertical: 0,
  }
});

export default BookyStyleTabs;