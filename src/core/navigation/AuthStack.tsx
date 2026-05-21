import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../../containers/auth/screens/LoginScreen';
import RegisterScreen from '../../containers/auth/screens/RegisterScreen';

export type AuthStackParamList = {
 login: undefined;
 register: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
 return (
  <Stack.Navigator initialRouteName="login" screenOptions={{ headerShown: false }}>
   <Stack.Screen name="login" component={LoginScreen} />
   <Stack.Screen name="register" component={RegisterScreen} />
  </Stack.Navigator>
 );
}
