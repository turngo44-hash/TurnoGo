import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './tabNavigator';
import ProfessionalProfileNew from '../../screens/main/ProfessionalProfileNew';
import EditProfileScreen from '../../screens/main/EditProfileScreen';
import BookAppointmentScreen from '../../screens/main/BookAppointmentScreen';
import AppointmentDetailsScreen from '../../screens/main/AppointmentDetailsScreen';
import ChatScreen from '../../screens/main/ChatScreen';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      <Stack.Screen name="ProfessionalProfile" component={ProfessionalProfileNew} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} />
      <Stack.Screen name="AppointmentDetails" component={AppointmentDetailsScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}