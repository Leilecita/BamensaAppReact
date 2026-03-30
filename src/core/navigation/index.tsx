import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Platform, StatusBar } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

export const NavigationApp = () => {
 const { userToken } = useContext(AuthContext);

 console.log('TOKEN NAV:', userToken);

 return (
  <>
   <StatusBar
    translucent={false}
    backgroundColor={Platform.OS === 'android' ? '#463a63' : 'transparent'}
    barStyle="light-content"
   />
   <NavigationContainer>
    {userToken ? <AppStack /> : <AuthStack />}
   </NavigationContainer>
  </>
 );
};
