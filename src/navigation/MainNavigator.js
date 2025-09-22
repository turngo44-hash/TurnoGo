import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/main/HomeScreen';
import AppointmentsScreen from '../screens/main/AppointmentsScreen';
import BusinessScreen from '../screens/main/BusinessScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import ProfessionalProfileNew from '../screens/main/ProfessionalProfileNew';
import EditProfileScreen from '../screens/main/EditProfileScreen';
import BookAppointmentScreen from '../screens/main/BookAppointmentScreen';
import AppointmentDetailsScreen from '../screens/main/AppointmentDetailsScreen';
import SelectProfessionalScreen from '../screens/SelectProfessionalScreen';
import ChatScreen from '../screens/main/ChatScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Appointments') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'ProfessionalView') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Business') {
            iconName = focused ? 'storefront' : 'storefront-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#DC2626',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: Platform.OS === 'ios' ? 10 : 6, // Reduced safe padding
          paddingTop: 6,
          height: Platform.OS === 'ios' ? 70 : 56, // Reduced overall height
          backgroundColor: '#ffffff',
          borderTopWidth: 0.5,
          borderTopColor: '#E5E7EB',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ tabBarLabel: 'Inicio' }}
      />
      <Tab.Screen 
        name="Appointments" 
        component={AppointmentsScreen}
        options={{ tabBarLabel: 'Turnos' }}
      />
      <Tab.Screen 
        name="ProfessionalView" 
        component={ProfessionalProfileNew}
        options={{ tabBarLabel: 'Profesional' }}
      />
      <Tab.Screen 
        name="Business" 
        component={BusinessScreen}
        options={{ tabBarLabel: 'Mi Negocio' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Ajustes' }}
      />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={HomeTabs} />
      <Stack.Screen name="ProfessionalProfile" component={ProfessionalProfileNew} />
      <Stack.Screen name="EditProfileScreen" component={require('../screens/main/EditProfileScreen').default} />
      <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} />
      <Stack.Screen name="AppointmentDetails" component={AppointmentDetailsScreen} />
      <Stack.Screen name="SelectProfessional" component={SelectProfessionalScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
}
