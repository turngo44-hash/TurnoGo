import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import PhoneLoginScreen from '../screens/auth/PhoneLoginScreen';
import SelectProfessionalScreen from '../screens/SelectProfessionalScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{ 
        headerShown: false,
        animationTypeForReplace: 'push',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} />
  <Stack.Screen name="SelectProfessional" component={SelectProfessionalScreen} />
    </Stack.Navigator>
  );
}
