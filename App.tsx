import React from 'react';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { ToastProvider } from './src/core/feedback/ToastContext';
import { NavigationApp } from './src/core/navigation';

export default function App() {
 const [fontsLoaded] = useFonts({
  OpenSansRegular: require('./assets/fonts/opensansregular.ttf'),
  OpenSansLight: require('./assets/fonts/opensanslight.ttf'),
  OpenSansItalic: require('./assets/fonts/opensansitalic.ttf'),
  OpenSansBold: require('./assets/fonts/openssansbold.ttf'),
  ArialRoundedRegular: require('./assets/fonts/arialroundedreg.ttf'),
  ArialRoundedRegular2: require('./assets/fonts/arialroundedreg2.ttf'),
  AriaRounded: require('./assets/fonts/ariarounded.ttf'),
 });

 if (!fontsLoaded) {
  return null;
 }

 return (
  <SafeAreaProvider>
   <AuthProvider>
    <ToastProvider>
     <NavigationApp />
    </ToastProvider>
   </AuthProvider>
  </SafeAreaProvider>
 );
}
